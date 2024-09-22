const express = require("express");
require("dotenv").config();
const User = require("../models/User");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const nodemailer = require("nodemailer");
const twilio = require("twilio");
const randomstring = require("randomstring");

// ------------------- Default page -------------------
const home = async (req, res) => {
  try {
    res.status(200).send("Hello Developers!, this is auth/user router");
  } catch (err) {
    console.log(err);
  }
};

// ------------------- Register user -------------------
// const register = async (req, res) => {
//   const { name, email, password, phoneNumber } = req.body;

//   try {
//     let user = await User.findOne({ email });
//     if (user) {
//       console.log("Already registered");
//       return res.status(400).json({ message: "User already exists" });
//     }

//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     user = new User({
//       name,
//       email,
//       password: hashedPassword,
//       phoneNumber,
//     });

//     await user.save();

//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//       expiresIn: "1h",
//     });
//     console.log("Register Successfully");
//     res.status(201).json({ token });
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// };

const register = async (req, res) => {
  const { name, email, password, phoneNumber } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      console.log("Already registered");
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    user = new User({
      name,
      email,
      password: hashedPassword,
      phoneNumber,
      verificationCode: randomstring.generate(6),
      isPending: true,
    });

    await user.save();

    // Send verification email

    const transporter = nodemailer.createTransport({
      // Your email provider configuration
      service: "gmail",
      auth: {
        user: process.env.USER_EMAIL, // Replace with your email
        pass: process.env.USER_PASSWORD, // Replace with your password (stored securely)
      },
    });
    
    // console.log(user.verificationCode);

    const mailOptions = {
      from: process.env.USER_EMAIL,
      to: user.email,
      subject: "Email Verification",
      text: `Your verification code   
 is: ${user.verificationCode}, and your email is: ${user.email}, your username is: ${user.name}, phone number is: ${user.phoneNumber}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return res.status(500).send({ message: "Server error" });
      } else {
        console.log("Email sent: " + info.response);
        return res.status(200).send({ message: "Registration successful. Please check your email for verification." });
      }
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    console.log("Register Successfully");
    res.status(201).json({ token });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ------------------- Login user -------------------
// const login = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     let user = await User.findOne({ email });
//     if (!user) return res.status(400).json({ message: "Invalid credentials" });

//     if (!user.isVerified) {
//       console.log("User is not verified");
//       return res.status(401).json({ message: "Email not verified" });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch)
//       return res.status(400).json({ message: "Invalid credentials" });

//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//       expiresIn: "1h",
//     });
//     console.log("Login Successfully");
//     res.json({
//       token,
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         phoneNumber: user.phoneNumber,
//       },
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// };

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    // Generate verification code
    const verificationCode = randomstring.generate(6);
    user.verificationCode = verificationCode;
    await user.save();

    // Send verification code based on user's preference (e.g., SMS or email)

    // Send email using Nodemailer
    const transporter = nodemailer.createTransport({
      // Your email provider configuration
      service: "gmail",
      auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.USER_EMAIL,
      to: user.email,
      subject: "2FA Verification",
      text: `Your verification code is: ${verificationCode}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });

    return res.status(200).json({ message: "Verification code sent" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ------------------- Get user -------------------

const getUser = async (req, res) => {
  try {
    // The user data is already attached to req.user by authMiddleware
    res.status(200).json(req.user);
    console.log("Data Fetched Successfully");
  } catch (error) {
    console.error("Server Error");
    res.status(500).json({ message: "Server error" });
  }
};

// ------------------- Verify email -------------------

const verifyEmail = async (req, res) => {
  const { email, verificationCode } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found");
      return res.status(404).json({ message: "User not found" });
    }

    if (user.verificationCode === verificationCode) {
      user.isVerified = true;
      await user.save();
      console.log("Email Verified Successfully");
      return res.status(200).json({ message: "Email verified successfully" });
    } else {
      console.log("Invalid verification code");
      return res.status(400).json({ message: "Invalid verification code" });
    }
  } catch (error) {
    // ... handle errors
    console.error("Server Error for verification");
    res
      .status(500)
      .json({ message: "Server error during verify email when register" });
  }
};

// ------------------- Verify login -------------------

const verifyLogin = async (req, res) => {
  const { email, verificationCode } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.verificationCode === verificationCode) {
      // Generate a JWT token and return it
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      return res.status(200).json({ token });
    } else {
      return res.status(400).json({ message: "Invalid verification code" });
    }
  } catch (error) {
    // ... handle errors
    console.error("Server Error for login 2-factor authentication");
    res.status(500).json({ message: "Server error during login verification" });
  }
};

module.exports = { home, register, login, getUser, verifyEmail, verifyLogin };

// module.exports = { home, register, login };
