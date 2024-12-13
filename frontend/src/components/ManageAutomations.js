import React from "react";
import LabelCard from "./LabelCard";

const ManageAutomations = () => (
  <div className="flex-1 p-6 bg-gray-900 text-white">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold">Manage Automations</h2>
      <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        + Create New Label
      </button>
    </div>
    <div className="space-y-4">
      <LabelCard
        title="Investor Email"
        description="Emails from investors who want to book a meeting to invest in Sunday"
      />
    </div>
  </div>
);

export default ManageAutomations;
