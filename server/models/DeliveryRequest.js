const mongoose = require("mongoose");

const deliveryRequestSchema = new mongoose.Schema(
  {
    foodListing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FoodListing",
      required: true,
    },
    shelter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    volunteer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    status: {
      type: String,
      enum: ["waiting", "assigned", "picked-up", "delivered", "cancelled"],
      default: "waiting",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("DeliveryRequest", deliveryRequestSchema);
