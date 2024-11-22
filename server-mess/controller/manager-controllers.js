
// --------------------------------------------------------------------------------------------------------------------
// ------------------------------    MANAGER CONTROLLER (FINANCIAL RELATED...)    -----------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------

const User = require("../models/User");
const mongoose = require("mongoose");


// --------------------------------------------------------------------------------------------------------------------
// ----------------------------------    DEFAULT/HOME PAGE    -----------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------

const home = async (req, res) => {
  try {
    res.status(200).send("Hello Developers!, this is manager router");
  } catch (err) {
    console.log(err);
  }
};


// --------------------------------------------------------------------------------------------------------------------
// ----------------------------------    GET ALL PENDING DEPOSIT    -----------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------


const getPendingDeposits = async (req, res) => {
  try {
    // Fetch users who have pending deposits
    const usersWithPendingDeposits = await User.find({
      pendingDeposits: { $elemMatch: { isApproved: false } },
    }).select("name email pendingDeposits");

    if (usersWithPendingDeposits.length === 0) {
      return res.status(404).json({ message: "No pending deposits found" });
    }

    // Format response to show only pending and approved deposits for each user
    const formattedDeposits = usersWithPendingDeposits.map(user => ({
      id: user.id,
      userName: user.name,
      email: user.email,
      pendingDeposits: user.pendingDeposits.filter(deposit => !deposit.isApproved),
      approvedDeposits: user.pendingDeposits.filter(deposit => deposit.isApproved),
    }));

    res.status(200).json({
      totalUsersWithPendingDeposits: formattedDeposits.length,
      deposits: formattedDeposits,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};




// --------------------------------------------------------------------------------------------------------------------
// ----------------------------------    APPROVE DEPOSIT    -----------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------

const approveDeposit = async (req, res) => {
  try {
    const userId = req.params.id;

    // Validate the userId to ensure it's a valid ObjectId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    const objectId = new mongoose.Types.ObjectId(userId);
    const user = await User.findById(objectId);

    // console.log("User is ", user); // Debugging check

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if pendingDeposits exists and has unapproved deposits
    const pendingDeposit = user.pendingDeposits.find(
      (deposit) => !deposit.isApproved
    );

    if (!pendingDeposit) {
      return res.status(400).json({ message: "No pending deposits found" });
    }

    pendingDeposit.isApproved = true;
    user.messBalance += pendingDeposit.amount;
    await user.save();

    res.status(200).json({ message: "Deposit approved successfully" });
  } catch (error) {
    console.error("Error approving deposit:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// --------------------------------------------------------------------------------------------------------------------
// ----------------------------------    DENY DEPOSIT    -----------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------

const denyDeposit = async (req, res) => {
  try {
    const userId = req.params.id;

    // Validate the userId to ensure it's a valid ObjectId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    const objectId = new mongoose.Types.ObjectId(userId);
    const user = await User.findById(objectId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the first unapproved pending deposit
    const pendingDepositIndex = user.pendingDeposits.findIndex(
      (deposit) => !deposit.isApproved
    );

    if (pendingDepositIndex === -1) {
      return res.status(400).json({ message: "No pending deposits to deny" });
    }

    // Remove the first unapproved pending deposit
    user.pendingDeposits.splice(pendingDepositIndex, 1);
    await user.save();

    res.status(200).json({ message: "Pending deposit denied successfully" });
  } catch (error) {
    console.error("Error denying deposit:", error);
    res.status(500).json({ message: "Server error" });
  }
};



// --------------------------------------------------------------------------------------------------------------------
// ----------------------------------    EXPORTING METHODS    -----------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------------------


module.exports = {
  home,
  getPendingDeposits,
  approveDeposit,
  denyDeposit,
};
