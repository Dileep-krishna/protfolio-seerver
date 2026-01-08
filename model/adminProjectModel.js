const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true, 
    },
    description: {
      type: String,
      required: true,
    },
    github: {
      type: String,
      default: "#",
    },
    live: {
      type: String,
      default: "#",
    },
        id: {
      type: String,
      default: "#",
    },
  }
);

const Project= mongoose.model("project", projectSchema);
module.exports=Project
