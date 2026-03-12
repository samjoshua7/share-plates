import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const SAMPLE_LISTINGS = [
  { id: 1, name: "Sourdough Bread", qty: "12 loaves", expiry: "Today 8PM", status: "available" },
  { id: 2, name: "Mixed Salad", qty: "6 trays", expiry: "Today 6PM", status: "claimed" },
  { id: 3, name: "Pasta Bake", qty: "15 portions", expiry: "Tomorrow 12PM", status: "delivered" },
];

const STATUS_CLASS = {
  available: "sp-badge-available",
  claimed: "sp-badge-claimed",
  delivered: "sp-badge-delivered",
};

export default function StoreDashboard() {
  const { user } = useAuth();

  return (
    <div>
      {/* Welcome */}
      <h1 className="db-page-title">Welcome back, {user?.name?.split(" ")[0]} 👋</h1>
      <p className="db-page-sub">
        {user?.organizationName || "Your Store"} · Manage your food donations and track deliveries
      </p>

      {/* Stats */}
      <div className="db-stats-row">
        {[
          { icon: "🍱", value: 12, label: "Listings Posted" },
          { icon: "📬", value: 5, label: "Pending Requests" },
          { icon: "🚗", value: 3, label: "Active Deliveries" },
          { icon: "✅", value: 28, label: "Meals Delivered" },
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

      {/* Quick Action */}
      <div style={{ marginBottom: "28px" }}>
        <Link to="/dashboard/post-food" className="btn btn-primary">
          ➕ Post New Food Listing
        </Link>
      </div>

      {/* Recent Listings */}
      <p className="db-section-title">📋 Recent Listings</p>
      <div className="db-food-grid">
        {SAMPLE_LISTINGS.map((item) => (
          <div key={item.id} className="db-food-card">
            <div className="db-food-card__header">
              <span className="db-food-card__name">{item.name}</span>
              <span className={`sp-badge ${STATUS_CLASS[item.status]}`}>
                {item.status}
              </span>
            </div>
            <div className="db-food-card__meta">
              <span>🥡 Quantity: {item.qty}</span>
              <span>⏰ Expiry: {item.expiry}</span>
            </div>
            <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
              <button className="btn btn-outline" style={{ padding: "6px 14px", fontSize: "0.8rem", borderRadius: "8px" }}>
                Edit
              </button>
              <button className="btn btn-outline" style={{ padding: "6px 14px", fontSize: "0.8rem", borderRadius: "8px" }}>
                View Requests
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
