const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");
const { createFoodListing, getAvailableFood, getMyListings, updateFoodListing, getAdminAllFood } = require("../controllers/foodController");

router.post("/", protect, authorize("store"), createFoodListing);
router.get("/available", protect, authorize("shelter"), getAvailableFood);
router.get("/my-listings", protect, authorize("store"), getMyListings);
router.put("/:id", protect, authorize("store"), updateFoodListing);
router.get("/all", protect, authorize("admin"), getAdminAllFood);

module.exports = router;
