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
    const token = jwt.sign(
      { id: savedUser._id, username },
      process.env.JWT_SECRET
    );

    res
      .cookie("token", token, { sameSite: "none", secure: true })
      .status(201)
      .json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getProfile(req, res) {
  try {
    const token = req.cookies?.token;

    if (!token) {
      res.status(401).json({ message: "Unauthorized, no token presented" });
    }

    const verifiedUser = jwt.verify(token, process.env.JWT_SECRET);

    res.status(200).json(verifiedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  registerUser,
  getProfile,
};
