package com.onlinelearning.backend.course.dto;

import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

/**
 * DTO nhận request tạo / cập nhật khóa học qua multipart/form-data.
 * Dùng @RequestPart / @RequestParam trong controller thay vì @RequestBody.
 */
@Getter
@Setter
public class CourseRequest {

    private String name;
    private String description;
    private Double price;
    private String category;
    private String type;   // FREE | PAID
    private String status; // DRAFT | PUBLISHED
    private String instructorId;

    // File ảnh thumbnail (optional)
    private MultipartFile image;
}
