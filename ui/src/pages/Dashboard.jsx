import { useKeycloak } from '@react-keycloak/web';
import { useEffect, useState } from 'react';

const Dashboard = () => {
  const { keycloak } = useKeycloak();
  const [data, setData] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
console.log(keycloak);
  useEffect(() => {
    if (keycloak?.authenticated && keycloak?.token) {
      protectedEndpoint();
    }
  }, [keycloak]); // Add keycloak to dependency array

  const protectedEndpoint = async () => {
    try {
      const response = await fetch("http://localhost:9090/api/protected", {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${keycloak.token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.text();
      setData(responseData);
    } catch (err) {
      setError(err.message || 'Failed to fetch protected data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading protected data...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="dashboard">
      <h1>Dashboard (Protected)</h1>
      <p>Welcome, {keycloak.tokenParsed?.preferred_username || 'User'}!</p>
      
      <div className="data-section">
        <h2>Protected Data:</h2>
        <pre>{data}</pre>
      </div>

      <button 
        onClick={() => keycloak.logout()}
        className="logout-button"
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
