import React, { useState } from "react";

const AutoDraftSettings = () => {
  const [enabled, setEnabled] = useState(false);
  const [instructions, setInstructions] = useState(
    "Create a draft to the investor saying we are excited to meet with them and to book a time here: https://cal.com/example"
  );

  return (
    <div className="p-6 bg-gray-900 text-white rounded-lg">
      <h3 className="text-lg font-bold mb-4">Auto Draft</h3>
      <label className="flex items-center gap-4 mb-4">
        <span className="text-gray-400">Enable Auto Draft</span>
        <input
          type="checkbox"
          className="w-6 h-6"
          checked={enabled}
          onChange={() => setEnabled(!enabled)}
        />
      </label>
      <textarea
        value={instructions}
        onChange={(e) => setInstructions(e.target.value)}
        className="w-full p-4 bg-gray-800 text-white rounded-lg"
        rows="4"
      ></textarea>
      <button className="mt-4 bg-blue-600 px-4 py-2 rounded hover:bg-blue-700">
        Save Changes
      </button>
    </div>
  );
};

export default AutoDraftSettings;
