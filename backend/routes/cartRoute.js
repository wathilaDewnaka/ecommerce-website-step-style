const express = require("express");
const { addToCart, removeCart, listCart, getDiscount } = require("../controllers/cartController");
const authMiddleWare = require("../middleware/auth");

const cartRouter = express.Router()

cartRouter.post("/add", authMiddleWare, addToCart)
cartRouter.post("/remove", authMiddleWare, removeCart)
cartRouter.post("/get", authMiddleWare, listCart)

module.exports = cartRouter