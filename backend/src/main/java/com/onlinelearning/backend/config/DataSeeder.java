package com.onlinelearning.backend.config;

import com.onlinelearning.backend.course.entity.*;
import com.onlinelearning.backend.course.repository.*;
import com.onlinelearning.backend.user.entity.Role;
import com.onlinelearning.backend.user.entity.User;
import com.onlinelearning.backend.user.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private static final String[] DEFAULT_CATEGORIES = {
            "Ads",
            "Lập trình - Web",
            "SEO",
            "Copywriting",
            "AI - ChatGPT",
            "Data Analysis",
            "Tiktok",
            "Bất động sản",
            "Shopee",
            "Kiếm tiền online",
            "Tiếng Anh",
            "Tin học văn phòng",
            "Tài Chính - Kế Toán",
            "Crypto - Forex - Chứng khoán",
            "Phòng the",
            "Đồ họa - Thiết kế",
            "Edit Video",
            "Kinh doanh - Marketing",
            "Phong Thủy",
            "Tiếng Trung - Nhật - Hàn"
    };

    private final CourseRepository courseRepository;
    private final ChapterRepository chapterRepository;
    private final LessonRepository lessonRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(CourseRepository courseRepository,
                      ChapterRepository chapterRepository,
                      LessonRepository lessonRepository,
                      UserRepository userRepository,
                      PasswordEncoder passwordEncoder) {
        this.courseRepository = courseRepository;
        this.chapterRepository = chapterRepository;
        this.lessonRepository = lessonRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {

        // ================= USER =================
        if (userRepository.findByUsername("admin").isEmpty()) {
            System.out.println("👤 Seeding admin account...");
            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("123456"));
            admin.setRole(Role.ADMIN);
            admin.setEmail("admin@gmail.com");
            admin.setStatus(true);
            userRepository.save(admin);
            System.out.println("✅ ADMIN SEEDED!");
        }

        if (userRepository.count() <= 1) {
            System.out.println("👤 Seeding test users and instructors...");

            User user1 = new User();
            user1.setUsername("user1");
            user1.setPassword(passwordEncoder.encode("123456"));
            user1.setRole(Role.USER);
            user1.setEmail("user1@gmail.com");
            user1.setStatus(true);
            userRepository.save(user1);

            User user2 = new User();
            user2.setUsername("user2");
            user2.setPassword(passwordEncoder.encode("123456"));
            user2.setRole(Role.USER);
            user2.setEmail("user2@gmail.com");
            user2.setStatus(true);
            userRepository.save(user2);

            User user3 = new User();
            user3.setUsername("hocvien_nga");
            user3.setPassword(passwordEncoder.encode("123456"));
            user3.setRole(Role.USER);
            user3.setEmail("nga_student@gmail.com");
            user3.setStatus(true);
            userRepository.save(user3);

            User ins1 = new User();
            ins1.setUsername("giangvien_a");
            ins1.setPassword(passwordEncoder.encode("123456"));
            ins1.setRole(Role.INSTRUCTOR);
            ins1.setEmail("instructor_a@gmail.com");
            ins1.setStatus(true);
            userRepository.save(ins1);

            User ins2 = new User();
            ins2.setUsername("giangvien_b");
            ins2.setPassword(passwordEncoder.encode("123456"));
            ins2.setRole(Role.INSTRUCTOR);
            ins2.setEmail("instructor_b@gmail.com");
            ins2.setStatus(true);
            userRepository.save(ins2);

            User ins3 = new User();
            ins3.setUsername("giangvien_c");
            ins3.setPassword(passwordEncoder.encode("123456"));
            ins3.setRole(Role.INSTRUCTOR);
            ins3.setEmail("instructor_c@gmail.com");
            ins3.setStatus(true);
            userRepository.save(ins3);

            System.out.println("✅ TEST USERS AND INSTRUCTORS SEEDED!");
        }

        // ================= COURSE =================
        if (courseRepository.count() > 0) {
            System.out.println("⚠️ Data already exists, checking course categories...");
            List<Course> existingCourses = courseRepository.findAll();
            boolean updated = false;
            for (int i = 0; i < existingCourses.size(); i++) {
                Course course = existingCourses.get(i);
                if (course.getCategory() == null || course.getCategory().isBlank()) {
                    course.setCategory(DEFAULT_CATEGORIES[i % DEFAULT_CATEGORIES.length]);
                    courseRepository.save(course);
                    updated = true;
                }
            }
            System.out.println(updated
                    ? "✅ Existing courses updated with category values"
                    : "✅ Existing courses already have category values");
            return;
        }

        System.out.println("🔥 Start seeding courses...");

        for (int i = 1; i <= 10; i++) {
            Course course = new Course();
            course.setName("Course " + i);
            course.setDescription("This is course number " + i);
            course.setPrice(100000.0 + (i * 10000));
            course.setImage("https://picsum.photos/400/300?random=" + i);
            course.setCategory(DEFAULT_CATEGORIES[(i - 1) % DEFAULT_CATEGORIES.length]);
            course.setInstructorId("instructor-" + i);
            course.setType(i % 2 == 0 ? "FREE" : "PAID");
            course.setStatus("ACTIVE");

            course = courseRepository.save(course);

            for (int j = 1; j <= 3; j++) {
                Chapter chapter = new Chapter();
                chapter.setTitle("Chapter " + j + " of Course " + i);
                chapter.setOrderNumber(j);
                chapter.setStatus("ACTIVE");
                chapter.setCourse(course);

                chapter = chapterRepository.save(chapter);

                for (int k = 1; k <= 4; k++) {
                    Lesson lesson = new Lesson();
                    lesson.setTitle("Lesson " + k + " of Chapter " + j);
                    lesson.setOrderNumber(k);
                    lesson.setIsFree(k == 1);
                    lesson.setStatus("ACTIVE");
                    lesson.setChapter(chapter);

                    lessonRepository.save(lesson);
                }
            }
        }

        System.out.println("✅ SEED DATA DONE SUCCESSFULLY!");
    }
}