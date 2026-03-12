import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import FoodMap from "../../components/FoodMap";

export default function PostFood() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    quantity: "",
    expiryTime: "",
    pickupLocation: "",
    coordinates: null,
    description: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDetectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            coordinates: { lat: position.coords.latitude, lng: position.coords.longitude },
          });
        },
        (err) => {
          alert("Could not detect location. Please ensure location permissions are granted.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await api.post("/food", formData);
      // Navigate back to Store Dashboard after posting
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to post food");
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <button
        onClick={() => navigate("/dashboard")}
        className="btn btn-outline"
        style={{ padding: "8px 16px", marginBottom: "20px" }}
      >
        ← Back to Dashboard
      </button>

      <h1 className="db-page-title">Post Surplus Food 🍱</h1>
      <p className="db-page-sub">Fill out the details below to notify nearby shelters and volunteers.</p>

      {error && <div className="sp-form-error" style={{ marginBottom: "20px" }}>{error}</div>}

      <div className="sp-card">
        <form onSubmit={handleSubmit} className="auth-form" style={{ gap: "20px" }}>

          <div className="sp-form-group">
            <label>Food Title / Description</label>
            <input
              type="text"
              name="name"
              className="sp-input"
              placeholder="e.g. Sourdough Bread Loaves"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="auth-form-grid">
            <div className="sp-form-group">
              <label>Quantity</label>
              <input
                type="text"
                name="quantity"
                className="sp-input"
                placeholder="e.g. 12 loaves, 5 boxes"
                value={formData.quantity}
                onChange={handleChange}
                required
              />
            </div>

            <div className="sp-form-group">
              <label>Expiry / Best Before</label>
              <input
                type="datetime-local"
                name="expiryTime"
                className="sp-input"
                value={formData.expiryTime}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="sp-form-group">
            <label>Pickup Location Instructions</label>
            <input
              type="text"
              name="pickupLocation"
              className="sp-input"
              placeholder="e.g. Back loading dock, front counter"
              value={formData.pickupLocation}
              onChange={handleChange}
              required
            />
          </div>

          <div className="sp-form-group">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <label>Pinpoint Location on Map</label>
              <button
                type="button"
                className="btn btn-outline"
                style={{ padding: "6px 12px", fontSize: "0.8rem" }}
                onClick={handleDetectLocation}
              >
                📍 Detect My Location
              </button>
            </div>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "8px", marginTop: "4px" }}>
              Click on the map to drop a pin where the food is located.
            </p>
            <FoodMap
              coordinates={formData.coordinates}
              setCoordinates={(coords) => setFormData({ ...formData, coordinates: coords })}
            />
          </div>

          <div className="sp-form-group">
            <label>Additional Details (Optional)</label>
            <textarea
              name="description"
              className="sp-input"
              placeholder="Any allergy info or special handling required?"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              style={{ resize: "vertical" }}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={loading}
            style={{ marginTop: "10px", padding: "14px" }}
          >
            {loading ? "Posting..." : "🚀 Post Food Listing"}
          </button>

        </form>
      </div>
    </div>
  );
}
