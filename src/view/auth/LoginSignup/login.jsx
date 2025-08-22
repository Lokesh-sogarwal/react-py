import React, { useState, useEffect } from 'react';
import './LoginSignup.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faUser, faToggleOn, faToggleOff } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';

const LoginSignup = () => {
  const [action, setAction] = useState("Login");
  const [isToggled, setIsToggled] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: ""
  });
  // console.log(formData);

  const handleToggle = () => {
    setIsToggled(!isToggled);
  };

  // Update form state on change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  useEffect(() => {
    if (isToggled) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [isToggled]);

  const submit = async () => {
    if (action === 'Login') {
      try {
        const res = await fetch("http://localhost:5000/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
          credentials: "include"
        });
        // console.log("res", res);

        const data = await res.json();
        console.log("data", data);

        if (!res.ok) {
          setError(data.error || "Something went wrong");
          toast.error(data.error || "Something went wrong", {
          });
          return;
        } else {
          if (data.token) {
            localStorage.setItem("token", data.token);
            console.log("tokken stored");
            toast.success("Login Succesfull");
            navigate("/dashboard")    
            console.log("Login succesfull ready to naviagte to dashboard");
          }
        }
      } catch (err) {
        setError("Server error. Please try again later.");
        toast.error("Server error. Please try again later.", {
          position: "top-right",
        });
      }
    } else {

      try {
        const res = await fetch("http://localhost:5000/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            is_password_change: true,
            role : 'student'
          }),
        });

        const data = await res.json();
        console.log("data", data);

        if (!res.ok) {
          setError(data.error || "Something went wrong");
          toast.error(data.error || "Something went wrong", {
          });
          return;
        } else {
          toast.success("User registered Successfully");
          setAction("Login");
        }
      } catch (err) {
        setError("Server error. Please try again later.");
        toast.error("Server error. Please try again later.", {
          position: "top-right",
        });
      }

    }
  };

  return (
    <div className="body">

      <div className="container">
        {/* Header */}
        <div className="header">
          <div className="text">{action}</div>
          <div className="underline"></div>
        </div>

        {/* Input Fields */}
        <div className="inputs">
          {action !== "Login" && (
            <div className="input">
              <FontAwesomeIcon icon={faUser} />
              <input
                type="text"
                placeholder="Full Name"
                name="fullname"
                value={formData.fullname}
                onChange={handleChange}
              />
            </div>
          )}

          <div className="input">
            <FontAwesomeIcon icon={faEnvelope} />
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="input">
            <FontAwesomeIcon icon={faLock} />
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Forgot Password */}
        {action === "Login" && (
          <div className="forgot-password">
            Lost Password? <span>Click Here</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="submit-container">
          <div
            className={action === "Login" ? "submit" : "submit gray"}
            onClick={() => {
              if (action !== "Login") {
                // Just switch to Login mode, don't validate yet
                setAction("Login");
                return;
              }
              // Already in Login mode — now validate and submit
              if (
                formData.email.trim() !== "" &&
                formData.password.trim() !== ""
              ) {
                submit();
              } else {
                toast.error("Please fill in email and password", { position: "top-right" });
              }
            }}
          >
            Login
          </div>


          <div
            className={action === "Sign Up" ? "submit" : "submit gray"}
            onClick={() => {
              if (action !== "Sign Up") {
                // Just switch the mode, no validation yet
                setAction("Sign Up");
                return;
              }

              // If already in "Sign Up" mode, validate and submit
              if (
                formData.fullname.trim() &&
                formData.email.trim() &&
                formData.password.trim()
              ) {
                submit();
              } else {
                toast.error("Please fill in all fields", { position: "top-right" });
              }
            }}
          >
            Sign Up
          </div>


        </div>


        {/* Toggle Button */}
        <div className="toggle-button" onClick={handleToggle}>
          <FontAwesomeIcon
            icon={isToggled ? faToggleOn : faToggleOff}
            size="2x"
            style={{ cursor: 'pointer', color: isToggled ? '#4caf50' : '#2a00b7' }}
          />
        </div>
        <ToastContainer />
      </div>
    </div>
  );
};

export default LoginSignup;
