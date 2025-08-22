import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./user_blogs.css";
import myimage from '../../../../Assets/blog.jpg';
import { timeAgo } from "../../../../utils/timecalc"; // 👈 import helper

export default function BlogDetails() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBlog() {
      try {
        const res = await fetch(`http://localhost:5000/auth/edit_blog/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        });

        if (!res.ok) throw new Error("Failed to fetch blog");

        const data = await res.json();
        setBlog(data.blog);
      } catch (err) {
        console.error("Error fetching blog:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchBlog();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!blog) return <p>Blog not found.</p>;

  return (
    <div className="blog-details">
      <div className="blog-img">
        <img src={myimage} alt="" />
      </div>
      <h2>{blog.title}</h2>
      <p>{blog.content}</p>
      <div className="blog-meta">
        <span>Published: {blog.is_published ? "Yes" : "No"}</span>
        <span>Created: {timeAgo(blog.created_at)}</span> {/* 👈 formatted */}
      </div>
      <div className="comment-box">
        <input type="text" placeholder="Add a comment..." />
        <button>Comment</button>
      </div>
      <div className="comment-section">
        {/* Render comments here */}
      </div>
    </div>
  );
}
