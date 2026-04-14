package com.onlinelearning.backend.course.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "lesson_files")
public class Lesson_file {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fileName;
    private String fileUrl;
    private String fileType;
    private Integer orderNumber;

    @ManyToOne
    @JoinColumn(name = "lesson_id")
    @com.fasterxml.jackson.annotation.JsonIgnore
    private Lesson lesson;
}