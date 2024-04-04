const {
  createMission,
  getAllMissions,
  addUserToMission,
  removeUserFromMission,
  updateMission,
  deleteMission
} = require("../controllers/missionController");

const router = require("express").Router();

router.get("/mission/get-all", getAllMissions);
router.post("/mission/create", createMission);
router.put("/mission/add-user", addUserToMission);
router.put("/mission/remove-user", removeUserFromMission);
router.put("/mission/update/:missionId", updateMission);
router.delete("/mission/delete/:missionId", deleteMission);

module.exports = router;
