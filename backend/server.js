const dotenv = require("dotenv/config");
const express = require("express");
const cors = require("cors");
const productRouter = require("./routes/productRoute");
const DBConnect = require("./config/db");
const userRouter = require("./routes/userRoute");
const cartRouter = require("./routes/cartRoute");
const orderRouter = require("./routes/orderRoute");
const adminRoute = require("./routes/adminRoute");
const couponRouter = require("./routes/couponRouter");
const cron = require('node-cron');
const { couponModel } = require('./models/couponModel');
const { userModel } = require("./models/userModel");

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(cors());

DBConnect();

// Routes
app.use("/api/product", productRouter);
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/admin", adminRoute);
app.use("/api/coupons", couponRouter);

// Function to remove expired coupons
const removeExpiredCoupons = async () => {
    try {
        const now = new Date();

        // Remove expired coupons from the coupon model
        await couponModel.deleteMany({ expiryDate: { $lt: now } });

        // Remove expired coupons from users' couponsUsed array
        await userModel.updateMany(
            {},
            { $pull: { couponsUsed: { expiryDate: { $lt: now } } } }
        );

        console.log('Expired coupons removed successfully.');
    } catch (error) {
        console.error('Error removing expired coupons:', error);
    }
};


// Schedule the function to run daily at midnight
cron.schedule('0 0 * * *', async () => {
    console.log('Running cron job to remove expired coupons.');
    await removeExpiredCoupons();
});


// Create a GET API to manually remove expired coupons
app.get('/api/remove-expired-coupons', async (req, res) => {
    try {
        await removeExpiredCoupons();
        res.status(200).json({ message: 'Expired coupons removed successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error removing expired coupons.', error: error.message });
    }
});


app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
