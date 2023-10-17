const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

async function registerUser(req, res) {
  try {
    const { username, password } = req.body;

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      password: passwordHash,
    });

    const savedUser = await newUser.save();

    // Sign in with JWT on register
    const token = jwt.sign(
      { id: savedUser._id, username },
      process.env.JWT_SECRET,
      {
        expiresIn: "2hr",
      }
    );

    res.status(201).json(token);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function loginUser(req, res) {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({ message: "No user with that username." });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials." });
    }
    const token = jwt.sign({ id: user._id, username }, process.env.JWT_SECRET, {
      expiresIn: "2hr",
    });
    delete user.password;

    res.status(200).json(token);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getProfile(req, res) {
  try {
    const username = req.user.username;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({ message: "No user with that username." });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  registerUser,
  getProfile,
  loginUser,
};
