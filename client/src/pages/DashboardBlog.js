import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navigation from "../components/Navigation";
import "../css/DashboardBlog.css";
import DashboardBlog from "../components/DashboardBlog";

const PageBlog = () => {
  const location = useLocation();

  useEffect(() => {
    const sectionId = location.pathname.split("/")[2];
    if (sectionId) {
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

  return (
    <>
      <div className="dashboard-container">
        <Navigation />
        <div className="dashboard-content">
          <DashboardBlog />
        </div>
      </div>
    </>
  );
};

export default PageBlog;
