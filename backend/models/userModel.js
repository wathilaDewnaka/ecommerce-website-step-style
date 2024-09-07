const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    cartData: { type: Object, default: {} },
    sizeData: { type: Object, default: {} },
    colorData: { type: Object, default: {} },
    couponsUsed: [
        {
            code: { type: String },
            amount: { type: Number},
            isActive: { type: Boolean, default: true },
            couponId: { type: String} // Store couponId as a string
        },
    ],
}, { minimize: false });

const userModel = mongoose.models.user || mongoose.model("user", userSchema);

module.exports = { userModel, userSchema };
