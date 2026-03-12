const DeliveryRequest = require("../models/DeliveryRequest");
const FoodListing = require("../models/FoodListing");

// @route  POST /api/requests/:foodId
// @desc   Shelter claims food
// @access Private/Shelter
const claimFood = async (req, res) => {
  try {
    const foodId = req.params.foodId;
    const food = await FoodListing.findById(foodId);

    if (!food) return res.status(404).json({ message: "Food not found" });
    if (food.status !== "available") return res.status(400).json({ message: "Food already claimed" });

    // Update food status
    food.status = "claimed";
    await food.save();

    const request = await DeliveryRequest.create({
      foodListing: food._id,
      shelter: req.user._id,
      status: "waiting"
    });

    // --- SOCKET.IO ALERT ---
    // Notify volunteers that a new delivery request is waiting
    const io = req.app.get("io");
    if (io) {
      io.to("volunteer").emit("new_delivery_request", {
        message: `New pickup waiting! ${food.name}`,
        requestId: request._id,
      });
    }

    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route  GET /api/requests/my-requests
// @desc   Get shelter's claims
// @access Private/Shelter
const getMyRequests = async (req, res) => {
  try {
    const requests = await DeliveryRequest.find({ shelter: req.user._id })
      .populate({
        path: "foodListing",
        select: "name quantity expiryTime pickupLocation status",
        populate: { path: "store", select: "organizationName phone address" }
      })
      .populate("volunteer", "name phone")
      .sort("-createdAt");

    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route  GET /api/requests/store-requests
// @desc   Get Store's outbound deliveries
// @access Private/Store
const getMyStoreRequests = async (req, res) => {
  try {
    // First find all food listings belonging to this store
    const myFoods = await FoodListing.find({ store: req.user._id }).select("_id");
    const myFoodIds = myFoods.map(f => f._id);

    // Now find any delivery requests tied to those specific food IDs
    const requests = await DeliveryRequest.find({ foodListing: { $in: myFoodIds } })
      .populate({
        path: "foodListing",
        select: "name quantity expiryTime pickupLocation status coordinates",
        populate: { path: "store", select: "organizationName phone address" }
      })
      .populate("shelter", "organizationName phone address")
      .populate("volunteer", "name phone")
      .sort("-createdAt");

    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route  GET /api/requests/open
// @desc   Get open requests waiting for volunteer
// @access Private/Volunteer
const getOpenRequests = async (req, res) => {
  try {
    // Both 'waiting' and assigned to this volunteer
    const requests = await DeliveryRequest.find({
      $or: [
        { status: "waiting" },
        { volunteer: req.user._id }
      ]
    })
      .populate({
        path: "foodListing",
        select: "name quantity pickupLocation expiryTime coordinates",
        populate: { path: "store", select: "organizationName phone address" }
      })
      .populate("shelter", "organizationName phone address")
      .sort("-createdAt");

    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route  GET /api/requests/all
// @desc   Get ALL requests globally
// @access Private/Admin
const getAdminAllRequests = async (req, res) => {
  try {
    const requests = await DeliveryRequest.find()
      .populate({
        path: "foodListing",
        select: "name quantity",
        populate: { path: "store", select: "organizationName" }
      })
      .populate("shelter", "organizationName")
      .populate("volunteer", "name")
      .sort("-createdAt");

    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route  PUT /api/requests/:id/state
// @desc   Volunteer updates state (accept/pickup/deliver)
// @access Private/Volunteer
const updateDeliveryState = async (req, res) => {
  try {
    const { action } = req.body; // 'accept', 'pickup', 'deliver'
    const request = await DeliveryRequest.findById(req.params.id);
    
    if (!request) return res.status(404).json({ message: "Request not found" });

    const food = await FoodListing.findById(request.foodListing);

    if (action === "accept") {
      if (request.status !== "waiting") return res.status(400).json({ message: "Request already handled" });
      request.volunteer = req.user._id;
      request.status = "assigned";
    } else if (action === "pickup") {
      if (request.volunteer.toString() !== req.user._id.toString()) return res.status(403).json({ message: "Not your task" });
      request.status = "picked-up";
      if (food) { food.status = "picked-up"; await food.save(); }
    } else if (action === "deliver") {
      if (request.volunteer.toString() !== req.user._id.toString()) return res.status(403).json({ message: "Not your task" });
      request.status = "delivered";
      if (food) { food.status = "delivered"; await food.save(); }
    }

    await request.save();

    // --- SOCKET.IO ALERT ---
    // Notify the shelter and the store about the status update
    const io = req.app.get("io");
    if (io) {
      const roomShelter = request.shelter.toString();
      // Store ID is in the food object 
      const roomStore = food?.store?.toString();

      if (roomShelter) {
        io.to(roomShelter).emit("delivery_updated", {
          message: `Delivery status updated to: ${action}`,
          requestId: request._id,
          status: request.status
        });
      }
      if (roomStore) {
        io.to(roomStore).emit("delivery_updated", {
          message: `Delivery status updated to: ${action}`,
          requestId: request._id,
          status: request.status
        });
      }
    }

    res.status(200).json(request);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { claimFood, getMyRequests, getMyStoreRequests, getOpenRequests, updateDeliveryState, getAdminAllRequests };
