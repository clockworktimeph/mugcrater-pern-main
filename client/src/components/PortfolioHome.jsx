import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import "../css/Portfolio.css";

const makeAbsoluteUrl = (url) => {
  if (!url) return null;
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  return `https://${url}`;
};

const Portfolio = () => {
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5002";

  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/getportfolios`);

        if (!response.ok) {
            throw new Error('Failed to fetch portfolios from API');
        }
        
        let data = await response.json();

        if (data?.portfolios) data = data.portfolios;
        if (!Array.isArray(data)) data = [data];

        setPortfolios(data);
        setLoading(false);

      } catch (error) {
        console.error("Error fetching portfolios for homepage:", error);
        setLoading(false);
      }
    };

    fetchPortfolios();
  }, [API_BASE]);
  
  const featuredPortfolios = useMemo(() => {
    return portfolios.slice(0, 3);
  }, [portfolios]);


  if (loading) {
    return (
      <div className="loading-container">
        <p>Brewing projects...</p>
        <small style={{ display: 'block', opacity: 0.7 }}>Server is waking up, please wait...</small>
      </div>
    );
  }

  return (
    <div id="portfolio-home">
      {featuredPortfolios.length > 0 ? (
        featuredPortfolios.map((portfolio) => (
          <article className="portfolioSection" key={portfolio.id}>
            <div className="container">
              <div className="row">
                <div className="col-12">
                  {portfolio.url && (
                      <a href={makeAbsoluteUrl(portfolio.url)} target="_blank" rel="noopener noreferrer">
                          <img 
                            src={`${API_BASE}/uploads/portfolio/${portfolio.image}`}
                            alt={portfolio.title}
                            className="img-fluid"
                            onError={(e) => { e.target.src = 'https://via.placeholder.com/800x450?text=Project+Coming+Soon'; }}
                          />
                      </a>
                  )}
                </div>
                <div className="col-12 aboutTitle">
                  <h2 className="contentTitle"> {portfolio.title || "Untitled Project"} </h2>
                </div>
                <div className="col-12 aboutDesc">
                  <span className="contentDesc">
                    {portfolio.description && portfolio.description.length > 150 
                      ? portfolio.description.substring(0, 150) + "..." 
                      : portfolio.description || "No description provided."}
                  </span>
                </div>
              </div>
            </div>
          </article>
        ))
      ) : (
        <div className="container p-5">
            <p className="text-center">No portfolio items found.</p>
        </div>
      )}
      <div className="portfolioSection">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center">
              <span className="contentBtn">
                <Link to="/Portfolio">View More</Link>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;