package com.onlinelearning.chatservice.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.HttpEntity;
import org.springframework.stereotype.Component;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Recover;
import org.springframework.retry.annotation.Retryable;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;
import java.util.Map;

@Component
public class OrderServiceClient {

    private final RestTemplate restTemplate;

    @Value("${order.service.host:${ORDER_SERVICE_HOST:order-service:8083}}")
    private String orderServiceHost;

    public OrderServiceClient(RestTemplateBuilder restTemplateBuilder) {
        this.restTemplate = restTemplateBuilder
                .setConnectTimeout(Duration.ofSeconds(5))
                .setReadTimeout(Duration.ofSeconds(5))
                .build();
    }

    @Retryable(value = Exception.class, maxAttempts = 3, backoff = @Backoff(delay = 3000))
    public String cancelOrder(Long orderId) {
        String orderUrl = String.format("http://%s/api/orders/%d", orderServiceHost, orderId);
        @SuppressWarnings("unchecked")
        Map<String, Object> order = restTemplate.getForObject(orderUrl, Map.class);

        if (order == null || order.isEmpty()) {
            throw new IllegalStateException("Đơn hàng không tồn tại hoặc không thể truy vấn đơn hàng.");
        }

        order.put("status", "CANCELLED");
        restTemplate.put(orderUrl, new HttpEntity<>(order));
        return "OK";
    }

    @Recover
    public String recoverCancelOrder(Exception ex, Long orderId) {
        return "Lỗi khi huỷ đơn hàng: " + ex.getMessage();
    }
}
