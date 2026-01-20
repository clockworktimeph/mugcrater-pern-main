import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Navigation from "../components/Navigation";
import "../css/CreateBlog.css";
import "react-toastify/dist/ReactToastify.css";

const DashboardCreateBlog = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    image: null,
    title: "",
    content: "",
    category: "",
    author: "",
    status: "Unpublished",
  });

  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      const file = files?.[0] || null;
      setFormData((prev) => ({ ...prev, image: file }));
      setPreview(file ? URL.createObjectURL(file) : null);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleContentChange = (value) => {
    setFormData((prev) => ({ ...prev, content: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
        
      if (!token) {
        toast.error("You are not authorized.");
        navigate("/login");
        return;
      }

      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== "") {
          formDataToSend.append(key, value);
        }
      });

      const response = await fetch("http://localhost:5001/api/createblog", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "admin_token": token,
        },
        body: formDataToSend,
      });

      let data = null;
      try {
        data = await response.json();
      } catch (err) {
        // server returned non-json (500 HTML), handle below
      }

      if (!response.ok) {
        const serverMsg = data?.error || data?.message || response.statusText;
        toast.error(serverMsg || "Failed to create blog");
        console.error("Create blog server error:", response.status, serverMsg, data);
        setLoading(false);
        return;
      }

      toast.success("Blog created successfully!");
      setTimeout(() => navigate("/dashboard/dashboardblog"), 1500);
    } catch (err) {
      console.error("Error submitting blog:", err);
      toast.error(err.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <Navigation />
      <div className="dashboard-content">
        <div className="header-with-back">
          <h2>Create Blog</h2>
          <span
            className="back-arrow"
            onClick={() => navigate("/dashboard/dashboardblog")}
          >
            <img
              src={`${process.env.PUBLIC_URL}/img/back-arrow.svg`}
              alt="Back"
            />
          </span>
        </div>

        <div className="create-blog-container">
          <Form onSubmit={handleSubmit} encType="multipart/form-data">
            {preview && (
              <div className="image-preview">
                <img
                  src={preview}
                  alt="Preview"
                  style={{ width: "100%", height: "auto" }}
                />
              </div>
            )}

            <Form.Group>
              <Form.Control
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group>
              <Form.Control
                type="text"
                name="title"
                placeholder="Title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group>
              <ReactQuill
                value={formData.content}
                onChange={handleContentChange}
                theme="snow"
              />
            </Form.Group>

            <Form.Group>
              <Form.Select name="category" value={formData.category} onChange={handleChange} required>
                <option value="" disabled>Select Category</option>
                <option value="Technology">Technology</option>
                <option value="Business">Business</option>
                <option value="Lifestyle">Lifestyle</option>
              </Form.Select>
            </Form.Group>

            <Form.Group>
              <Form.Select name="status" value={formData.status} onChange={handleChange} required>
                <option value="Unpublished">Unpublished</option>
                <option value="Published">Published</option>
              </Form.Select>
            </Form.Group>

            <Button type="submit" className="mt-2" disabled={loading}>
              {loading ? "Creating..." : "Create"}
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default DashboardCreateBlog;
