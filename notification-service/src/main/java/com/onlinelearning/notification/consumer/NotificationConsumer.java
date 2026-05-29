package com.onlinelearning.notification.consumer;

import com.onlinelearning.notification.config.RabbitMQConfig;
import com.onlinelearning.notification.dto.EnrollmentEvent;
import com.onlinelearning.notification.dto.MembershipBoughtEvent;
import com.onlinelearning.notification.dto.OrderCreatedEvent;
import com.onlinelearning.notification.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import java.text.NumberFormat;
import java.util.Locale;

@Slf4j
@Component
@RequiredArgsConstructor
public class NotificationConsumer {

    private final EmailService emailService;

    @RabbitListener(queues = RabbitMQConfig.ORDER_CREATED_QUEUE)
    public void handleOrderCreated(OrderCreatedEvent event) {
        log.info("📨 Received order.created event for user: {}", event.getUserEmail());
        try {
            String courseList = event.getCourseNames() != null
                    ? String.join(", ", event.getCourseNames())
                    : "Khóa học";
            String formattedPrice = formatPrice(event.getTotalPrice() != null
                    ? event.getTotalPrice().longValue() : 0);
            emailService.sendOrderConfirmation(
                    event.getUserEmail(),
                    event.getUserName() != null ? event.getUserName() : "Học viên",
                    event.getOrderId(),
                    formattedPrice,
                    courseList,
                    event.getPaymentMethod() != null ? event.getPaymentMethod() : "QR"
            );
        } catch (Exception e) {
            log.error("Error processing order.created event: {}", e.getMessage());
        }
    }

    @RabbitListener(queues = RabbitMQConfig.MEMBERSHIP_BOUGHT_QUEUE)
    public void handleMembershipBought(MembershipBoughtEvent event) {
        log.info("📨 Received membership.bought event for user: {}", event.getUserEmail());
        try {
            String formattedPrice = formatPrice(event.getPrice() != null
                    ? event.getPrice().longValue() : 0);
            emailService.sendMembershipConfirmation(
                    event.getUserEmail(),
                    event.getUserName() != null ? event.getUserName() : "Học viên",
                    event.getMembershipName() != null ? event.getMembershipName() : "Membership",
                    formattedPrice,
                    event.getStartDate() != null ? event.getStartDate() : "",
                    event.getEndDate() != null ? event.getEndDate() : "",
                    event.getDurationDays() != null ? event.getDurationDays() : 30
            );
        } catch (Exception e) {
            log.error("Error processing membership.bought event: {}", e.getMessage());
        }
    }

    @RabbitListener(queues = RabbitMQConfig.ENROLLMENT_QUEUE)
    public void handleEnrollment(EnrollmentEvent event) {
        log.info("📨 Received enrollment event for user: {}", event.getUserEmail());
        try {
            emailService.sendEnrollmentConfirmation(
                    event.getUserEmail(),
                    event.getUserName() != null ? event.getUserName() : "Học viên",
                    event.getCourseName() != null ? event.getCourseName() : "Khóa học",
                    event.getInstructorName() != null ? event.getInstructorName() : "Giảng viên"
            );
        } catch (Exception e) {
            log.error("Error processing enrollment event: {}", e.getMessage());
        }
    }

    private String formatPrice(long amount) {
        return NumberFormat.getNumberInstance(new Locale("vi", "VN")).format(amount) + "đ";
    }
}
