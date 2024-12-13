import React from "react";

const ActionsUI = () => (
  <div className="p-6 bg-gray-900 text-white rounded-lg shadow-lg">
    <h3 className="text-xl font-bold mb-4">Configure automated actions</h3>
    <ul className="space-y-4">
      <li className="flex items-center justify-between bg-gray-800 p-4 rounded hover:bg-gray-700 cursor-pointer">
        <div className="flex items-center gap-3">
          <span>⭐</span>
          <span className="text-sm">Mark Important</span>
        </div>
        <span>→</span>
      </li>
      <li className="flex items-center justify-between bg-gray-800 p-4 rounded hover:bg-gray-700 cursor-pointer">
        <div className="flex items-center gap-3">
          <span>✏️</span>
          <span className="text-sm">Auto Draft</span>
        </div>
        <span>→</span>
      </li>
      <li className="flex items-center justify-between bg-gray-800 p-4 rounded hover:bg-gray-700 cursor-pointer">
        <div className="flex items-center gap-3">
          <span>↩️</span>
          <span className="text-sm">Auto Reply</span>
        </div>
        <span>→</span>
      </li>
      <li className="flex items-center justify-between bg-gray-800 p-4 rounded hover:bg-gray-700 cursor-pointer">
        <div className="flex items-center gap-3">
          <span>➡️</span>
          <span className="text-sm">Auto Forward</span>
        </div>
        <span>→</span>
      </li>
      <li className="flex items-center justify-between bg-gray-800 p-4 rounded hover:bg-gray-700 cursor-pointer">
        <div className="flex items-center gap-3">
          <span>📱</span>
          <span className="text-sm">Text Me</span>
        </div>
        <span>→</span>
      </li>
    </ul>
    <div className="flex gap-4 mt-6">
      <button className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600">
        Close
      </button>
      <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500">
        Delete Label
      </button>
    </div>
  </div>
);

export default ActionsUI;
