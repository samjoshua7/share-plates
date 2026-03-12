import React from "react";

export default function ProgressTracker({ currentStatus }) {
  // Define the master flow of states
  // For FoodListing it starts at 'available', then 'claimed' (which maps to request 'waiting')
  // For DeliveryRequest it goes: waiting -> assigned -> picked-up -> delivered
  
  const steps = [
    { id: "available", label: "Posted" },
    { id: "waiting", label: "Requested" },
    { id: "assigned", label: "Assigned" },
    { id: "picked-up", label: "Picked Up" },
    { id: "delivered", label: "Delivered" }
  ];

  // Map "claimed" food status to "waiting" request status for visual continuity
  const normalizedStatus = currentStatus === "claimed" ? "waiting" : currentStatus;

  // Find the index of the current status
  const currentIndex = steps.findIndex(s => s.id === normalizedStatus);

  return (
    <div style={{ margin: "24px 0", padding: "16px", background: "var(--bg-surface)", borderRadius: "var(--radius-md)", border: "1px solid var(--border)" }}>
      <p style={{ margin: "0 0 16px 0", fontWeight: "600", color: "var(--text-primary)", fontSize: "0.95rem" }}>
        Delivery Progress
      </p>
      
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative" }}>
        {/* Progress Line Background */}
        <div style={{ position: "absolute", top: "14px", left: "10%", right: "10%", height: "4px", background: "var(--border)", zIndex: 0, borderRadius: "2px" }} />
        
        {/* Active Progress Line */}
        <div style={{ 
          position: "absolute", 
          top: "14px", 
          left: "10%", 
          width: `${Math.max(0, (currentIndex / (steps.length - 1)) * 80)}%`, 
          height: "4px", 
          background: "var(--primary)", 
          zIndex: 1, 
          borderRadius: "2px",
          transition: "width 0.4s ease"
        }} />

        {/* Steps */}
        {steps.map((step, index) => {
          const isCompleted = index <= currentIndex;
          const isActive = index === currentIndex;
          
          return (
            <div key={step.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", zIndex: 2, width: "20%" }}>
              <div style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                background: isCompleted ? "var(--primary)" : "var(--bg)",
                border: `3px solid ${isCompleted ? "var(--primary)" : "var(--border)"}`,
                color: isCompleted ? "#fff" : "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                fontSize: "0.9rem",
                boxShadow: isActive ? "0 0 0 4px rgba(22, 163, 74, 0.2)" : "none",
                transition: "all 0.3s ease"
              }}>
                {isCompleted ? "✓" : ""}
              </div>
              <span style={{ 
                marginTop: "8px", 
                fontSize: "0.75rem", 
                fontWeight: isActive ? "700" : "500",
                color: isCompleted ? "var(--text-primary)" : "var(--text-muted)",
                textAlign: "center"
              }}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
