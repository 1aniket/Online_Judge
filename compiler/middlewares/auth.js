export const verifyInternalRequest = (req, res, next) => {
  const apiKey = req.headers["x-api-key"];

 
  if (apiKey !== process.env.COMPILER_SECRET) {
    return res.status(403).json({
      success: false,
      message: "Forbidden",
    });
  }

  next();
};