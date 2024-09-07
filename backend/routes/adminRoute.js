const express = require("express");
const { loginAdmin, registerAdmin, registerAdmin2, adminOtp, sendMessages, validateAdmin, resetReg } = require("../controllers/adminController")
const authMiddleWare = require("../middleware/auth");

const userRouter = express.Router()

userRouter.post("/login", loginAdmin)
userRouter.post("/send-otp", registerAdmin)
userRouter.post("/register", registerAdmin2)
userRouter.get("/otps", adminOtp)
userRouter.post("/send-message", authMiddleWare,sendMessages)
userRouter.get("/validate", authMiddleWare, validateAdmin)
userRouter.post("/reset", resetReg)

module.exports = userRouter
