import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navigation from "../components/Navigation";
import "../css/CreatePortfolio.css";
import "react-toastify/dist/ReactToastify.css";

const DashboardCreatePortfolio = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    image: null,
    title: "",
    description: "",
    category: "",
    url: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle Form Inputs
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Handle Form Submission
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
      formDataToSend.append("title", formData.title || "");
      formDataToSend.append("description", formData.description || "");
      formDataToSend.append("category", formData.category || "");
      formDataToSend.append("url", formData.url || "");
      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }

      const response = await fetch("http://localhost:5001/api/createportfolio", {
        method: "POST",
        body: formDataToSend,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (response.ok && data) {
        toast.success("Portfolio created successfully!", { position: "top-right" });
        setTimeout(() => navigate("/dashboard/dashboardportfolio"), 2000);
      } else {
        setError(data?.error || "Failed to create portfolio");
        toast.error(data?.error || "Failed to create portfolio");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Failed to connect to the server");
      toast.error("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="dashboard-container">
        <Navigation />
        <div className="dashboard-content">
          <div className="header-with-back">
            <h2>Create Portfolio</h2>
            <span className="back-arrow" onClick={() => navigate("/dashboard/dashboardportfolio")}>
              <img src={process.env.PUBLIC_URL + "/img/back-arrow.svg"} alt="Back" />
            </span>
          </div>
          <div className="create-portfolio-container">
            <Form onSubmit={handleSubmit}>
              <Form.Group>
                <Form.Control type="file" name="image" onChange={handleChange} required />
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
                <Form.Control
                  type="text"
                  name="url"
                  placeholder="URL"
                  value={formData.url}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group>
                <Form.Control
                  as="textarea"
                  name="description"
                  placeholder="Description"
                  value={formData.description}
                  onChange={handleChange}
                  required
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
                  <option value="Bubble.io">Bubble.io</option>
                  <option value="API">API</option>
                </Form.Select>
              </Form.Group>
              <Button type="submit" className="mt-2" disabled={loading}>
                {loading ? "Creating..." : "Create"}
              </Button>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardCreatePortfolio;
