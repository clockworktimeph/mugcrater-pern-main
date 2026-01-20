import React from "react";
import "../css/SectionGreyBanner.css";

const Contact = () => {
  return (
    <div className="contentSectionGreyBanner" id="contact">
      <div className="container">
        <div className="row">
          <div className="col-12 aboutTitle">
            <span className="contentTitle"> Get in touch. </span>
          </div>
          <div className="col-12 aboutIntro">
            <span className="contentIntro"> Love to hear your thoughts! </span>
          </div>
          <hr className="borderLineContent"></hr>
          <div className="col-12 aboutDesc">
            <span className="contentDesc"> Ready to transform your online presence into something pixel-perfect through an Agile process? Let's collaborate and bring your web development project to life. </span>
          </div>
          <div className="col-12 aboutDesc">
            <a className="bannerBtn" href="https://calendar.google.com/calendar/appointments/schedules/AcZssZ1CgA6jWVIIWds4o3F1P1P8PMN2cWilIqpopRyaxzUwmNRf09REJ67QyaDqjpzwPjDCyPqYXW8x?gv=true" target="_blank" rel="noopener noreferrer"> Book an Appointment </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
