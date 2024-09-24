const User = require("../models/User");

const addMoney = async (req, res) => {
  try {
    const amount = req.body.amount;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.pendingDeposits.push({
      amount,
      timestamp: Date.now(),
    });
    await user.save();

    res.status(200).json({ message: "Deposit added successfully" });
  } catch (error) {
    console.error("Error adding money:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { addMoney };
