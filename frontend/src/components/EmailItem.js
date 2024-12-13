import React from 'react';

function EmailItem({ email }) {
  return (
    <div>
      <h3>{email.subject}</h3>
      <p>{email.body}</p>
    </div>
  );
}

export default EmailItem;
