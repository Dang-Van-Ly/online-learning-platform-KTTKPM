package com.onlinelearning.chatservice.service;

import com.onlinelearning.chatservice.dto.AgentRequest;
import com.onlinelearning.chatservice.dto.AgentResponse;
import org.springframework.stereotype.Service;

@Service
public class ChatAgentService {

    private final GroqClient groqClient;
    private final OrderServiceClient orderServiceClient;

    public ChatAgentService(GroqClient groqClient, OrderServiceClient orderServiceClient) {
        this.groqClient = groqClient;
        this.orderServiceClient = orderServiceClient;
    }

    public AgentResponse handle(AgentRequest request) {
        AgentResponse response = new AgentResponse();
        String message = request.getMessage() == null ? "" : request.getMessage().trim();

        if (message.isEmpty()) {
            response.setAssistantMessage("Xin chào! Tôi là trợ lý ảo của KhoKhoaHoc. Tôi có thể giúp gì cho bạn?");
            response.setAction("none");
            response.setActionPerformed(false);
            return response;
        }

        // Tự động tìm ID đơn hàng trong tin nhắn nếu field orderId bị trống
        Long effectiveOrderId = request.getOrderId();
        if (effectiveOrderId == null && isCancelOrderRequest(message)) {
            effectiveOrderId = extractOrderIdFromMessage(message);
        }

        if (isCancelOrderRequest(message) && effectiveOrderId != null) {
            response.setAction("cancel_order");
            response.setActionPerformed(true);
            response.setActionResult(cancelOrder(effectiveOrderId));
            response.setAssistantMessage("Hệ thống đã ghi nhận yêu cầu và cập nhật trạng thái HUỶ cho đơn hàng #" + effectiveOrderId + ". Bạn có cần hỗ trợ gì khác không?");
            return response;
        }

        String assistantText = groqClient.ask(message); // Đảm bảo gọi Groq
        response.setAssistantMessage(assistantText);
        response.setActionPerformed(false);
        response.setAction("none");
        response.setActionResult(null);
        return response;
    }

    private boolean isCancelOrderRequest(String message) {
        String normalized = message.toLowerCase();
        return normalized.contains("hủy đơn hàng") || normalized.contains("huy don hang") || normalized.contains("cancel order") || normalized.contains("hủy đơn") || normalized.contains("huỷ đơn");
    }

    private Long extractOrderIdFromMessage(String message) {
        try {
            // Tìm số đầu tiên xuất hiện trong tin nhắn (giả định đó là mã đơn hàng)
            String numbers = message.replaceAll("[^0-9]", " ").trim();
            if (!numbers.isEmpty()) {
                return Long.parseLong(numbers.split("\\s+")[0]);
            }
        } catch (Exception e) { /* Ignore parsing errors */ }
        return null;
    }

    private String cancelOrder(Long orderId) {
        return orderServiceClient.cancelOrder(orderId);
    }
}
