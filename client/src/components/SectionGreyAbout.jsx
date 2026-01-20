import React from "react";
import "../css/SectionGrey.css";

const SectionGrey = () => {
  return (
    <div className="contentSectionGrey" id="about">
      <div className="container">
        <div className="row">
          <div className="col-12 aboutIntro">
            <span className="contentIntro"> High-Impact Web Development Services. </span>
          </div>
          <hr className="borderLineContent"></hr>
          <div className="col-12 aboutDesc">
            <span className="contentDesc"> We bridge the gap between custom code and rapid innovation to ensure business success. </span>
          </div>
          <div className="col-md-6 aboutDesc">
              <h4><strong>Full-Stack & No-Code</strong></h4>
              <p>Bespoke <strong>PERN stack</strong> applications and high-speed development with <strong>Bubble.io</strong> and <strong>Xano</strong>.</p>
            </div>
            <div className="col-md-6 aboutDesc">
              <h4><strong>AI & API Integration</strong></h4>
              <p>Implementation of <strong>OpenAI</strong> and <strong>Anthropic</strong> APIs to automate workflows and scale intelligence.</p>
            </div>
            <div className="col-md-6 aboutDesc">
              <h4><strong>Databases & Payments</strong></h4>
              <p>Secure database architecture and seamless <strong>Stripe</strong> payment processing for global scaling.</p>
            </div>
            <div className="col-md-6 aboutDesc">
              <h4><strong>Scaling Strategy</strong></h4>
              <p>Planning and implementing technical strategies to ensure your application grows with your user base.</p>
            </div>
        </div>
      </div>
    </div>
    
  );
};

export default SectionGrey;
