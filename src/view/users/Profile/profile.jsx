import React, { useState, useEffect } from 'react';
import './profile.css';
import { jwtDecode } from "jwt-decode";
import { ToastContainer, toast } from 'react-toastify';

const Profile = () => {
  const [user, setUser] = useState({ fullname: '', email: '', dob: '', fathername: '', mothername: '' });
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ fullname: '', email: '', dob: '', fathername: '', mothername: '' });
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');
    const [loading, setLoading] = useState(true); 

  const isTokenExpired = (token) => {
    try {
      const decoded = jwtDecode(token);
      const now = Date.now() / 1000; // Current time in seconds
      return decoded.exp < now; // True if expired
    } catch (err) {
      return true; // Treat invalid token as expired
    }
  };

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
    const fetchProfile = async () => {
      if (!token) {
        setError("No token found. Please log in.");
        return;
      }
      setLoading(true)  

      try {
        const res = await fetch("http://localhost:5000/auth/profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
          },
          credentials: "include",
        });

        const data = await res.json();

        if (!res.ok) {
          
          throw new Error(data.error || "Failed to fetch profile");
        }

        setUser({
          fullname: data.fullname,
          email: data.email,
          dob: data.dob || '',
          fathername: data.fathername || '',
          mothername: data.mothername || '',
        });
        setFormData({
          fullname: data.fullname,
          email: data.email,
          dob: data.dob || '',
          fathername: data.fathername || '',
          mothername: data.mothername || '',
        });
      } catch (err) {
        console.error(err);
        setError(err.message);
      }finally{
        setTimeout(() => {
      setLoading(false);
    }, 1500);
      }
    };
    fetchProfile();
  }, [token]);

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:5000/auth/logout", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token
        },
      });

      localStorage.removeItem('token');
      window.location.href = "/";
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const handleEdit = () => setEditMode(true);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const res = await fetch("http://localhost:5000/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update profile");
      }

      setUser({ ...formData });
      setEditMode(false);
      setError('');
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  const handleCancel = () => {
    setFormData({ ...user });
    setEditMode(false);
    setError('');
  };
  function calculateAge(dobString) {
    let today = new Date();
    let dob = new Date(dobString);
    let age = today.getFullYear() - dob.getFullYear();
    let monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age;
  }
  if (loading) {
  return (
    <div className="profileContainer">
      <div className="details">
        <h2>Loading profile...</h2>
      </div>
    </div>
  );
}

  return (
    
    <div className='profileContainer'>
      <div className="details">
        <h2>User Profile</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}

        {editMode ? (
          <>
            <p>
              Fullname:
              <input type="text" name="fullname" value={formData.fullname} onChange={handleChange} />
            </p>
            <p>
              Email:
              <input type="email" name="email" value={formData.email} onChange={handleChange} />
            </p>
            <p>
              Date of Birth:
              <input type="date" name="dob" value={formData.dob} onChange={handleChange} />
            </p>
            <p>
              Father's Name:
              <input type="text" name="fathername" value={formData.fathername} onChange={handleChange} />
            </p>
            <p>
              Mother's Name:
              <input type="text" name="mothername" value={formData.mothername} onChange={handleChange} />
            </p>
            <div className="buttons">
              <button onClick={handleSave}>Save</button>
              <button onClick={handleCancel}>Cancel</button>
            </div>
          </>
        ) : (
          <>
            <p>Fullname: <span>{user.fullname}</span></p>
            <p>Email: <span>{user.email}</span></p>
            <p>Age: <span>{user.dob ? calculateAge(user.dob) : '-'}</span></p>
            <p>Date of Birth: <span>{user.dob || '-'}</span></p>
            <p>Father's Name: <span>{user.fathername || '-'}</span></p>
            <p>Mother's Name: <span>{user.mothername || '-'}</span></p>
            <div className="modal-buttons">
              <button onClick={handleEdit}>Edit Profile</button>
              <button onClick={handleLogout}>Logout</button>
            </div>
          </>

        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default Profile;
