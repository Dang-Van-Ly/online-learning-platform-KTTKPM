package com.onlinelearning.backend.course.service;

import com.onlinelearning.backend.course.dto.CourseRequest;
import com.onlinelearning.backend.course.entity.Course;
import com.onlinelearning.backend.course.repository.CourseRepository;
import com.onlinelearning.backend.storage.service.LocalStorageService;
import com.onlinelearning.backend.storage.service.S3Service;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import org.springframework.data.domain.PageRequest;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;

import com.onlinelearning.backend.course.entity.CourseHistory;
import com.onlinelearning.backend.course.repository.CourseHistoryRepository;

@Service
@Slf4j
public class CourseService {

    private final CourseRepository repo;
    private final S3Service s3Service;
    private final LocalStorageService localStorageService;
    private final CourseHistoryRepository historyRepo;

    public CourseService(CourseRepository repo, S3Service s3Service, LocalStorageService localStorageService, CourseHistoryRepository historyRepo) {
        this.repo = repo;
        this.s3Service = s3Service;
        this.localStorageService = localStorageService;
        this.historyRepo = historyRepo;
    }

    // ================= CREATE (JSON, không có ảnh) =================
    public Course create(Course course) {
        return executeWithRetry(() -> {
            course.setCreatedAt(LocalDateTime.now());
            course.setUpdatedAt(LocalDateTime.now());
            course.setStudentsCount(0L);
            course.setRevenue(0.0);
            if (course.getStatus() == null || !"DRAFT".equalsIgnoreCase(course.getStatus())) {
                course.setStatus("PENDING");
            }
            Course saved = repo.save(course);
            // create history record
            try {
                CourseHistory h = new CourseHistory();
                h.setCourse(saved);
                h.setStatus(saved.getStatus());
                h.setChangedBy(saved.getInstructorId());
                historyRepo.save(h);
            } catch (Exception ex) {
                log.warn("Could not save course history: {}", ex.getMessage());
            }
            return saved;
        }, "CREATE COURSE");
    }

    // ================= CREATE WITH IMAGE (multipart/form-data) =================
    /**
     * Tạo khóa học kèm upload thumbnail lên AWS S3.
     * 1. Upload ảnh → lấy public URL
     * 2. Map CourseRequest → Course entity
     * 3. Lưu vào DB với imageUrl
     */
    public Course createWithImage(CourseRequest request) {
        Course course = new Course();
        course.setName(request.getName());
        course.setDescription(request.getDescription());
        course.setPrice(request.getPrice());
        course.setCategory(request.getCategory());
        course.setType(request.getType());
        course.setStatus(request.getStatus() != null ? request.getStatus() : "DRAFT");
        course.setInstructorId(request.getInstructorId());
        course.setStudentsCount(0L);
        course.setRevenue(0.0);

        // Upload thumbnail nếu có
        MultipartFile image = request.getImage();
        if (image != null && !image.isEmpty()) {
            try {
                String imageUrl = s3Service.uploadCourseThumbnail(image);
                course.setImageUrl(imageUrl);
                course.setImage(imageUrl); // backward-compatible
            } catch (Exception e) {
                log.warn("Upload ảnh thumbnail S3 thất bại, chuyển sang lưu cục bộ: {}", e.getMessage());
                try {
                    String localUrl = localStorageService.saveFile(image, "thumbnails");
                    course.setImageUrl(localUrl);
                    course.setImage(localUrl);
                } catch (Exception localEx) {
                    log.error("Lưu ảnh cục bộ thất bại: {}", localEx.getMessage(), localEx);
                }
            }
        }

        if (course.getStatus() == null || !"DRAFT".equalsIgnoreCase(course.getStatus())) {
            course.setStatus("PENDING");
        }

        Course saved = executeWithRetry(() -> repo.save(course), "CREATE COURSE WITH IMAGE");
        try {
            CourseHistory h = new CourseHistory();
            h.setCourse(saved);
            h.setStatus(saved.getStatus());
            h.setChangedBy(saved.getInstructorId());
            historyRepo.save(h);
        } catch (Exception ex) {
            log.warn("Could not save course history (with image): {}", ex.getMessage());
        }
        return saved;
    }

    // ================= GET ALL (CACHE DISABLED TEMPORARILY) =================
    // @Cacheable(value = "courses")
    public List<Course> getAll() {
        return executeWithRetry(() -> {
            List<Course> courses = repo.findByStatusIn(java.util.Arrays.asList("PUBLISHED", "ACTIVE"));
            courses.forEach(this::populateStats);
            return courses;
        }, "GET ALL COURSES");
    }

    // ================= GET BY CATEGORY =================
    public List<Course> getByCategory(String category) {
        return executeWithRetry(() -> {
            List<Course> courses = repo.findByCategoryIgnoreCaseAndStatusIn(category, java.util.Arrays.asList("PUBLISHED", "ACTIVE"));
            courses.forEach(this::populateStats);
            return courses;
        }, "GET COURSES BY CATEGORY");
    }

    // ================= GET BY ID (CACHE DISABLED TEMPORARILY + RETRY) =================
    // @Cacheable(value = "course", key = "#id")
    public Course getById(Long id) {
        return executeWithRetry(() -> {
            Course course = repo.findById(id)
                    .orElseThrow(() -> new RuntimeException("Course không tồn tại"));
            populateStats(course);
            return course;
        }, "GET COURSE BY ID");
    }

    // ================= POPULATE STATS =================
    private void populateStats(Course course) {
        if (course != null && course.getId() != null) {
            course.setStudentsCount(repo.countEnrollmentsByCourseId(course.getId()));
            course.setRevenue(repo.sumRevenueByCourseId(course.getId()));
        }
    }


    // ================= UPDATE (CACHE CLEAR DISABLED TEMPORARILY + RETRY) =================
    // @CacheEvict(value = "courses", allEntries = true)
    public Course update(Long id, Course newData) {
        return executeWithRetry(() -> {

            Course course = repo.findById(id)
                    .orElseThrow(() -> new RuntimeException("Course không tồn tại"));

            course.setName(newData.getName());
            course.setDescription(newData.getDescription());
            course.setPrice(newData.getPrice());
            course.setImage(newData.getImage());
            if (newData.getCategory() != null) {
                course.setCategory(newData.getCategory());
            }
            course.setStatus(newData.getStatus());
            course.setUpdatedAt(LocalDateTime.now());

            Course saved = repo.save(course);
            // save history about update
            try {
                CourseHistory h = new CourseHistory();
                h.setCourse(saved);
                h.setStatus(saved.getStatus());
                h.setChangedBy(saved.getInstructorId());
                historyRepo.save(h);
            } catch (Exception ex) {
                log.warn("Could not save course history (update): {}", ex.getMessage());
            }
            populateStats(saved);
            return saved;

        }, "UPDATE COURSE");
    }

    // ================= DELETE (CACHE CLEAR + RETRY) =================
    @CacheEvict(value = "courses", allEntries = true)
    public void delete(Long id) {
        executeWithRetry(() -> {
            repo.deleteById(id);
            return null;
        }, "DELETE COURSE");
    }

    // ================= GET TOP COURSES =================
    public List<Course> getTopCourses(int limit) {
        return executeWithRetry(() -> {
            List<Course> courses = repo.findTopCourses(PageRequest.of(0, limit));
            courses.forEach(this::populateStats);
            return courses;
        }, "GET TOP COURSES");
    }

    // ================= GET NEWEST COURSES =================
    public List<Course> getNewestCourses(int limit) {
        return executeWithRetry(() -> {
            List<Course> courses = repo.findNewestCourses(PageRequest.of(0, limit));
            courses.forEach(this::populateStats);
            return courses;
        }, "GET NEWEST COURSES");
    }

    // ================= GET HOMEPAGE DATA =================
    public Map<String, Object> getHomepageData() {
        return executeWithRetry(() -> {
            Map<String, Object> data = new HashMap<>();

            // 1. Top Courses (limit 6)
            List<Course> top = repo.findTopCourses(PageRequest.of(0, 6));
            top.forEach(this::populateStats);
            data.put("topCourses", top);

            // 2. Newest Courses (limit 6)
            List<Course> newest = repo.findNewestCourses(PageRequest.of(0, 6));
            newest.forEach(this::populateStats);
            data.put("newestCourses", newest);

            // 3. Grouped by Category (all published or active courses grouped)
            List<Course> allPublished = repo.findByStatusIn(java.util.Arrays.asList("PUBLISHED", "ACTIVE"));
            allPublished.forEach(this::populateStats);

            Map<String, List<Course>> grouped = allPublished.stream()
                .filter(c -> c.getCategory() != null && !c.getCategory().isBlank())
                .collect(Collectors.groupingBy(c -> c.getCategory().trim()));

            data.put("categories", grouped);

            return data;
        }, "GET HOMEPAGE DATA");
    }

    // ================= ADMIN HELPERS =================
    // Lấy danh sách khóa học đang chờ duyệt
    public List<Course> getPendingCourses() {
        return executeWithRetry(() -> {
            List<Course> list = repo.findByStatus("PENDING");
            list.forEach(this::populateStats);
            return list;
        }, "GET PENDING COURSES");
    }

    // Phê duyệt khóa học
    public void approveCourse(Long id) {
        executeWithRetry(() -> {
            Course course = repo.findById(id).orElseThrow(() -> new RuntimeException("Course không tồn tại"));
            course.setStatus("PUBLISHED");
            course.setUpdatedAt(LocalDateTime.now());
            Course saved = repo.save(course);
            try {
                CourseHistory h = new CourseHistory();
                h.setCourse(saved);
                h.setStatus(saved.getStatus());
                h.setChangedBy("admin");
                historyRepo.save(h);
            } catch (Exception ex) {
                log.warn("Could not save course history (approve): {}", ex.getMessage());
            }
            return null;
        }, "APPROVE COURSE");
    }

    // Từ chối khóa học
    public void rejectCourse(Long id) {
        executeWithRetry(() -> {
            Course course = repo.findById(id).orElseThrow(() -> new RuntimeException("Course không tồn tại"));
            course.setStatus("REJECTED");
            course.setUpdatedAt(LocalDateTime.now());
            Course saved = repo.save(course);
            try {
                CourseHistory h = new CourseHistory();
                h.setCourse(saved);
                h.setStatus(saved.getStatus());
                h.setChangedBy("admin");
                historyRepo.save(h);
            } catch (Exception ex) {
                log.warn("Could not save course history (reject): {}", ex.getMessage());
            }
            return null;
        }, "REJECT COURSE");
    }

    // ================= RETRY CORE LOGIC =================
    private <T> T executeWithRetry(RetrySupplier<T> action, String actionName) {

        int maxRetry = 3;
        int attempt = 0;

        while (true) {
            try {
                attempt++;

                System.out.println("[" + actionName + "] Attempt " + attempt);

                return action.get();

            } catch (Exception e) {

                System.out.println("[" + actionName + "] Failed attempt " + attempt + ": " + e.getMessage());

                if (attempt >= maxRetry) {
                    throw new RuntimeException(actionName + " failed after " + maxRetry + " retries");
                }

                try {
                    Thread.sleep(3000); // ⬅️ delay 3 giây
                } catch (InterruptedException ie) {
                    Thread.currentThread().interrupt();
                    throw new RuntimeException("Retry interrupted");
                }
            }
        }
    }

    // functional interface
    @FunctionalInterface
    private interface RetrySupplier<T> {
        T get();
    }
}