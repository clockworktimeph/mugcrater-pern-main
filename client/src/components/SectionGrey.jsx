import React from "react";
import "../css/SectionGrey.css";

const SectionGrey = () => {
  return (
    <div className="contentSectionGrey" id="about">
      <div className="container">
        <div className="row">
          <div className="col-12 aboutIntro">
            <span className="contentIntro"> Dedicated to providing Web Development Services that ensure business success. </span>
          </div>
          <hr className="borderLineContent"></hr>
          <div className="col-12 aboutDesc">
            <span className="contentDesc"> Create custom web applications, Design and set up databases, Plan and implement strategies for scaling web applications and more. </span>
          </div>
        </div>
      </div>
    </div>
    
  );
};

export default SectionGrey;
