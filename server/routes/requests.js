const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");
const { claimFood, getMyRequests, getMyStoreRequests, getOpenRequests, updateDeliveryState, getAdminAllRequests } = require("../controllers/requestController");

router.post("/:foodId", protect, authorize("shelter"), claimFood);
router.get("/my-requests", protect, authorize("shelter"), getMyRequests);
router.get("/store-requests", protect, authorize("store"), getMyStoreRequests);
router.get("/open", protect, authorize("volunteer"), getOpenRequests);
router.get("/all", protect, authorize("admin"), getAdminAllRequests);
router.put("/:id/state", protect, authorize("volunteer"), updateDeliveryState);

module.exports = router;
