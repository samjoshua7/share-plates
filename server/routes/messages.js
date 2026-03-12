const express = require("express");
const router = express.Router();
const { sendMessage, getMessages, getContacts } = require("../controllers/messageController");
const { protect } = require("../middleware/authMiddleware");

// All message routes require authentication
router.use(protect);

router.post("/", sendMessage);
router.get("/contacts", getContacts);
router.get("/:userId", getMessages);

module.exports = router;
