const User = require("../models/user");
const jwt = require("jsonwebtoken");

async function registerUser(req, res) {
  console.log(req.body);
  try {
    const { username, password } = req.body;

    const newUser = new User({
      username,
      password,
    });

    const savedUser = await newUser.save();

    // Sign in with JWT on register
    const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET);

    res.cookie("token", token).status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  registerUser,
};
