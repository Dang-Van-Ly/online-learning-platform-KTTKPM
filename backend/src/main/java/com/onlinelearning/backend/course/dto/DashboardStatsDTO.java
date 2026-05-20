package com.onlinelearning.backend.course.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DashboardStatsDTO {
    private long totalUsers;
    private long totalCourses;
    private long pendingCourses;
    private double totalRevenue;
}