const { userModel } = require("../models/userModel");

const addToCart = async (req, res) => {
    try {
        let userData = await userModel.findOne({ _id: req.body.userId });
        
        // Get the cart data or initialize it if it doesn't exist
        let cartData = userData.cartData;
        let sizeData = userData.sizeData;
        let colorData = userData.colorData;

        sizeData[req.body.itemId] = req.body.size
        colorData[req.body.itemId] = req.body.color

        // Add or update the item quantity in the cart
        if (!cartData[req.body.itemId]) {
            cartData[req.body.itemId] = 1;
        } else {
            cartData[req.body.itemId] += 1;
        }
        // Update the user's cart data
        await userModel.findByIdAndUpdate(req.body.userId, { cartData, sizeData, colorData });
        res.json({ success: true, message: "Added to cart" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

const removeCart = async (req, res) => {
    try {
        let userData = await userModel.findOne({ _id: req.body.userId });
        
        let sizeData = userData.sizeData;
        let colorData = userData.colorData;
        
        // Get the cart data or initialize it if it doesn't exist
        let cartData = userData.cartData || {};

        // Add or update the item quantity in the cart
        if (cartData[req.body.itemId] > 0) {
            cartData[req.body.itemId] -= 1;
        }


        if (cartData[req.body.itemId] === 0){
            sizeData[req.body.itemId] = "M"
            colorData[req.body.itemId] = "Black"

        }

        // Update the user's cart data
        await userModel.findByIdAndUpdate(req.body.userId, { cartData, sizeData, colorData });
        res.json({ success: true, message: "Removed from cart" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

const listCart = async (req, res) => {
    try {
        let userData = await userModel.findOne({ _id: req.body.userId });
        

        // Get the cart data or initialize it if it doesn't exist
        let cartData = userData.cartData;
        let sizeData = userData.sizeData;
        let colorData = userData.colorData;

        res.json({ success: true, cartData, sizeData, colorData });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};


module.exports = { addToCart, removeCart, listCart };
