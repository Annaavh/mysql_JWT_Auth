const express = require("express");
const {
  getAllPosts,
  createPost,
  updatePost,
  deletePost,
  getPost,
  getMyPosts,
} = require("../controllers/postControllers");
const permission = require("../middlewares/permissions");
const router = express.Router();

router.route("/").get(getAllPosts).post(createPost);
router.route("/myPosts").get(getMyPosts);
router
  .route("/:id")
  .get(getPost)
  .put(permission, updatePost)
  .delete(permission, deletePost);

module.exports = router;
