package com.onlinelearning.notification.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    // ===== EXCHANGES =====
    public static final String NOTIFICATION_EXCHANGE = "notification.exchange";

    // ===== QUEUES =====
    public static final String ORDER_CREATED_QUEUE    = "order.created.queue";
    public static final String MEMBERSHIP_BOUGHT_QUEUE = "membership.bought.queue";
    public static final String ENROLLMENT_QUEUE       = "enrollment.queue";

    // ===== ROUTING KEYS =====
    public static final String ORDER_CREATED_KEY    = "order.created";
    public static final String MEMBERSHIP_BOUGHT_KEY = "membership.bought";
    public static final String ENROLLMENT_KEY       = "enrollment.success";

    @Bean
    public TopicExchange notificationExchange() {
        return new TopicExchange(NOTIFICATION_EXCHANGE, true, false);
    }

    @Bean
    public Queue orderCreatedQueue() {
        return QueueBuilder.durable(ORDER_CREATED_QUEUE).build();
    }

    @Bean
    public Queue membershipBoughtQueue() {
        return QueueBuilder.durable(MEMBERSHIP_BOUGHT_QUEUE).build();
    }

    @Bean
    public Queue enrollmentQueue() {
        return QueueBuilder.durable(ENROLLMENT_QUEUE).build();
    }

    @Bean
    public Binding orderCreatedBinding() {
        return BindingBuilder.bind(orderCreatedQueue())
                .to(notificationExchange()).with(ORDER_CREATED_KEY);
    }

    @Bean
    public Binding membershipBoughtBinding() {
        return BindingBuilder.bind(membershipBoughtQueue())
                .to(notificationExchange()).with(MEMBERSHIP_BOUGHT_KEY);
    }

    @Bean
    public Binding enrollmentBinding() {
        return BindingBuilder.bind(enrollmentQueue())
                .to(notificationExchange()).with(ENROLLMENT_KEY);
    }

    @Bean
    public Jackson2JsonMessageConverter messageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate template = new RabbitTemplate(connectionFactory);
        template.setMessageConverter(messageConverter());
        return template;
    }
}
