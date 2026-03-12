import React from "react";
import FoodMap from "./FoodMap";
import ProgressTracker from "./ProgressTracker";

export default function FoodDetailsModal({ isOpen, onClose, data, type = "food", actionButton }) {
  if (!isOpen || !data) return null;

  // Data normalization depending on whether we passed a raw FoodListing (type="food") or a DeliveryRequest (type="request")
  const food = type === "request" ? data.foodListing : data;
  const store = food?.store;
  const volunteer = type === "request" ? data.volunteer : null;
  const shelter = type === "request" ? data.shelter : null;
  const status = type === "request" ? data.status : food?.status;

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      backdropFilter: "blur(4px)",
      zIndex: 9999,
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "20px"
    }}>
      <div style={{
        background: "var(--bg-surface)",
        width: "100%", maxWidth: "650px",
        maxHeight: "90vh", overflowY: "auto",
        borderRadius: "var(--radius-lg)",
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        animation: "slideUp 0.3s ease-out"
      }}>

        {/* Header */}
        <div style={{
          padding: "24px",
          borderBottom: "1px solid var(--border)",
          display: "flex", justifyContent: "space-between", alignItems: "flex-start"
        }}>
          <div>
            <h2 style={{ margin: 0, fontSize: "1.5rem", color: "var(--text-primary)" }}>{food?.name}</h2>
            <div style={{ display: "flex", gap: "12px", marginTop: "12px", flexWrap: "wrap" }}>
              <span className={`sp-badge sp-badge-${status === 'available' || status === 'waiting' ? 'available' : 'claimed'}`}>
                {status?.toUpperCase()}
              </span>
              <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "4px" }}>
                <span>📦</span> Quantity: {food?.quantity}
              </span>
              <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "4px" }}>
                <span>⏰</span> Expires: {food?.expiryTime ? new Date(food.expiryTime).toLocaleString() : "Unknown"}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "var(--bg-surface)", border: "1px solid var(--border)",
              width: "36px", height: "36px", borderRadius: "50%",
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              color: "var(--text-muted)", fontSize: "1.2rem", transition: "all 0.2s"
            }}
            onMouseOver={(e) => e.currentTarget.style.color = "var(--text-primary)"}
            onMouseOut={(e) => e.currentTarget.style.color = "var(--text-muted)"}
          >
            ✕
          </button>
        </div>

        {/* Body Content */}
        <div style={{ padding: "24px" }}>

          <ProgressTracker currentStatus={status} />

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px", marginTop: "24px" }}>

            {/* Left Column: Details */}
            <div>
              <h3 style={{ fontSize: "1rem", color: "var(--text-primary)", marginBottom: "12px" }}>📝 Description</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: "1.6", background: "var(--bg-surface)", padding: "16px", borderRadius: "var(--radius-md)", border: "1px solid var(--border)" }}>
                {food?.description || "No additional description provided."}
              </p>

              <h3 style={{ fontSize: "1rem", color: "var(--text-primary)", margin: "24px 0 12px 0" }}>🧑‍🤝‍🧑 Involved Parties</h3>
              <div style={{ background: "var(--bg-surface)", padding: "16px", borderRadius: "var(--radius-md)", border: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: "12px" }}>
                <div>
                  <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Donor Store</span>
                  <p style={{ margin: "4px 0 0 0", fontWeight: "500", color: "var(--text-primary)" }}>{store?.organizationName || store?.name || "Unknown Store"}</p>
                  {store?.address && <p style={{ margin: "2px 0 0 0", fontSize: "0.85rem", color: "var(--text-secondary)" }}>{store.address}</p>}
                </div>

                {shelter && (
                  <div style={{ paddingTop: "12px", borderTop: "1px dashed var(--border)" }}>
                    <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Requested By</span>
                    <p style={{ margin: "4px 0 0 0", fontWeight: "500", color: "var(--text-primary)" }}>{shelter.organizationName || shelter.name}</p>
                    {shelter.address && <p style={{ margin: "2px 0 0 0", fontSize: "0.85rem", color: "var(--text-secondary)" }}>{shelter.address}</p>}
                  </div>
                )}

                {volunteer && (
                  <div style={{ paddingTop: "12px", borderTop: "1px dashed var(--border)" }}>
                    <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Assigned Volunteer</span>
                    <p style={{ margin: "4px 0 0 0", fontWeight: "500", color: "var(--text-primary)" }}>{volunteer.name}</p>
                    {volunteer.phone && <p style={{ margin: "2px 0 0 0", fontSize: "0.85rem", color: "var(--text-secondary)" }}>📞 {volunteer.phone}</p>}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Location & Actions */}
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <div>
                <h3 style={{ fontSize: "1rem", color: "var(--text-primary)", marginBottom: "12px" }}>📍 Pickup Location</h3>
                <div style={{ background: "var(--bg-surface)", padding: "16px", borderRadius: "var(--radius-md)", border: "1px solid var(--border)" }}>
                  <p style={{ margin: "0 0 12px 0", color: "var(--text-secondary)", fontSize: "0.95rem" }}>
                    <strong>Instructions:</strong> {food?.pickupLocation}
                  </p>
                  {food?.coordinates?.lat ? (
                    <div style={{ pointerEvents: "none" }}>
                      <FoodMap coordinates={food.coordinates} />
                    </div>
                  ) : (
                    <div style={{ height: "150px", background: "var(--bg-base)", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "var(--radius-sm)", border: "1px dashed var(--border)" }}>
                      <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>No map coordinates provided</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Button Injector */}
              {actionButton && (
                <div style={{ marginTop: "auto" }}>
                  {actionButton}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
