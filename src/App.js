import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from './view/Layout/Layout';
import LoginSignup from './view/auth/LoginSignup/LoginSignup';
import MainContainer from './view/MainContainer/MainContainer';

const isLoggedIn = () => !!localStorage.getItem('token');

// PublicRoute: For routes like login/signup, redirect to dashboard if logged in
function PublicRoute({ children }) {
  return isLoggedIn() ? <Navigate to="/dashboard" replace /> : children;
}

// PrivateRoute: For protected routes like dashboard, redirect to login if NOT logged in
function PrivateRoute({ children }) {
  return isLoggedIn() ? children : <Navigate to="/" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route
          path="/"
          element={
            <PublicRoute>
              <LoginSignup />
            </PublicRoute>
          }
        />

        {/* Private routes */}
        <Route
          path="/*"
          element={
            <PrivateRoute>
              <MainContainer/>
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
