import React, { useState, useEffect, useMemo } from "react";
import { Helmet } from 'react-helmet';
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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; 

  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        const response = await fetch("http://localhost:5002/api/getportfolios");
        if (!response.ok) throw new Error('Failed to fetch portfolios');
        
        let data = await response.json();
        if (data?.portfolios) data = data.portfolios;
        if (!Array.isArray(data)) data = [data];

        setPortfolios(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching portfolios:", error);
        toast.error("Failed to load portfolio items.");
        setLoading(false);
      }
    };
    fetchPortfolios();
  }, []);
  
  const totalPages = Math.ceil(portfolios.length / itemsPerPage);

  const displayedPortfolios = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return portfolios.slice(indexOfFirstItem, indexOfLastItem);
  }, [portfolios, currentPage]);

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return <div className="loading-container"><p>Loading Portfolios...</p></div>;
  }

  return (
    <div id="portfolio">
      <Helmet>
        <title>Mugcrater Portfolio</title>
      </Helmet>

      {displayedPortfolios.length > 0 ? (
        <>
          {displayedPortfolios.map((portfolio) => (
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
          ))}

          <div className="container portfolio-list">
            <div className="row text-center">
              <div className="col-12 pagination">
                <ul className="nav justify-content-center" style={{ display: 'flex', alignItems: 'center', listStyle: 'none' }}>
                  <li 
                    onClick={() => handlePageChange(currentPage - 1)}
                    style={{ cursor: currentPage === 1 ? 'not-allowed' : 'pointer', opacity: currentPage === 1 ? 0.3 : 1, margin: '0 15px' }}
                  >
                    &lt;&lt;
                  </li>
                  {pageNumbers.map(number => (
                    <li 
                      key={number} 
                      onClick={() => handlePageChange(number)}
                      className={currentPage === number ? "filter-active" : ""}
                      style={{ cursor: 'pointer', margin: '0 15px' }}
                    >
                      {number < 10 ? `0${number}` : number}
                    </li>
                  ))}
                  <li 
                    onClick={() => handlePageChange(currentPage + 1)}
                    style={{ cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', opacity: currentPage === totalPages ? 0.3 : 1, margin: '0 15px' }}
                  >
                    &gt;&gt;
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="container p-5">
            <p className="text-center">No portfolio items found.</p>
        </div>
      )}
    </div>
  );
};

export default Portfolio;