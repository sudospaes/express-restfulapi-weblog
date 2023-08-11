const setHeaders = (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", process.env.ORIGIN);
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("X-Powered-By", "Nothing");
  next();
};

module.exports = {
  setHeaders,
};
