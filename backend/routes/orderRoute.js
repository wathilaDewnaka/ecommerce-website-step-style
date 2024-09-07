const express = require("express");
const { placeOrder, verifyOrder, userOrders, listOrders,statusHandler } = require("../controllers/orderController");
const authMiddleWare = require("../middleware/auth");

const orderRouter = express.Router();

orderRouter.post("/place", authMiddleWare, placeOrder);
orderRouter.post("/verify", verifyOrder);
orderRouter.post("/userorders", authMiddleWare, userOrders)
orderRouter.get("/list", authMiddleWare, listOrders)
orderRouter.post("/set-status", statusHandler)

module.exports = orderRouter;
