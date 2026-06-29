/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AppProvider, useAppContext } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import { Home } from './pages/Home';
import { Admin } from './pages/Admin';
import { ProductDetails } from './pages/ProductDetails';
import { CategoryPage } from './pages/CategoryPage';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { MobileBottomNav } from './components/MobileBottomNav';

function AppLayout() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const { settings, isDemoMode } = useAppContext();

  return (
    <div className={isAdmin ? "" : "pb-[64px] md:pb-0"}>
      {settings.customCss && (
        <style>{settings.customCss}</style>
      )}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<CategoryPage />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
      {!isAdmin && <MobileBottomNav />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <Router>
          <AppLayout />
        </Router>
      </AppProvider>
    </AuthProvider>
  );
}
