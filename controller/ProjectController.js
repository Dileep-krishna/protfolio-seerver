const Project = require("../model/adminProjectModel");
const fs = require("fs");
const path = require("path");

// Add project - CORRECTED for FormData
exports.addProject = async (req, res) => {
  try {
    // With FormData, req.body fields are available but as strings
    const { title, description, github, live, id } = req.body;

    // Debug logging
    console.log("📦 req.body:", req.body);
    console.log("📁 req.file:", req.file);

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image is required"
      });
    }

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Title and description are required"
      });
    }

    const imagePath = req.file.filename;

    const newProject = await Project.create({
      title,
      image: imagePath,
      description,
      github: github || "",
      live: live || "",
      id: id || "",
    });

    res.status(201).json({
      success: true,
      data: newProject
    });
  } catch (error) {
    console.error("❌ addProject error:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get all projects with pagination - CORRECTED
exports.getAllProjects = async (req, res) => {
  try {
    console.log("🔥 getAllProjects HIT - Query:", req.query);

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Get total count
    const total = await Project.countDocuments();
    
    // Get paginated data
    const projects = await Project.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalPages = Math.ceil(total / limit);

    console.log(`✅ Fetched ${projects.length} projects, page ${page}/${totalPages}`);

    res.status(200).json({
      success: true,
      data: projects,
      page: page,
      totalPages: totalPages,
      total: total
    });
  } catch (error) {
    console.error("❌ getAllProjects ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get single project
exports.getSingleProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }
    res.status(200).json({
      success: true,
      data: project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update project - CORRECTED for FormData
exports.updateProject = async (req, res) => {
  try {
    console.log("🔄 updateProject - ID:", req.params.id);
    console.log("📦 req.body:", req.body);
    console.log("📁 req.file:", req.file);

    const projectId = req.params.id;
    
    // Check if project exists
    const existingProject = await Project.findById(projectId);
    if (!existingProject) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

    // Build update object from req.body (FormData fields)
    const updateData = {};
    
    // Update only the fields that are provided
    if (req.body.title !== undefined) updateData.title = req.body.title;
    if (req.body.description !== undefined) updateData.description = req.body.description;
    if (req.body.github !== undefined) updateData.github = req.body.github;
    if (req.body.live !== undefined) updateData.live = req.body.live;
    if (req.body.id !== undefined) updateData.id = req.body.id;

    // Handle new image upload
    if (req.file) {
      // Delete old image file if exists
      if (existingProject.image) {
        const oldImagePath = path.join(__dirname, '..', 'imguploads', existingProject.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      updateData.image = req.file.filename;
    }

    console.log("📝 Update data:", updateData);

    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedProject) {
      return res.status(404).json({
        success: false,
        message: "Project not found after update"
      });
    }

    res.status(200).json({
      success: true,
      message: "Project updated successfully",
      data: updatedProject
    });
  } catch (error) {
    console.error("❌ updateProject error:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete project - CORRECTED to delete image file
exports.deleteProject = async (req, res) => {
  try {
    const projectId = req.params.id;
    console.log("🗑️ deleteProject - ID:", projectId);
    
    // Find project first to get image filename
    const project = await Project.findById(projectId);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

    // Delete associated image file
    if (project.image) {
      const imagePath = path.join(__dirname, '..', 'imguploads', project.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    // Delete from database
    await Project.findByIdAndDelete(projectId);
    
    res.status(200).json({
      success: true,
      message: "Project deleted successfully"
    });
  } catch (error) {
    console.error("❌ deleteProject error:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};