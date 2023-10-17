const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const token =
    req.headers.authorization && req.headers.authorization.split(" ")[1]; // Extract token from Authorization header

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Forbidden" });
    }
    req.user = user; // Attach the decoded user information to the request object
    next(); // Pass the request to the next middleware or route handler
  });
}

module.exports = {
  authenticateToken,
};
