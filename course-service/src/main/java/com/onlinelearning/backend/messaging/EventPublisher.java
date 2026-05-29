package com.onlinelearning.backend.messaging;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class EventPublisher {

    private final RabbitTemplate rabbitTemplate;

    public void publishEnrollment(EnrollmentEvent event) {
        try {
            rabbitTemplate.convertAndSend(
                    RabbitMQConfig.NOTIFICATION_EXCHANGE,
                    RabbitMQConfig.ENROLLMENT_KEY,
                    event
            );
            log.info("📤 Published enrollment event for userId={}, course={}",
                    event.getUserId(), event.getCourseName());
        } catch (Exception e) {
            log.warn("⚠️ Failed to publish enrollment event: {}", e.getMessage());
        }
    }
}
