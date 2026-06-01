package com.onlinelearning.chatservice.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Recover;
import org.springframework.retry.annotation.Retryable;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Component
public class GroqClient {

    @Value("${groq.api.key:${GROQ_API_KEY:}}")
    private String apiKey;

    @Value("${groq.model:llama-3.1-8b-instant}")
    private String model;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public GroqClient(RestTemplateBuilder restTemplateBuilder) {
        this.restTemplate = restTemplateBuilder
                .setConnectTimeout(Duration.ofSeconds(15))
                .setReadTimeout(Duration.ofSeconds(60))
                .build();
    }

    @Retryable(
            value = {RestClientException.class},
            maxAttempts = 3,
            backoff = @Backoff(delay = 3000)
    )
    public String ask(String message) {
        if (apiKey == null || apiKey.isBlank() || apiKey.equalsIgnoreCase("xxx")) {
            log.error("GROQ_API_KEY is missing or contains 'xxx'. Please check your .env file.");
            return "[Hệ thống AI chưa sẵn sàng: Vui lòng cấu hình GROQ_API_KEY hợp lệ]";
        }

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiKey);

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", model);
            requestBody.put("messages", List.of(
                Map.of("role", "system", "content", 
                    "Bạn là Chuyên viên Hỗ trợ Cao cấp của hệ thống KhoKhoaHoc. Trình bày câu trả lời chuyên nghiệp, cấu trúc rõ ràng và lịch sự.\n" +
                    "Nhiệm vụ của bạn:\n" +
                    "1. Chỉ trả lời các câu hỏi liên quan đến quy trình hệ thống KhoKhoaHoc (Đăng ký, Đăng nhập, Tìm khóa học, Mua khóa học, Thanh toán, Hủy đơn, Quản lý hồ sơ).\n" +
                    "2. Nếu người dùng muốn mua khóa học, hãy hướng dẫn flow: Đăng nhập -> Chọn khóa học -> Xem chi tiết -> Nhấn 'Mua ngay' -> Thanh toán tại giỏ hàng.\n" +
                    "3. Nếu người dùng muốn hủy đơn mà chưa kèm ID, hãy yêu cầu họ ghi rõ ID đơn hàng vào tin nhắn chat. Hệ thống của chúng tôi sẽ tự động trích xuất ID này để xử lý.\n" +
                    "4. TUYỆT ĐỐI KHÔNG trả lời các chủ đề ngoài hệ thống (viết code, tâm lý, kiến thức chung, toán học...).\n" +
                    "5. Nếu gặp câu hỏi ngoài phạm vi, bạn CHỈ ĐƯỢC PHÉP trả lời duy nhất: 'Tôi không thể thực hiện yêu cầu này'. Tuyệt đối không giải giải thích hay xin lỗi."
                ),
                Map.of("role", "user", "content", message)
            ));
            requestBody.put("temperature", 0.1);

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);
            
            log.debug("Calling Groq API for message: {}", message);
            String response = restTemplate.postForObject("https://api.groq.com/openai/v1/chat/completions", request, String.class);

            if (response == null) throw new RestClientException("Empty response from Groq");

            JsonNode root = objectMapper.readTree(response);
            JsonNode content = root.path("choices").path(0).path("message").path("content");
            if (content.isTextual()) {
                String result = content.asText();
                log.info("AI response received successfully.");
                return result;
            }
        } catch (Exception ex) {
            log.error("Error calling Groq API: {}", ex.getMessage());
            throw new RestClientException("Groq Service Error: " + ex.getMessage(), ex);
        }
        return "[AI agent tạm thời không thể trả lời, vui lòng thử lại sau]";
    }

    @Recover
    public String recoverAsk(RestClientException ex, String message) {
        log.error("All retries failed for Groq call: {}", ex.getMessage());
        return "[Hệ thống AI đang quá tải sau nhiều lần thử lại. Chi tiết: " + ex.getMessage() + "]";
    }
}