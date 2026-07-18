const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail.js");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

const sendVerificationOtp = async (name, email, otp) => {
  const text = `Hello ${name},

Thank you for creating an account with ShopNest.

Your OTP for account verification is: ${otp}

This OTP will expire in 10 minutes.
If you did not request this verification, simply ignore this email.

Thank you,
The ShopNest Team`;

  const html = `<div style="font-family:Arial,Helvetica,sans-serif;color:#111;line-height:1.6;">
    <h2 style="color:#1d4ed8;">Verify your ShopNest account</h2>
    <p>Hi ${name},</p>
    <p>Thanks for joining <strong>ShopNest</strong>. Please use the verification code below to activate your account:</p>
    <p style="font-size:1.6rem;font-weight:700;letter-spacing:0.1em;margin:24px 0;padding:18px;background:#f3f4f6;border-radius:12px;text-align:center;">${otp}</p>
    <p>This code will expire in <strong>10 minutes</strong>.</p>
    <p>If you did not request this, you can safely ignore this message.</p>
    <p>Best regards,<br/><strong>The ShopNest Team</strong></p>
  </div>`;

  await sendEmail(email, "ShopNest Account Verification", text, html);
};

// Register a new user
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      if (existingUser.verified) {
        return res.status(400).json({ message: "User already exists" });
      }

      const otp = generateOtp();
      existingUser.otp = otp;
      existingUser.otpExpires = Date.now() + 10 * 60 * 1000;
      await existingUser.save();
      await sendVerificationOtp(existingUser.name, email, otp);

      return res.status(200).json({
        message: "Verification OTP resent. Check your email.",
        email: existingUser.email,
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const otp = generateOtp();
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      verified: false,
      otp,
      otpExpires: Date.now() + 10 * 60 * 1000,
    });

    if (user) {
      await sendVerificationOtp(name, email, otp);
      return res.status(201).json({
        message: "Account created. Verify your email using the OTP sent to your inbox.",
        email: user.email,
      });
    }

    res.status(400).json({ message: "Invalid user data" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Verify OTP for registration
const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    if (user.verified) {
      return res.status(400).json({ message: "Account already verified" });
    }
    if (!user.otp || !user.otpExpires || Date.now() > user.otpExpires) {
      return res.status(400).json({ message: "OTP has expired. Please request a new one." });
    }
    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    user.verified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      verified: user.verified,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Resend OTP for verification
const resendOtp = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    if (user.verified) {
      return res.status(400).json({ message: "Account already verified" });
    }

    const otp = generateOtp();
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000;
    await user.save();
    await sendVerificationOtp(user.name, email, otp);

    res.json({ message: "OTP resent. Check your email." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Login a user
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    if (!user.verified) {
      return res.status(401).json({ message: "Account not verified. Please verify your email." });
    }
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        verified: user.verified,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Exclude password field
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { registerUser, loginUser, getUsers, verifyOtp, resendOtp };