const express = require('express')
const couponRouter = express.Router();

const { addCoupon, redeemCoupon, removeCoupon, listCoupons, removeCouponUser, getDiscount, removeCouponWithoutInactive } = require("../controllers/couponController");
const authMiddleWare = require('../middleware/auth');

couponRouter.post("/add-coupon", authMiddleWare, addCoupon)
couponRouter.post("/remove-coupon", authMiddleWare, removeCoupon)
couponRouter.post("/remove-coupon-user", authMiddleWare, removeCouponUser)
couponRouter.post("/redeem-coupon", authMiddleWare,redeemCoupon)
couponRouter.get("/list-coupon", listCoupons)
couponRouter.post('/get-discount', authMiddleWare, getDiscount)
couponRouter.post('/deactive-coupon', authMiddleWare, removeCouponWithoutInactive)


module.exports = couponRouter