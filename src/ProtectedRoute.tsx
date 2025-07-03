import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import React, { useEffect } from 'react';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  
  useEffect(() => {
    if (!loading && user !== null) {
      navigate('/main');
    }
  }, [loading, user]);

  if (loading || user === null) return null;

  return <>{children}</>;
};

export default ProtectedRoute;
