import React, { useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import AutomationsCard from "../components/AutomationsCard";
import ActionsDialog from "../components/ActionsDialog";

export default function Automations() {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <div className="page">
      <Sidebar />
      <div className="page-content">
        <Header title="Manage Automations" />
        <AutomationsCard
          onEdit={() => console.log("Edit clicked")}
          onActions={() => setShowDialog(true)}
        />
        <ActionsDialog open={showDialog} onClose={() => setShowDialog(false)} />
      </div>
    </div>
  );
}
