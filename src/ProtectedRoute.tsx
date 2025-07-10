import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import React, { useEffect } from 'react';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  useEffect(() => {
    if (user !== null) {
      navigate('/main');
    }
  }, [user]);

  if (user === null) return null;

  return <>{children}</>;
};

export default ProtectedRoute;
