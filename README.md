📦 Real-Time Service Order Management System

A full-stack real-time order management system built using React, Node.js, MQTT, WebSockets, and MongoDB.
This system enables customers to place orders, vendors to manage them, and admins to monitor everything live without page refresh.

🚀 Tech Stack
Frontend

    React (Vite)
    
    Tailwind CSS
    
    Context API
    
    WebSocket (real-time updates)

Backend

    Node.js
    
    Express.js
    
    MongoDB + Mongoose
    
    JWT Authentication
    
    MQTT (real-time messaging)
    
    Messaging
    
    MQTT Broker (Mosquitto / HiveMQ)
    
    WebSocket Server (MQTT → Frontend bridge)



🔐 Authentication & Roles

    Role	Permissions
    Customer	Create orders, view order history
    Vendor	Login, (accepted, on_the_way, in_progress, completed)update status
    Admin	View all orders, monitor vendor status

JWT is used for authentication and role-based access control.

⚡ Real-Time Architecture
Why MQTT + WebSocket?

MQTT handles backend real-time events efficiently

WebSocket delivers those events instantly to the frontend

🔄 Data Flow

    Customer → REST API → MongoDB
                       ↓
                    MQTT Publish
                       ↓
             WebSocket Server
                       ↓
             React Frontend (Admin/Vendor)

📡 MQTT Topic Design
Topic	Purpose

      orders/new	New order created
      orders/update	Order status updated
      vendor/status	Vendor online/offline


🌐 WebSocket Bridge

    Backend subscribes to MQTT topics
    
    On MQTT message → broadcasts to connected WebSocket clients
    
    Frontend listens and updates UI instantly (no refresh)

🛠 Setup Instructions
Backend

    cd backend
    npm install
    npm run dev

Frontend

    cd frontend
    npm install
    npm run dev

to run seeds , create admin and create vendor 

    node scripts/createAdmin.js
    node scripts/createVendor.js

    

Environment Variables (Backend)

    MONGO_URI=your_mongodb_uri
    JWT_SECRET=your_secret
    MQTT_BROKER_URL=mqtt://localhost:1883
    ADMIN_EMAIL=adminMail
    ADMIN_PASSWORD=adminPass
    VENDOR_EMAIL=vendorMail
     VENDOR_PASSWORD=VendorPass

📈 Scaling Approach
Backend

    Stateless APIs → easy horizontal scaling
    
    MongoDB indexing for faster order queries
    
    Separate services for Orders, Users, and Notifications
    
    MQTT
    
    Supports thousands of concurrent messages
  
    WebSocket
    
 
    

Frontend

    Component-based design
    WebSocket connection reused globally

🧠 Design Decisions

    Single Vendor (current) → Simplifies assignment logic
    
    Service–Controller Separation → Clean architecture
    
    Full Order Payload Broadcast → Prevents frontend refresh issues
    
    Real-time vendor status → Admin visibility
