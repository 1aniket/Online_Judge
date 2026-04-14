const adminMiddleware = (req, res, next) => {
  try {
    // req.user should already be set by auth middleware
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No user found",
      });
    }

    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied: Admins only",
      });
    }

    next(); // user is admin → proceed
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error in admin middleware",
    });
  }
};

export default adminMiddleware;