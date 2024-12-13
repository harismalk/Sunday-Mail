import React, { useState, useEffect } from "react";
import "./ActionsDialog.css";

export default function ActionsDialog({ open, onClose, automation, onActionsSaved }) {
  const [view, setView] = useState('list');
  const [currentAction, setCurrentAction] = useState(null);
  const [actionsState, setActionsState] = useState({});

  // Sync actionsState with automation.actions whenever automation changes
  useEffect(() => {
    if (automation) {
      setActionsState({ ...automation.actions });
    }
  }, [automation]);

  if (!open || !automation) return null;

  function handleActionClick(actionName) {
    setCurrentAction(actionName);
    setView('actionDetail');
  }

  async function handleDelete() {
    try {
      await fetch(`http://localhost:5001/api/automations/${automation._id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      onActionsSaved(automation._id, null); // Remove the automation from the parent component state
      onClose();
    } catch (error) {
      alert('Error deleting label: ' + error.message);
    }
  }

  async function handleSaveAction() {
    try {
      const updatedActions = { ...actionsState };

      const response = await fetch(`http://localhost:5001/api/automations/${automation._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ actions: updatedActions }),
      });

      if (!response.ok) {
        throw new Error('Failed to save actions');
      }

      const updatedAutomation = await response.json();
      onActionsSaved(automation._id, updatedAutomation.actions);
      setView('list');
      setCurrentAction(null);
    } catch (error) {
      alert('Error saving actions: ' + error.message);
    }
  }

  if (view === 'actionDetail' && currentAction) {
    // Render action detail form
    const actionEnabledKey = currentAction;
    const instructionsKey = currentAction + 'Instructions';
    const isEnabled = actionsState[actionEnabledKey] || false;
    const instructionsVal = actionsState[instructionsKey] || '';

    return (
      <div className="dialog-backdrop">
        <div className="dialog">
          <h2>{currentAction.charAt(0).toUpperCase() + currentAction.slice(1)}</h2>
          <label>
            <span>Enable {currentAction}</span>
            <input
              type="checkbox"
              checked={isEnabled}
              onChange={(e) =>
                setActionsState({ ...actionsState, [actionEnabledKey]: e.target.checked })
              }
            />
          </label>
          {(currentAction === 'autoDraft' ||
            currentAction === 'autoReply' ||
            currentAction === 'autoForward') && (
            <>
              <label>Custom Instructions</label>
              <textarea
                value={instructionsVal}
                onChange={(e) =>
                  setActionsState({ ...actionsState, [instructionsKey]: e.target.value })
                }
              />
              {currentAction === 'autoForward' && (
                <>
                  <label>Forward To</label>
                  <input
                    value={actionsState.forwardTo || ''}
                    onChange={(e) =>
                      setActionsState({ ...actionsState, forwardTo: e.target.value })
                    }
                  />
                </>
              )}
            </>
          )}
          {currentAction === 'textNotification' && (
            <>
              <label>Phone Number</label>
              <input
                value={actionsState.phoneNumber || ''}
                onChange={(e) =>
                  setActionsState({ ...actionsState, phoneNumber: e.target.value })
                }
              />
            </>
          )}
          <button className="btn" onClick={handleSaveAction}>
            Save Changes
          </button>
          <button
            className="btn-close"
            onClick={() => {
              setView('list');
              setCurrentAction(null);
            }}
          >
            Close
          </button>
          <button className="btn-danger" onClick={handleDelete}>
            Delete Label
          </button>
        </div>
      </div>
    );
  }

  // Main action list
  return (
    <div className="dialog-backdrop">
      <div className="dialog">
        <h2>Actions for {automation.label}</h2>
        <ul className="actions-list">
          <li onClick={() => handleActionClick('markImportant')}>Mark Important</li>
          <li onClick={() => handleActionClick('autoDraft')}>Auto Draft</li>
          <li onClick={() => handleActionClick('autoReply')}>Auto Reply</li>
          <li onClick={() => handleActionClick('autoForward')}>Auto Forward</li>
          <li onClick={() => handleActionClick('textNotification')}>Text Me</li>
        </ul>
        <button className="btn-close" onClick={onClose}>
          Close
        </button>
        <button className="btn-danger" onClick={handleDelete}>
          Delete Label
        </button>
      </div>
    </div>
  );
}
