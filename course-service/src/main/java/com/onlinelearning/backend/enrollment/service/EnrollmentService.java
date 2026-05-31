package com.onlinelearning.backend.enrollment.service;

import com.onlinelearning.backend.course.entity.Course;
import com.onlinelearning.backend.course.repository.CourseRepository;
import com.onlinelearning.backend.enrollment.dto.EnrollRequest;
import com.onlinelearning.backend.enrollment.entity.Enrollment;
import com.onlinelearning.backend.enrollment.repository.EnrollmentRepository;
import com.onlinelearning.backend.membership.UserMembership;
import com.onlinelearning.backend.membership.UserMembershipRepository;
import com.onlinelearning.backend.user.entity.User;
import com.onlinelearning.backend.user.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class EnrollmentService {
    private final EnrollmentRepository enrollmentRepository;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final UserMembershipRepository userMembershipRepository;

    public EnrollmentService(EnrollmentRepository enrollmentRepository,
                             UserRepository userRepository,
                             CourseRepository courseRepository,
                             UserMembershipRepository userMembershipRepository) {
        this.enrollmentRepository = enrollmentRepository;
        this.userRepository = userRepository;
        this.courseRepository = courseRepository;
        this.userMembershipRepository = userMembershipRepository;
    }

    public Enrollment enrollUser(EnrollRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User không tồn tại"));

        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new RuntimeException("Course không tồn tại"));

        // Check duplicate
        if (enrollmentRepository.existsByUserIdAndCourseId(user.getId(), course.getId())) {
            throw new RuntimeException("User đã đăng ký khóa học này rồi");
        }

        double price = request.getPricePaid() != null ? request.getPricePaid() : 0.0;
        boolean isMembershipEnroll = "MEMBERSHIP".equalsIgnoreCase(request.getType());

        // Kiểm tra membership limit khi mở khóa bằng gói hội viên
        if (isMembershipEnroll) {
            checkMembershipLimit(user.getId());
        }

        Enrollment enrollment = new Enrollment();
        enrollment.setUser(user);
        enrollment.setCourse(course);
        enrollment.setPricePaid(price);
        enrollment.setStatus("ACTIVE");
        enrollment.setEnrolledAt(LocalDateTime.now());
        // Lưu type để frontend có thể lọc usedCourseIds sau khi đăng nhập lại
        if (isMembershipEnroll) {
            enrollment.setType("MEMBERSHIP");
        }

        return enrollmentRepository.save(enrollment);
    }

    /**
     * Kiểm tra user có membership hợp lệ và chưa vượt giới hạn khóa/ngày.
     */
    private void checkMembershipLimit(Long userId) {
        LocalDateTime now = LocalDateTime.now();
        Optional<UserMembership> activeMembership =
                userMembershipRepository.findActiveMembership(userId, now);

        if (activeMembership.isEmpty()) {
            throw new RuntimeException("Bạn cần có gói membership còn hạn để đăng ký khóa học này");
        }

        UserMembership um = activeMembership.get();
        int dailyLimit = um.getMembership().getCoursesPerDay();

        // Đếm số khóa đã enroll hôm nay
        LocalDate today = LocalDate.now();
        LocalDateTime startOfDay = today.atStartOfDay();
        LocalDateTime endOfDay = today.plusDays(1).atStartOfDay();

        long enrolledToday = enrollmentRepository.countEnrollmentsToday(userId, startOfDay, endOfDay);

        if (enrolledToday >= dailyLimit) {
            throw new RuntimeException(
                "Bạn đã đạt giới hạn " + dailyLimit + " khóa học/ngày của gói " +
                um.getMembership().getName() + ". Vui lòng quay lại vào ngày mai."
            );
        }
    }

    public List<Enrollment> getEnrollmentsByUser(Long userId) {
        return enrollmentRepository.findByUserId(userId);
    }

    public List<Enrollment> getEnrollmentsByInstructor(String instructorId) {
        return enrollmentRepository.findByCourseInstructorIdOrderByEnrolledAtDesc(instructorId);
    }
}