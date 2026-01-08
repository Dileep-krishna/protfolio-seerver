const adminModel = require("../model/adminModel");

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
