import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../css/Header.css";

const Header = () => {
  const [activeTab, setActiveTab] = useState("Home");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const handleLinkClick = (tabName) => {
    setActiveTab(tabName);
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const path = location.pathname.toLowerCase();
    if (path === "/") setActiveTab("Home");
    else if (path === "/about") setActiveTab("About");
    else if (path === "/portfolio") setActiveTab("Portfolio");
    else if (path === "/blog") setActiveTab("Blog");
    else if (path === "/contact") setActiveTab("Contact");
  }, [location]);

  return (
    <>
      <header className="header" id="header">
        <div className="container">
          <nav className="main-nav navbar navbar-expand-lg">
            <div className="container-fluid d-flex justify-content-between align-items-center">
              <Link className="site-logo navbar-brand" to="/" onClick={() => setIsMenuOpen(false)}>
                <img src={process.env.PUBLIC_URL + '/img/Mugcrater.svg'} alt="Logo" />
              </Link>
              <button 
                className={`hamburger-btn d-lg-none ${isMenuOpen ? "open" : ""}`} 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle navigation"
              >
                <span></span>
                <span></span>
                <span></span>
              </button>
              <div className="d-none d-lg-block mainNav">
                <ul className="navbar-nav">
                  <li><Link to="/" onClick={() => handleLinkClick("Home")} className={activeTab === "Home" ? "active" : ""}>Home</Link></li>
                  <li><Link to="/About" onClick={() => handleLinkClick("About")} className={activeTab === "About" ? "active" : ""}>About</Link></li>
                  <li><Link to="/Portfolio" onClick={() => handleLinkClick("Portfolio")} className={activeTab === "Portfolio" ? "active" : ""}>Portfolio</Link></li>
                  {/* <li><Link to="/Blog" onClick={() => handleLinkClick("Blog")} className={activeTab === "Blog" ? "active" : ""}>Blog</Link></li> */}
                  <li><Link to="/Contact" onClick={() => handleLinkClick("Contact")} className={activeTab === "Contact" ? "active" : ""}>Contact Us</Link></li>
                </ul>
              </div>
              <div className={`mobile-menu-overlay d-lg-none ${isMenuOpen ? "active" : ""}`}>
                <ul className="mobile-nav-links">
                  <li><Link to="/" onClick={() => handleLinkClick("Home")}>Home</Link></li>
                  <li><Link to="/About" onClick={() => handleLinkClick("About")}>About</Link></li>
                  <li><Link to="/Portfolio" onClick={() => handleLinkClick("Portfolio")}>Portfolio</Link></li>
                  {/* <li><Link to="/Blog" onClick={() => handleLinkClick("Blog")}>Blog</Link></li> */}
                  <li><Link to="/Contact" onClick={() => handleLinkClick("Contact")}>Contact Us</Link></li>
                </ul>
              </div>

            </div>
          </nav>
        </div>
      </header>
    </>
  );
};

export default Header;