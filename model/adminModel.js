const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  profile: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    default: "",
  },

});

const adminModel = mongoose.model("adminlogin", adminSchema);
module.exports = adminModel;
