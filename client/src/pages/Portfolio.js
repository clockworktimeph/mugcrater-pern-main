import React from 'react';
import { Helmet } from 'react-helmet';
import Portfolio from "../components/Portfolio";
import PortfolioHeader from "../components/PortfolioHeader";
import "../css/Portfolio.css";

const PagePortfolio = () => {
  return (
    <>
      <PortfolioHeader/>
      <Portfolio/>
      <Helmet>
        <script src="/js/main.js" async></script>
      </Helmet>
    </>
  );
};

export default PagePortfolio;
