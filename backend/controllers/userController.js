const { userModel } = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const crypto = require('crypto'); // For generating OTPs
const sgMail = require('@sendgrid/mail')

const otps = {};

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET);
}

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "User doesn't exist" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({ success: false, message: "Invalid credentials" });
        }

        const token = createToken(user._id);
        return res.json({ success: true, token });
    } catch (error) {
        return res.json({ success: false, message: "error" });
    }
}

const registerUser01 = async (req, res) => {
    const { name, email, password } = req.body;
    const otp = crypto.randomInt(100000, 999999).toString();

    try {
        const exist = await userModel.findOne({ email });
        if (exist) {
            return res.json({ success: false, message: "User already exists" });
        }

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Wrong email address" });
        }

        if (password.length < 10) {
            return res.json({ success: false, message: "Enter a strong password" });
        }

        // Store OTP against the user identifier
        otps[email] = otp;

        sgMail.setApiKey(process.env.MAIL_API)

        setTimeout(() => {
            delete otps[email];
        }, 600000);

        const message = {
            to: email,
            from: 'noreply.stepstyle@gmail.com',
            subject: "StepStyle Register Account OTP Code",
            html: `
                <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
                    <div style="font-size: 18px; margin-bottom: 20px;">
                        <p>Hello ${name},</p>
                        <p>Your OTP Code is:</p>
                        <h2 style="color: #1a73e8;">${otp}</h2>
                        <p>Please use this code to complete your account setup. The code is valid for 10 minutes.</p>
                    </div>
                    <div style="font-size: 14px; color: #888;">
                        <p>Thank you for choosing StepStyle!</p>
                        <p>- The StepStyle Team</p>
                    </div>
                </div>
            `
        };

        await sgMail.send(message)

        return res.json({ success: true, message: "OTP Sent" })

    } catch (error) {
        console.log(error)
        return res.json({ success: false, message: "error" });
    }
}

const registerUser02 = async(req, res) => {
    const { name, email, password, otp } = req.body;

    if (otps[email] && otps[email] === otp) {
        delete otps[email]; 

        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password, salt);

        const newUser = new userModel({
            name: name,
            email: email,
            password: hashedPass
        });

        const user = await newUser.save();
        const token = createToken(user._id);

        return res.json({ success: true, token });
    }
    
    res.json({ success: false, message: 'Invalid OTP' });
    
}

const forgetPasswordOTP = async(req, res) => {
    const { email } = req.body;
    const otp = crypto.randomInt(100000, 999999).toString();

    try {
        const exist = await userModel.findOne({email})

        if(!exist){
            return res.json({success: false, message: "User doesn't exist"})
        }


        // Store OTP against the user identifier
        otps[email] = otp;

        sgMail.setApiKey(process.env.MAIL_API)

        setTimeout(() => {
            delete otps[email]
        }, 600000);

        const name = exist.name

        const message = {
            to: email,
            from: 'noreply.stepstyle@gmail.com',
            subject: "StepStyle Reset Account OTP Code",
            html: `
                <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
                    <div style="font-size: 18px; margin-bottom: 20px;">
                        <p>Hello ${name},</p>
                        <p>Your OTP Code is:</p>
                        <h2 style="color: #1a73e8;">${otp}</h2>
                        <p>Please use this code to complete your account setup. The code is valid for 10 minutes.</p>
                    </div>
                    <div style="font-size: 14px; color: #888;">
                        <p>Thank you for choosing StepStyle!</p>
                        <p>- The StepStyle Team</p>
                    </div>
                </div>
            `
        };

        await sgMail.send(message)
        return res.json({ success: true, message: "OTP Sent" })

    } catch (error) {
        console.log(error)
        return res.json({ success: false, message: "error" });
        
    }

}

const resetPassword = async(req, res) => {
    const { email, newPassword, confirmNewPassword, otp } = req.body

    if (!otps[email] || otps[email] !== otp) {
        return res.json({ success: false, message: 'Invalid OTP' });
    }

    else if (newPassword !== confirmNewPassword){
        return res.json({ success: false, message: "Both passwords doesn't match" });
    }

    else if (newPassword.length < 10){  
        return res.json({ success: false, message: 'Provide strong password' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    const user = await userModel.findOneAndUpdate(
        { email },
        { password: hashedPassword }
    );

    const token = createToken(user._id);

    delete otps[email];
    return res.json({ success: true, message: 'Password reset successfully', token});
}

const userDetails = async (req, res) => {
    try {
        // Fetch the user by ID
        const user = await userModel.findById(req.body.userId);

        // Check if user exists
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Extract relevant details
        const { email, name, createdAt } = user;

        // Send response with user details
        return res.status(200).json({ email, name, createdAt });
    } catch (error) {
        // Handle any errors that occur
        return res.status(500).json({ message: 'Server error', error });
    }
};



module.exports = { loginUser, registerUser01, registerUser02, forgetPasswordOTP, resetPassword, userDetails };
