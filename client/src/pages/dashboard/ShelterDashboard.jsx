import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import FoodDetailsModal from "../../components/FoodDetailsModal";

export default function ShelterDashboard() {
  const { user } = useAuth();
  const [foods, setFoods] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [selectedFood, setSelectedFood] = useState(null);
  const [selectedReq, setSelectedReq] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [foodRes, reqRes] = await Promise.all([
        api.get("/food/available"),
        api.get("/requests/my-requests")
      ]);
      setFoods(foodRes.data);
      setRequests(reqRes.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleClaim = async (foodId) => {
    try {
      await api.post(`/requests/${foodId}`);
      fetchData(); // Refresh both lists
    } catch (error) {
      alert("Failed to claim food: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div>
      <h1 className="db-page-title">Hello, {user?.name?.split(" ")[0]} 👋</h1>
      <p className="db-page-sub">
        {user?.organizationName || "Your Shelter"} · Browse available food and track your pickups
      </p>

      {/* Stats */}
      <div className="db-stats-row">
        {[
          { icon: "🍱", value: foods.length, label: "Active Listings" },
          { icon: "📦", value: requests.length, label: "My Requests" },
          { icon: "🚗", value: requests.filter(r => r.status === "picked-up").length, label: "In Transit" },
          { icon: "✅", value: requests.filter(r => r.status === "delivered").length, label: "Received Total" },
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
      <p className="db-section-title">🍱 Available Food</p>
      
      {loading ? (
        <div className="sp-loading-screen" style={{ height: "120px" }}>
          <div className="sp-spinner" style={{ width: "30px", height: "30px", borderWidth: "2px" }}></div>
        </div>
      ) : foods.length === 0 ? (
        <div className="sp-card" style={{ marginBottom: "28px", textAlign: "center" }}>
          <p style={{ color: "var(--text-muted)" }}>No available food listings right now.</p>
        </div>
      ) : (
        <div className="db-food-grid" style={{ marginBottom: "28px" }}>
          {foods.map((item) => (
            <div key={item._id} className="db-food-card">
              <div className="db-food-card__header">
                <span className="db-food-card__name">{item.name}</span>
                <span className="sp-badge sp-badge-available">Available</span>
              </div>
              <div className="db-food-card__meta">
                <span>🏪 {item.store?.organizationName || "A Store"}</span>
                <span>🥡 {item.quantity} · ⏰ {new Date(item.expiryTime).toLocaleString()}</span>
                <span>📍 {item.pickupLocation}</span>
              </div>
              <div style={{ display: "flex", gap: "8px", marginTop: "auto", paddingTop: "12px" }}>
                <button 
                  onClick={() => setSelectedFood(item)}
                  className="btn btn-outline" 
                  style={{ flex: 1, padding: "8px 14px", fontSize: "0.85rem", borderRadius: "8px" }}
                >
                  View Details
                </button>
                <button 
                  onClick={() => handleClaim(item._id)}
                  className="btn btn-primary" 
                  style={{ flex: 1, padding: "8px 14px", fontSize: "0.85rem", borderRadius: "8px" }}
                >
                  Request Pickup
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* My Requests */}
      <p className="db-section-title">📦 My Requests</p>
      
      {loading ? null : requests.length === 0 ? (
        <div className="sp-card" style={{ textAlign: "center" }}>
          <p style={{ color: "var(--text-muted)" }}>You haven't requested any food yet.</p>
        </div>
      ) : (
        <div className="db-food-grid">
          {requests.map((r) => (
            <div key={r._id} className="db-food-card">
              <div className="db-food-card__header">
                <span className="db-food-card__name">{r.foodListing?.name || "Unknown Food"}</span>
                <span className={`sp-badge ${r.status !== "waiting" ? "sp-badge-claimed" : "sp-badge-available"}`}>
                  {r.status.toUpperCase()}
                </span>
              </div>
              <div className="db-food-card__meta">
                <span>🏪 {r.foodListing?.store?.organizationName}</span>
                <span>🚗 Volunteer: {r.volunteer ? r.volunteer.name : "Pending"}</span>
              </div>
              <button 
                onClick={() => setSelectedReq(r)}
                className="btn btn-outline" 
                style={{ padding: "8px 14px", fontSize: "0.85rem", borderRadius: "8px", marginTop: "8px" }}
              >
                Track Status
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Global Modals */}
      <FoodDetailsModal 
        isOpen={!!selectedFood} 
        onClose={() => setSelectedFood(null)} 
        data={selectedFood} 
        type="food" 
        actionButton={
          <button 
            onClick={() => {
              handleClaim(selectedFood._id);
              setSelectedFood(null);
            }} 
            className="btn btn-primary" 
            style={{ width: "100%", padding: "12px", fontSize: "1rem" }}
          >
            Confirm Request
          </button>
        }
      />
      
      <FoodDetailsModal 
        isOpen={!!selectedReq} 
        onClose={() => setSelectedReq(null)} 
        data={selectedReq} 
        type="request" 
      />
    </div>
  );
}
