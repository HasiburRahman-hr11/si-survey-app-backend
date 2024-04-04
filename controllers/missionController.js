const User = require("../models/User");
const Mission = require("../models/Mission");
const jwt = require("jsonwebtoken");

// Create New Mission
exports.createMission = async (req, res) => {
  const token = req.headers.authorization;
  const secretKey = process.env.JWT_SECRET;

  try {
    // Verify JWT token
    const decodedToken = jwt.verify(token, secretKey);

    // Check if the user is an admin
    if (!decodedToken.isAdmin) {
      return res.status(403).json({
        message:
          "Unauthorized access. Only admins are allowed to create missions.",
      });
    }

    // If user is admin, proceed to create mission
    const { title, description, isOpen } = req.body;

    // Create new mission
    const mission = new Mission({
      title,
      description,
      isOpen,
    });

    // Save mission to database
    await mission.save();

    res.status(201).json({ mission });
  } catch (error) {
    console.error(error);
    if (error.name === "JsonWebTokenError") {
      return res
        .status(401)
        .json({ message: "Unauthorized access. Please provide a valid token" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get All Missions
exports.getAllMissions = async (req, res) => {
  try {
    const allMissions = await Mission.find().sort({ createdAt: -1 });
    res.status(200).json(allMissions);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

// Controller function to add a user to a mission
exports.addUserToMission = async (req, res) => {
  const { userId, missionId } = req.body;

  try {
    // Update Mission model
    const mission = await Mission.findById(missionId);
    if (!mission) {
      return res.status(404).json({ message: "Mission not found" });
    }
    // Check if the user is already a participant
    if (mission.participants.includes(userId)) {
      return res
        .status(400)
        .json({ message: "User is already a participant in this mission." });
    }

    mission.participants.push(userId);
    await mission.save();

    // Update User model
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.participatedMissions.includes(missionId)) {
      return res
        .status(400)
        .json({ message: "User is already a participant in this mission." });
    }

    user.participatedMissions.push(missionId);
    await user.save();

    res.status(200).json({ message: "User added to mission successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Controller function to cancel a mission by the user
exports.removeUserFromMission = async (req, res) => {
  const { userId, missionId } = req.body;

  try {
    // Update Mission model
    const mission = await Mission.findById(missionId);
    if (!mission) {
      return res.status(404).json({ message: "Mission not found" });
    }

    // Remove user ID from participants array
    mission.participants = mission.participants.filter(
      (id) => id.toString() !== userId.toString()
    );
    await mission.save();

    // Update User model
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Remove mission ID from participatedMissions array
    user.participatedMissions = user.participatedMissions.filter(
      (id) => id.toString() !== missionId.toString()
    );
    await user.save();

    res.status(200).json({ message: "Mission canceled successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Controller function to update a mission
exports.updateMission = async (req, res) => {
  const { missionId } = req.params;
  const token = req.headers.authorization;
  const secretKey = process.env.JWT_SECRET;

  try {
    // Verify JWT token
    const decodedToken = jwt.verify(token, secretKey);

    // Check if the user is an admin
    if (!decodedToken.isAdmin) {
      return res.status(403).json({
        message:
          "Unauthorized access. Only admins are allowed to update missions.",
      });
    }

    // Update the mission
    const mission = await Mission.findByIdAndUpdate(missionId, req.body, {
      new: true,
    });
    if (!mission) {
      return res.status(404).json({ message: "Mission not found" });
    }

    res.status(200).json({ mission });
  } catch (error) {
    console.error(error);
    if (error.name === "JsonWebTokenError") {
      return res
        .status(401)
        .json({ message: "Unauthorized access. Please provide a valid token" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

// Controller function to delete a mission
exports.deleteMission = async (req, res) => {
  const { missionId } = req.params;
  const token = req.headers.authorization;
  const secretKey = process.env.JWT_SECRET;

  try {
    // Verify JWT token
    const decodedToken = jwt.verify(token, secretKey);

    // Check if the user is an admin
    if (!decodedToken.isAdmin) {
      return res.status(403).json({
        message:
          "Unauthorized access. Only admins are allowed to delete missions.",
      });
    }

    // Delete the mission
    const deletedMission = await Mission.findByIdAndDelete(missionId);
    if (!deletedMission) {
      return res.status(404).json({ message: "Mission not found" });
    }

    // Remove mission ID from participatedMissions array of all users
    await User.updateMany({}, { $pull: { participatedMissions: missionId } });

    res
      .status(200)
      .json({ message: "Mission deleted successfully", deletedMission });
  } catch (error) {
    console.error(error);
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};
