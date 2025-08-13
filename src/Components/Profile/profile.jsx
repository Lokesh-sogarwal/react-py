import React, { useState, useEffect } from 'react';
import './profile.css'

const Profile = () => {
  const [user, setUser] = useState({ fullname: '', email: '' });
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');
  console.log('token',token)
useEffect(() => {
  const fetchProfile = async () => {
    if (!token) {
      setError("No token found. Please log in.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/auth/profile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token,
        },
        credentials: "include" // optional, only if you rely on cookies
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch profile");
      }

      setUser({ fullname: data.fullname, email: data.email });
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  fetchProfile();
}, [token]);


  const handleLogout = async () => {
    try {
      await fetch("http://localhost:5000/auth/logout", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      localStorage.removeItem('token');
      window.location.href = "/"; // redirect to login
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <div className='profileContainer'>
      <div className="details">
        <h2>User Profile</h2>
        {error ? (
          <p style={{ color: 'red' }}>{error}</p>
        ) : (
          <>
            <p>Fullname: <span>{user.fullname}</span></p>
            <p>Email: <span>{user.email}</span></p>
          </>
        )}
      </div>
      <div className="buttons">
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default Profile;
