import React from 'react';
import './nav.css';
import { useNavigate } from 'react-router-dom';

const Nav = () => {
    const islogin = localStorage.getItem('token');
    const navigate = useNavigate();

    const logout = async () => {
        try {
            await fetch("http://localhost:5000/auth/logout", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" }
            });

            localStorage.removeItem('token');

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
