import React from "react";
import { useAuth } from "../../context/AuthContext";
import DashboardLayout from "../../components/DashboardLayout";
import StoreDashboard from "./StoreDashboard";
import ShelterDashboard from "./ShelterDashboard";
import VolunteerDashboard from "./VolunteerDashboard";

export default function DashboardPage() {
  const { user } = useAuth();

  const renderDashboard = () => {
    switch (user?.role) {
      case "store": return <StoreDashboard />;
      case "shelter": return <ShelterDashboard />;
      case "volunteer": return <VolunteerDashboard />;
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
      {renderDashboard()}
    </DashboardLayout>
  );
}
