import React, { useState, useEffect, useRef } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Navigation from "../components/Navigation";
import "../css/UpdateBlog.css";

const UpdateBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    image: null,
    title: "",
    content: "",
    category: "",
    status: "Unpublished",
  });
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const quillRef = useRef(null);

  useEffect(() => {
    fetchBlog();
  }, []);

  const fetchBlog = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You are not authorized.");
        navigate("/login");
        return;
      }

      const response = await fetch(`http://localhost:5001/api/getblog/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (response.ok) {
        setFormData({
          title: data.title,
          content: data.content,
          category: data.category,
          status: data.status || "Unpublished",
          image: null,
        });

        setImageUrl(
          data.image ? `http://localhost:5001/uploads/blog/${data.image}` : ""
        );
      } else {
        setError(data.error || "Blog not found");
      }
    } catch (err) {
      setError("Error fetching blog data");
    }
  };

  const handleChange = (e) => {
    if (typeof e === "string") {
      setFormData({ ...formData, content: e });
    } else {
      const { name, value, files } = e.target;

      if (name === "image" && files.length > 0) {
        const file = files[0];
        setFormData({ ...formData, image: file });
        setImageUrl(URL.createObjectURL(file));
      } else {
        setFormData({ ...formData, [name]: value });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You are not authorized.");
        navigate("/login");
        return;
      }

      const formDataToSend = new FormData();
      if (formData.image) formDataToSend.append("image", formData.image);
      formDataToSend.append("title", formData.title);
      formDataToSend.append("content", formData.content);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("status", formData.status);

      const response = await fetch(
        `http://localhost:5001/api/updateblog/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formDataToSend,
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success("Blog updated successfully!");
        navigate("/dashboard/dashboardblog");
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (err) {
      setError("Failed to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <Navigation />
      <div className="dashboard-content">
        <div className="header-with-back">
          <h2>Update Blog</h2>
          <span
            className="back-arrow"
            onClick={() => navigate("/dashboard/dashboardblog")}
          >
            <img
              src={process.env.PUBLIC_URL + "/img/back-arrow.svg"}
              alt="Back"
            />
          </span>
        </div>

        <div className="edit-blog-container">
          <Form onSubmit={handleSubmit}>
            {imageUrl && (
              <img
                src={imageUrl}
                alt="Blog"
                width="100%"
                height="100%"
                style={{ objectFit: "cover", marginBottom: "10px" }}
              />
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
                ref={quillRef}
                value={formData.content}
                onChange={handleChange}
                theme="snow"
              />
            </Form.Group>

            <Form.Group>
              <Form.Select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Select Category
                </option>
                <option value="Technology">Technology</option>
                <option value="Business">Business</option>
                <option value="Lifestyle">Lifestyle</option>
              </Form.Select>
            </Form.Group>

            <Form.Group>
              <Form.Select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
              >
                <option value="Unpublished">Unpublished</option>
                <option value="Published">Published</option>
              </Form.Select>
            </Form.Group>

            <Button type="submit" className="mt-2" disabled={loading}>
              {loading ? "Updating..." : "Update"}
            </Button>

            {error && <p className="error-text">{error}</p>}
          </Form>
        </div>
      </div>
    </div>
  );
};

export default UpdateBlog;
