package com.onlinelearning.chatservice.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Component
public class GeminiClient {

    private static final Logger log = LoggerFactory.getLogger(GeminiClient.class);

    @Value("${GEMINI_API_KEY:}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    private static final String[] MODELS = {
        "gemini-2.0-flash",
        "gemini-2.0-flash-lite",
        "gemini-1.5-flash",
        "gemini-1.5-pro"
    };

    public String ask(String message) {
        if (apiKey == null || apiKey.isBlank()) {
            return "Xin lỗi, tính năng AI tạm thời chưa được cấu hình. Vui lòng liên hệ quản trị viên.";
        }

        for (String model : MODELS) {
            try {
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);

                Map<String, Object> part = Map.of("text", message);
                Map<String, Object> content = Map.of("parts", List.of(part));
                Map<String, Object> requestBody = Map.of("contents", List.of(content));

                HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

                String url = "https://generativelanguage.googleapis.com/v1beta/models/"
                        + model + ":generateContent?key=" + apiKey;

                log.info("Calling Gemini model: {}", model);
                String response = restTemplate.postForObject(url, request, String.class);

                JsonNode root = objectMapper.readTree(response);
                JsonNode text = root.path("candidates").path(0).path("content").path("parts").path(0).path("text");
                if (text.isTextual()) {
                    return text.asText();
                }
                return "Xin lỗi, tôi không thể xử lý yêu cầu của bạn lúc này. Vui lòng thử lại sau.";

            } catch (HttpClientErrorException e) {
                log.error("HTTP error calling Gemini model {}: {} - {}", model, e.getStatusCode(), e.getResponseBodyAsString());
                if (e.getStatusCode().value() == 429 || e.getStatusCode().value() == 404) {
                    continue; // thử model tiếp theo
                }
                return "Lỗi API: " + e.getStatusCode() + " - " + e.getResponseBodyAsString();
            } catch (Exception ex) {
                log.error("Exception calling Gemini model {}: {}", model, ex.getMessage(), ex);
                continue;
            }
        }

        return "Xin lỗi, hệ thống AI đang bận. Vui lòng thử lại sau ít phút.";
    }
}
