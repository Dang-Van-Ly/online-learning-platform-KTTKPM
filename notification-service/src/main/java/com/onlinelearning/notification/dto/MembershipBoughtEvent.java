package com.onlinelearning.notification.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MembershipBoughtEvent {
    private Long userId;
    private String userEmail;
    private String userName;
    private String membershipName;
    private BigDecimal price;
    private Integer durationDays;
    private String startDate;
    private String endDate;
}
