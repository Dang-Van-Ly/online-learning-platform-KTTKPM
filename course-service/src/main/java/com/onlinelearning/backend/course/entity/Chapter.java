package com.onlinelearning.backend.course.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "chapters")
@com.fasterxml.jackson.annotation.JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Chapter {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private Integer orderNumber;
    private String status;
    private LocalDateTime createdAt;

    // ❗ CHẶN LOOP về Course
    @ManyToOne
    @JoinColumn(name = "course_id")
    @com.fasterxml.jackson.annotation.JsonProperty(access = com.fasterxml.jackson.annotation.JsonProperty.Access.WRITE_ONLY)
    private Course course;

    // ❗ CHẶN LOOP xuống Lesson
    @OneToMany(mappedBy = "chapter", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties("chapter")
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private List<Lesson> lessons;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.status == null) this.status = "ACTIVE";
    }
}