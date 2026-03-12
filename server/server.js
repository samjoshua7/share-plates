// Force Google DNS — ISP DNS blocks MongoDB Atlas SRV lookups
const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const foodRoutes = require("./routes/food");
const requestRoutes = require("./routes/requests");
const messageRoutes = require("./routes/messages");

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Expose Socket.io instance to routes via req.app.get("io")
app.set("io", io);

io.on("connection", (socket) => {
  console.log("Client connected via Socket.io:", socket.id);
  
  socket.on("join", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their personal room`);
  });

  socket.on("join_role", (role) => {
    socket.join(role);
    console.log(`Socket ${socket.id} joined role room: ${role}`);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Share Plates API Running");
});

// Mount API routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/food", foodRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/messages", messageRoutes);

// Connect to DB first, then start server
connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Server & Socket.io running on port ${PORT}`);
  });
});