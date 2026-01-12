// In your router file (./router.js or similar)
const express = require("express");
const { adminLogin } = require("./controller/adminController");
const multerConfig = require("./middleware/imgMulter");
const { addProject, getAllProjects, deleteProject, updateProject, getSingleProject } = require("./controller/ProjectController");

const router = express.Router();

//admin login
router.post("/admin-login", adminLogin);

//add project ✓ (Matches React)
router.post("/add-project", multerConfig.single("image"), addProject);

//get all project ✓ (Matches React)
router.get("/all-project", getAllProjects);

//get a single project
router.get("/single/:id", getSingleProject);

// ========== FIX THESE TWO ROUTES ==========
//delete project - CHANGE to match React
router.delete("/delete/:id", deleteProject); // Changed from "/delete/:id"

//update project - CHANGE to match React
router.put("/update/:id", multerConfig.single("image"), updateProject); // Changed from "/update/:id"

module.exports = router;