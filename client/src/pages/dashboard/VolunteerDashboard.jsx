import React from "react";
import { useAuth } from "../../context/AuthContext";

const DELIVERY_TASKS = [
  {
    id: 1,
    food: "Sourdough Bread (12 loaves)",
    from: "Sunrise Bakery, MG Road",
    to: "Hope Shelter, 5th Cross",
    distance: "3.2 km",
    status: "available",
  },
  {
    id: 2,
    food: "Rice & Curry (20 portions)",
    from: "Spice Garden, Brigade Road",
    to: "Rainbow Home, JP Nagar",
    distance: "5.8 km",
    status: "available",
  },
];

const MY_TASKS = [
  {
    id: 3,
    food: "Vegetable Box",
    from: "FreshMart",
    to: "City Shelter",
    status: "picked-up",
  },
];

export default function VolunteerDashboard() {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="db-page-title">Ready to deliver, {user?.name?.split(" ")[0]}? 🚗</h1>
      <p className="db-page-sub">Check delivery requests and accept tasks near you</p>

      {/* Stats */}
      <div className="db-stats-row">
        {[
          { icon: "📦", value: 2, label: "Open Requests" },
          { icon: "🚗", value: 1, label: "Active Delivery" },
          { icon: "✅", value: 18, label: "Completed Trips" },
          { icon: "⭐", value: "4.9", label: "Rating" },
        ].map((s) => (
          <div key={s.label} className="db-stat-card">
            <span className="db-stat-card__icon">{s.icon}</span>
            <div>
              <div className="db-stat-card__value">{s.value}</div>
              <div className="db-stat-card__label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Open Requests */}
      <p className="db-section-title">📦 Open Delivery Requests</p>
      <div className="db-food-grid" style={{ marginBottom: "28px" }}>
        {DELIVERY_TASKS.map((task) => (
          <div key={task.id} className="db-food-card">
            <div className="db-food-card__header">
              <span className="db-food-card__name">{task.food}</span>
              <span className="sp-badge sp-badge-available">Open</span>
            </div>
            <div className="db-food-card__meta">
              <span>🏪 Pickup: {task.from}</span>
              <span>🏠 Drop: {task.to}</span>
              <span>📍 Distance: {task.distance}</span>
            </div>
            <button className="btn btn-primary" style={{ padding: "8px 18px", fontSize: "0.85rem", borderRadius: "8px" }}>
              Accept Task
            </button>
          </div>
        ))}
      </div>

      {/* Active Task */}
      <p className="db-section-title">🚗 My Active Task</p>
      <div className="db-food-grid">
        {MY_TASKS.map((task) => (
          <div key={task.id} className="db-food-card" style={{ borderColor: "rgba(249,115,22,0.3)" }}>
            <div className="db-food-card__header">
              <span className="db-food-card__name">{task.food}</span>
              <span className="sp-badge sp-badge-claimed">Picked Up</span>
            </div>
            <div className="db-food-card__meta">
              <span>🏪 From: {task.from}</span>
              <span>🏠 Deliver to: {task.to}</span>
            </div>
            <button className="btn btn-accent" style={{ padding: "8px 18px", fontSize: "0.85rem", borderRadius: "8px" }}>
              ✅ Confirm Delivery
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
