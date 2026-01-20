import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../features/AuthContext";
import { toast } from "react-toastify";
import "../css/Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  const navigate = useNavigate();
  const { login, user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      navigate("/dashboard");
    }
  }, [user, loading, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:5001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (res.ok) {
        const userData = data.user || data.userData || data; 
        const token = data.token || data.accessToken;

        if (!userData || !token) {
          console.error("Login failed: User or Token is missing in response", data);
          setError("Invalid server response structure.");
          return;
        }

        login(userData, token);
        toast.success("Login successful!");
      } else {
        setError(data.error || data.message || "Invalid credentials");
      }
    } catch (err) {
      console.error("Login Error:", err);
      setError("Server connection failed.");
    }
  };

  if (loading) return null;

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2 className="auth-title">Mugcrater</h2>
        <p className="auth-intro">Brewing Ideas, Brewing Innovations</p>
        
        {error && <p className="error-message">{error}</p>}
        
        <form className="auth-form" onSubmit={handleLogin}>
          <input 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
          <button className="auth-btn" type="submit">Log In</button>
        </form>

        <p className="auth-links">
          <Link to="/forgotpassword">Forgot Password?</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;