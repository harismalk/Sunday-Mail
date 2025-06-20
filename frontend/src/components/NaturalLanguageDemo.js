import React, { useState } from 'react';

export default function NaturalLanguageDemo() {
  const [demoInstructions, setDemoInstructions] = useState('');
  const [generatedActions, setGeneratedActions] = useState(null);

  const demoExamples = [
    {
      title: "Invoice Processing",
      instruction: "Label all invoices as 'Finance' and draft a professional thank you reply",
      expectedActions: {
        markImportant: false,
        autoDraft: true,
        autoDraftInstructions: "professional thank you reply",
        autoReply: false,
        autoForward: false,
        textNotification: false
      }
    },
    {
      title: "Urgent Email Handling",
      instruction: "Mark urgent emails as important and forward them to manager@company.com",
      expectedActions: {
        markImportant: true,
        autoDraft: false,
        autoReply: false,
        autoForward: true,
        forwardTo: "manager@company.com",
        textNotification: false
      }
    },
    {
      title: "Meeting Requests",
      instruction: "Auto-reply to meeting requests with my availability and send me a text notification",
      expectedActions: {
        markImportant: false,
        autoDraft: false,
        autoReply: true,
        autoReplyInstructions: "with my availability",
        autoForward: false,
        textNotification: true
      }
    }
  ];

  const simulateProcessing = (instruction) => {
    setDemoInstructions(instruction);
    
    // Simulate AI processing delay
    setTimeout(() => {
      const example = demoExamples.find(ex => ex.instruction === instruction);
      if (example) {
        setGeneratedActions(example.expectedActions);
      }
    }, 1500);
  };

  return (
    <div className="demo-container">
      <h2>Natural Language Instructions Demo</h2>
      <p>See how natural language instructions automatically populate action dialogs:</p>

      <div className="demo-examples">
        <h3>Try these examples:</h3>
        {demoExamples.map((example, index) => (
          <div key={index} className="demo-example">
            <h4>{example.title}</h4>
            <p className="demo-instruction">{example.instruction}</p>
            <button 
              className="btn-demo"
              onClick={() => simulateProcessing(example.instruction)}
            >
              Process This Instruction
            </button>
          </div>
        ))}
      </div>

      {demoInstructions && (
        <div className="demo-result">
          <h3>Processing: "{demoInstructions}"</h3>
          {!generatedActions ? (
            <div className="processing">🤖 AI is processing your instructions...</div>
          ) : (
            <div className="actions-preview">
              <h4>Generated Actions:</h4>
              <div className="actions-grid">
                {Object.entries(generatedActions).map(([action, value]) => (
                  <div key={action} className={`action-item ${value ? 'enabled' : 'disabled'}`}>
                    <span className="action-name">{action}</span>
                    <span className="action-value">
                      {typeof value === 'boolean' ? (value ? '✅' : '❌') : value}
                    </span>
                  </div>
                ))}
              </div>
              <p className="demo-note">
                These actions would be automatically configured in the Actions Dialog!
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 