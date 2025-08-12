const express = require("express");
const app = express();
const cors = require('cors');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("dotenv").config();
const PORT = Number(process.env.PORT) || 7000;
const mongoURL = process.env.MongoDB_URL || process.env.MONGO_URL;

const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const petRoutes = require("./routes/petRoutes");
const adoptionRoutes = require("./routes/adoptionRoutes");
const shopRoutes = require("./routes/shopRoutes");

// Database connection
mongoose.connect(mongoURL)
  .then(() => 
    console.log("MongoDB connected"))
  .catch((error) => 
    console.log("Database connection failed:", error)
);

// Frontend CORS configuration (permissive for dev)
app.use(cors({
  origin: (origin, cb) => cb(null, true),
  credentials: true,
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/api/auth", authRoutes);
app.use("/profile", profileRoutes);
app.use("/pet", petRoutes);
app.use("/adoption", adoptionRoutes);
app.use("/shop", shopRoutes);

// Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
