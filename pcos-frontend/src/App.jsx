import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Auth components
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// User pages (placeholders for now)
import { UserDashboard } from './pages/user/Dashboard';

// Doctor pages (placeholders for now)
import { DoctorDashboard } from './pages/doctor/DashboardDoctor';

// Shared components
import { LandingPage } from './pages/LandingPage';

const queryClient = new QueryClient();

function AppRoutes() {
  const { isAuthenticated, isDoctor } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={isAuthenticated ? <Navigate to={isDoctor ? "/doctor" : "/user"} replace /> : <LoginForm />} />
      <Route path="/register" element={isAuthenticated ? <Navigate to={isDoctor ? "/doctor" : "/user"} replace /> : <RegisterForm />} />

      {/* User Routes */}
      <Route path="/user/*" element={
        <ProtectedRoute requireRole="USER">
          <UserDashboard />
        </ProtectedRoute>
      } />

      {/* Doctor Routes */}
      <Route path="/doctor/*" element={
        <ProtectedRoute requireRole="DOCTOR">
          <DoctorDashboard />
        </ProtectedRoute>
      } />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
