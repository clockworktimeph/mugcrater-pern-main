import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../features/AuthContext";
import Navigation from "../components/Navigation";
import UserAnalytics from "../components/UserAnalytics";
import PortfolioAnalytics from "../components/PortfolioAnalytics";
import BlogAnalytics from "../components/BlogAnalytics";
import "../css/Dashboard.css";

const PageDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const sectionId = location.pathname.split("/")[2];

    if (sectionId) {
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location, navigate]);

  return (
    <div className="dashboard-container">
      <Navigation />
      
      <div className="dashboard-content">
        <UserAnalytics/>
        <PortfolioAnalytics/>
        <BlogAnalytics/>
      </div>
    </div>
  );
};

export default PageDashboard;
