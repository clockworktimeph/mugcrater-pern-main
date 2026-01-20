import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navigation from "../components/Navigation";
import "../css/CreateUser.css";
import "react-toastify/dist/ReactToastify.css";

const DashboardCreateUser = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", email: "", role: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
  
      const response = await fetch("http://localhost:5001/api/createuser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        toast.success("User created successfully!", { position: "top-right" });
        setTimeout(() => navigate("/dashboard/dashboardusers"), 2000);
      } else {
        setError(data.error || "Something went wrong");
        toast.error(data.error || "Failed to create user.");
      }
    } catch (err) {
      setError("Failed to connect to the server.");
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
            <h2>Create User</h2>
            <span className="back-arrow" onClick={() => navigate("/dashboard/dashboardusers")}>
              <img src={process.env.PUBLIC_URL + "/img/back-arrow.svg"} alt="Back" />
            </span>
          </div>
          <div className="create-user-container">
            <Form onSubmit={handleSubmit}>
              <Form.Group>
                <Form.Control type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} required/>
              </Form.Group>
              <Form.Group>
                <Form.Control type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required/>
              </Form.Group>
              <Form.Select type="dropdown" name="role" placeholder="Role" value={formData.role} onChange={handleChange} required>
                <option value="" disabled>Select Role</option>
                <option value="Editor">Editor</option>
                <option value="Admin">Admin</option>
              </Form.Select>
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

export default DashboardCreateUser;
