const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/auth.controller");
const authController = new AuthController();

router.post("/signup", authController.signup.bind(authController));
module.exports = router;
