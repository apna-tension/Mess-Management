const express = require("express");
const User = require("../models/User");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const nodemailer = require("nodemailer");
const randomstring = require("randomstring");

const home = async (req, res) => {
  try {
    res.status(200).send("Hello World!");
  } catch (err) {
    console.log(err);
  }
};

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
    });

    await user.save();

    // Send verification email
    const transporter = nodemailer.createTransport({
      // Your email provider configuration
      service: "gmail",
      auth: {
        user: "aminulislam.it2022@nsec.ac.in",
        pass: "mkme wkge azcm nuxs",
      },
    });
    console.log(user.verificationCode);
    const mailOptions = {
      from: "aminulislam.it2022@nsec.ac.in",
      to: user.email,
      subject: "Email Verification",
      text: `Your verification code   
 is: ${user.verificationCode}, and your email is: ${user.email}, your username is: ${user.name}, phone number is: ${user.phoneNumber}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
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

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    if (!user.isVerified) {
      console.log("User is not verified");
      return res.status(401).json({ message: "Email not verified" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    console.log("Login Successfully");
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

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
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { home, register, login, getUser, verifyEmail };

// module.exports = { home, register, login };
