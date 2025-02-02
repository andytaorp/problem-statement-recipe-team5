// routes/authRoutes.js
const express = require("express");
const { loginUser, signupUser } = require("../controllers/authController");

const router = express.Router();

// Register
router.post("/register", signupUser);

// Login
router.post("/login", loginUser);

module.exports = router;
