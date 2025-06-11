const bcrypt = require('bcryptjs');
const User = require('../models/User');



// JWT Verification

const jwt = require('jsonwebtoken');
const { secret } = require("../config/jwtSecret");

const createNewUser = async (req, res) => {
    const { name, username, email, password, phone } = req.body;

    if (!username || !password || !name || !email || !phone) {
        return res.status(400).json({ error: 'Please provide all required fields' });
    }

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, name, email, password: hashedPassword, phone });
        await user.save();

        res.status(201).json({ message: 'User created successfully', user: user });
    } catch (error) {
        console.error('Error inserting user:', error);
        return res.status(500).json({ error: 'Server error' });
    }
};

// Update user profile
const updateUserProfile = async (req, res) => {
    const { username } = req.user;
    const { name, updatedusername, email, phone, password } = req.body;

    try {
        // Find the user by username
        const user = await User.findOne({ username });

        console.log(user);
        console.log(name, updatedusername, email, phone, password);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check and update the username
        if (updatedusername && updatedusername !== user.username) {
            const usernameExists = await User.findOne({ username: updatedusername });
            if (usernameExists) {
                return res.status(400).json({ message: "Username already exists" });
            }
            user.username = updatedusername;
        }

        // Check and update the email
        if (email && email !== user.email) {
            const emailExists = await User.findOne({ email });
            if (emailExists) {
                return res.status(400).json({ message: "Email already exists" });
            }
            user.email = email;
        }

        // Check and update the phone
        if (phone && phone !== user.phone) {
            const phoneExists = await User.findOne({ phone });
            if (phoneExists) {
                return res.status(400).json({ message: "Phone number already exists" });
            }
            user.phone = phone;
            user.phoneVerified = false; // Reset phone verification status
        }

        // Update other fields
        if (name) user.name = name;
        if (password) user.password = await bcrypt.hash(password, 10);

        // Save the updated user
        const updatedUser = await user.save();
        console.log(updatedUser);

        res.status(200).json({
            message: "Profile updated successfully",
            user: {
                username: updatedUser.username,
                email: updatedUser.email,
                phone: updatedUser.phone,
                name: updatedUser.name,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating profile", error: error.message });
    }
};


const loginUser = async (req, res) => {
    const { username, password } = req.body;

    // Validate user input
    if (!username || !password) {
        return res.status(400).json({ error: 'Please provide all fields' });
    }

    try {
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).send("Invalid credentials");

        const token = jwt.sign({ _id: user._id, username: user.username,  }, secret , {
            expiresIn: '1h',
        });

        res.status(200).json({ token, message: 'Logged in successfully' });
    } catch (error) {
        console.error('Error logging in:', error);
        return res.status(500).json({ error: 'Server error' });
    }
};

const getUserInfo = async (req, res) => {
    try {
        const user = await User.findOne({username: req.user.username}).select('-password');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    }
    catch (error) {
        console.error('Error getting user info:', error);
        return res.status(500).json({ error: 'Server error' });
    }
};



// Twilio - OTP Verification

require("dotenv").config();
const twilio = require('twilio');
const OtpCache = require('../models/OtpCache');
const client = new twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

const sendOtp = async (req, res) => {
    const { phone } = req.body;

    try {
        // Check if the user exists and is already verified
        const user = await User.findOne({ phone });
        if (user && user.phoneVerified) {
            return res.status(400).send("User is already verified");
        }

        // Generate OTP
        const otp = Math.floor(1000 + Math.random() * 9000);

        // Send OTP using Twilio
        await client.messages.create({
            body: `Your Petcare OTP is ${otp}`,
            to: phone,
            from: process.env.TWILIO_PHONE_NUMBER,
        });

        // Save the OTP in the cache
        await OtpCache.create({ phone, otp });

        res.status(200).send("OTP sent successfully");
    } catch (error) {
        console.error("Error sending OTP:", error);
        res.status(500).send("Server error");
    }
};

const verifyOtp = async (req, res) => {
    const { phone, otp } = req.body;
  
    const record = await OtpCache.findOne({ phone });
    if (!record || record.otp !== otp) {
        console.log(record);
      return res.status(400).send("Invalid OTP");
    }
  
    // OTP is valid, authenticate user
    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(404).send("User not found");
    }

    user.phoneVerified = true;
    await user.save();
    
    await OtpCache.deleteOne({ phone });
  
    res.status(200).send("OTP verified successfully");
};
  
module.exports = { createNewUser, loginUser, getUserInfo, sendOtp, verifyOtp, updateUserProfile };