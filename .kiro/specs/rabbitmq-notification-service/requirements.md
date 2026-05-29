# Requirements Document

## Introduction

The RabbitMQ + Notification Service is a critical component of the online learning platform that handles asynchronous email notifications for course purchases, membership subscriptions, and enrollment events. The service uses RabbitMQ message broker to decouple notification processing from core business services, ensuring reliable delivery of email confirmations even during high load or service disruptions.

## Glossary

- **Notification_Service**: The microservice responsible for consuming events from RabbitMQ and sending email notifications
- **RabbitMQ**: Message broker that handles event distribution between services
- **Order_Service**: Service that processes course purchases and publishes order events
- **Course_Service**: Service that manages courses and publishes enrollment events
- **Email_Service**: Component within Notification_Service that handles SMTP email delivery
- **Event_Publisher**: Component in producer services that publishes events to RabbitMQ
- **Notification_Consumer**: Component in Notification_Service that consumes events from RabbitMQ queues
- **Topic_Exchange**: RabbitMQ exchange type that routes messages based on routing key patterns
- **Routing_Key**: String pattern used to route messages from exchanges to queues

## Requirements

### Requirement 1: RabbitMQ Infrastructure Setup

**User Story:** As a system administrator, I want RabbitMQ properly configured in the infrastructure, so that all microservices can reliably exchange events for notification processing.

#### Acceptance Criteria

1. THE RabbitMQ_Container SHALL be defined in docker-compose.yml with proper configuration
2. THE RabbitMQ_Container SHALL expose port 5672 for AMQP communication
3. THE RabbitMQ_Container SHALL expose port 15672 for management UI
4. THE RabbitMQ_Container SHALL have persistent volume for message durability
5. THE RabbitMQ_Container SHALL be accessible to all microservices via hostname "rabbitmq"
6. WHEN RabbitMQ_Container starts, THEN THE RabbitMQ_Container SHALL initialize with default guest credentials
7. WHERE high availability is required, THE RabbitMQ_Container SHALL support clustering configuration

### Requirement 2: Notification Service Integration

**User Story:** As a developer, I want the notification service integrated into the docker-compose ecosystem, so that it can receive and process events from other services.

#### Acceptance Criteria

1. THE Notification_Service SHALL be defined in docker-compose.yml with proper dependencies
2. THE Notification_Service SHALL depend on RabbitMQ_Container being healthy
3. THE Notification_Service SHALL expose port 8084 for health checks
4. THE Notification_Service SHALL connect to RabbitMQ using hostname "rabbitmq"
5. WHEN Notification_Service starts, THEN THE Notification_Service SHALL declare required exchanges, queues, and bindings
6. IF RabbitMQ connection fails, THEN THE Notification_Service SHALL implement retry logic with exponential backoff
7. WHILE processing events, THE Notification_Service SHALL maintain message acknowledgment for reliable delivery

### Requirement 3: Event Consumption and Processing

**User Story:** As a user, I want to receive email notifications for my purchases and enrollments, so that I have confirmation and access details.

#### Acceptance Criteria

1. WHEN Order_Service publishes "order.created" event, THEN THE Notification_Consumer SHALL consume from "order.created.queue"
2. WHEN Order_Service publishes "membership.bought" event, THEN THE Notification_Consumer SHALL consume from "membership.bought.queue"
3. WHEN Course_Service publishes "enrollment.success" event, THEN THE Notification_Consumer SHALL consume from "enrollment.queue"
4. FOR ALL consumed events, THE Notification_Consumer SHALL extract user email, name, and event details
5. FOR ALL consumed events, THE Notification_Consumer SHALL call Email_Service with formatted data
6. IF event processing fails, THEN THE Notification_Consumer SHALL log error and implement dead letter queue handling
7. WHILE processing events, THE Notification_Consumer SHALL maintain idempotent processing to prevent duplicate notifications

### Requirement 4: Email Notification Delivery

**User Story:** As a user, I want professional, formatted email notifications, so that I have clear information about my transactions.

#### Acceptance Criteria

1. THE Email_Service SHALL send HTML-formatted emails with platform branding
2. THE Email_Service SHALL include order details (ID, courses, price, payment method) in order confirmation emails
3. THE Email_Service SHALL include membership details (name, duration, start/end dates, price) in membership confirmation emails
4. THE Email_Service SHALL include course details (name, instructor) in enrollment confirmation emails
5. THE Email_Service SHALL format prices in Vietnamese currency (VND) with proper thousand separators
6. THE Email_Service SHALL include actionable links to user dashboard and course access
7. IF email delivery fails, THEN THE Email_Service SHALL log error and implement retry logic
8. WHERE SMTP configuration is provided, THE Email_Service SHALL use secure SSL/TLS connection

### Requirement 5: Configuration Management

**User Story:** As a system administrator, I want configurable email and RabbitMQ settings, so that I can deploy to different environments.

#### Acceptance Criteria

1. THE Notification_Service SHALL read RabbitMQ connection details from application.properties
2. THE Notification_Service SHALL read SMTP email configuration from application.properties
3. THE Email_Service SHALL support configurable sender email address and platform name
4. THE RabbitMQ_Configuration SHALL support configurable exchange names, queue names, and routing keys
5. WHERE environment variables are available, THE Configuration SHALL override property file values
6. THE Configuration SHALL separate development, testing, and production settings

### Requirement 6: Monitoring and Observability

**User Story:** As an operations engineer, I want visibility into notification processing, so that I can monitor system health and troubleshoot issues.

#### Acceptance Criteria

1. THE Notification_Service SHALL log all consumed events with user email and event type
2. THE Notification_Service SHALL log successful email deliveries with recipient and email type
3. THE Notification_Service SHALL log failed email deliveries with error details
4. THE Notification_Service SHALL expose health endpoint at /actuator/health
5. THE Notification_Service SHALL include RabbitMQ connection status in health checks
6. WHERE monitoring is enabled, THE Notification_Service SHALL publish metrics for events processed, emails sent, and failures
7. IF RabbitMQ management UI is accessible, THEN THE System SHALL provide queue monitoring and message tracing

### Requirement 7: Error Handling and Resilience

**User Story:** As a system architect, I want robust error handling, so that the system remains operational during partial failures.

#### Acceptance Criteria

1. IF Email_Service fails to send email, THEN THE System SHALL not lose the event (store in dead letter queue)
2. IF RabbitMQ connection is lost, THEN THE Notification_Service SHALL attempt reconnection with backoff
3. IF event parsing fails, THEN THE Notification_Consumer SHALL reject message with error logging
4. WHERE retry is configured, THE System SHALL implement exponential backoff for failed operations
5. THE System SHALL implement circuit breaker pattern for external service dependencies (SMTP)
6. WHILE processing high volume, THE System SHALL implement rate limiting to prevent SMTP abuse
7. FOR ALL critical failures, THE System SHALL alert administrators via configured channels

### Requirement 8: Parser and Serializer Requirements

**User Story:** As a developer, I want reliable event serialization and deserialization, so that events are properly transmitted between services.

#### Acceptance Criteria

1. THE Event_Serializer SHALL convert Java objects to JSON for RabbitMQ message payload
2. THE Event_Deserializer SHALL convert JSON messages back to Java objects in Notification_Service
3. THE Pretty_Printer SHALL format event objects for logging and debugging purposes
4. FOR ALL event types, serializing then deserializing SHALL produce equivalent objects (round-trip property)
5. WHEN invalid JSON is received, THEN THE Deserializer SHALL throw descriptive error with message details
6. THE Serializer SHALL handle Java 8 date/time types (LocalDate, LocalDateTime) properly
7. THE Serializer SHALL maintain backward compatibility for event schema changes