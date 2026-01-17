const adminModel = require("../model/adminModel");
const AdminResume = require("../model/AdminResumeModel");
const fs = require("fs");
const Skills = require("../model/adminSkillModel");
const path = require("path");
const Certificate = require("../model/adminCertificateModel");

exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await adminModel.findOne({ email });

    if (!admin) {
        console.log("Admin found:", admin);

      return res.status(401).json("Admin not found");
    }

    if (admin.password !== password) {
      return res.status(401).json("Invalid credentials");
    }

    res.status(200).json({
      message: "Login successful",
      admin,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};
// Get all skills grouped by category
exports.getAllSkills = async (req, res) => {
  try {
    const skills = await Skills.find();
    const grouped = { frontend: [], backend: [], tools: [],programmingLanguage:[] };
    skills.forEach(skill => {
      grouped[skill.category].push(skill);
    });
    res.status(200).json(grouped);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a new skill
// adminController.js (your addSkill function)
exports.addSkill = async (req, res) => {
  const { name, level, category } = req.body;
  if (!name || level === undefined || !category) {
    return res.status(400).json({ message: 'Name, level and category are required.' });
  }

  try {
    const newSkill = new Skills({
      name: name.trim(),
      level,
      category,
    });
    const savedSkill = await newSkill.save();
    console.log("💾 Skill saved:", savedSkill);  // <-- backend log
    res.status(201).json(savedSkill);
  } catch (error) {
    console.error("💥 Error saving skill:", error);  // <-- backend error log
    res.status(400).json({ message: error.message });
  }
};
// DELETE /skills/:id
exports.deleteSkill = async (req, res) => {
  const skillId = req.params.id;

  try {
    const deletedSkill = await Skills.findByIdAndDelete(skillId);

    if (!deletedSkill) {
      return res.status(404).json({ message: 'Skill not found' });
    }

    return res.status(200).json({ message: 'Skill deleted successfully' });
  } catch (error) {
    console.error('Error deleting skill:', error);
    return res.status(500).json({ message: 'Server error while deleting skill' });
  }
};



// UPDATE ADMIN PROFILE (with image)
exports.updateAdminProfile = async (req, res) => {
  try {
    const admin = await adminModel.findById(req.params.id);

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    if (req.body.email) admin.email = req.body.email;
    if (req.body.description) admin.description = req.body.description;

    if (req.file) {
      admin.profile = req.file.path.replace(/\\/g, "/");
    }

    await admin.save();

    const adminData = admin.toObject();
    delete adminData.password;

    res.status(200).json({
      message: "Admin profile updated successfully",
      admin: adminData,
    });
  } catch (error) {
    res.status(500).json({
      message: "Profile update failed",
      error: error.message,
    });
  }
};
// 🔹 GET ADMIN PROFILE
exports.getAdminProfile = async (req, res) => {
  try {
    const { id } = req.params;

    // Use adminModel, NOT Admin
    const admin = await adminModel.findById(id).select("-password");

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json(admin);
  } catch (error) {
    console.error("Get Admin Profile Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
//resume controller

exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const resume = new AdminResume({
      filename: req.file.filename,
      filepath: `/Imguploads/${req.file.filename}`
    });

    await resume.save();

    res.status(201).json({
      message: "Resume uploaded successfully",
      resume
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * 📄 Get Latest Resume
 */
exports.getResume = async (req, res) => {
  try {
    const resume = await AdminResume.findOne().sort({ createdAt: -1 });

    if (!resume) {
      return res.status(404).json({ message: "No resume found" });
    }

    res.status(200).json(resume);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * 🔄 Update Resume (Replace Old File)
 */
exports.updateResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const resume = await AdminResume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    // delete old file
    const oldPath = path.join(__dirname, "..", resume.filepath);
    if (fs.existsSync(oldPath)) {
      fs.unlinkSync(oldPath);
    }

    resume.filename = req.file.filename;
    resume.filepath = `/Imguploads/${req.file.filename}`;
    resume.uploadedAt = Date.now();

    await resume.save();

    res.status(200).json({
      message: "Resume updated successfully",
      resume
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * ❌ Delete Resume
 */
exports.deleteResume = async (req, res) => {
  try {
    const resume = await AdminResume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    const filePath = path.join(__dirname, "..", resume.filepath);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await AdminResume.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Resume deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//admin certificate
// ✅ ADD CERTIFICATE
exports.addCertificate = async (req, res) => {
  try {
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "File is required" });
    }

    const certificate = new Certificate({
      title,
      fileUrl: req.file.path.replace(/\\/g, "/"),
      fileType: req.file.mimetype,
    });

    await certificate.save();

    res.status(201).json({
      success: true,
      message: "Certificate uploaded successfully",
      data: certificate,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ GET ALL CERTIFICATES
exports.getAllCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find().sort({ createdAt: -1 });
    res.status(200).json(certificates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ DELETE CERTIFICATE
exports.deleteCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id);

    if (!certificate) {
      return res.status(404).json({ message: "Certificate not found" });
    }

    await certificate.deleteOne();

    res.status(200).json({
      success: true,
      message: "Certificate deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

