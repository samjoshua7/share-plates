import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import FoodDetailsModal from "../../components/FoodDetailsModal";

const STATUS_CLASS = {
  available: "sp-badge-available",
  claimed: "sp-badge-claimed",
  delivered: "sp-badge-delivered",
};

export default function StoreDashboard() {
  const { user } = useAuth();
  const [listings, setListings] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal & Edit States
  const [selectedFood, setSelectedFood] = useState(null);
  const [selectedReq, setSelectedReq] = useState(null);
  
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", quantity: "", pickupLocation: "" });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [listRes, reqRes] = await Promise.all([
        api.get("/food/my-listings"),
        api.get("/requests/store-requests")
      ]);
      setListings(listRes.data);
      setRequests(reqRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEditClick = (item) => {
    setEditingId(item._id);
    setEditForm({ name: item.name, quantity: item.quantity, pickupLocation: item.pickupLocation });
  };

  const handleEditSubmit = async (e, id) => {
    e.preventDefault();
    try {
      await api.put(`/food/${id}`, editForm);
      setEditingId(null);
      fetchData(); // Refresh UI
    } catch (err) {
      alert("Failed to update listing: " + (err.response?.data?.message || err.message));
    }
  };
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
          { icon: "🍱", value: listings.length, label: "Listings Posted" },
          { icon: "📬", value: listings.filter(l => l.status === "claimed").length, label: "Pending Requests" },
          { icon: "🚗", value: listings.filter(l => l.status === "picked-up").length, label: "Active Deliveries" },
          { icon: "✅", value: listings.filter(l => l.status === "delivered").length, label: "Meals Delivered" },
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
      <p className="db-section-title">📋 Active Listings</p>
      
      {loading ? (
        <div className="sp-loading-screen" style={{ height: "120px" }}>
          <div className="sp-spinner"></div>
        </div>
      ) : listings.length === 0 ? (
        <div className="sp-card" style={{ textAlign: "center", padding: "40px" }}>
          <p style={{ color: "var(--text-muted)" }}>You haven't posted any food yet.</p>
        </div>
      ) : (
        <div className="db-food-grid" style={{ marginBottom: "28px" }}>
          {listings.map((item) => (
            <div key={item._id} className="db-food-card" style={{ display: "flex", flexDirection: "column" }}>
              
              {/* If editing this particular card */}
              {editingId === item._id ? (
                <form onSubmit={(e) => handleEditSubmit(e, item._id)} style={{ display: "flex", flexDirection: "column", gap: "12px", height: "100%" }}>
                  <input 
                    type="text" className="sp-input" value={editForm.name} 
                    onChange={e => setEditForm({...editForm, name: e.target.value})} required 
                  />
                  <input 
                    type="text" className="sp-input" value={editForm.quantity} 
                    onChange={e => setEditForm({...editForm, quantity: e.target.value})} required 
                  />
                  <input 
                    type="text" className="sp-input" value={editForm.pickupLocation} 
                    onChange={e => setEditForm({...editForm, pickupLocation: e.target.value})} required 
                  />
                  <div style={{ display: "flex", gap: "8px", marginTop: "auto" }}>
                    <button type="submit" className="btn btn-primary" style={{ flex: 1, padding: "6px" }}>Save</button>
                    <button type="button" className="btn btn-outline" style={{ flex: 1, padding: "6px" }} onClick={() => setEditingId(null)}>Cancel</button>
                  </div>
                </form>
              ) : (
                // Standard View
                <>
                  <div className="db-food-card__header">
                    <span className="db-food-card__name">{item.name}</span>
                    <span className={`sp-badge ${STATUS_CLASS[item.status] || ''}`}>
                      {item.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="db-food-card__meta">
                    <span>🥡 Quantity: {item.quantity}</span>
                    <span>⏰ Expiry: {new Date(item.expiryTime).toLocaleString()}</span>
                  </div>
                  <div style={{ display: "flex", gap: "8px", marginTop: "auto" }}>
                    {item.status === "available" && (
                      <button 
                        onClick={() => handleEditClick(item)} 
                        className="btn btn-outline" 
                        style={{ flex: 1, padding: "6px", fontSize: "0.85rem", borderRadius: "6px" }}
                      >
                        Edit
                      </button>
                    )}
                    <button 
                      onClick={() => setSelectedFood(item)}
                      className="btn btn-outline" 
                      style={{ flex: item.status !== "available" ? 1 : undefined, padding: "6px 14px", fontSize: "0.85rem", borderRadius: "6px" }}
                    >
                      View Details
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Track Deliveries */}
      <p className="db-section-title">🚚 Outbound Deliveries</p>
      
      {!loading && requests.length === 0 ? (
        <div className="sp-card" style={{ textAlign: "center", padding: "24px" }}>
          <p style={{ color: "var(--text-muted)" }}>None of your food has been requested for delivery yet.</p>
        </div>
      ) : (
        <div className="db-food-grid">
          {requests.map((req) => (
            <div key={req._id} className="db-food-card" style={{ borderColor: req.status === "delivered" ? "var(--primary)" : "rgba(249,115,22,0.3)" }}>
              <div className="db-food-card__header">
                <span className="db-food-card__name">{req.foodListing?.name}</span>
                <span className={`sp-badge ${STATUS_CLASS[req.status] || ''}`}>
                  {req.status.toUpperCase()}
                </span>
              </div>
              <div className="db-food-card__meta">
                <span>🏠 To: {req.shelter?.organizationName}</span>
                <span>🚗 Driver: {req.volunteer?.name || "Pending Selection"}</span>
              </div>
              <button 
                onClick={() => setSelectedReq(req)}
                className="btn btn-outline" 
                style={{ padding: "6px 14px", fontSize: "0.85rem", borderRadius: "6px", marginTop: "8px" }}
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
