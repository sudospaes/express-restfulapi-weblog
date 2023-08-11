const Blog = require("../models/blog");

const getPosts = async (req, res, next) => {
  try {
    const posts = await Blog.find({ status: "public" }).sort({
      createdAt: "desc",
    });

    if (!posts) {
      const error = new Error("There is no post");
      error.statusCode = 404;
      throw error;
    } else {
      res.status(200).json({ posts });
    }
  } catch (err) {
    next(err);
  }
};

const getPost = async (req, res, next) => {
  try {
    const post = await Blog.findOne({ _id: req.params.id, status: "public" });
    if (post) {
      res.status(200).json({ post });
    } else {
      const error = new Error("This post is not exists");
      error.statusCode = 404;
      throw error;
    }
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getPosts,
  getPost,
};
