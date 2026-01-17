const mongoose = require("mongoose");
const resumeSchema = new mongoose.Schema(
  {
    filename: String,
    filepath: String,
    filetype: String
  },
  { timestamps: true }
);


const AdminResume = mongoose.model("resume", resumeSchema);
module.exports = AdminResume;

