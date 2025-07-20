function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      console.log("No user object found");
      return res.status(401).json({ error: "User not authenticated" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      console.log(
        `Access denied: User role '${req.user.role}' not in allowed roles:`,
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
