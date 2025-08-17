// ./Components/routes/index.js
import React, { Suspense } from 'react';
import LoginSignUp from '../view/auth/LoginSignup/LoginSignup';
import Dashboard from '../view/users/Dashboard/dashboard';
import Profile from '../view/users/Profile/profile';
import AboutUs from '../view/users/Aboutus/aboutus';
import Userdetails from '../view/users/Aboutus/userdetails'; 
import Change_password from '../view/users/ChangePassword/Changepassword';
import Otp from '../view/auth/OTP/Otp';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Helper to check login status
const isLoggedIn = () => !!localStorage.getItem('token');

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
      <Suspense fallback={<div>Loading...</div>}>
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
          <Route
            path="/users"
            element={
              <PrivateRoute>
                <Userdetails />
              </PrivateRoute>
            }
          />
          <Route
            path="/defaultchangepassword"
            element={
              <PrivateRoute>
                <Change_password />
              </PrivateRoute>
            }
          />
          <Route
            path="/verify_otp"
            element={
              <PrivateRoute>
                < Otp/>
              </PrivateRoute>
            }
          />
        </Routes>
      </Suspense>
    </Router>
  );
}
