import React from "react";
import "../css/SectionGreyBanner.css";

const Contact = () => {

  // const googleCalendar = () => {
  //   (function() {
  //     var target = document.currentScript;
  //     window.addEventListener('load', function() {
  //       calendar.schedulingButton.load({
  //         url: 'https://calendar.google.com/calendar/appointments/schedules/AcZssZ1CgA6jWVIIWds4o3F1P1P8PMN2cWilIqpopRyaxzUwmNRf09REJ67QyaDqjpzwPjDCyPqYXW8x?gv=true',
  //         color: '#39489e',
  //         label: "Book an Appointment",
  //         target,
  //       });
  //     });
  //   })();
  // };

  return (
    <div className="contentSectionGreyBanner" id="contact">
      <div className="container">
        <div className="row">
          <div className="col-12 aboutTitle">
            <span className="contentTitle"> Let’s build the future together. </span>
          </div>
          <div className="col-12 aboutIntro">
            <span className="contentIntro"> Your ideas, powered by our expertise! </span>
          </div>
          <hr className="borderLineContent"></hr>
          <div className="col-12 aboutDesc">
            <span className="contentDesc"> Ready to scale your business with a pixel-perfect blend of Full-Stack expertise, No-Code speed, and AI-driven innovation? Let’s collaborate to turn your project into a high-performance reality through our Agile process. </span>
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
