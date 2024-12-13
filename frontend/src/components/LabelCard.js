import React from "react";

const LabelCard = ({ title, description }) => (
  <div className="bg-gray-800 p-4 rounded-lg shadow">
    <div className="flex justify-between items-center">
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-gray-400">{description}</p>
      </div>
      <div className="flex gap-2">
        <button className="text-blue-500 hover:underline">Edit</button>
        <button className="text-red-500 hover:underline">Delete</button>
      </div>
    </div>
  </div>
);

export default LabelCard;
