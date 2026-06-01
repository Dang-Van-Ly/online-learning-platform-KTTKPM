package com.onlinelearning.chatservice.service;

import com.onlinelearning.chatservice.dto.AgentRequest;
import com.onlinelearning.chatservice.dto.AgentResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
public class ChatAgentService {

    private final GeminiClient geminiClient;
    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${order.service.host:${ORDER_SERVICE_HOST:order-service:8083}}")
    private String orderServiceHost;

    public ChatAgentService(GeminiClient geminiClient) {
        this.geminiClient = geminiClient;
    }

    public AgentResponse handle(AgentRequest request) {
        AgentResponse response = new AgentResponse();
        String message = request.getMessage() == null ? "" : request.getMessage().trim();

        if (isCancelOrderRequest(message) && request.getOrderId() != null) {
            response.setAction("cancel_order");
            response.setActionPerformed(true);
            response.setActionResult(cancelOrder(request.getOrderId()));
            response.setAssistantMessage("Đơn hàng " + request.getOrderId() + " đã được cập nhật trạng thái huỷ. Nếu bạn muốn tôi kiểm tra lại trạng thái, hãy hỏi tiếp.");
            return response;
        }

        if (isPlaceOrderRequest(message)) {
            response.setAction("place_order_help");
            response.setActionPerformed(false);
            response.setActionResult("Yêu cầu đặt hàng đã được ghi nhận. Hãy cung cấp ID khóa học hoặc thông tin chi tiết đơn hàng.");
            response.setAssistantMessage("Tôi có thể giúp bạn đặt đơn khóa học. Vui lòng cho tôi biết khóa học bạn muốn, ID khóa học, hoặc yêu cầu tôi giới thiệu một khóa học phù hợp.");
            return response;
        }

        String assistantText = geminiClient.ask(message);
        response.setAssistantMessage(assistantText);
        response.setActionPerformed(false);
        response.setAction("none");
        response.setActionResult("Không có hành động tự động nào được kích hoạt.");
        return response;
    }

    private boolean isCancelOrderRequest(String message) {
        String normalized = message.toLowerCase();
        return normalized.contains("hủy đơn hàng") || normalized.contains("huy don hang") || normalized.contains("cancel order") || normalized.contains("hủy đơn") || normalized.contains("huỷ đơn");
    }

    private boolean isPlaceOrderRequest(String message) {
        String normalized = message.toLowerCase();
        return normalized.contains("đặt đơn") || normalized.contains("mua khóa học") || normalized.contains("mua khoa hoc") || normalized.contains("place order") || normalized.contains("buy course") || normalized.contains("đăng ký khóa học") || normalized.contains("dang ky khoa hoc");
    }

    private String cancelOrder(Long orderId) {
        try {
            String orderUrl = String.format("http://%s/api/orders/%d", orderServiceHost, orderId);
            Map<String, Object> order = restTemplate.getForObject(orderUrl, Map.class);
            if (order == null || order.isEmpty()) {
                return "Đơn hàng không tồn tại hoặc không thể truy vấn đơn hàng.";
            }
            order.put("status", "CANCELLED");
            String updateUrl = String.format("http://%s/api/orders/%d", orderServiceHost, orderId);
            restTemplate.put(updateUrl, order);
            return "OK";
        } catch (Exception ex) {
            return "Lỗi khi huỷ đơn hàng: " + ex.getMessage();
        }
    }
}
