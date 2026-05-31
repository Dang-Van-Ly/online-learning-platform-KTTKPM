package com.onlinelearning.backend.messaging;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EnrollmentEvent {
    private Long userId;
    private String userEmail;
    private String userName;
    private String courseName;
    private String instructorName;
}
