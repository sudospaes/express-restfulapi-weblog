const { Router } = require("express");

const userController = require("../controllers/user-controller");
const postController = require("../controllers/post-controller");
const blogController = require("../controllers/blogs-controller");
const { authenticated } = require("../middlewares/auth");
const router = Router();

//? GET
router.get("/", blogController.getPosts);

router.get("/post/:id", blogController.getPost);

router.get("/user-posts", authenticated, postController.userPosts);

//? POST
router.post("/signup", userController.userSignUp);

router.post("/login", userController.userLogin);

router.post("/forget-password", userController.forgetPassword);

router.post("/reset-password/:token", userController.resetPassword);

router.post("/add-post", authenticated, postController.addPost);

//? PUT
router.put("/edit-post/:id", authenticated, postController.editPost);

//? DELETE
router.delete("/remove-post/:id", authenticated, postController.removePost);

module.exports = router;
