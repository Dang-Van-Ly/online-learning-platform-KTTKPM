package com.onlinelearning.backend.enrollment.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EnrollRequest {
    private Long userId;
    private Long courseId;
    private Double pricePaid;
    private String type; // "MEMBERSHIP" khi mở khóa bằng gói hội viên
}
