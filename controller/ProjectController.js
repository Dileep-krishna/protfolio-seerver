const Project = require("../model/adminProjectModel");


exports.addProject = async (req, res) => {
  try {
    const { title, description, github, live ,id} = req.body;

    if (!req.file) {
        console.log(req.body);
console.log(req.file);

      return res.status(400).json("Image or video is required");
    }

    const imagePath = req.file.filename; // or req.file.path

    const newProject = await Project.create({
      title,
      image: imagePath,
      description,
      github,
      live,
      id,
    });

    res.status(201).json(newProject);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

// get all project
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ _id: -1 });
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json(error);
  }
};
// get single project
exports.getSingleProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json("Project not found");
    }
    res.status(200).json(project);
  } catch (error) {
    res.status(500).json(error);
  }
};
//updated projecrt 
exports.updateProject = async (req, res) => {
  try {
    const updatedData = { ...req.body };

    // If multer file upload:
    if (req.file) {
      updatedData.image = req.file.filename;
    }

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,     // Make sure this ID is coming correctly
      updatedData,
      { new: true }      // Return the updated document
    );

    if (!updatedProject) {
      return res.status(404).json("Project not found");
    }

    res.status(200).json(updatedProject);
  } catch (error) {
    res.status(500).json(error.message);
  }
};


// delete project
exports.deleteProject = async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.status(200).json("Project deleted successfully");
  } catch (error) {
    res.status(500).json(error);
  }
};
