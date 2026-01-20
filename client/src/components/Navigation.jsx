import React from "react";
import { ListGroup } from "react-bootstrap";
import { Link, useLocation, useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../features/AuthContext";

import "../css/Navigation.css";


const Navigation = () => {
  const location = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
  const { logout } = useAuth();

  return (
    <>
      <div className="sidebar">
        <div className="logo">
          <Link to="/dashboard"><img src={process.env.PUBLIC_URL + '/img/Mugcrater.svg'} className="d-inline-block align-top" alt="Logo"></img></Link>
        </div>
        <ListGroup variant="flush" className="nav-links">
          <ListGroup.Item active={location.pathname === "/dashboard"} as={Link} to="/dashboard">
            Dashboard
          </ListGroup.Item>
          <ListGroup.Item active={location.pathname === "/dashboard/dashboardusers" || location.pathname === "/dashboard/dashboardusers/createuser" || location.pathname === `/dashboard/dashboardusers/updateuser/${id}`} as={Link} to="/dashboard/dashboardusers">
            Users
          </ListGroup.Item>
          <ListGroup.Item active={location.pathname === "/dashboard/dashboardportfolio" || location.pathname === "/dashboard/dashboardportfolio/createportfolio" || location.pathname === `/dashboard/dashboardportfolio/updateportfolio/${id}`} as={Link} to="/dashboard/dashboardportfolio">
            Portfolio
          </ListGroup.Item>
          <ListGroup.Item active={location.pathname === "/dashboard/dashboardblog" || location.pathname === "/dashboard/dashboardblog/createblog" || location.pathname === `/dashboard/dashboardblog/updateblog/${id}`} as={Link} to="/dashboard/dashboardblog">
            Blog
          </ListGroup.Item>
          <ListGroup.Item active={location.pathname === "/dashboard/dashboardsettings"} as={Link} to="/dashboard/dashboardsettings">
            Settings
          </ListGroup.Item>
        </ListGroup>
        <div className="logout-container">
          <ListGroup.Item as="button" onClick={logout}>
            Logout
          </ListGroup.Item>
        </div>
      </div>
    </>
  );
};

export default Navigation;
