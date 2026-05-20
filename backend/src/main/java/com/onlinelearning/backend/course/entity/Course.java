package com.onlinelearning.backend.course.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * Course entity - chỉ lưu thông tin cơ bản của khóa học.
 * studentsCount và revenue là @Transient, được tính từ DB thật qua EnrollmentRepository.
 * Khi tạo mới: studentsCount = 0, revenue = 0 (không fake data).
 */
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "courses")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Course implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    private Double price;

    private String image;

    @Column(name = "image_url", length = 1024)
    private String imageUrl;

    private String category;

    @Column(name = "instructor_id")
    private String instructorId;

    private String type; // FREE, PAID

    private String status; // DRAFT, PUBLISHED

    @Column(name = "created_at", updatable = false)
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime updatedAt;

    // ---------------------------------------------------------------
    // Transient fields - KHÔNG lưu vào DB, tính từ Enrollment table
    // ---------------------------------------------------------------
    @Transient
    private Long studentsCount;

    @Transient
    private Double revenue;

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        this.createdAt = now;
        this.updatedAt = now;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}