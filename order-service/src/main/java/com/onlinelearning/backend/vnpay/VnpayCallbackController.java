package com.onlinelearning.backend.vnpay;

import com.onlinelearning.backend.order.service.OrderService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
public class VnpayCallbackController {

    private final VnpayService vnpayService;
    private final OrderService orderService;

    public VnpayCallbackController(VnpayService vnpayService, OrderService orderService) {
        this.vnpayService = vnpayService;
        this.orderService = orderService;
    }

    @GetMapping("/vnpay-callback")
    public String handleVnpayCallback(HttpServletRequest request) {
        Map<String, String> params = new HashMap<>();
        request.getParameterMap().forEach((key, values) -> {
            if (values != null && values.length > 0) {
                params.put(key, values[0]);
            }
        });

        if (!vnpayService.validateReturnSignature(params)) {
            return "INVALID_SIGNATURE";
        }

        String txnRef = params.get("vnp_TxnRef");
        String responseCode = params.get("vnp_ResponseCode");
        if (txnRef == null) {
            return "MISSING_TXNREF";
        }

        Long orderId = Long.parseLong(txnRef);
        if ("00".equals(responseCode)) {
            orderService.updateOrderStatus(orderId, "PAID");
            return "PAYMENT_SUCCESS";
        }
        orderService.updateOrderStatus(orderId, "FAILED");
        return "PAYMENT_FAILED";
    }
}
