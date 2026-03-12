const mongoose = require("mongoose");

const foodListingSchema = new mongoose.Schema(
  {
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    quantity: {
      type: String,
      required: true,
    },
    expiryTime: {
      type: Date,
      required: true,
    },
    pickupLocation: {
      type: String,
      required: true,
    },
    coordinates: {
      lat: { type: Number, required: false },
      lng: { type: Number, required: false }
    },
    description: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["available", "claimed", "picked-up", "delivered"],
      default: "available",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FoodListing", foodListingSchema);
