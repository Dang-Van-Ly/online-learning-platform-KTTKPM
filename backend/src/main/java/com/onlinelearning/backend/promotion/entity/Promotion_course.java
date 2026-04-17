package com.onlinelearning.backend.promotion.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.onlinelearning.backend.course.entity.Course;
import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;

@Entity
@Getter 
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "promotion_course")
public class Promotion_course implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id")
    // Đảm bảo bên Course.java có @JsonManagedReference(value = "course-promotion")
    private Course course;

    // Chỗ này giúp fix lỗi biên dịch: Tìm thấy method setPromotion()
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "promotion_id")
    // Đảm bảo bên Promotion.java có @JsonManagedReference(value = "promotion-course")
    private Promotion promotion; 
}