import React, { StrictMode, useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { AdminApp } from './admin/AdminApp';
import { isAdminRoute } from './admin/adminRouting';
import './index.css';

const RootApp = () => {
  const [isAdmin, setIsAdmin] = useState(isAdminRoute);

  useEffect(() => {
    const handleLocationChange = () => {
      setIsAdmin(isAdminRoute());
    };
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  if (isAdmin) {
    return <AdminApp />;
  }

  return <App />;
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RootApp />
  </StrictMode>
);
