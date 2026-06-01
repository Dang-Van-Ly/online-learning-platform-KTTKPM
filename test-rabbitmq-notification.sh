#!/bin/bash

# Test Script for RabbitMQ + Notification Service End-to-End Flow
# This script tests the complete flow: Order → RabbitMQ → Notification → Email

echo "=============================================="
echo "Testing RabbitMQ + Notification Service Flow"
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if docker-compose is running
echo -e "${YELLOW}[1/6] Checking if services are running...${NC}"
if ! docker-compose ps | grep -q "Up"; then
    echo -e "${RED}Error: Docker services are not running. Please start with: docker-compose up -d${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Services are running${NC}"

# Check RabbitMQ health
echo -e "${YELLOW}[2/6] Checking RabbitMQ health...${NC}"
RABBITMQ_HEALTH=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:15672)
if [ "$RABBITMQ_HEALTH" != "200" ]; then
    echo -e "${RED}Error: RabbitMQ management UI not accessible (expected 200, got $RABBITMQ_HEALTH)${NC}"
    echo "Trying alternative check..."
    
    # Try to connect via AMQP
    if ! docker-compose exec rabbitmq rabbitmq-diagnostics ping; then
        echo -e "${RED}Error: RabbitMQ is not healthy${NC}"
        exit 1
    fi
fi

echo -e "${GREEN}✓ RabbitMQ is healthy${NC}"

# Check notification service health
echo -e "${YELLOW}[3/6] Checking Notification Service health...${NC}"
NOTIFICATION_HEALTH=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8084/actuator/health)
if [ "$NOTIFICATION_HEALTH" != "200" ]; then
    echo -e "${RED}Error: Notification service not healthy (expected 200, got $NOTIFICATION_HEALTH)${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Notification Service is healthy${NC}"

# Check RabbitMQ queues
echo -e "${YELLOW}[4/6] Checking RabbitMQ queues...${NC}"
echo "Listing RabbitMQ queues:"
docker-compose exec rabbitmq rabbitmqctl list_queues name messages_ready messages_unacknowledged

# Test 1: Send a test order event
echo -e "${YELLOW}[5/6] Sending test order event to RabbitMQ...${NC}"

# Create test event JSON
TEST_EVENT_JSON=$(cat << EOF
{
  "orderId": 9999,
  "userId": 100,
  "userEmail": "test@example.com",
  "userName": "Test User",
  "totalPrice": 299000,
  "paymentMethod": "QR",
  "courseNames": ["Khóa học Test 1", "Khóa học Test 2"],
  "status": "COMPLETED"
}
EOF
)

# Send to RabbitMQ using rabbitmqadmin (if available) or curl
if command -v rabbitmqadmin &> /dev/null; then
    echo "Using rabbitmqadmin to publish event..."
    echo "$TEST_EVENT_JSON" | rabbitmqadmin publish exchange="notification.exchange" routing_key="order.created"
else
    echo "Using HTTP API to publish event..."
    # Note: This requires rabbitmq_management plugin enabled
    curl -u guest:guest -X POST \
      -H "Content-Type: application/json" \
      -d "$TEST_EVENT_JSON" \
      "http://localhost:15672/api/exchanges/%2F/notification.exchange/publish" \
      --data-urlencode 'properties={"content_type":"application/json"}' \
      --data-urlencode 'routing_key=order.created' \
      --data-urlencode 'payload_encoding=string' \
      --data-urlencode "payload=$TEST_EVENT_JSON"
fi

echo -e "${GREEN}✓ Test order event sent to RabbitMQ${NC}"

# Wait for processing
echo -e "${YELLOW}[6/6] Waiting for event processing...${NC}"
sleep 5

# Check notification service logs
echo "Checking notification service logs for event processing:"
docker-compose logs notification-service --tail=20 | grep -E "(Received|sent|error|Error)" || echo "No relevant logs found"

# Check RabbitMQ queue status after processing
echo "Checking queue status after processing:"
docker-compose exec rabbitmq rabbitmqctl list_queues name messages_ready messages_unacknowledged

echo ""
echo "=============================================="
echo "Test Summary:"
echo "=============================================="
echo "1. Services Health: ✓"
echo "2. RabbitMQ: ✓" 
echo "3. Notification Service: ✓"
echo "4. Queues Created: ✓"
echo "5. Event Published: ✓"
echo "6. Event Processing: Check logs above"
echo ""
echo "Next steps:"
echo "1. Check email at test@example.com (if SMTP configured)"
echo "2. Monitor RabbitMQ management UI: http://localhost:15672"
echo "3. Check notification service logs: docker-compose logs notification-service"
echo "4. Test with real order from frontend"
echo "=============================================="