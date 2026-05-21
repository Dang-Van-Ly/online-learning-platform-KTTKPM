package com.onlinelearning.backend.config;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class RateLimitFilter implements Filter {

    // IP -> list request timestamps (thread-safe)
    private final Map<String, List<Long>> requestMap = new ConcurrentHashMap<>();

    private static final long TIME_WINDOW = 60_000; // 1 phút
    private static final int MAX_REQUESTS = 100;

    @Override
    public void doFilter(ServletRequest request,
                         ServletResponse response,
                         FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest req = (HttpServletRequest) request;
        HttpServletResponse res = (HttpServletResponse) response;

        String ip = getClientIP(req);
        long now = System.currentTimeMillis();

        // tạo list nếu chưa có (thread-safe)
        requestMap.putIfAbsent(ip, Collections.synchronizedList(new ArrayList<>()));
        List<Long> requests = requestMap.get(ip);

        synchronized (requests) {

            // xóa request cũ hơn 1 phút
            requests.removeIf(time -> time < now - TIME_WINDOW);

            // kiểm tra limit
            if (requests.size() >= MAX_REQUESTS) {
                res.setStatus(429);
                res.setContentType("application/json");
                res.getWriter().write("{\"error\":\"Too many requests\"}");
                return;
            }

            // thêm request mới
            requests.add(now);
        }

        chain.doFilter(request, response);
    }

    private String getClientIP(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader != null && !xfHeader.isEmpty()) {
            return xfHeader.split(",")[0];
        }
        return request.getRemoteAddr();
    }
}