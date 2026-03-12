const express = require("express");
const mongoose = require("mongoose");
const User = require("../models/User");

const router = express.Router();

// GET /api/users - return all users
router.get("/", async (req, res) => {
  try {
    // debug: confirm which DB we hit
    if (mongoose.connection?.db) {
      console.log("[/api/users] connected to database:", mongoose.connection.db.databaseName);
    }

    const users = await User.find();
    console.log(`[/api/users] documents found: ${users.length}`);

    res.json(users);
  } catch (err) {
    console.error("[/api/users] error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
