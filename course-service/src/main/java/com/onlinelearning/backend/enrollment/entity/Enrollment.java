package com.onlinelearning.backend.enrollment.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.onlinelearning.backend.course.entity.Course;
import com.onlinelearning.backend.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Enrollment = quan hệ thật giữa User và Course.
 * Chỉ được tạo khi user thật sự đăng ký khóa học.
 */
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "enrollments",
       uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "course_id"}))
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Enrollment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnoreProperties({"password", "memberships"})
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    @JsonIgnoreProperties({"studentsCount", "revenue"})
    private Course course;

    /** Số tiền user đã trả cho enrollment này. Free course = 0. */
    private Double pricePaid;

    private String status; // ACTIVE, COMPLETED, CANCELLED

    @Column(name = "enrolled_at", updatable = false)
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime enrolledAt;

    private LocalDateTime expireAt;
    private String type;

    @PrePersist
    protected void onCreate() {
        this.enrolledAt = LocalDateTime.now();
        if (this.status == null) this.status = "ACTIVE";
        if (this.pricePaid == null) this.pricePaid = 0.0;
    }
}