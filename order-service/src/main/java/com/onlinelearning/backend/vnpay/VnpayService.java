package com.onlinelearning.backend.vnpay;

import com.onlinelearning.backend.order.entity.Order;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Map;
import java.util.TreeMap;
import java.util.stream.Collectors;

@Service
public class VnpayService {

    private final VnpayConfig config;

    public VnpayService(VnpayConfig config) {
        this.config = config;
    }

    public String generatePaymentUrl(Order order, String clientIp) {
        Map<String, String> vnpParams = new TreeMap<>();
        vnpParams.put("vnp_Version", "2.1.0");
        vnpParams.put("vnp_Command", "pay");
        vnpParams.put("vnp_TmnCode", config.getTmnCode());
        vnpParams.put("vnp_Amount", toVnpayAmount(order.getTotalPrice()));
        vnpParams.put("vnp_CurrCode", "VND");
        vnpParams.put("vnp_TxnRef", order.getId().toString());
        vnpParams.put("vnp_OrderInfo", "Thanh toán đơn hàng " + order.getId());
        vnpParams.put("vnp_OrderType", "education");
        vnpParams.put("vnp_Locale", "vn");
        vnpParams.put("vnp_ReturnUrl", config.getReturnUrl());
        if (clientIp != null && !clientIp.isBlank()) {
            vnpParams.put("vnp_IpAddr", clientIp);
        }
        if (config.getBankCode() != null && !config.getBankCode().isBlank()) {
            vnpParams.put("vnp_BankCode", config.getBankCode());
        }
        vnpParams.put("vnp_CreateDate", LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss")));
        vnpParams.put("vnp_ExpireDate", LocalDateTime.now().plusMinutes(15).format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss")));

        String hashData = buildHashData(vnpParams);
        String secureHash = hmacSHA512(config.getHashSecret(), hashData);

        String queryString = buildQueryString(vnpParams);
        queryString += "&vnp_SecureHashType=SHA512&vnp_SecureHash=" + secureHash;

        return config.getUrl() + "?" + queryString;
    }

    public boolean validateReturnSignature(Map<String, String> params) {
        Map<String, String> sorted = new TreeMap<>(params);
        sorted.remove("vnp_SecureHash");
        sorted.remove("vnp_SecureHashType");
        String data = buildHashData(sorted);
        String computedHash = hmacSHA512(config.getHashSecret(), data);
        String receivedHash = params.get("vnp_SecureHash");
        return computedHash.equalsIgnoreCase(receivedHash);
    }

    private String buildHashData(Map<String, String> params) {
        return params.entrySet().stream()
                .map(entry -> entry.getKey() + "=" + entry.getValue())
                .collect(Collectors.joining("&"));
    }

    private String buildQueryString(Map<String, String> params) {
        return params.entrySet().stream()
                .map(entry -> entry.getKey() + "=" + urlEncode(entry.getValue()))
                .collect(Collectors.joining("&"));
    }

    private String urlEncode(String value) {
        return URLEncoder.encode(value, StandardCharsets.UTF_8);
    }

    private String hmacSHA512(String key, String data) {
        try {
            Mac mac = Mac.getInstance("HmacSHA512");
            mac.init(new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA512"));
            byte[] digest = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            StringBuilder hex = new StringBuilder();
            for (byte b : digest) {
                String hexPart = Integer.toHexString(0xff & b);
                if (hexPart.length() == 1) {
                    hex.append('0');
                }
                hex.append(hexPart);
            }
            return hex.toString();
        } catch (NoSuchAlgorithmException | InvalidKeyException e) {
            throw new IllegalStateException("Unable to compute VNPAY secure hash", e);
        }
    }

    private String toVnpayAmount(BigDecimal amount) {
        if (amount == null) {
            return "0";
        }
        return amount.multiply(BigDecimal.valueOf(100)).toBigInteger().toString();
    }
}
