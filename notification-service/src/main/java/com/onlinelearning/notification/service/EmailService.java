package com.onlinelearning.notification.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.MailException;
import org.springframework.mail.MailSendException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Recover;
import org.springframework.retry.annotation.Retryable;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Retryable(value = MailException.class, maxAttempts = 3, backoff = @Backoff(delay = 3000))
    public void sendOrderConfirmation(String to, String userName, Long orderId,
                                      String totalPrice, String courseList, String paymentMethod) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(to);
            helper.setSubject("✅ Xác nhận đơn hàng #" + orderId + " - KhoKhoaHoc");
            helper.setText(buildOrderEmail(userName, orderId, totalPrice, courseList, paymentMethod), true);
            mailSender.send(message);
            log.info("Order confirmation email sent to {}", to);
        } catch (MailException e) {
            throw e;
        } catch (Exception e) {
            throw new MailSendException("Failed to send order confirmation email", e);
        }
    }

    @Retryable(value = MailException.class, maxAttempts = 3, backoff = @Backoff(delay = 3000))
    public void sendMembershipConfirmation(String to, String userName, String membershipName,
                                           String price, String startDate, String endDate, int durationDays) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(to);
            helper.setSubject("🎉 Kích hoạt gói " + membershipName + " thành công - KhoKhoaHoc");
            helper.setText(buildMembershipEmail(userName, membershipName, price, startDate, endDate, durationDays), true);
            mailSender.send(message);
            log.info("Membership confirmation email sent to {}", to);
        } catch (MailException e) {
            throw e;
        } catch (Exception e) {
            throw new MailSendException("Failed to send membership confirmation email", e);
        }
    }

    @Retryable(value = MailException.class, maxAttempts = 3, backoff = @Backoff(delay = 3000))
    public void sendEnrollmentConfirmation(String to, String userName, String courseName, String instructorName) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(to);
            helper.setSubject("📚 Đăng ký khóa học thành công - " + courseName);
            helper.setText(buildEnrollmentEmail(userName, courseName, instructorName), true);
            mailSender.send(message);
            log.info("Enrollment confirmation email sent to {}", to);
        } catch (MailException e) {
            throw e;
        } catch (Exception e) {
            throw new MailSendException("Failed to send enrollment confirmation email", e);
        }
    }

    @Recover
    public void recoverSendOrderConfirmation(MailException ex, String to, String userName, Long orderId,
                                             String totalPrice, String courseList, String paymentMethod) {
        log.error("Failed to send order email to {} after retries: {}", to, ex.getMessage());
    }

    @Recover
    public void recoverSendMembershipConfirmation(MailException ex, String to, String userName, String membershipName,
                                                  String price, String startDate, String endDate, int durationDays) {
        log.error("Failed to send membership email to {} after retries: {}", to, ex.getMessage());
    }

    @Recover
    public void recoverSendEnrollmentConfirmation(MailException ex, String to, String userName,
                                                  String courseName, String instructorName) {
        log.error("Failed to send enrollment email to {} after retries: {}", to, ex.getMessage());
    }

    private String buildOrderEmail(String userName, Long orderId, String totalPrice,
                                   String courseList, String paymentMethod) {
        return """
            <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc;">
              <div style="background: linear-gradient(135deg, #2563eb, #1d4ed8); padding: 32px; text-align: center; border-radius: 12px 12px 0 0;">
                <h1 style="color: white; margin: 0; font-size: 24px;">🎓 KhoKhoaHoc</h1>
                <p style="color: #bfdbfe; margin: 8px 0 0;">Nền tảng học trực tuyến hàng đầu</p>
              </div>
              <div style="background: white; padding: 32px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                <h2 style="color: #1e293b; margin-top: 0;">✅ Đơn hàng đã được xác nhận!</h2>
                <p style="color: #475569;">Xin chào <strong>%s</strong>,</p>
                <p style="color: #475569;">Cảm ơn bạn đã mua khóa học tại KhoKhoaHoc. Đơn hàng của bạn đã được xử lý thành công.</p>
                <div style="background: #f1f5f9; border-radius: 8px; padding: 20px; margin: 20px 0;">
                  <table style="width: 100%%; border-collapse: collapse;">
                    <tr><td style="color: #64748b; padding: 6px 0;">Mã đơn hàng:</td><td style="font-weight: bold; color: #1e293b;">#%d</td></tr>
                    <tr><td style="color: #64748b; padding: 6px 0;">Khóa học:</td><td style="color: #1e293b;">%s</td></tr>
                    <tr><td style="color: #64748b; padding: 6px 0;">Phương thức:</td><td style="color: #1e293b;">%s</td></tr>
                    <tr><td style="color: #64748b; padding: 6px 0;">Tổng tiền:</td><td style="font-weight: bold; color: #2563eb; font-size: 18px;">%s</td></tr>
                  </table>
                </div>
                <a href="http://localhost:3000/profile" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">Xem khóa học của tôi →</a>
                <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;">
                <p style="color: #94a3b8; font-size: 12px; text-align: center;">© 2024 KhoKhoaHoc. Mọi thắc mắc liên hệ: support@khokhoahoc.vn</p>
              </div>
            </div>
            """.formatted(userName, orderId, courseList, paymentMethod, totalPrice);
    }

    private String buildMembershipEmail(String userName, String membershipName, String price,
                                        String startDate, String endDate, int durationDays) {
        return """
            <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc;">
              <div style="background: linear-gradient(135deg, #7c3aed, #6d28d9); padding: 32px; text-align: center; border-radius: 12px 12px 0 0;">
                <h1 style="color: white; margin: 0; font-size: 24px;">🎓 KhoKhoaHoc</h1>
                <p style="color: #ddd6fe; margin: 8px 0 0;">Gói thành viên cao cấp</p>
              </div>
              <div style="background: white; padding: 32px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                <h2 style="color: #1e293b; margin-top: 0;">🎉 Kích hoạt gói thành viên thành công!</h2>
                <p style="color: #475569;">Xin chào <strong>%s</strong>,</p>
                <p style="color: #475569;">Gói <strong>%s</strong> của bạn đã được kích hoạt. Hãy bắt đầu học ngay!</p>
                <div style="background: linear-gradient(135deg, #f5f3ff, #ede9fe); border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #7c3aed;">
                  <table style="width: 100%%; border-collapse: collapse;">
                    <tr><td style="color: #64748b; padding: 6px 0;">Gói:</td><td style="font-weight: bold; color: #7c3aed;">%s</td></tr>
                    <tr><td style="color: #64748b; padding: 6px 0;">Thời hạn:</td><td style="color: #1e293b;">%d ngày</td></tr>
                    <tr><td style="color: #64748b; padding: 6px 0;">Bắt đầu:</td><td style="color: #1e293b;">%s</td></tr>
                    <tr><td style="color: #64748b; padding: 6px 0;">Hết hạn:</td><td style="color: #1e293b;">%s</td></tr>
                    <tr><td style="color: #64748b; padding: 6px 0;">Giá:</td><td style="font-weight: bold; color: #7c3aed; font-size: 18px;">%s</td></tr>
                  </table>
                </div>
                <a href="http://localhost:3000/courses" style="display: inline-block; background: #7c3aed; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">Khám phá khóa học →</a>
                <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;">
                <p style="color: #94a3b8; font-size: 12px; text-align: center;">© 2024 KhoKhoaHoc. Mọi thắc mắc liên hệ: support@khokhoahoc.vn</p>
              </div>
            </div>
            """.formatted(userName, membershipName, membershipName, durationDays, startDate, endDate, price);
    }

    private String buildEnrollmentEmail(String userName, String courseName, String instructorName) {
        return """
            <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc;">
              <div style="background: linear-gradient(135deg, #059669, #047857); padding: 32px; text-align: center; border-radius: 12px 12px 0 0;">
                <h1 style="color: white; margin: 0; font-size: 24px;">🎓 KhoKhoaHoc</h1>
                <p style="color: #a7f3d0; margin: 8px 0 0;">Học tập không giới hạn</p>
              </div>
              <div style="background: white; padding: 32px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                <h2 style="color: #1e293b; margin-top: 0;">📚 Đăng ký khóa học thành công!</h2>
                <p style="color: #475569;">Xin chào <strong>%s</strong>,</p>
                <p style="color: #475569;">Bạn đã đăng ký thành công khóa học <strong>%s</strong>.</p>
                <div style="background: #f0fdf4; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #059669;">
                  <p style="margin: 0; color: #1e293b;"><strong>📖 Khóa học:</strong> %s</p>
                  <p style="margin: 8px 0 0; color: #1e293b;"><strong>👨‍🏫 Giảng viên:</strong> %s</p>
                </div>
                <a href="http://localhost:3000/courses" style="display: inline-block; background: #059669; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">Bắt đầu học ngay →</a>
                <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;">
                <p style="color: #94a3b8; font-size: 12px; text-align: center;">© 2024 KhoKhoaHoc. Mọi thắc mắc liên hệ: support@khokhoahoc.vn</p>
              </div>
            </div>
            """.formatted(userName, courseName, courseName, instructorName);
    }
}
