import express from 'express';
import cookieParser from "cookie-parser";
import cors from 'cors';
import dotenv from "dotenv";
import authRoutes from './routes/auth.routes.js';

dotenv.config();

const app = express();

// Middleware pour parser le JSON
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:3000', 
  credentials: true, 
}));

// Routes
app.use("/api/auth", authRoutes);
app.get("/", (req, res) => res.send("Bienvenue sur Cinephoria API"));


export default app;

