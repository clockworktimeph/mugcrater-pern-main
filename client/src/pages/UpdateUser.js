import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Navigation from "../components/Navigation";
import "../css/UpdateUser.css";

const UpdateUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", email: "", role: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You are not authorized.");
        navigate("/login");
        return;
      }

      const response = await fetch(`http://localhost:5001/api/getuser/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (response.ok) {
        setFormData(data);
      } else {
        setError(data.error || "User not found");
      }
    } catch (err) {
      setError("Error fetching user data");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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

      const response = await fetch(`http://localhost:5001/api/updateuser/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("User updated successfully!");
        navigate("/dashboard/dashboardusers");
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
          <h2>Update User</h2>
          <span className="back-arrow" onClick={() => navigate("/dashboard/dashboardusers")}>
            <img src={process.env.PUBLIC_URL + "/img/back-arrow.svg"} alt="Back" />
          </span>
        </div>
        <div className="edit-user-container">
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Control type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} required/>
            </Form.Group>
            <Form.Group>
              <Form.Control type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required/>
            </Form.Group>
            <Form.Select name="role" value={formData.role} onChange={handleChange} required>
              <option value="Admin">Admin</option>
              <option value="Editor">Editor</option>
            </Form.Select>
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

export default UpdateUser;
