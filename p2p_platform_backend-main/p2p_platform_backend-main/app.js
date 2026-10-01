import env from "./config/env.js";
import express from "express";
import userRoutes from "./routes/userRoutes.js";
import { connectDB } from "./config/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { checkAuth } from "./middlewares/authMiddleware.js";
import exchangeRoutes from "./routes/exchangeRoutes.js";
import matchRoutes from "./routes/matchRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { initializeSocket } from "./socket/index.js";
import { socketAuth } from "./socket/middlewares/socketMiddleware.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js"
import authRoutes from "./routes/authRoutes.js"
import reportRoutes from "./routes/reportRoutes.js"


// Gracefully handle unhandled errors to prevent server crash
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception thrown:", error);
});

await connectDB();

const app = express();
const server = createServer(app);

// Allow FRONTEND_ENDPOINT, any subdomain of debanshupati.dev, vercel preview URLs, and localhost
const isOriginAllowed = (origin, callback) => {
  if (!origin) return callback(null, true);
  if (
    origin === env.FRONTEND_ENDPOINT ||
    origin.endsWith("debanshupati.dev") ||
    origin.endsWith(".vercel.app") ||
    origin.includes("localhost")
  ) {
    return callback(null, true);
  }
  return callback(null, true);
};

export const io = new Server(server, {
  cors: {
    origin: isOriginAllowed,
    credentials: true,
  },
});

io.use(socketAuth);
initializeSocket(io);

app.use(express.json());
app.use(cookieParser(env.SESSION_SECRET));
app.use(
  cors({
    origin: isOriginAllowed,
    credentials: true,
  }),
);

// Health check endpoint for uptime monitors (prevents Render free tier spin-down)
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", uptime: process.uptime() });
});

app.get("/", (req, res) => {
  res.status(200).send("upiSathi Backend API is Running");
});

app.use("/user", userRoutes);
app.use("/auth", authRoutes);
app.use("/exchange", checkAuth, exchangeRoutes);
app.use("/match", checkAuth, matchRoutes);
app.use("/chat", checkAuth, chatRoutes);
app.use("/notification", checkAuth, notificationRoutes);
app.use("/reviews", checkAuth, reviewRoutes);
app.use("/report", checkAuth, reportRoutes);

server.listen(env.PORT, () => {
  console.log(`App is running on port ${env.PORT}`);
});

