const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    // Array to store mission ids the user has participated in
    participatedMissions: [
      {
        type: Schema.Types.ObjectId,
        ref: "Mission",
      },
    ],
  },
  { timestamps: true }
);

const User = model("User", userSchema);
module.exports = User;
