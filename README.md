## Architecture
Client → REST API → MongoDB
           ↓
        MQTT Broker
           ↓
     WebSocket Server → Clients

## MQTT Topics
- orders/new → New order creation
- orders/update → Order status updates
- vendor/status → Vendor online/offline

## Scaling
- MQTT broker handles event distribution
- WebSocket server can be horizontally scaled
- MongoDB indexed by status and vendor
