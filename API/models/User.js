const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    unique: true,
  },
  ProfilePic: {
    type: String,
  },
  joinedDate: {
    type: Date,
    default: Date.now,
  },
  sentFollowRequests: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  receivedFollowRequests: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  ],
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  verified: {
    type: Boolean,
    default: false,
  },
  verificationToken: { type: String },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
