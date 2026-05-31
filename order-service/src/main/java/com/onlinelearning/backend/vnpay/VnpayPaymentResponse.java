package com.onlinelearning.backend.vnpay;

public class VnpayPaymentResponse {
    private Long orderId;
    private String paymentUrl;
    private String status;

    public VnpayPaymentResponse() {
    }

    public VnpayPaymentResponse(Long orderId, String paymentUrl, String status) {
        this.orderId = orderId;
        this.paymentUrl = paymentUrl;
        this.status = status;
    }

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public String getPaymentUrl() {
        return paymentUrl;
    }

    public void setPaymentUrl(String paymentUrl) {
        this.paymentUrl = paymentUrl;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
