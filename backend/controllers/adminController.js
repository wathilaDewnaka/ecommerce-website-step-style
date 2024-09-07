const { adminModel } = require("../models/adminModel");
const crypto = require('crypto'); // For generating OTPs
const sgMail = require('@sendgrid/mail')
const validator = require('validator')
const jwt = require("jsonwebtoken");
const { userModel } = require("../models/userModel");

const otps = {}

const loginAdmin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await adminModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "User doesn't exist" });
        }


        // Check if the entered password matches the stored password
        if (password !== user.password) {
            return res.json({ success: false, message: "Invalid credentials" });
        }

        const token =  jwt.sign({ _id :  user._id }, process.env.JWT_SECRET)

        return res.json({ success: true, message: "Logged in successfully", token });
    } catch (error) {
        console.error(error); // Logging the error for debugging
        return res.json({ success: false, message: "An error occurred" });
    }
};

const registerAdmin = async (req, res) => {
    const { email } = req.body;
    const otp = crypto.randomInt(100000, 999999).toString();

    try {
        const exist = await adminModel.findOne({ email });
        if (exist) {
            return res.json({ success: false, message: "Admin already exists" });
        }

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Wrong email address" });
        }

        if (email in otps){
            return res.json({ success: false, message: "OTP Already Sent to Management" });
        }

        otps[email] = otp;
        sgMail.setApiKey(process.env.MAIL_API)

        const message = {
            to: "wathiladk@gmail.com",
            from: 'noreply.stepstyle@gmail.com',
            subject: `StepStyle Register OTP Code - ${email}`,
            html: `
                <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
                    <div style="font-size: 18px; margin-bottom: 20px;">
                        <p>Hello Owner,</p>
                        <p>The OTP code for registering account ${email} is, </p>
                        <h2 style="color: #1a73e8;">${otp}</h2>
                    </div>

                    <div style="font-size: 14px; color: #888;">
                        <p>Thank you for choosing StepStyle!</p>
                        <p>- The StepStyle</p>
                    </div>
                </div>
            `
        };


    
        await sgMail.send(message)
        return res.json({ success: true, message: "OTP Sent to Management" });
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: "Error" });
    }
};

const registerAdmin2 = async(req, res) => {
    const { email, password, otp } = req.body;

    try {
        if (password.length < 10) {
            return res.json({ success: false, message: "Enter a strong password" });
        }

        if (otp !== otps[email]){
            return res.json({ success: false, message: "Invalid OTP" });
        }

        // Create a new user with the provided email and password
        const newUser = new adminModel({
            email: email,
            password: password
        });

        await newUser.save();

        const id = newUser._id
        const token =  jwt.sign({ id }, process.env.JWT_SECRET)
        return res.json({ success: true, message: "Admin added", token });

    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: "Admin not added" });
    }
    

}

const adminOtp = async(req, res) => {
    try {
        return res.json({success: true, otp: otps})
    } catch (error) {
        return res.json({success: false})
    }
}

const sendMessages = async (req, res) => {
    const { subject, message } = req.body
    try {
        const admin = await adminModel.findById(req.body.userId)
        if(!admin){
            return res.json({success: false, message: "Unauthorized"})
        }

        sgMail.setApiKey(process.env.MAIL_API)

        const users = await userModel.find({}); // Retrieve all users from the database
    
        const emailPromises = users.map((user) => {
            const msg = {
                to: user.email, // Send email to each user's email address
                from: 'noreply.stepstyle@gmail.com', // Replace with your SendGrid verified sender
                subject: subject,
                html: 
                `
                <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
                    <div style="font-size: 18px; margin-bottom: 20px;">
                        <p>Dear Customers,</p>
                        <p>${message} </p>
                    </div>

                    <div style="font-size: 14px; color: #888;">
                        <p>Thank you for choosing StepStyle!</p>
                        <p>- The StepStyle</p>
                    </div>
                </div>
                `
            };

            return sgMail.send(msg);
        });

        await Promise.all(emailPromises); // Send all emails in parallel

        return res.json({success: true})
    } catch (error) {
        console.log(error)
        return res.json({success: false})
    }
}

const validateAdmin = async (req, res) => {
    try {
        const admins = await adminModel.findById(req.body.userId)
        if(!admins){
            return res.json({success: false})
        }
        return res.json({success: true})
    } catch (error) {
        console.log(error)
        return res.json({success: false})
    }
}

module.exports = { validateAdmin, loginAdmin, registerAdmin, registerAdmin2, adminOtp, sendMessages };
