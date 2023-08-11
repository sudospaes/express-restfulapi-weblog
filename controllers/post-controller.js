const fs = require("fs");

const Blog = require("../models/blog");

const shortId = require("shortid");
const sharp = require("sharp");

const appRoot = require("app-root-path");

const userPosts = async (req, res, next) => {
  try {
    const blogs = await Blog.find({ user: req.user.id });
    if (blogs) {
      res.status(200).json({ blogs });
    } else {
      const err = new Error("There is no blog");
      err.statusCode = 404;
      throw err;
    }
  } catch (err) {
    next(err);
  }
};

const addPost = async (req, res, next) => {
  let thumbnail = req.files ? req.files.thumbnail : {};
  let fileName = `${shortId.generate()}_${thumbnail.name}`;
  let path = `${appRoot}/public/uploads/thumbnails/${fileName}`;
  try {
    req.body = { ...req.body, thumbnail };
    await Blog.postValidation(req.body);
    await sharp(thumbnail.data).jpeg({ quality: 60 }).toFile(path);
    await Blog.create({ ...req.body, user: req.user.id, thumbnail: fileName });
    res
      .status(201)
      .json({ message: `Post creation successful by ${req.user.email}` });
  } catch (err) {
    next(err);
  }
};

const removePost = async (req, res, next) => {
  try {
    const post = await Blog.findOne({ _id: req.params.id });
    if (!post) {
      const err = new Error("Post is not exists");
      err.statusCode = 404;
      throw err;
    } else {
      if (post.user.toString() === req.user.id) {
        await Blog.findByIdAndRemove(req.params.id);
        res.status(201).json({ message: `Post removed by ${req.user.email}` });
      } else {
        const err = new Error("Invaild action");
        err.statusCode = 401;
        throw err;
      }
    }
  } catch (err) {
    next(err);
  }
};

const editPost = async (req, res, next) => {
  let thumbnail = req.files ? req.files.thumbnail : {};
  let fileName = `${shortId.generate()}_${thumbnail.name}`;
  let path = `${appRoot}/public/uploads/thumbnails/${fileName}`;
  try {
    const post = await Blog.findOne({ _id: req.params.id });
    if (post) {
      if (post.user.toString() === req.user.id) {
        if (thumbnail.name) {
          req.body = { ...req.body, thumbnail };
          await Blog.postValidation(req.body);
        } else {
          req.body = {
            ...req.body,
            thumbnail: {
              name: "nothing",
              size: 0,
              mimetype: "image/jpeg",
            },
          };
          await Blog.postValidation(req.body);
        }
        const { title, status, body, thumbnail } = req.body;
        post.title = title;
        post.status = status;
        post.body = body;
        if (thumbnail.name != "nothing") {
          await sharp(thumbnail.data).jpeg({ quality: 60 }).toFile(path);
          oldName = post.thumbnail;
          post.thumbnail = fileName;
          fs.unlink(
            `${appRoot}/public/uploads/thumbnails/${oldName}`,
            (err) => {
              if (err) {
                throw err;
              }
            }
          );
        }
        post.save();
        res.status(201).json({ message: `Post edited by ${req.user.email}` });
      } else {
        const err = new Error("Invaild action");
        err.statusCode = 401;
        throw err;
      }
    } else {
      const err = new Error("Post is not exists");
      err.statusCode = 404;
      throw err;
    }
  } catch (err) {
    next(err);
  }
};

module.exports = {
  userPosts,
  addPost,
  removePost,
  editPost,
};
