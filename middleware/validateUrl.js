const validateUrl = (req, res, next) => {
  const { url } = req.body;
  if (!url) {
    const error = new Error('URL is required');
    error.status = 400;
    return next(error);
  }
  if (!/^https?:\/\//.test(url)) {
    const error = new Error('URL must start with http:// or https://');
    error.status = 400;
    return next(error);
  }
  next();
};

module.exports = validateUrl;

