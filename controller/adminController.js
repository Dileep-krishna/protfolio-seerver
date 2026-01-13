const adminModel = require("../model/adminModel");
const Skills = require("../model/adminSkillModel");

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
    const grouped = { frontend: [], backend: [], tools: [] };
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


