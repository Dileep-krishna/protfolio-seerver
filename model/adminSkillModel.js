// models/Skill.js
const mongoose = require("mongoose");

const SkillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  level: { type: Number, required: true, min: 0, max: 100 },
  category: { type: String, enum: ["frontend", "backend", "tools","programmingLanguage"], required: true },
});

const Skills= mongoose.model("Skill", SkillSchema);
module.exports=Skills
