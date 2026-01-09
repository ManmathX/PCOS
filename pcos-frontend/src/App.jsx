import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';

// Auth components
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// User pages (placeholders for now)
import { UserDashboard } from './pages/user/Dashboard';
import { NotificationsPage } from './pages/user/NotificationsPage';

// Shared components
import { LandingPage } from './pages/LandingPage';
import { AIAssistant } from './components/AIAssistant';
import { VoiceOnboarding } from './pages/VoiceOnboarding';
import { OnboardingReport } from './pages/OnboardingReport';

const queryClient = new QueryClient();

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={isAuthenticated ? <Navigate to="/user" replace /> : <LoginForm />} />
      <Route path="/register" element={<RegisterForm />} />

      {/* User Routes */}
      <Route path="/user/notifications" element={
        <ProtectedRoute requireRole="USER">
          <NotificationsPage />
        </ProtectedRoute>
      } />
      <Route path="/user/*" element={
        <ProtectedRoute requireRole="USER">
          <UserDashboard />
        </ProtectedRoute>
      } />

      {/* Onboarding Route */}
      <Route path="/onboarding" element={
        <ProtectedRoute requireRole="USER">
          <VoiceOnboarding />
        </ProtectedRoute>
      } />

      {/* Report Route */}
      <Route path="/onboarding/report/:reportId" element={
        <ProtectedRoute requireRole="USER">
          <OnboardingReport />
        </ProtectedRoute>
      } />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes >
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <NotificationProvider>
            <AppRoutes />
            <AIAssistant />
          </NotificationProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
