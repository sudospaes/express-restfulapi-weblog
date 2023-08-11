const jwt = require("jsonwebtoken");

const authenticated = (req, res, next) => {
  const authHeader = req.get("Authorization");
  try {
    if (!authHeader) {
      const err = new Error("Access deined");
      err.statusCode = 401;
      throw err;
    }
    const token = authHeader.split(" ")[1];
    const verifyToken = jwt.verify(token, process.env.JWT_SECRET);

    if (!verifyToken) {
      const err = new Error("Access deined");
      err.statusCode = 401;
      throw err;
    } else {
      req.user = {
        id: verifyToken.user.id,
        fullname: verifyToken.user.fullname,
        email: verifyToken.user.email,
      };
      next();
    }
  } catch (err) {
    next(err);
  }
};

module.exports = {
  authenticated,
};
