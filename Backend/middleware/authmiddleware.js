require("dotenv").config();
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.JWT_SECRET;

function authenticateToken(req, res, next) {
  const authHeader = req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    console.log("No token found");
    return res.status(401).json({ error: "No or malformed token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    console.log("Token received, attempting to verify...");
    console.log("SECRET_KEY value:", SECRET_KEY ? "Present" : "Missing");
    const decoded = jwt.verify(token, SECRET_KEY);
    console.log("Token decoded successfully:", decoded);
    console.log("User role:", decoded.role);
    console.log("User ID:", decoded.id);

    req.user = decoded;
    next(); // Pass control to next middleware or route handler
  } catch (err) {
    console.error("Token verification failed:", err.message);
    res.status(403).json({ error: "Invalid or expired token" });
  }
}

module.exports = authenticateToken;
