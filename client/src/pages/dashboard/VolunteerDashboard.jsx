import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import FoodDetailsModal from "../../components/FoodDetailsModal";

export default function VolunteerDashboard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [selectedTask, setSelectedTask] = useState(null);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await api.get("/requests/open");
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAction = async (id, action) => {
    try {
      await api.put(`/requests/${id}/state`, { action });
      fetchTasks();
    } catch (err) {
      alert("Error: " + (err.response?.data?.message || err.message));
    }
  };

  const openTasks = tasks.filter((t) => t.status === "waiting");
  const myTasks = tasks.filter((t) => t.status !== "waiting" && t.status !== "delivered");

  return (
    <div>
      <h1 className="db-page-title">Ready to deliver, {user?.name?.split(" ")[0]}? 🚗</h1>
      <p className="db-page-sub">Check delivery requests and accept tasks near you</p>

      {/* Stats */}
      <div className="db-stats-row">
        {[
          { icon: "📦", value: openTasks.length, label: "Open Requests" },
          { icon: "🚗", value: myTasks.length, label: "Active Delivery" },
          { icon: "✅", value: tasks.filter(t => t.status === "delivered").length, label: "Completed Trips" },
          { icon: "⭐", value: "5.0", label: "Rating" },
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
      
      {loading ? (
        <div className="sp-loading-screen" style={{ height: "120px" }}>
          <div className="sp-spinner" style={{ width: "30px", height: "30px", borderWidth: "2px" }}></div>
        </div>
      ) : openTasks.length === 0 ? (
        <div className="sp-card" style={{ marginBottom: "28px", textAlign: "center" }}>
          <p style={{ color: "var(--text-muted)" }}>No open requests right now. Check back later!</p>
        </div>
      ) : (
        <div className="db-food-grid" style={{ marginBottom: "28px" }}>
          {openTasks.map((task) => (
            <div key={task._id} className="db-food-card">
              <div className="db-food-card__header">
                <span className="db-food-card__name">{task.foodListing?.name}</span>
                <span className="sp-badge sp-badge-available">Open</span>
              </div>
              <div className="db-food-card__meta">
                <span>🏪 Pickup: {task.foodListing?.store?.organizationName}</span>
                <span>🏠 Drop: {task.shelter?.organizationName}</span>
              </div>
              <div style={{ display: "flex", gap: "8px", marginTop: "auto", paddingTop: "12px" }}>
                <button 
                  onClick={() => setSelectedTask(task)}
                  className="btn btn-outline" 
                  style={{ flex: 1, padding: "8px 14px", fontSize: "0.85rem", borderRadius: "8px" }}
                >
                  View Details
                </button>
                <button 
                  onClick={() => handleAction(task._id, "accept")}
                  className="btn btn-primary" 
                  style={{ flex: 1, padding: "8px 14px", fontSize: "0.85rem", borderRadius: "8px" }}
                >
                  Accept Task
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Active Task */}
      <p className="db-section-title">🚗 My Active Tasks</p>
      
      {!loading && myTasks.length === 0 ? (
        <div className="sp-card" style={{ textAlign: "center" }}>
          <p style={{ color: "var(--text-muted)" }}>You have no active tasks.</p>
        </div>
      ) : (
        <div className="db-food-grid">
          {myTasks.map((task) => (
            <div key={task._id} className="db-food-card" style={{ borderColor: task.status === "assigned" ? "var(--primary)" : "rgba(249,115,22,0.3)" }}>
              <div className="db-food-card__header">
                <span className="db-food-card__name">{task.foodListing?.name}</span>
                <span className={task.status === "assigned" ? "sp-badge sp-badge-available" : "sp-badge sp-badge-claimed"}>
                  {task.status.toUpperCase()}
                </span>
              </div>
              <div className="db-food-card__meta">
                <span>🏪 From: {task.foodListing?.store?.organizationName}</span>
                <span>🏠 Deliver to: {task.shelter?.organizationName}</span>
              </div>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "auto", paddingTop: "12px" }}>
                <button 
                  onClick={() => setSelectedTask(task)}
                  className="btn btn-outline" 
                  style={{ padding: "8px 14px", fontSize: "0.85rem", borderRadius: "8px" }}
                >
                  View Details
                </button>
                
                {task.status === "assigned" ? (
                  <button 
                    onClick={() => handleAction(task._id, "pickup")}
                    className="btn btn-outline" 
                    style={{ padding: "8px 14px", fontSize: "0.85rem", borderRadius: "8px" }}
                  >
                    Confirm Pickup
                  </button>
                ) : (
                  <button 
                    onClick={() => handleAction(task._id, "deliver")}
                    className="btn btn-accent" 
                    style={{ padding: "8px 14px", fontSize: "0.85rem", borderRadius: "8px" }}
                  >
                    ✅ Confirm Delivery
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Global Modal */}
      <FoodDetailsModal 
        isOpen={!!selectedTask} 
        onClose={() => setSelectedTask(null)} 
        data={selectedTask} 
        type="request" 
        actionButton={
          selectedTask?.status === "waiting" ? (
            <button 
              onClick={() => {
                handleAction(selectedTask._id, "accept");
                setSelectedTask(null);
              }} 
              className="btn btn-primary" 
              style={{ width: "100%", padding: "12px", fontSize: "1rem" }}
            >
              Accept Delivery Task
            </button>
          ) : selectedTask?.status === "assigned" ? (
            <button 
              onClick={() => {
                handleAction(selectedTask._id, "pickup");
                setSelectedTask(null);
              }} 
              className="btn btn-outline" 
              style={{ width: "100%", padding: "12px", fontSize: "1rem" }}
            >
              Confirm Package Pickup
            </button>
          ) : selectedTask?.status === "picked-up" ? (
            <button 
              onClick={() => {
                handleAction(selectedTask._id, "deliver");
                setSelectedTask(null);
              }} 
              className="btn btn-accent" 
              style={{ width: "100%", padding: "12px", fontSize: "1rem" }}
            >
              ✅ Confirm Delivered
            </button>
          ) : null
        }
      />
    </div>
  );
}
