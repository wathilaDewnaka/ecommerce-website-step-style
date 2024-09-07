const Stripe = require("stripe");
const { orderModel } = require("../models/orderModel");
const { userModel } = require("../models/userModel");
const sgMail = require('@sendgrid/mail');
const { adminModel } = require("../models/adminModel");

const frontend_url = "https://ecommerce-website-step-style.vercel.app"
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const EXCHANGE_RATE = 300;

const placeOrder = async (req, res) => {
    try {
        const discount = req.body.discount;
        const totalAmount = req.body.amount + 350 - req.body.discount;
        const paymentMethod = req.body.paymentMethod

        // Create a new order
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: totalAmount, 
            address: req.body.address,
            discount: discount,
            mode: paymentMethod
        });

        // Save the order to the database
        await newOrder.save();

        // Clear the user's cart
        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });


        if (paymentMethod !== "COD"){
            // Create a Stripe session for payment with the total amount
            const session = await stripe.checkout.sessions.create({
                line_items: [
                    {
                        price_data: {
                            currency: "usd",
                            product_data: {
                                name: "Total Amount",
                            },
                            unit_amount: Math.round((totalAmount / EXCHANGE_RATE) * 100), // Convert to smallest currency unit (cents)
                        },
                        quantity: 1,
                    }
                ],
                mode: "payment",
                success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
                cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
            });

            // Send the session URL to the frontend
            return res.json({ success: true, session_url: session.url });
        }

        return res.json({ success: true, session_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}` });

    } catch (error) {
        console.error("Error placing order:", error);
        res.json({ success: false, message: "An error occurred while placing the order" });
    }
};


const verifyOrder = async (req, res) => {
    const { orderId, success } = req.body;

    const order = await orderModel.findById(orderId);
    const user = await userModel.findById(order.userId);

    const user_name = user.name;
    const user_email = user.email;
    const email = order.address.email;
    let message = {}


    try {
        if (success === "true") {
            // Update order to paid
            await orderModel.findByIdAndUpdate(orderId, { payment: true });

            sgMail.setApiKey(process.env.MAIL_API);

            if (email === user_email){
                message = {
                    to: user_email,
                    from: 'noreply.stepstyle@gmail.com',
                    subject: `StepStyle Order Successful #${orderId}`,
                    html: `
                        <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
                            <div style="font-size: 18px; margin-bottom: 20px;">
                                <p>Hello ${user_name},</p>
                                <p>Your order has been placed successfully!</p>
                                <p>You can track the status of your order by My Orders section in your account</p>
                            </div>
    
                            <div style="font-size: 14px; color: #888;">
                                <p>Thank you for choosing StepStyle!</p>
                                <p>- The StepStyle Team</p>
                            </div>
                        </div>
                    `,
                };

            } else{
                message = {
                    to: [user_email, email],
                    from: 'noreply.stepstyle@gmail.com',
                    subject: `StepStyle Order Successful #${orderId}`,
                    html: `
                        <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
                            <div style="font-size: 18px; margin-bottom: 20px;">
                                <p>Hello ${user_name},</p>
                                <p>Your order has been placed successfully!</p>
                                <p>You can track the status of your order by My Orders section in your account</p>
                            </div>

                            <div style="font-size: 14px; color: #888;">
                                <p>Thank you for choosing StepStyle!</p>
                                <p>- The StepStyle Team</p>
                            </div>
                        </div>
                    `,
                };

            }

            await sgMail.send(message);

            return res.json({
                success: true,
                message: "Paid",
            });
        } else {
            sgMail.setApiKey(process.env.MAIL_API);

            if (email === user_email){
                message = {
                    to: user_email,
                    from: 'noreply.stepstyle@gmail.com',
                    subject: `StepStyle Order Failed #${orderId}`,
                    html: `
                        <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
                            <div style="font-size: 18px; margin-bottom: 20px;">
                                <p>Hello ${user_name},</p>
                                <p>Your order has been failed due to an error!</p>
                                <p>Please try again!</p>
                            </div>
    
                            <div style="font-size: 14px; color: #888;">
                                <p>Thank you for choosing StepStyle!</p>
                                <p>- The StepStyle Team</p>
                            </div>
                        </div>
                    `,
                };

            } else{
                message = {
                    to: [user_email, email],
                    from: 'noreply.stepstyle@gmail.com',
                    subject: `StepStyle Order Successful #${orderId}`,
                    html: `
                        <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
                            <div style="font-size: 18px; margin-bottom: 20px;">
                                <p>Hello ${user_name},</p>
                                <p>Your order has been failed due to an error!</p>
                                <p>Please try again!</p>
                            </div>

                            <div style="font-size: 14px; color: #888;">
                                <p>Thank you for choosing StepStyle!</p>
                                <p>- The StepStyle Team</p>
                            </div>
                        </div>
                    `,
                };

            }

            await sgMail.send(message);


            // Delete order if payment failed
            await orderModel.findByIdAndDelete(orderId);

            return res.json({
                success: false,
                message: "Not Paid",
            });
        }
    } catch (error) {
        console.error("Error verifying order:", error);

        return res.status(500).json({
            success: false,
            message: "Error verifying order",
        });
    }
};

const userOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({ userId: req.body.userId });
        res.json({
            success: true,
            data: orders,
        });
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: "Error fetching orders",
        });
    }
};

const listOrders = async (req, res) => {
    try {
        const user = await adminModel.findById(req.body.userId)
        if(!user){
            return res.json({success: false, message: "Unauthorized"})
        }
        
        const orders = await orderModel.find({});
        res.json({ success: true, data: orders });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error fetching orders" });
    }
};

const statusHandler = async (req, res) => {
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId, {status: req.body.status})
        return res.json({success: true})
    } catch (error) {
        return res.json({success: false})
    }
}

module.exports = { placeOrder, verifyOrder, userOrders, listOrders, statusHandler };
