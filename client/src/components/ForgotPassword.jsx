import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "../css/Login.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5001";

    try {
      const res = await fetch(`${API_BASE}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Check your email for the password reset link.");
        toast.success("Reset link sent!");
      } else {
        setError(data.error || data.message || "Something went wrong");
        toast.error(data.error || "Email not found");
      }
    } catch (err) {
      setError("Server error. Please try again later.");
      toast.error("Connection failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2 className="auth-title" style={{ color: "#333" }}>Forgot Password</h2>
        <p className="auth-intro">Enter your email to reset your password.</p>
        
        {message && <p className="success-message" style={{ color: "#39489e", fontWeight: "bold" }}>{message}</p>}
        {error && <p className="error-message" style={{ color: "#cb3694" }}>{error}</p>}
        
        <form className="auth-form" onSubmit={handleForgotPassword}>
          <input 
            type="email" 
            placeholder="Enter your email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            disabled={loading}
            required
          />
          <button 
            className="auth-btn" 
            type="submit" 
            disabled={loading}
            style={{ 
              backgroundColor: loading ? "#ccc" : "#39489e",
              cursor: loading ? "not-allowed" : "pointer" 
            }}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
        
        <div className="auth-links">
          <Link to="/login">Back to Login</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;