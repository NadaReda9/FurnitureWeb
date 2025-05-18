const { signupSchema, signinSchema, acceptCodeSchema, changePasswordSchema, acceptFPCodeSchema } = require("../middlewares/validator");
const { doHash, doHashValidation, hmacProcess } = require("../utils/hashing");
const User = require('../models/usersModel');
const jwt = require('jsonwebtoken');
const transport = require("../middlewares/sendEmail");

exports.signup = async (req, res) => {
    const { email, password, name } = req.body;
    try {
        const { error } = signupSchema.validate({ email, password, name });
        if (error) {
            return res.status(400).json({ success: false, message: error.details[0].message });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ success: false, message: 'User already exists' });
        }

        const hashPassword = await doHash(password, 12);
        const newUser = new User({ email, name, password: hashPassword });
        const result = await newUser.save();


        const token = jwt.sign(
            {
                userId: result._id,
                email: result.email,
                verified: result.verified,
            },
            process.env.TOKEN_SECRET
        );

        result.password = undefined;

        // Send token and user info
        return res
            .cookie('Authorization', 'Bearer ' + token, {
                expires: new Date(Date.now() + 8 * 3600000),
                httpOnly: process.env.NODE_ENV === 'production',
                secure: process.env.NODE_ENV === 'production',
            })
            .status(201)
            .json({
                success: true,
                message: "Your account has been created successfully",
                token,
                userId: result._id,
                name: result.name
            });

    } catch (error) {
        console.error("Signup Error:", error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};


exports.signin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const { error } = signinSchema.validate({ email, password });
        if (error) {
            return res.status(400).json({ success: false, message: error.details[0].message });
        }

        const existingUser = await User.findOne({ email }).select('+password');
        if (!existingUser) {
            return res.status(404).json({ success: false, message: 'User does not exist' });
        }

        const isValidPassword = await doHashValidation(password, existingUser.password);
        if (!isValidPassword) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            {
                userId: existingUser._id,
                email: existingUser.email,
                verified: existingUser.verified,
            },
            process.env.TOKEN_SECRET
        );
        
        return res
            .cookie('Authorization', 'Bearer ' + token, {
                expires: new Date(Date.now() + 8 * 3600000),
                httpOnly: process.env.NODE_ENV === 'production',
                secure: process.env.NODE_ENV === 'production',
            })
            .json({ success: true, token,userId: existingUser._id,name: existingUser.name, message: "Logged in successfully" });
    } catch (error) {
        console.error("Signin Error:", error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};


exports.signout = async (req, res) => {
    return res.clearCookie('Authorization').status(200).json({
        success: true,
        message: 'Logged out successfully',
    });
};



exports.sendVerificationCode = async (req, res) => {
    const { email } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(404).json({ success: false, message: 'User does not exist' });
        }

        if (existingUser.verified) {
            return res.status(400).json({ success: false, message: 'User already verified' });
        }

        const codeValue = Math.floor(Math.random() * 100000).toString();
        const info = await transport.sendMail({
            from: process.env.NODE_CODE_SENDING_EMAIL_ADDRESS,
            to: email,
            subject: "Verification Code",
            html: `<h1>${codeValue}</h1>`,
        });

        if (info.accepted.includes(email)) {
            const hashedCodeValue = hmacProcess(codeValue, process.env.HMAC_VERIFICATION_CODE_SECRET);
            existingUser.verificationCode = hashedCodeValue;
            existingUser.verificationCodeValidation = Date.now();
            await existingUser.save();
            return res.status(200).json({ success: true, message: 'Code sent successfully' });
        }

        return res.status(500).json({ success: false, message: 'Failed to send verification code' });
    } catch (error) {
        console.error("Send Verification Code Error:", error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};



exports.verificationCode = async (req, res) => {
    const { email, providedCode } = req.body;

    try {
        const { error } = acceptCodeSchema.validate({ email, providedCode });
        if (error) {
            return res.status(400).json({ success: false, message: error.details[0].message });
        }

        const codeValue = providedCode.toString();
        const existingUser = await User.findOne({ email }).select("verificationCode verificationCodeValidation verified");

        if (!existingUser) {
            return res.status(404).json({ success: false, message: 'User does not exist' });
        }

        if (existingUser.verified) {
            return res.status(400).json({ success: false, message: "User already verified" });
        }

        if (!existingUser.verificationCode || !existingUser.verificationCodeValidation) {
            return res.status(400).json({ success: false, message: "Verification code not found or invalid" });
        }

        if (Date.now() - existingUser.verificationCodeValidation > 5 * 60 * 1000) {
            return res.status(400).json({ success: false, message: "Verification code expired" });
        }

        const hashedCodeValue = hmacProcess(codeValue, process.env.HMAC_VERIFICATION_CODE_SECRET);
        if (hashedCodeValue === existingUser.verificationCode) {
            existingUser.verified = true;
            existingUser.verificationCodeValidation = undefined;
            await existingUser.save();
            return res.status(200).json({ success: true, message: "Account verified successfully" });
        }

        return res.status(400).json({ success: false, message: "Invalid verification code" });
    } catch (error) {
        console.error("Verification Code Error:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};






exports.changePassword = async (req, res) => {
    try {
        const { userId } = req.user;
        const { oldPassword, newPassword } = req.body;

        if (!userId) {
            return res.status(401).json({ success: false, message: 'Unauthorized: Missing user ID' });
        }

        const { error } = changePasswordSchema.validate({ oldPassword, newPassword });
        if (error) {
            return res.status(400).json({ success: false, message: error.details[0].message });
        }

        const existingUser = await User.findOne({ _id: userId }).select("+password");
        if (!existingUser) {
            return res.status(404).json({ success: false, message: 'User does not exist' });
        }

        const isValid = await doHashValidation(oldPassword, existingUser.password);
        if (!isValid) {
            return res.status(401).json({ success: false, message: 'Incorrect old password' });
        }

        existingUser.password = await doHash(newPassword, 12);
        await existingUser.save();

        return res.status(200).json({ success: true, message: 'Password changed successfully' });
    } catch (error) {
        console.error("Change Password Error:", error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};




exports.sendForgetPasswordCode = async (req, res) => {
    const { email } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(404).json({ success: false, message: 'User does not exist' });
        }

        const codeValue = Math.floor(Math.random() * 1000000).toString();
        const info = await transport.sendMail({
            from: process.env.NODE_CODE_SENDING_EMAIL_ADDRESS,
            to: email,
            subject: "ForgotPassword Code",
            html: `<h1>${codeValue}</h1>`,
        });

        if (info.accepted.includes(email)) {
            const hashedCodeValue = hmacProcess(codeValue, process.env.HMAC_VERIFICATION_CODE_SECRET);
            existingUser.forgetPasswordCode = hashedCodeValue;
            existingUser.forgetPasswordCodeValidation = Date.now();
            await existingUser.save();
            return res.status(200).json({ success: true, message: 'Code sent successfully' });
        }

        return res.status(500).json({ success: false, message: 'Failed to send verification code' });
    } catch (error) {
        console.error("Send Verification Code Error:", error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
exports.verifyForgetPasswordCode = async (req, res) => {
    const { email, providedCode, newPassword } = req.body;

    try {
        const { error } = acceptFPCodeSchema.validate({ email, providedCode, newPassword });
        if (error) {
            return res.status(400).json({ success: false, message: error.details[0].message });
        }

        const codeValue = providedCode.toString();
        const existingUser = await User.findOne({ email }).select("+forgetPasswordCode +forgetPasswordCodeValidation");

        if (!existingUser) {
            return res.status(404).json({ success: false, message: 'User does not exist' });
        }

        if (!existingUser.forgetPasswordCode || !existingUser.forgetPasswordCodeValidation) {
            return res.status(400).json({ success: false, message: "Verification code not found or invalid" });
        }

        if (Date.now() - existingUser.forgetPasswordCodeValidation > 5 * 60 * 1000) {
            return res.status(400).json({ success: false, message: "Verification code expired" });
        }

        const hashedCodeValue = hmacProcess(codeValue, process.env.HMAC_VERIFICATION_CODE_SECRET);
        if (hashedCodeValue === existingUser.forgetPasswordCode) {
            const hashPassword = await doHash(newPassword, 12);
            existingUser.password = hashPassword;
            existingUser.verified = true;
            existingUser.forgetPasswordCode = undefined; // Clear the code after successful validation
            existingUser.forgetPasswordCodeValidation = undefined; // Clear the validation time
            await existingUser.save();
            return res.status(200).json({ success: true, message: 'Password updated successfully' });
        }

        return res.status(400).json({ success: false, message: "Invalid verification code" });
    } catch (error) {
        console.error("Forgot Password Code Error:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

