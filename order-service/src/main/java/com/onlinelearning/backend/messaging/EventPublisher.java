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

    public void publishOrderCreated(OrderCreatedEvent event) {
        try {
            rabbitTemplate.convertAndSend(
                    RabbitMQConfig.NOTIFICATION_EXCHANGE,
                    RabbitMQConfig.ORDER_CREATED_KEY,
                    event
            );
            log.info("📤 Published order.created event for orderId={}", event.getOrderId());
        } catch (Exception e) {
            log.warn("⚠️ Failed to publish order.created event: {}", e.getMessage());
        }
    }

    public void publishMembershipBought(MembershipBoughtEvent event) {
        try {
            rabbitTemplate.convertAndSend(
                    RabbitMQConfig.NOTIFICATION_EXCHANGE,
                    RabbitMQConfig.MEMBERSHIP_BOUGHT_KEY,
                    event
            );
            log.info("📤 Published membership.bought event for userId={}", event.getUserId());
        } catch (Exception e) {
            log.warn("⚠️ Failed to publish membership.bought event: {}", e.getMessage());
        }
    }
}
