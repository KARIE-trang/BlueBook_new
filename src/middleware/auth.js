const requireLogin = (req, res, next) => {
  if (!req.session.users) {
    return res.redirect("/login?error=LOGIN_REQUIRED");
  }
  next();
};

const requireAdmin = (req, res, next) => {
  if (!req.session.users) {
    return res.redirect("/login?error=LOGIN_REQUIRED");
  }
  if (req.session.users.role !== "ADMIN") {
    return res.redirect("/home?error=NO_PERMISSION");
  }
  next();
};

module.exports = {
  requireLogin,
  requireAdmin,
};
