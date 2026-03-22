package com.onlinelearning.backend.course.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "lessons")
public class Lesson {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Sử dụng tính năng tự tăng của DB
    private Long id;
    private String title;
    private Integer orderNumber;
    private Boolean isFree;
    private String status;
    private LocalDateTime createdAt;
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    @ManyToOne
    @JoinColumn(name = "chapter_id")
    @com.fasterxml.jackson.annotation.JsonIgnore
    private Chapter chapter;
}