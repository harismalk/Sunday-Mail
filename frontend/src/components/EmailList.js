import React from 'react';
import EmailItem from './EmailItem';

function EmailList({ emails }) {
  return (
    <div>
      {emails.map((email) => (
        <EmailItem key={email.id} email={email} />
      ))}
    </div>
  );
}

export default EmailList;
