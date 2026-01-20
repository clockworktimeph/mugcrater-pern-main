import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Navigation from "../components/Navigation";
import "../css/UpdatePortfolio.css";

const UpdatePortfolio = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    image: null,
    title: "",
    description: "",
    category: "",
    url: "",
  });

  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5001/api/getportfolio/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Portfolio not found");
        return;
      }

      setFormData({
        title: data.title || "",
        description: data.description || "",
        category: data.category || "",
        url: data.url || "",
        image: null,
      });

      setImageUrl(
        data.image
          ? `http://localhost:5001/uploads/portfolio/${data.image}`
          : ""
      );
    } catch (err) {
      setError("Error fetching portfolio data");
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image" && files.length > 0) {
      const file = files[0];
      setFormData({ ...formData, image: file });
      setImageUrl(URL.createObjectURL(file));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      const formDataToSend = new FormData();
      if (formData.image) formDataToSend.append("image", formData.image);

      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("url", formData.url);

      const response = await fetch(
        `http://localhost:5001/api/updateportfolio/${id}`,
        {
          method: "PUT",
          body: formDataToSend,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success("Portfolio updated successfully!");
        navigate("/dashboard/dashboardportfolio");
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
          <h2>Update Portfolio</h2>
          <span
            className="back-arrow"
            onClick={() => navigate("/dashboard/dashboardportfolio")}
          >
            <img
              src={process.env.PUBLIC_URL + "/img/back-arrow.svg"}
              alt="Back"
            />
          </span>
        </div>

        <div className="edit-portfolio-container">
          <Form onSubmit={handleSubmit}>
            {imageUrl && (
              <img
                src={imageUrl}
                alt="Portfolio"
                width="100%"
                height="100%"
                style={{ objectFit: "cover", marginBottom: "10px" }}
              />
            )}

            <Form.Group>
              <Form.Control type="file" name="image" onChange={handleChange} />
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
                required
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
              {loading ? "Updating..." : "Update"}
            </Button>

            {error && <p className="error-text">{error}</p>}
          </Form>
        </div>
      </div>
    </div>
  );
};

export default UpdatePortfolio;
