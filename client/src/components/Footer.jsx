import React from "react";
import "../css/Footer.css";


const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div id="footer" className="text-center">
      <div className="container">
        <div className="socials-media text-center">
          <ul className="list-unstyled">
            <li><a href="https://www.linkedin.com/company/mugcrater" target="_blank"><i className="ion-social-linkedin"></i></a>
            </li>
            <li><a href="https://www.instagram.com/mugcrater" target="_blank"><i className="ion-social-instagram"></i></a>
            </li>
            <li><a href="mailto:leemarkdocto@mugcrater.com"><i className="ion-ios-email"></i></a>
            </li>
          </ul>
          <p>© {currentYear} MUGCRATER WEB DEVELOPMENT SERVICES</p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
