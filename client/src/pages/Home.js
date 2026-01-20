import React from 'react';
import { Helmet } from 'react-helmet';
import Banner from "../components/Banner";
import SectionGrey from "../components/SectionGrey";
import PortfolioHome from "../components/PortfolioHome";
import SectionWhite from "../components/SectionWhite";
import Contact from "../components/Contact";
import Footer from "../components/Footer";

const PageHome = () => {
  return (
    <>
      <Banner/>
      <SectionGrey/>
      <PortfolioHome/>
      <SectionWhite/>
      <Contact/>
      <Footer/>
      <Helmet>
        <script src="/lib/isotope/isotope.pkgd.min.js" async></script>
        <script src="/js/main.js" async></script>
      </Helmet>
    </>
  );
};

export default PageHome;
