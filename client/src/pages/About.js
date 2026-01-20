import React from 'react'
import { Helmet } from 'react-helmet';
import SectionGreyAbout from "../components/SectionGreyAbout";
import AboutHeader from "../components/AboutHeader";
import "../css/About.css";

const PageAbout = () => {
  return (
    <div className="about">
      <AboutHeader/>
      <div className="container aboutBanner">
        <div className="row">
          <img src={process.env.PUBLIC_URL + '/img/Team.svg'} className="aboutImg" alt="About"></img>
        </div>
      </div>
      <SectionGreyAbout/>
      <Helmet>
        <script src="/lib/isotope/isotope.pkgd.min.js" async></script>
        <script src="/js/main.js" async></script>
      </Helmet>
    </div>
  );
};

export default PageAbout;
