const express = require("express");
const { loginUser, registerUser01, registerUser02, forgetPasswordOTP, resetPassword, userDetails } = require("../controllers/userController")
const authMiddleware = require("../middleware/auth")

const userRouter = express.Router()

userRouter.post("/send-otp", registerUser01)
userRouter.post("/register", registerUser02)
userRouter.post("/forget-password", forgetPasswordOTP)
userRouter.post("/reset-password", resetPassword)
userRouter.post("/login", loginUser)
userRouter.get("/details", authMiddleware, userDetails)

module.exports = userRouter
