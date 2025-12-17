const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

// Load environment variables
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

const stationRoutes = require("./routes/stationRoutes");

const app = express();
app.use(cors());
app.use(express.json());

// Test Route
app.get("/", (req, res) => {
  res.send("EV Charger Finder API is running");
});

// Use Routes
app.use("/api/stations", stationRoutes);

// Debug log


// ✅ Connect to MongoDB Atlas (no deprecated options)
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚗 Server running on port ${PORT}`));