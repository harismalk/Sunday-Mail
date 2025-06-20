// frontend/src/components/ActionsDialog.js
import React, { useState, useEffect } from "react";
import "./ActionsDialog.css";

const DISPLAY_NAMES = {
  markImportant:    "Mark Important",
  autoDraft:        "Auto Draft",
  autoReply:        "Auto Reply",
  autoForward:      "Auto Forward",
  textNotification: "Text Notification",
};

const ACTION_ICONS = {
  markImportant:    "⭐",
  autoDraft:        "✏️",
  autoReply:        "↩️",
  autoForward:      "➡️",
  textNotification: "📱",
};

export default function ActionsDialog({ open, onClose, automation, onActionsSaved }) {
  const [view, setView]                     = useState("list");
  const [currentAction, setCurrentAction]   = useState(null);
  const [actionsState, setActionsState]     = useState({});

  // Sync incoming automation.actions into local state
  useEffect(() => {
    if (automation) setActionsState({ ...automation.actions });
  }, [automation]);

  if (!open || !automation) return null;

  function handleActionClick(name) {
    setCurrentAction(name);
    setView("actionDetail");
  }

  async function handleDelete() {
    await fetch(`http://localhost:5001/api/automations/${automation._id}`, {
      method: "DELETE",
      credentials: "include",
    });
    onActionsSaved(automation._id, null);
    onClose();
  }

  async function handleSaveAction() {
    const res = await fetch(
      `http://localhost:5001/api/automations/${automation._id}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ actions: actionsState }),
      }
    );
    const updated = await res.json();
    onActionsSaved(automation._id, updated.actions);
    setView("list");
    setCurrentAction(null);
  }

  // Helper function to check if an action has custom instructions
  const hasCustomInstructions = (actionName) => {
    const instructionsKey = `${actionName}Instructions`;
    return actionsState[instructionsKey] && actionsState[instructionsKey].trim() !== '';
  };

  // Helper function to get action status
  const getActionStatus = (actionName) => {
    const isEnabled = !!actionsState[actionName];
    const hasInstructions = hasCustomInstructions(actionName);
    
    if (isEnabled && hasInstructions) return "configured";
    if (isEnabled) return "enabled";
    return "disabled";
  };

  // — Detail View —
  if (view === "actionDetail" && currentAction) {
    const enabledKey      = currentAction;
    const instructionsKey = `${currentAction}Instructions`;
    const isEnabled       = !!actionsState[enabledKey];
    const instrVal        = actionsState[instructionsKey] || "";
    const label           = DISPLAY_NAMES[currentAction] || currentAction;
    const icon            = ACTION_ICONS[currentAction] || "⚙️";

    return (
      <div className="dialog-backdrop">
        <div className="dialog dialog-large">
          <h2>
            {icon} {label}
            {hasCustomInstructions(currentAction) && (
              <span className="status-badge configured">Configured</span>
            )}
          </h2>

          <div className="field-group">
            <label>
              <input
                type="checkbox"
                checked={isEnabled}
                onChange={e =>
                  setActionsState({
                    ...actionsState,
                    [enabledKey]: e.target.checked,
                  })
                }
              />
              {" "}Enable {label}
            </label>
          </div>

          {["autoDraft", "autoReply", "autoForward"].includes(currentAction) && (
            <div className="field-group">
              <label>Custom Instructions</label>
              <textarea
                value={instrVal}
                onChange={e =>
                  setActionsState({
                    ...actionsState,
                    [instructionsKey]: e.target.value,
                  })
                }
                placeholder={`Enter custom instructions for ${label.toLowerCase()}...`}
              />
              {instrVal && (
                <div className="instruction-preview">
                  <strong>Preview:</strong> {instrVal}
                </div>
              )}
            </div>
          )}

          {currentAction === "autoForward" && (
            <div className="field-group">
              <label>Forward To</label>
              <input
                type="email"
                value={actionsState.forwardTo || ""}
                onChange={e =>
                  setActionsState({
                    ...actionsState,
                    forwardTo: e.target.value,
                  })
                }
                placeholder="Enter email address to forward to..."
              />
            </div>
          )}

          {currentAction === "textNotification" && (
            <div className="field-group">
              <label>Phone Number</label>
              <input
                type="tel"
                value={actionsState.phoneNumber || ""}
                onChange={e =>
                  setActionsState({
                    ...actionsState,
                    phoneNumber: e.target.value,
                  })
                }
                placeholder="Enter phone number for notifications..."
              />
            </div>
          )}

          <div className="button-row">
            <button className="btn" onClick={handleSaveAction}>
              Save Changes
            </button>
            <button
              className="btn-close"
              onClick={() => {
                setView("list");
                setCurrentAction(null);
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  // — List View —
  return (
    <div className="dialog-backdrop">
      <div className="dialog dialog-large">
        <h2>Actions for {automation.label}</h2>
        <p className="dialog-subtitle">
          Configure automated actions for emails matching this automation
        </p>
        <ul className="actions-list">
          {Object.entries(DISPLAY_NAMES).map(([key, name]) => {
            const status = getActionStatus(key);
            const icon = ACTION_ICONS[key];
            const isEnabled = !!actionsState[key];
            const hasInstructions = hasCustomInstructions(key);
            
            return (
              <li 
                key={key} 
                onClick={() => handleActionClick(key)}
                className={`action-item ${status}`}
              >
                <div className="action-content">
                  <span className="action-icon">{icon}</span>
                  <div className="action-details">
                    <span className="action-name">{name}</span>
                    {isEnabled && hasInstructions && (
                      <span className="action-instructions">
                        {actionsState[`${key}Instructions`]}
                      </span>
                    )}
                    {key === "autoForward" && isEnabled && actionsState.forwardTo && (
                      <span className="action-forward-to">
                        → {actionsState.forwardTo}
                      </span>
                    )}
                    {key === "textNotification" && isEnabled && actionsState.phoneNumber && (
                      <span className="action-phone">
                        → {actionsState.phoneNumber}
                      </span>
                    )}
                  </div>
                </div>
                <div className="action-status">
                  {status === "configured" && <span className="status-badge configured">✓</span>}
                  {status === "enabled" && <span className="status-badge enabled">•</span>}
                  {status === "disabled" && <span className="status-badge disabled">○</span>}
                </div>
              </li>
            );
          })}
        </ul>
        <div className="button-row">
          <button className="btn-close" onClick={onClose}>
            Close
          </button>
          <button className="btn-danger" onClick={handleDelete}>
            Delete Label
          </button>
        </div>
      </div>
    </div>
  );
}