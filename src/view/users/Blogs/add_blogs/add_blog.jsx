import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./addblog.css";

const AddBlog = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPublished, setIsPublished] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/auth/addblog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          title: title,
          content: content,
          is_published: isPublished,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        toast.error("Failed to add blog: " + (error.message || "Unknown error"));
        return;
      }

      const data = await res.json();
      toast.success("✅ Blog added successfully!");
      setTitle("");
      setContent("");
      setIsPublished(false);
    } catch (err) {
      toast.error("Failed to add blog: " + (err.message || "Unknown error"));
    }
  };

  return (
    <div className="add-blog-container">
      <h2>Add Blog</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          ></textarea>
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
            />
            Publish Blog
          </label>
        </div>

        <button type="submit">Add Blog</button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default AddBlog;
