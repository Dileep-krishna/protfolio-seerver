// 7. Import dotenv
require("dotenv").config();
const skillRoutes = require("./router"); 
// 1. Import express
const express = require("express");

// 5. Import cors
const cors = require("cors");

// Import mongoose at the top before usage
const mongoose = require("mongoose");

// Import path to handle file paths
const path = require("path");

// 8. Import router
const router = require("./router");

// 11. Connect db (assuming this connects MongoDB)
require("./connection");

// 2. Create express app
const Portfolio = express();

/* ================== MIDDLEWARES ================== */

// 6. Tell server to use cors
Portfolio.use(cors());

// 10. Parse incoming JSON requests
Portfolio.use(express.json());

// ========== CRITICAL FOR FORMDATA ==========
Portfolio.use(express.urlencoded({ extended: true }));

/* ================== DATABASE CONNECTION ================== */


/* ================== STATIC FILES ================== */

Portfolio.use(
  "/imguploads",
  express.static(path.join(__dirname, "imguploads"))
);

/* ================== ROUTES ================== */

// Use skill routes
Portfolio.use("/api/skills", skillRoutes);

// Main router
Portfolio.use(router);

/* ================== SERVER ================== */

// 3. Create port
const PORT = 4000;

// 4. Start server
Portfolio.listen(PORT, () => {
  console.log(`🚀 Portfolio server running successfully at ${PORT}`);
});
Portfolio.get("/", (req, res) => {
  res.send("Backend is running successfully 🚀");
});

