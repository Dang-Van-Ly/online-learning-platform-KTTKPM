package com.onlinelearning.backend.order.dto;

import java.math.BigDecimal;

public class OrderItemRequest {

    private Long courseId;
    private BigDecimal price;

    public Long getCourseId() {
        return courseId;
    }

    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }
}
