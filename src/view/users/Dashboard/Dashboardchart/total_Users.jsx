import React, { useEffect, useState } from 'react';
import CountUp from 'react-countup';
import './total.css';
import { useNavigate } from 'react-router-dom';
import { FaUserFriends } from "react-icons/fa";

const Total_Users = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [confirmed, setConfirmed] = useState(0);
  const [notConfirmed, setNotConfirmed] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("http://localhost:5000/auth/get_data", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
          credentials: "include",
        });

        if (!res.ok) {
          const error = await res.json();
          console.error("Error fetching total users:", error);
          return;
        }

        const rawData = await res.json();
        console.log("Fetched data:", rawData);

        // Example: rawData = [users, totalCount, confirmedCount, notConfirmedCount]
        setTotalUsers(rawData[1] || 0);
        setConfirmed(rawData[2] || 0);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="total-card">
      {/* Header */}
      <div className="total-card-header" onClick={() => navigate('/users')}>
        <div><FaUserFriends /> Users</div>
        <div>{'>'}</div>
      </div>

      {/* Count */}
      <div className="total-card-count">
        <CountUp end={totalUsers} duration={2.5} />
      </div>
      <div className="total-card-subtitle">Total Users</div>

      {/* Footer */}
      <div className="total-card-footer">
        <div onClick={() => navigate('/active_users')} style={{ cursor: 'pointer' }}>
          <strong >{confirmed}</strong>
          Active
        </div>
        <div style={{ cursor: 'pointer' }}>
          <strong>{totalUsers-confirmed}</strong>
          Non-Active
        </div>
      </div>
    </div>
  );
};

export default Total_Users;
