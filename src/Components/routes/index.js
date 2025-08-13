// ./Components/routes/index.js
import React from 'react';
import LoginSignUp from '../LoginSignup/LoginSignup';
import Dashboard from '../Dashboard/dashboard';
import Profile from '../Profile/profile';
import AboutUs from '../Aboutus/aboutus';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Helper to check login status
const isLoggedIn = () => !!localStorage.getItem('token');
console.log('isLoggedIn', isLoggedIn()); // ✅ call the function

// PublicRoute: For routes like login/signup, redirect to dashboard if logged in
function PublicRoute({ children }) {
  return isLoggedIn() ? <Navigate to="/dashboard" replace /> : children;
}

// PrivateRoute: For protected routes like dashboard, redirect to login if NOT logged in
function PrivateRoute({ children }) {
  return isLoggedIn() ? children : <Navigate to="/" replace />;
}

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <PublicRoute>
              <LoginSignUp />
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
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/aboutus"
          element={
            <PrivateRoute>
              <AboutUs />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}
