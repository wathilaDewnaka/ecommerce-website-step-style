const { adminModel } = require('../models/adminModel');
const { couponModel } = require('../models/couponModel');
const { userModel } = require('../models/userModel');

// Add a new coupon
const addCoupon = async(req, res) => {
    try {
        const admin = await adminModel.findById(req.body.userId)
        if(!admin){
            return res.json({success: false, message: "Unauthorized"})
        }

        const { code, discount, maxUsageCount, expiryDate } = req.body;

        const exist = await couponModel.findOne({code})
        if (exist){
            return res.json({success: false})
        }

        const newCoupon = new couponModel({ code, discount, expiryDate, maxUsageCount });
        await newCoupon.save();

        return res.json({success: true});
    } catch (err) {
        return res.json({ success: false });
    }
}


const removeCoupon = async (req, res) => {
    try {
        const admin = await adminModel.findById(req.body.userId)
        if(!admin){
            return res.json({success: false, message: "Unauthorized"})
        }

        const couponId = req.body.id;

        // 1. Delete the coupon from the couponModel
        await couponModel.findByIdAndDelete(couponId);

        // 2. Remove the coupon from the couponsUsed array of all users
        await userModel.updateMany(
            { "couponsUsed.couponId": couponId },
            { $pull: { couponsUsed: { couponId } } }
        );

        return res.json({ success: true });
    } catch (err) {
        console.error('Error removing coupon:', err);
        return res.json({ success: false });
    }
};



const redeemCoupon = async (req, res) => {
    try {
        const { userId, couponCode } = req.body;

        // Find the coupon
        const coupon = await couponModel.findOne({ code: couponCode, isActive: true });
        if (!coupon || new Date() > coupon.expiryDate) {
            return res.json({ success: false, message: 'Invalid or expired coupon.' });
        }

        if (coupon.usageCount >= coupon.maxUsageCount) {
            return res.json({ success: false, message: 'Coupon usage limit reached.' });
        }

        // Find the user and check if they have already used the coupon
        const user = await userModel.findById(userId);
        if (!user) {
            return res.json({ success: false, message: 'User not found.' });
        }

        const alreadyClaimed = user.couponsUsed.some(c => c.code === couponCode);
        if (alreadyClaimed) {
            return res.json({ success: false, message: 'Coupon already claimed by this user.' });
        }

        // Increment usage count
        coupon.usageCount += 1;
        await coupon.save();

        // Save coupon details to user's profile
        user.couponsUsed.push({
            couponId: coupon._id.toString(),
            code: coupon.code,
            amount: coupon.discount,
            isActive: true,
        });
        await user.save();

        return res.json({ success: true, discount: coupon.discount, message: 'Coupon applied successfully.' });
    } catch (err) {
        console.log(err);
        return res.json({ success: false, message: "Invalid or expired coupon" });
    }
};


const getDiscount = async (req, res) => {
    try {
        const { userId } = req.body;

        // Find the user
        const user = await userModel.findById(userId);

        if (!user) {
            return res.json({ success: false, message: 'User not found.' });
        }


        // Filter active coupons
        const activeCoupons = user.couponsUsed.filter(coupon => coupon.isActive);

        // Calculate the total discount for active coupons
        const totalDiscount = activeCoupons.reduce((total, coupon) => {
            return total + coupon.amount;
        }, 0);

        res.json({ success: true, discount: totalDiscount });
    } catch (err) {
        res.json({ success: false, message: err.message });
        console.log(err)
    }
};

const removeCouponWithoutInactive = async (req, res) => {
    const { userId, discount } = req.body;

    try {
        // Find the user
        const user = await userModel.findById(userId);

        if (!user) {
            return res.json({ success: false, message: 'User not found.' });
        }

        // Find the coupon with the specific discount and isActive true
        const coupon = await couponModel.findOne({ discount, isActive: true });

        if (!coupon) {
            return res.json({ success: false, message: 'Active coupon with specified discount not found.' });
        }

        // Remove the coupon with the specific discount and isActive true from the user's couponsUsed array
        await userModel.updateOne(
            { _id: userId },
            {
                $pull: {
                    couponsUsed: { amount: discount, isActive: true }
                }
            }
        );

        // Decrement the usage count of the coupon
        coupon.usageCount -= 1; 
        await coupon.save();

        return res.json({ success: true });
    } catch (error) {
        console.error("Error removing coupon from user's couponsUsed:", error);
        return res.json({ success: false, message: "Internal server error." });
    }
};

const removeCouponUser = async (req, res) => {
    try {
        const { userId } = req.body;

        // Find the user
        const user = await userModel.findById(userId);
        if (!user) {
            return res.json({ success: false, message: 'User not found.' });
        }

        // Deactivate all coupons used by the user
        user.couponsUsed.forEach(coupon => coupon.isActive = false);
        await user.save();

        return res.json({ success: true, message: 'All coupons deactivated successfully.' });
    } catch (err) {
        console.log(err);
        return res.json({ success: false, message: err.message });
    }
};




const listCoupons = async(req, res) => {
    try {
        const coupons = await couponModel.find({});
        return res.json({success: true, data: coupons});
    } catch (err) {
        return res.json({ success: false });
    }
}

module.exports = {addCoupon, removeCoupon, redeemCoupon, listCoupons, getDiscount, removeCouponUser, removeCouponWithoutInactive};