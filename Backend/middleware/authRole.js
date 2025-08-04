function authorizeRoles(...allowedRoles) {
  const User = require("../models/user");

  return async (req, res, next) => {
    if (!req.user) {
      console.log("No user object found");
      return res.status(401).json({ error: "User not authenticated" });
    }
    const user = await User.findById(req.user.id).select("role");

    if (!allowedRoles.includes(user.role)) {
      console.log(
        `Access denied: User role '${user.role}' not in allowed roles:`,
        allowedRoles
      );
      return res
        .status(403)
        .json({ error: "Access denied: insufficient permissions" });
    }

    console.log("Role authorization passed");
    next();
  };
}

module.exports = authorizeRoles;
