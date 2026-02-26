import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from "./routes/userRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";

// Load environment variables from .env file
dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));


app.use(express.json());
app.use('/api/auth', authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/bookings", bookingRoutes);

const PORT = process.env.PORT; // connection to port 5000

// checking API is running
app.get('/', (req, res) => {
  res.send('Server is running!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
