package com.onlinelearning.notification.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderCreatedEvent {
    private Long orderId;
    private Long userId;
    private String userEmail;
    private String userName;
    private BigDecimal totalPrice;
    private String paymentMethod;
    private List<String> courseNames;
    private String status;
}
