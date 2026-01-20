import React from "react";
import "../css/SectionGreyBanner.css";

const BlogHeader = () => {
  return (
    <div className="contentSectionGreyBanner">
      <div className="container">
        <div className="row">
          <div className="col-12 aboutTitle">
            <span className="contentTitle"> Portfolio </span>
          </div>
          <hr className="borderLineContent"></hr>
          <div className="col-12 aboutDesc">
            <span className="contentDesc"> Ready to embark on a collaborative journey? Let's transform your web development project into a digital masterpiece, together.</span>
          </div>
          <div className="col-12 aboutDesc">
            <div className="col contentBtn"><a className="bannerBtn" href="https://calendar.google.com/calendar/appointments/schedules/AcZssZ1CgA6jWVIIWds4o3F1P1P8PMN2cWilIqpopRyaxzUwmNRf09REJ67QyaDqjpzwPjDCyPqYXW8x?gv=true" target="_blank" rel="noopener noreferrer"> Book an Appointment </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogHeader;
