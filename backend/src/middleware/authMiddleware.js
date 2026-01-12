const apiKeyAuth = (req, res, next) => {
  const apiKey = req.headers["x-api-key"];

  if (!apiKey || apiKey !== process.env.WEBSITE_API_KEY) {
    return res.status(401).json({ message: "Unauthorized request" });
  }

  next();
};

export default apiKeyAuth;
