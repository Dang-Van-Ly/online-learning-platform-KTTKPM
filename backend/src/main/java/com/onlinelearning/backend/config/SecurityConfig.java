package com.onlinelearning.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    public SecurityConfig(JwtFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                // ❌ disable CSRF cho REST API
                .csrf(csrf -> csrf.disable())

                // ✅ CORS chuẩn (Giúp React gọi API không bị chặn)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // ❌ tắt login mặc định của Spring (vì mình dùng JWT tự chế)
                .formLogin(form -> form.disable())
                .httpBasic(basic -> basic.disable())

                // ❌ REST API stateless (Không dùng Session)
                .sessionManagement(sm ->
                        sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                .authorizeHttpRequests(auth -> auth

                        // ✅ PUBLIC API: Cho phép truy cập không cần Token
                        .requestMatchers(
                                "/",
                                "/auth/**",          // 👈 Đảm bảo login nằm trong /auth/login
                                "/api/users/register", // 👈 Thêm trực tiếp đường dẫn register của bạn vào đây
                                "/api/public/**",
                                "/api/courses/**",
                                "/swagger-ui/**",
                                "/v3/api-docs/**"
                        ).permitAll()

                        // 🔐 PRIVATE API: Bắt buộc phải có JWT hợp lệ
                        .requestMatchers(
                                "/api/cart/**",
                                "/api/order/**",
                                "/api/admin/**"
                        ).authenticated()

                        // ⚠️ DEV MODE: Những gì chưa định nghĩa thì tạm thời cho phép
                        // (Khi xong dự án nên đổi thành .authenticated())
                        .anyRequest().permitAll()
                )

                // ✅ Thêm Filter kiểm tra JWT trước khi xử lý Request
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // ================= CORS CONFIG (Kết nối React - Spring Boot) =================
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        // Cho phép React (port 3000) truy cập
        config.setAllowedOrigins(List.of("http://localhost:3000"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return source;
    }

    // ✅ Bean mã hóa mật khẩu (Đã dùng trong UserService của bạn)
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}