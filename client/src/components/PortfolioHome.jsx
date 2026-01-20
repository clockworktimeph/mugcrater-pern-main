import React, { useState, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
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

  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        const response = await fetch("http://localhost:5002/api/getportfolios");

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
        toast.error("Failed to load portfolio items.");
        setLoading(false);
      }
    };

    fetchPortfolios();
  }, []);
  
  const featuredPortfolios = useMemo(() => {
    return portfolios.slice(0, 3);
  }, [portfolios]);


  if (loading) {
    return <div className="loading-container"><p>Loading Portfolios...</p></div>;
  }

  return (
    <div>
      {featuredPortfolios.length > 0 ? (
        featuredPortfolios.map((portfolio) => (
          <div className="portfolioSection" key={portfolio.id}>
            <div className="container">
              <div className="row">
                {portfolio.url && (
                    <a href={makeAbsoluteUrl(portfolio.url)} target="_blank" rel="noopener noreferrer">
                        <img 
                          src={`http://localhost:5002/uploads/portfolio/${portfolio.image}`}
                          alt={portfolio.title}
                        />
                    </a>
                )}
                <div className="col-12 aboutTitle">
                  <span className="contentTitle"> {portfolio.title || "Untitled Project"} </span>
                </div>
                <div className="col-12 aboutDesc">
                  <span className="contentDesc">{portfolio.description || "No description provided."}</span>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="container p-5">
            <p className="text-center">No portfolio items found.</p>
        </div>
      )}

      <div className="portfolioSection">
        <div className="container">
          <div className="row">
            <div className="col-12 aboutDesc">
              <span className="contentBtn">
                <a href={process.env.PUBLIC_URL + '/Portfolio'}>View More</a>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
