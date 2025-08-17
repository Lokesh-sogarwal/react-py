import React, { useState } from 'react';
import './changepassword.css';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Change_password = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const change_password = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You are not logged in!");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/auth/changedefaultpassword", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": "Bearer " + token
        },
        credentials: "include", // ✅ important for Flask session
        body: JSON.stringify({ newpassword: newPassword })
      });

      const data = await res.json();

      if (res.ok) {
        if(data.otp_token){
          console.log(data.otp_token);
          sessionStorage.setItem('otp_token',data.otp_token);
        }else{
          console.log("There is no token!!")
          // navig
        }
        toast.success(data.message || "OTP sent to your email!");
        setTimeout(() => {
          navigate('/verify_otp');
        }, 1500);
      } else {
        toast.error(data.error || "Failed to request password change");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    
    <div className="change-password-container">
      <h1>Create New Password</h1>
      <form onSubmit={change_password}>
        <label htmlFor="newpassword">New Password:</label>
        <input
          type="password"
          id="newpassword"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <label htmlFor="confirmpassword">Confirm Password:</label>
        <input
          type="password"
          id="confirmpassword"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button type="submit">Submit</button>
      </form>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Change_password;
