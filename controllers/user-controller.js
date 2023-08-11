const User = require("../models/user");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const userSignUp = async (req, res, next) => {
  try {
    await User.userValidation(req.body);
    const { email } = req.body;
    const isUserExists = await User.findOne({ email });
    if (isUserExists) {
      const err = new Error("This email is exists");
      err.statusCode = 422;
      throw err;
    } else {
      await User.create({ ...req.body });
      res.status(201).json({ message: "User creation successful" });
    }
  } catch (err) {
    next(err);
  }
};

const userLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      const err = new Error("User or password is not exists");
      err.statusCode = 404;
      throw err;
    }
    const isEqual = await bcrypt.compare(password, user.password);
    if (isEqual) {
      const token = jwt.sign(
        {
          user: {
            id: user._id.toString(),
            fullname: user.fullname,
            email: user.email,
          },
        },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );
      res.status(200).json({ token });
    } else {
      const err = new Error("User or password is not exists");
      err.statusCode = 422;
      throw err;
    }
  } catch (err) {
    next(err);
  }
};

const forgetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      const err = new Error(
        "If your email is exists i sent reset link to this email"
      );
      err.statusCode = 404;
      throw err;
    } else {
      const token = jwt.sign(
        { user: { id: user._id.toString() } },
        process.env.JWT_SECRET,
        { expiresIn: "10m" }
      );
      req.session.cookie.originalMaxAge = 24 * 60 * 60 * 1000;
      const resetLink = `http://localhost:3000/reset-password/${token}`;
      res.status(201).json({ resetLink });
    }
  } catch (err) {
    next(err);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const verifyToken = jwt.verify(req.params.token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: verifyToken.user.id });
    if (verifyToken && user) {
      const { password, confirmPassword } = req.body;
      if (password === confirmPassword) {
        user.password = password;
        user.save();
        res.status(201).json({ message: "Resetting password successful" });
      } else {
        const err = new Error("New password is not match");
        err.statusCode = 422;
        throw err;
      }
    } else {
      const err = new Error("Token/User is not vaild");
      err.statusCode = 404;
      throw err;
    }
  } catch (err) {
    next(err);
  }
};

module.exports = {
  userSignUp,
  userLogin,
  forgetPassword,
  resetPassword,
};
