import React, { useEffect, useRef } from "react";
import Typed from "typed.js";
import "../css/Banner.css";

const Banner = () => {
  const el = useRef(null);

  useEffect(() => {
    const typed = new Typed(el.current, {
      strings: ["Ideas", "Innovations"],
      typeSpeed: 150,
      backSpeed: 100,
      loop: true,
    });

    return () => {
      typed.destroy();
    };
  }, []);

  return (
    <>
      <div className="carousel slide" id="Home">
        <div className="carousel-inner">
          <div className="carousel-item active">
            <div className="carousel-caption gradientColor"></div>
            <img className="d-block" src={process.env.PUBLIC_URL + '/img/banner-mugcrater.png'} alt="Banner" />
            <div className="container">
              <div className="carousel-caption d-flex h-100 align-items-center labelBanner">
                <div className="carousel-content">
                  <div className="row">
                    <div className="col-lg-7 order-lg-1 contentRight">
                      <div className="tagLineMinor1Class">
                        <span className="tagLineMinor1"> Brewing <span ref={el}></span> </span>
                      </div>
                      <hr className="tagLineMinor1Class borderLine"></hr>
                    </div>
                    <div className="col-lg-7 order-lg-1 contentLeft">
                      <div className="tagLineMinorClass">
                        <span className="tagLineMinor"> Let's have a cup of coffee. </span>
                      </div>
                      <div className="col contentBtn">
                        <a 
                          className="bannerBtn" 
                          href="https://calendar.google.com/calendar/appointments/schedules/AcZssZ1CgA6jWVIIWds4o3F1P1P8PMN2cWilIqpopRyaxzUwmNRf09REJ67QyaDqjpzwPjDCyPqYXW8x?gv=true" 
                          target="_blank" 
                          rel="noopener noreferrer"
                        > 
                          Get in Touch 
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Banner;