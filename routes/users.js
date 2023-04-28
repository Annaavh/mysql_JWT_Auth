const express = require("express");
const registerController = require("../controllers/registerController");
const { login, refreshToken } = require("../controllers/loginController");
const getAllUsers = require("../controllers/usersController");
const router = express.Router();
const authenticateToken = require("../middlewares/authenticateToken");

router.post("/register", registerController);
router.post("/login", login);
router.post("/refresh_token", refreshToken);
router.get("/getAllUsers",authenticateToken, getAllUsers);

module.exports = router;
