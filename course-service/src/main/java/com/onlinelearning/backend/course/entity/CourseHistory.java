package com.onlinelearning.backend.course.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "course_history")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class CourseHistory implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id")
    private com.onlinelearning.backend.course.entity.Course course;

    private String status; // PENDING, PUBLISHED, REJECTED, DRAFT, ACTIVE

    private String changedBy; // username or system

    @Column(name = "changed_at")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime changedAt;

    @PrePersist
    protected void onCreate() {
        if (this.changedAt == null) this.changedAt = LocalDateTime.now();
    }
}
