const express = require("express");
const { loginUser, registerUser01, registerUser02, forgetPasswordOTP, resetPassword } = require("../controllers/userController")

const userRouter = express.Router()

userRouter.post("/send-otp", registerUser01)
userRouter.post("/register", registerUser02)
userRouter.post("/forget-password", forgetPasswordOTP)
userRouter.post("/reset-password", resetPassword)
userRouter.post("/login", loginUser)

module.exports = userRouter