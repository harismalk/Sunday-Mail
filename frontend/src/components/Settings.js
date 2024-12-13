export async function disconnectAccount() {
    try {
      const response = await fetch('http://localhost:5001/api/integrations/disconnect', {
        method: 'POST',
        credentials: 'include',
      });
  
      if (response.ok) {
        alert('Account disconnected successfully.');
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error disconnecting account:', error);
      alert('Failed to disconnect account.');
    }
  }
  