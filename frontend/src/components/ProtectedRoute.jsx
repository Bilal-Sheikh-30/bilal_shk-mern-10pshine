import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const backendURL = globalThis.VITE_BACKEND_URL || 'http://localhost:3000';

export default function ProtectedRoute({ children }) {
  const [authenticated, setAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${backendURL}/auth/me`, {
          credentials: 'include',
        });
        const data = await res.json();
        localStorage.setItem('user', JSON.stringify(data.user));
        setAuthenticated(res.ok);
      } catch {
        setAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  if (authenticated === null) return <p>Loading...</p>;

  return authenticated ? children : <Navigate to="/login" />;
}
