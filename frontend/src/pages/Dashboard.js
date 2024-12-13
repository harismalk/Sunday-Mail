import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EmailList from '../components/EmailList';

function Dashboard() {
  const [emails, setEmails] = useState([]);

  useEffect(() => {
    axios.get('/api/emails')
      .then((res) => setEmails(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      <EmailList emails={emails} />
    </div>
  );
}

export default Dashboard;
