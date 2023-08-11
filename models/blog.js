const mongoose = require("mongoose");

const { postValidationSchema } = require("./secure/validation");

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 50,
  },
  body: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "public",
    enum: ["public", "private"],
  },
  thumbnail: {
    type: String,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

blogSchema.statics.postValidation = function (body) {
  return postValidationSchema.validate(body, { abortEarly: false });
};

module.exports = mongoose.model("Blog", blogSchema);
