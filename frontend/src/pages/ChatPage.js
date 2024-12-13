import React, { useState } from 'react';
import { sendChatMessage } from '../services/api';

export default function ChatPage() {
  const [message, setMessage] = useState('');
  const [responses, setResponses] = useState([]);

  async function handleSend() {
    const res = await sendChatMessage(message);
    setResponses([...responses, {user: message, assistant: res.response}]);
    setMessage('');
  }

  return (
    <div>
      <h1>Chat with Your Assistant</h1>
      <div style={{maxHeight: '300px', overflowY: 'auto'}}>
        {responses.map((r, i) => (
          <div key={i}>
            <p><strong>You:</strong> {r.user}</p>
            <p><strong>Sunday:</strong> {r.assistant}</p>
            <hr/>
          </div>
        ))}
      </div>
      <input 
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Ask Sunday to do something..."
      />
      <button className="btn" onClick={handleSend}>Send</button>
    </div>
  );
}
