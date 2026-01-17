const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    fileType: {
      type: String, // image / pdf
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Certificate= mongoose.model("Certificate", certificateSchema);
module.exports=Certificate
