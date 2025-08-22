import React, { useEffect, useState } from 'react';
import "./blog.css";
import myimage from '../../../../Assets/blog.jpg';
import { useNavigate } from 'react-router-dom';
import { timeAgo } from '../../../../utils/timecalc';
import { MdDelete } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { toast, ToastContainer } from 'react-toastify';

const Blog = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch("http://localhost:5000/auth/addblog", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          }
        });

        if (!res.ok) {
          console.error("Failed to fetch blog posts");
          return;
        }

        const data = await res.json();
        setBlogs(data.published_blogs);
      } catch (err) {
        console.error(err);
      }
    };

    fetchBlogs();
  }, []);

  // 🗑️ Delete API call
  const handleDelete = async (blogId) => {
    try {
      const res = await fetch(`http://localhost:5000/auth/edit_blog/${blogId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });

      if (res.ok) {
        setBlogs(prev => prev.filter(b => b.id !== blogId));
        toast.success("Blog deleted successfully");
      } else {
        const errData = await res.json();
        toast.error("Failed to delete blog: " + (errData.error || "Unknown error"));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Confirm dialog before deleting
  const confirmDelete = (e, blogId) => {
    e.stopPropagation(); // prevent card click
    confirmAlert({
      title: "Confirm Delete",
      message: "Are you sure you want to delete this blog?",
      buttons: [
        {
          label: "Yes",
          onClick: () => handleDelete(blogId)
        },
        {
          label: "No"
        }
      ]
    });
  };

  return (
    <div>
      <div className="blog-container">
        {blogs.map(blog => (
          <div 
            key={blog.id} 
            className="blog-post"
          >
            <div 
              className="blog-photo"
              onClick={() => navigate(`/blogs/${blog.id}`)}
            >
              <img src={myimage} alt={blog.title} />
            </div>
            <div className="footer">
              <div className="blog-content">
                <h3>
                  Title: {blog.title.length > 15 ? blog.title.substring(0, 15) + "..." : blog.title}
                </h3>
                <p>Created: {timeAgo(new Date(blog.created_at))}</p>
              </div>
              <div className="actions">
                <span onClick={() => navigate(`/edit_blogs/${blog.id}`)}>
                  <CiEdit />
                </span>
                <span onClick={(e) => confirmDelete(e, blog.id)}>
                  <MdDelete />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <ToastContainer />
    </div>
  );
};

export default Blog;
