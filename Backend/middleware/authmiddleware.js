const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;

function authenticateToken(req, res, next) {
  const authHeader = req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    console.log("No token found");
    return res.status(401).json({ error: "No or malformed token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    console.log("chal gya");
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded; // Attach decoded token payload (user info) to request
    next(); // Pass control to next middleware or route handler
  } catch (err) {
    res.status(403).json({ error: "Invalid or expired token" });
  }
}

module.exports = authenticateToken;
