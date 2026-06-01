package com.onlinelearning.backend.course.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "lesson_files")
@com.fasterxml.jackson.annotation.JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Lesson_file {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Tên tệp không được để trống")
    @Column(nullable = false)
    private String fileName;
    
    @NotBlank(message = "URL tệp không được để trống")
    @Column(nullable = false)
    private String fileUrl;
    
    @NotBlank(message = "Loại tệp không được để trống")
    @Column(nullable = false)
    private String fileType;
    
    @Column(nullable = false)
    private Integer orderNumber;

    @ManyToOne
    @JoinColumn(name = "lesson_id")
    @com.fasterxml.jackson.annotation.JsonIgnore
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Lesson lesson;
}