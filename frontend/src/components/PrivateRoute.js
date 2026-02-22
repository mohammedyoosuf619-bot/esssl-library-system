import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from './Layout';

const PrivateRoute = ({ children, librarianOnly = false }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh' 
    }}>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (librarianOnly && user.role !== 'librarian') {
    return <Navigate to="/dashboard" />;
  }

  return <Layout>{children}</Layout>;
};

export default PrivateRoute;