const { Schema, model } = require("mongoose");

const missionSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    isOpen: {
      type: Boolean,
      default: true,
    },
    // Array to store user ids of participants
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

const Mission = model("Mission", missionSchema);
module.exports = Mission;
