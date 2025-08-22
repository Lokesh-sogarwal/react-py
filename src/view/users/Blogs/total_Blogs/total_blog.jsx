import React, { useEffect, useState } from 'react';
import CountUp from 'react-countup';
import '../../Dashboard/Dashboardchart/total.css';
import { useNavigate } from 'react-router-dom';
import { FaBlog } from "react-icons/fa";

const Total_Blogs = () => {
  const [totalBlogs, settotalBlogs] = useState(0);
  const [published, setpublished] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("http://localhost:5000/auth/addblog", {
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

        // Example: rawData = [users, totalCount, publishedCount, notpublishedCount]
        settotalBlogs(rawData.total_blogs || 0);
        setpublished(rawData.published_blogs_count || 0);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="total-card">
      {/* Header */}
      <div className="total-card-header" onClick={() => navigate('/blogs')}>
        <div><FaBlog /> Blogs</div>
        <div>{'>'}</div>
      </div>

      {/* Count */}
      <div className="total-card-count">
        <CountUp end={totalBlogs} duration={2.5} />
      </div>
      <div className="total-card-subtitle">Total Blogs</div>

      {/* Footer */}
      <div className="total-card-footer">
        <div style={{ cursor: 'pointer' }}>
          <strong>{published}</strong>
          Published Blogs
        </div>
        <div style={{ cursor: 'pointer' }}>
          <strong>{totalBlogs-published}</strong>
          Un-Published Blogs
        </div>
      </div>
    </div>
  );
};

export default Total_Blogs;

