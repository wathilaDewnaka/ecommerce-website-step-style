const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    userId: {type: String, required: true},
    items: {type: Array, required: true},
    amount: {type: Number, required: true},
    address: {type: Object, required: true},
    status: {type: String, default: "Product Loading"},
    date: {type: Date, default: Date.now()},
    payment: {type: Boolean, default: false},
    mode: {type: String, required: true},
    discount: {type: Number, required: true}

})

const orderModel = mongoose.models.order || mongoose.model("order", orderSchema)

module.exports =  { orderModel, orderSchema} ;