// --------------------------------------------------------------------------------------------------------------------
// ---------------------------    ADMIN CONTROLLER(APPROVE/DENY USER)    -----------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------

const User = require("../models/User");
const mongoose = require("mongoose");

// --------------------------------------------------------------------------------------------------------------------
// ----------------------------------    DEFAULT/HOME PAGE    -----------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------

const home = async (req, res) => {
  try {
    res.status(200).send("Hello Developers!, this is admin router");
  } catch (err) {
    console.log(err);
  }
};

// --------------------------------------------------------------------------------------------------------------------
// ----------------------------------    GET APPROVED USER    -----------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------

const getApprovedUsers = async (req, res) => {
  try {
    const approvedUsers = await User.find({ isApproved: true });
    if (approvedUsers.length === 0) {
      return res.status(404).json({ message: "No approved users found" });
    }
    res.status(200).json({
      totalApprovedUsers: approvedUsers.length,
      approvedUsers,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// --------------------------------------------------------------------------------------------------------------------
// ----------------------------------    GET ALL PENDING USER    -----------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------

const getPendingUsers = async (req, res) => {
  try {
    const pendingUsers = await User.find({ isPending: true });
    if (pendingUsers.length === 0) {
      return res.status(404).json({ message: "No pending users found" });
    }
    res.status(200).json(pendingUsers);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// --------------------------------------------------------------------------------------------------------------------
// ----------------------------------    USER APPROVE    -----------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------

const approveUser = async (req, res) => {
  try {
    const userId = req.params.id; // Replace with the actual userId
    console.log("userId is ", userId);
    const objectId = new mongoose.Types.ObjectId(userId);
    console.log("objectId is ", objectId);
    const user = await User.findById(objectId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isPending = false;
    user.isApproved = true;
    await user.save();

    res.status(200).json({ message: "User approved successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

// --------------------------------------------------------------------------------------------------------------------
// ----------------------------------    USER DENY    -----------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------

const denyUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const objectId = new mongoose.Types.ObjectId(userId);

    const user = await User.findById(objectId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Remove the user from the database
    await user.remove();

    res.status(200).json({ message: "User denied successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// --------------------------------------------------------------------------------------------------------------------
// ----------------------------------    EXPORTING METHODS    -----------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------

module.exports = {
  getPendingUsers,
  approveUser,
  denyUser,
  home,
  getApprovedUsers,
};