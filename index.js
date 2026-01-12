// 7. Import dotenv
require("dotenv").config();

// 1. Import express
const express = require("express");

// 5. Import cors
const cors = require("cors");

// 8. Import router
const router = require("./router");

// 11. Connect db
require("./connection");

// Import path to handle file paths
const path = require("path");

// 2. Create express app
const Portfolio = express();

// 6. Tell server to use cors
Portfolio.use(cors());

// 10. Parse incoming JSON requests
Portfolio.use(express.json());

// ========== ADD THIS LINE - CRITICAL FOR FORMDATA ==========
Portfolio.use(express.urlencoded({ extended: true }));

// Serve static files from the uploads folder
Portfolio.use(
  "/imguploads",
  express.static(path.join(__dirname, "imguploads"))
);

// 9. Tell server to use router
Portfolio.use(router);

// 3. Create port
const PORT = 4000;

// 4. Start server (⚠️ USE server.listen, not app.listen)
Portfolio.listen(PORT, () => {
  console.log(`🚀 Portfolio... server running successfully at ${PORT}`);
});