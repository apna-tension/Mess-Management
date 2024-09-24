const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    verificationCode: {
      type: String,
      required: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isPending: {
      type: Boolean,
      default: true,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["user", "manager"],
      default: "user",
    },
    messBalance: {
      type: Number,
      default: 0,
    },
    isPendingBalance: {
        type: Boolean,
        default: false,
    },
    pendingDeposits: [
      {
        amount: Number,
        timestamp: Date,
        isApproved: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  { timestamps: true }
);

userSchema.methods = {
  remove: function () {
    console.log(`Removing user: ${this._id}`);
    return this.deleteOne();
  },
};

module.exports = mongoose.model("User", userSchema);
