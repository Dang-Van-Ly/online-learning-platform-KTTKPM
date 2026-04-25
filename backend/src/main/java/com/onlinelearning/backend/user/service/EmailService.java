package com.onlinelearning.backend.user.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendOtpEmail(String toEmail, String otpCode) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Mã xác thực đăng ký Online Learning");
        message.setText("Chào bạn,\n\nMã xác thực (OTP) của bạn là: " + otpCode + "\n\nMã này sẽ hết hạn trong 5 phút.");

        mailSender.send(message);
    }
}