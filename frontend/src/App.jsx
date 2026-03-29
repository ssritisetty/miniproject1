import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AIChatbot from './components/AIChatbot';
import Home from './pages/Home';

import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import CustomerDashboard from './pages/CustomerDashboard';
import ProviderDashboard from './pages/ProviderDashboard';
import authService from './services/auth.service';

const ProtectedRoute = ({ children, role }) => {
  const user = authService.getCurrentUser();
  if (!user) {
    return <Navigate to="/login" />;
  }
  if (role && (!user.roles || !user.roles.includes(role))) {
    return <Navigate to="/" />;
  }
  return children;
};


function App() {
  return (

    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute role="ROLE_ADMIN">
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/provider/dashboard" 
            element={
              <ProtectedRoute role="ROLE_PROVIDER">
                <ProviderDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/customer/dashboard" 
            element={
              <ProtectedRoute role="ROLE_CUSTOMER">
                <CustomerDashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <Footer />
      <AIChatbot />
    </div>
  );
}


export default App;

