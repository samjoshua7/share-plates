import React from "react";
import { useAuth } from "../../context/AuthContext";

const AVAILABLE_FOOD = [
  { id: 1, name: "Sourdough Bread", store: "Sunrise Bakery", qty: "12 loaves", expiry: "Today 8PM", distance: "1.2 km" },
  { id: 2, name: "Rice & Curry", store: "Spice Garden", qty: "20 portions", expiry: "Today 7PM", distance: "0.8 km" },
  { id: 3, name: "Vegetable Box", store: "FreshMart", qty: "5 boxes", expiry: "Tomorrow 10AM", distance: "2.1 km" },
];

const MY_REQUESTS = [
  { id: 1, food: "Mixed Salad", volunteer: "Ravi K.", status: "in-transit" },
  { id: 2, food: "Pasta Bake", volunteer: "Pending", status: "waiting" },
];

export default function ShelterDashboard() {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="db-page-title">Hello, {user?.name?.split(" ")[0]} 👋</h1>
      <p className="db-page-sub">
        {user?.organizationName || "Your Shelter"} · Browse available food and track your pickups
      </p>

      {/* Stats */}
      <div className="db-stats-row">
        {[
          { icon: "🍱", value: 8, label: "Active Listings Nearby" },
          { icon: "📦", value: 3, label: "My Requests" },
          { icon: "🚗", value: 1, label: "In Transit" },
          { icon: "✅", value: 14, label: "Received Total" },
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

      {/* Available Food */}
      <p className="db-section-title">🍱 Available Food Nearby</p>
      <div className="db-food-grid" style={{ marginBottom: "28px" }}>
        {AVAILABLE_FOOD.map((item) => (
          <div key={item.id} className="db-food-card">
            <div className="db-food-card__header">
              <span className="db-food-card__name">{item.name}</span>
              <span className="sp-badge sp-badge-available">Available</span>
            </div>
            <div className="db-food-card__meta">
              <span>🏪 {item.store}</span>
              <span>🥡 {item.qty} · ⏰ {item.expiry}</span>
              <span>📍 {item.distance} away</span>
            </div>
            <button className="btn btn-primary" style={{ padding: "8px 18px", fontSize: "0.85rem", borderRadius: "8px" }}>
              Request Pickup
            </button>
          </div>
        ))}
      </div>

      {/* My Requests */}
      <p className="db-section-title">📦 My Requests</p>
      <div className="db-food-grid">
        {MY_REQUESTS.map((r) => (
          <div key={r.id} className="db-food-card">
            <div className="db-food-card__header">
              <span className="db-food-card__name">{r.food}</span>
              <span className={`sp-badge ${r.status === "in-transit" ? "sp-badge-claimed" : "sp-badge-available"}`}>
                {r.status === "in-transit" ? "In Transit" : "Waiting"}
              </span>
            </div>
            <div className="db-food-card__meta">
              <span>🚗 Volunteer: {r.volunteer}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
