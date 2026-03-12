const FoodListing = require("../models/FoodListing");

// @route  POST /api/food
// @desc   Create food listing (Store only)
// @access Private/Store
const createFoodListing = async (req, res) => {
  try {
    const { name, quantity, expiryTime, pickupLocation, description, coordinates } = req.body;
    
    if (!name || !quantity || !expiryTime || !pickupLocation) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    const food = await FoodListing.create({
      store: req.user._id,
      name,
      quantity,
      expiryTime,
      pickupLocation,
      coordinates: coordinates || { lat: null, lng: null },
      description
    });

    // --- SOCKET.IO ALERT ---
    // Notify all shelters that a new food listing has been posted globally
    const io = req.app.get("io");
    if (io) {
      io.to("shelter").emit("new_food_available", {
        message: `New surplus food posted: ${name}`,
        foodId: food._id,
      });
    }

    res.status(201).json(food);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route  GET /api/food/available
// @desc   Get all available food listings
// @access Private
const getAvailableFood = async (req, res) => {
  try {
    const foods = await FoodListing.find({ status: "available" })
      .populate("store", "name organizationName address phone")
      .sort("-createdAt");
    
    res.status(200).json(foods);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route  GET /api/food/my-listings
// @desc   Get current store's listings
// @access Private/Store
const getMyListings = async (req, res) => {
  try {
    const foods = await FoodListing.find({ store: req.user._id })
      .sort("-createdAt");
      
    res.status(200).json(foods);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route  PUT /api/food/:id
// @desc   Store edits their listing
// @access Private/Store
const updateFoodListing = async (req, res) => {
  try {
    const foodId = req.params.id;
    const food = await FoodListing.findById(foodId);

    if (!food) return res.status(404).json({ message: "Food not found" });
    if (food.store.toString() !== req.user._id.toString()) return res.status(403).json({ message: "Not authorized to edit this listing" });
    if (food.status !== "available") return res.status(400).json({ message: "Cannot edit food that has already been claimed" });

    const updatedFood = await FoodListing.findByIdAndUpdate(
      foodId,
      { $set: req.body },
      { new: true }
    );

    res.status(200).json(updatedFood);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route  GET /api/food/all
// @desc   Get ALL food listings globally
// @access Private/Admin
const getAdminAllFood = async (req, res) => {
  try {
    const foods = await FoodListing.find()
      .populate("store", "name organizationName")
      .sort("-createdAt");
      
    res.status(200).json(foods);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { createFoodListing, getAvailableFood, getMyListings, updateFoodListing, getAdminAllFood };
