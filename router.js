const express = require("express");
const { adminLogin } = require("./controller/adminController");
const multerConfig = require("./middleware/imgMulter");
const { addProject, getAllProjects, deleteProject, updateProject, getSingleProject } = require("./controller/ProjectController");

const router = express.Router();


//admin login
router.post("/admin-login",adminLogin)
//add project
router.post("/add-project", multerConfig.single("image"), addProject);
//get all project
router.get("/all-project", getAllProjects);
//get a single project
router.get("/single/:id", getSingleProject);
//delete project
router.delete("/delete/:id", deleteProject);
//update project
router.put("/update/:id", multerConfig.single("image"), updateProject);

module.exports = router;