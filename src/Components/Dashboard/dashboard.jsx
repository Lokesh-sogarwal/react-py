import React, { useEffect } from 'react';
import './dashboard.css';
import MainContent from '../Dashboard/mainContent/mainContent';
import Nav from '../Dashboard/NavBar/nav';
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';

const Dashboard = () => {
   const navigate = useNavigate();
  
//  useEffect(() => {
//     if (localStorage.getItem('login') === 'true') {
//       toast.success("Login Success");
//     } else {
//       navigate('/');
//     }
//   }, [navigate]);

  return (
    <>
      <Nav />
      <MainContent />
      <ToastContainer />
    </>
  );
};

export default Dashboard;
