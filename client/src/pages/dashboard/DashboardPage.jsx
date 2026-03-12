import React from "react";
import { useAuth } from "../../context/AuthContext";
import DashboardLayout from "../../components/DashboardLayout";
import StoreDashboard from "./StoreDashboard";
import ShelterDashboard from "./ShelterDashboard";
import VolunteerDashboard from "./VolunteerDashboard";
import AdminDashboard from "./AdminDashboard";
import PostFood from "./PostFood";
import Messages from "./Messages";
import { Routes, Route, Navigate } from "react-router-dom";

export default function DashboardPage() {
  const { user } = useAuth();

  const renderDashboard = () => {
    switch (user?.role) {
      case "store": return <StoreDashboard />;
      case "shelter": return <ShelterDashboard />;
      case "volunteer": return <VolunteerDashboard />;
      case "admin": return <AdminDashboard />;
      default: return (
        <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>
          <p style={{ fontSize: "3rem" }}>🤔</p>
          <p>Unknown role. Please contact support.</p>
        </div>
      );
    }
  };

  return (
    <DashboardLayout>
      <Routes>
        {/* Exact Core Pages */}
        <Route path="/" element={renderDashboard()} />
        <Route path="/post-food" element={<PostFood />} />
        <Route path="/messages" element={<Messages />} />
        
        {/* 
          Catch-all fallback so Sidebar items like "/dashboard/deliveries", 
          "/dashboard/requests", etc. don't go blank. 
          They instead render the Main overview until they are built as standalone pages 
        */}
        <Route path="*" element={renderDashboard()} />
      </Routes>
    </DashboardLayout>
  );
}
