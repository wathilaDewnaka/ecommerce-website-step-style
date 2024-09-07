const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
    },
    discount: {
        type: Number,
        required: true,
    },
    expiryDate: {
        type: Date,
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    usageCount: {
        type: Number,
        default: 0,
    },
    maxUsageCount: {
        type: Number,
        required: true,
    },
});

const couponModel = mongoose.models.coupon || mongoose.model("coupon", couponSchema)

module.exports =  { couponModel, couponSchema } 