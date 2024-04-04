const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Create New User
exports.createNewUser = async (req, res) => {
  let { name, email, password } = req.body;

  try {
    const isExist = await User.findOne({ email: email });
    if (isExist) {
      res.status(200).json({
        message: "User already exist!",
      });
    } else {
      let hashedPassword = await bcrypt.hash(password, 11);
      let user = new User({
        name,
        email,
        password: hashedPassword,
      });
      await user.save();
      res.status(201).json(user);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

// Login Controller
exports.loginUser = async (req, res) => {
  let { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(200).json({ message: "User not found" });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(200).json({ message: "Invalid password" });
    }
    const token = jwt.sign(
      {
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        userId: user._id,
      },
      process.env.JWT_SECRET
    );
    res.json({ token });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
