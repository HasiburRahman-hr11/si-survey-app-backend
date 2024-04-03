const { createNewUser, loginUser } = require("../controllers/authController");

const router = require("express").Router();

router.post("/user/register", createNewUser);
router.post("/user/login", loginUser);

module.exports = router;