import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import TaskHistory from './pages/TaskHistory';
import Profile from './pages/Profile';
import Achievements from './pages/Achievements';
import TestSheet from './pages/TestSheet';
import NotFound from './pages/NotFound';
import Header from './components/Header';
import { ThemeProvider } from './context/ThemeContext';
import OfflineIndicator from './components/OfflineIndicator';
import ErrorBoundary from './components/ErrorBoundary';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();

  if (process.env.NODE_ENV === 'development') {
    console.log('PrivateRoute - loading:', loading, 'user:', user?.id);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-primary-dark">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-secondary mb-2"></div>
          <div className="text-sm font-sans text-primary dark:text-white">Checking authentication...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    if (process.env.NODE_ENV === 'development') {
      console.log('PrivateRoute - No user, redirecting to login');
    }
    return <Navigate to="/login" />;
  }

  if (process.env.NODE_ENV === 'development') {
    console.log('PrivateRoute - User authenticated, rendering children');
  }
  return children;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-primary-dark">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-secondary mb-4"></div>
          <div className="text-lg font-sans text-primary dark:text-white">Loading...</div>
        </div>
      </div>
    );
  }

  return user ? <Navigate to="/dashboard" /> : children;
}

function AppRoutes() {
  const { user } = useAuth();
  
  return (
    <>
      {user && <Header />}
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/history"
          element={
            <PrivateRoute>
              <TaskHistory />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
              <Route
                path="/achievements"
                element={
                  <PrivateRoute>
                    <Achievements />
                  </PrivateRoute>
                }
              />
              <Route
                path="/test-sheet"
                element={
                  <PrivateRoute>
                    <TestSheet />
                  </PrivateRoute>
                }
              />
              <Route path="/" element={<Navigate to="/dashboard" />} />
              {/* 404 Catch-all route - must be last */}
              <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <OfflineIndicator />
          <AppRoutes />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#0d9488',
                color: '#fff',
                borderRadius: '8px',
                padding: '16px',
                fontFamily: 'Inter, sans-serif',
              },
              success: {
                duration: 5000,
                iconTheme: {
                  primary: '#22c55e',
                  secondary: '#fff',
                },
              },
            }}
          />
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;


