const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const { userValidationSchema } = require("./secure/validation");

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 4,
    maxlength: 255,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.statics.userValidation = function (body) {
  return userValidationSchema.validate(body, { abortEarly: false });
};

userSchema.pre("save", function (next) {
  let user = this;
  if (!user.isModified("password")) {
    return next();
  }
  bcrypt.hash(user.password, 12, (err, hash) => {
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  });
});

module.exports = mongoose.model("User", userSchema);
