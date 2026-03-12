import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import { useTheme } from "../hooks/useTheme";
import "./DashboardLayout.css";

const NAV_ITEMS = {
  store: [
    { icon: "📋", label: "Overview", path: "/dashboard" },
    { icon: "➕", label: "Post Food", path: "/dashboard/post-food" },
    { icon: "🗂️", label: "My Listings", path: "/dashboard/listings" },
    { icon: "📬", label: "Requests", path: "/dashboard/requests" },
    { icon: "💬", label: "Messages", path: "/dashboard/messages" },
    { icon: "🔔", label: "Notifications", path: "/dashboard/notifications" },
  ],
  shelter: [
    { icon: "📋", label: "Overview", path: "/dashboard" },
    { icon: "🍱", label: "Browse Food", path: "/dashboard/browse" },
    { icon: "📦", label: "My Requests", path: "/dashboard/my-requests" },
    { icon: "🚗", label: "Track Delivery", path: "/dashboard/track" },
    { icon: "💬", label: "Messages", path: "/dashboard/messages" },
    { icon: "🔔", label: "Notifications", path: "/dashboard/notifications" },
  ],
  volunteer: [
    { icon: "📋", label: "Overview", path: "/dashboard" },
    { icon: "📦", label: "Deliveries", path: "/dashboard/deliveries" },
    { icon: "✅", label: "My Tasks", path: "/dashboard/tasks" },
    { icon: "🗺️", label: "Map View", path: "/dashboard/map" },
    { icon: "💬", label: "Messages", path: "/dashboard/messages" },
    { icon: "🔔", label: "Notifications", path: "/dashboard/notifications" },
  ],
};

const ROLE_LABELS = {
  store: "Store / Restaurant",
  shelter: "Shelter / Family",
  volunteer: "Volunteer",
};

const ROLE_COLORS = {
  store: "#16a34a",
  shelter: "#f97316",
  volunteer: "#6366f1",
};

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { socket } = useSocket();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifCount, setNotifCount] = useState(0);
  const [toast, setToast] = useState(null);

  // Global Socket Listener for Real-time Notifications
  useEffect(() => {
    if (!socket) return;

    const handleNotification = (data) => {
      setToast(data.message);
      setNotifCount((prev) => prev + 1);

      // Auto dismiss toast after 5 seconds
      setTimeout(() => setToast(null), 5000);
    };

    socket.on("new_food_available", handleNotification);
    socket.on("new_delivery_request", handleNotification);
    socket.on("delivery_updated", handleNotification);

    return () => {
      socket.off("new_food_available", handleNotification);
      socket.off("new_delivery_request", handleNotification);
      socket.off("delivery_updated", handleNotification);
    };
  }, [socket]);

  const navItems = NAV_ITEMS[user?.role] || [];
  const roleColor = ROLE_COLORS[user?.role] || "var(--primary)";

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className={`db-root${sidebarOpen ? "" : " db-root--collapsed"}`}>
      {/* SIDEBAR */}
      <aside className="db-sidebar">
        <div className="db-sidebar__header">
          <Link to="/" className="db-logo">
            <span>🌿</span>
            {sidebarOpen && <span>Share<strong>Plates</strong></span>}
          </Link>
          <button
            className="db-sidebar__toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? "◀" : "▶"}
          </button>
        </div>

        {/* Role Badge */}
        {sidebarOpen && (
          <div className="db-role-badge" style={{ "--rc": roleColor }}>
            <span>{user?.role === "store" ? "🏪" : user?.role === "shelter" ? "🏠" : "🚗"}</span>
            <span>{ROLE_LABELS[user?.role]}</span>
          </div>
        )}

        {/* Nav Links */}
        <nav className="db-nav">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`db-nav__item${isActive ? " db-nav__item--active" : ""}`}
                title={!sidebarOpen ? item.label : ""}
              >
                <span className="db-nav__icon">{item.icon}</span>
                {sidebarOpen && <span className="db-nav__label">{item.label}</span>}
                {item.label === "Notifications" && notifCount > 0 && sidebarOpen && (
                  <span className="db-nav__badge">{notifCount}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="db-sidebar__footer">
          <div className="db-user-info">
            <div className="sp-avatar" style={{ background: `linear-gradient(135deg, ${roleColor}, var(--accent))` }}>
              {initials}
            </div>
            {sidebarOpen && (
              <div className="db-user-text">
                <p className="db-user-name">{user?.name}</p>
                <p className="db-user-email">{user?.email}</p>
              </div>
            )}
          </div>
          <button className="db-logout-btn" onClick={handleLogout} title="Logout">
            <span>🚪</span>
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* MAIN AREA */}
      <div className="db-main">
        {/* Top Bar */}
        <header className="db-topbar">
          <div className="db-topbar__left">
            <button
              className="db-topbar__menu-btn"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle menu"
            >
              ☰
            </button>
            <div className="db-topbar__breadcrumb">
              <span>Dashboard</span>
            </div>
          </div>
          <div className="db-topbar__right">
            <button className="db-icon-btn" onClick={toggleTheme} title="Toggle Theme">
              {theme === "dark" ? "☀️" : "🌙"}
            </button>
            <button className="db-icon-btn" title="Notifications">
              🔔
              {notifCount > 0 && <span className="db-icon-btn__badge">{notifCount}</span>}
            </button>
            <div className="sp-avatar" style={{ background: `linear-gradient(135deg, ${roleColor}, var(--accent))`, width: 34, height: 34, fontSize: "0.8rem" }}>
              {initials}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="db-content">
          {children}
        </main>
      </div>

      {/* Realtime Toast Notification Overlay */}
      {toast && (
        <div 
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            backgroundColor: "var(--accent)",
            color: "#fff",
            padding: "16px 24px",
            borderRadius: "var(--radius-md)",
            boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            gap: "12px",
            animation: "slideIn 0.3s ease-out forwards"
          }}
        >
          <span style={{ fontSize: "1.2rem" }}>🔔</span>
          <span style={{ fontWeight: "500" }}>{toast}</span>
          <button 
            onClick={() => setToast(null)}
            style={{ 
              background: "none", 
              border: "none", 
              color: "rgba(255,255,255,0.7)", 
              marginLeft: "12px",
              cursor: "pointer",
              fontSize: "1rem" 
            }}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}

// Add a quick keyframe for the toast animation to the bottom of the layout
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
`;
document.head.appendChild(style);
