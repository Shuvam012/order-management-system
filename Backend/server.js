import express from 'express';
import cors from 'cors';

import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import connectDB from './src/config/db.js';

import authRoutes from './src/routes/authRoutes.js';
import orderRoutes from './src/routes/orderRoutes.js';
import http from 'http';
import { initWebSocket } from './src/websocket/soketServer.js';
import handleVendorStatus from './src/mqtt/venderStatusHandler.js';


dotenv.config();



const app = express();
// app.use(cors());
app.use(cors({
  origin: 'http://localhost:5173', // Replace with your exact Frontend URL
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 5000;


const server = http.createServer(app);

initWebSocket(server);
handleVendorStatus();

// Connect to MongoDB
connectDB();

// Routes placeholder
app.get('/', (req, res) => {
    res.send('Backend is running');
});



//auth
app.use('/api/auth', authRoutes);

//orders
app.use('/api/orders', orderRoutes);



// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

server.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);