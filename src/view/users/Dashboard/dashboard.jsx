import React, { useEffect } from 'react';
import './dashboard.css';
import MainContent from './mainContent/mainContent';
import Nav from '../../../Components/NavBar/nav';
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';

const Dashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const isTokenExpired = (token) => {
    try {
      const decoded = jwtDecode(token);
      const now = Date.now() / 1000; // Current time in seconds
      return decoded.exp < now; // True if expired
    } catch (err) {
      return true; // Treat invalid token as expired
    }
  };

  const check_password_change =(token)=>{
    try{
      const decoded = jwtDecode(token);
      const is_password_change = decoded.is_password_change
      if(is_password_change==false){
        navigate('/defaultchangepassword')
      }
    }catch{
      console.log('error')
    }
  }


  // ✅ Logout function
  const logoutUser = () => {
    localStorage.removeItem("token");

    window.location.href = "/"; // Redirect to login
  };
  useEffect(() => {
    if (!token || isTokenExpired(token)) {
      toast.error("Session expired. Please log in again.");
      setTimeout(() => {
        logoutUser();
      }, 3000);
      return;
    }
    check_password_change(token);
  },[token])

  return (
    <>
      <Nav />
      <MainContent />
      <ToastContainer />
    </>
  );
};

export default Dashboard;
