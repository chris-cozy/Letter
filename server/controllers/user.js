const User = require("../models/user");

async function getUsers(req, res) {
  try {
    const users = await User.find({}, { _id: 1, username: 1 });

    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  getUsers,
};
