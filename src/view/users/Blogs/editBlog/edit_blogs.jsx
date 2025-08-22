import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";  // ✅ Important
import "./edit_blog.css";


const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPublished, setIsPublished] = useState(false);

  const handleEdit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`http://localhost:5000/auth/edit_blog/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          title,
          content,
          is_published: isPublished,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Blog updated successfully!", {
          position: "top-right",
          autoClose: 2000,
        });

        // ✅ Delay navigation to allow toast to display
        setTimeout(() => {
          navigate("/blogs");
        }, 2000);
      } else {
        toast.error(data.error || "Failed to update blog");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="edit-blog-container">
      <h2>Edit Blog</h2>
      <form onSubmit={handleEdit}>
        <input
          type="text"
          placeholder="Edit Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Edit Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <label>
          <input
            type="checkbox"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
          />
          Publish
        </label>

        <button type="submit">Update Blog</button>
      </form>

      {/* ✅ Toast container must be rendered */}
      <ToastContainer />
    </div>
  );
};

export default EditBlog;
