import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    users: 0,
    foods: 0,
    requests: 0,
    delivered: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app we'd have a specific admin aggregate endpoint
    // For the hackathon, we fetch all data to count it.
    const fetchAdminStats = async () => {
      try {
        setLoading(true);
        // Note: For demo, leveraging available/open endpoints where possible
        // but adding an admin bypass might be needed. Let's assume standard endpoints 
        // return global data if the role is 'admin' (which we will add).
        const [usersRes, foodRes, reqRes] = await Promise.all([
          api.get("/users"), // Assume we create this
          api.get("/food/all"), // Assume we create this
          api.get("/requests/all") // Assume we create this
        ]);
        
        setStats({
          users: usersRes.data.length,
          foods: foodRes.data.length,
          requests: reqRes.data.length,
          delivered: reqRes.data.filter(r => r.status === "delivered").length
        });
      } catch (err) {
        console.error("Admin stat fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminStats();
  }, []);

  return (
    <div>
      <h1 className="db-page-title">System Overview 🛡️</h1>
      <p className="db-page-sub">Admin control panel: {user?.email}</p>

      {/* Stats */}
      <div className="db-stats-row">
        {[
          { icon: "👥", value: loading ? "..." : stats.users, label: "Total Users" },
          { icon: "🍱", value: loading ? "..." : stats.foods, label: "Total Food Lists" },
          { icon: "📦", value: loading ? "..." : stats.requests, label: "Total Deliveries" },
          { icon: "✅", value: loading ? "..." : stats.delivered, label: "Successfully Delivered" },
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

      <div className="sp-card" style={{ marginTop: "24px", padding: "40px", textAlign: "center" }}>
        <p style={{ color: "var(--text-muted)" }}>
          Global monitoring features and user account controls will appear here.
        </p>
      </div>
    </div>
  );
}
