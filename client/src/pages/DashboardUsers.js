import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navigation from "../components/Navigation";
import "../css/DashboardUsers.css";
import DashboardUsers from "../components/DashboardUsers";

const PageUsers = () => {
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
          <DashboardUsers />
        </div>
      </div>
    </>
  );
};

export default PageUsers;
