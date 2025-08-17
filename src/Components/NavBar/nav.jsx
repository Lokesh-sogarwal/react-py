import React from 'react';
import './nav.css';
import { useNavigate } from 'react-router-dom';

const Nav = () => {
    const islogin = localStorage.getItem('token');
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const logout = async () => {
    if (!token) return; // if no token, just return

    try {
        const res = await fetch("http://localhost:5000/auth/logout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            }
        });

        const data = await res.json();

        if (res.ok) {
            localStorage.removeItem("token");
            console.log(data.message); // optional success message
        } else {
            console.error("Logout failed:", data.error || "Unknown error");
        }

        navigate("/"); // redirect to login/home
    } catch (error) {
        console.error("Logout failed:", error);
    }
};


    return (
        <div className="main">
            <div className="nav">
                <div className="logo">BrandName</div>

                <div className="nav-links">
                    <a href="/" className="nav-link">Home</a>
                    <button
                        className="nav-link btn-link"
                        onClick={() => navigate('/aboutus')}
                    >
                        About Us
                    </button>
                    <button
                        className="nav-link btn-link"
                        onClick={() => navigate('/users')}
                    >
                        Users
                    </button>
                    {islogin && (
                        <button
                            className="nav-link btn-link"
                            onClick={() => navigate('/profile')}
                        >
                            Profile
                        </button>
                    )}
                </div>

                <div className="buttons">
                    {islogin ? (
                        <button className="btn" onClick={logout}>Log-Out</button>
                    ) : (
                        <>
                            <button className="btn">Login</button>
                            <button className="btn btn-primary">Register</button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Nav;
