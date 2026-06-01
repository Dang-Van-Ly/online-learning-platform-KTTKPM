package com.onlinelearning.chatservice.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Component
public class GeminiClient {

    @Value("${GEMINI_API_KEY:}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public String ask(String message) {
        if (apiKey == null || apiKey.isBlank()) {
            return "[AI agent không thể khởi động vì thiếu khóa GEMINI_API_KEY]";
        }

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiKey);

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", "gemini-1.0");
            requestBody.put("messages", new Object[]{
                    Map.of("role", "system", "content", "Bạn là một AI Agent hỗ trợ khách hàng học trực tuyến. Hãy giới thiệu khóa học phù hợp, giải thích cách đặt mua, và chỉ thực hiện hủy đơn khi người dùng yêu cầu hủy đơn cụ thể với orderId. Nếu người dùng muốn đặt đơn, đề xuất bước tiếp theo và yêu cầu thông tin cần thiết."),
                    Map.of("role", "user", "content", message)
            });
            requestBody.put("temperature", 0.2);
            requestBody.put("max_tokens", 400);

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);
            String response = restTemplate.postForObject("https://api.openai.com/v1/chat/completions", request, String.class);

            JsonNode root = objectMapper.readTree(response);
            JsonNode content = root.path("choices").path(0).path("message").path("content");
            if (content.isTextual()) {
                return content.asText();
            }
            return "[AI agent đã nhận yêu cầu nhưng không trả về kết quả rõ ràng]";
        } catch (Exception ex) {
            return "[Lỗi gọi Gemini API: " + ex.getMessage() + "]";
        }
    }
}
