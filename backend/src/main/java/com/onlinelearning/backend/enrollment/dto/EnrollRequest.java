package com.onlinelearning.backend.enrollment.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EnrollRequest {
    private Long userId;
    private Long courseId;
    private Double pricePaid;
}
