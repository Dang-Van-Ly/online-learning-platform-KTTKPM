package com.onlinelearning.backend.enrollment.entity;

import com.onlinelearning.backend.user.entity.User;
import com.onlinelearning.backend.course.entity.Course;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "enrollments")
@Data
public class Enrollment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Sử dụng tính năng tự tăng của DB
    private Long id;
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "course_id")
    private Course course;

    private LocalDateTime enrolledAt;

    // Bổ sung thuộc tính thiếu
    private LocalDateTime expireAt;
    private String type;

    private String status;

    @PrePersist
    protected void onCreate() {
        this.enrolledAt = LocalDateTime.now();
        if (this.status == null) this.status = "ACTIVE";
    }
}