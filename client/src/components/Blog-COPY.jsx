import React, { useState, useEffect, useMemo } from "react";
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom'; // Added for navigation
import { toast } from "react-toastify";
import "../css/Blog.css";

// 1. Helper to strip HTML and limit characters for SEO-friendly preview
const getPreviewText = (html, limit = 150) => {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;
  const text = tempDiv.textContent || tempDiv.innerText || "";
  return text.length > limit ? text.substring(0, limit) + "..." : text;
};

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const navigate = useNavigate();

  // 2. Use Dynamic API URL
  const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5002";

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/getblogs`);
        if (!response.ok) throw new Error('Failed to fetch blogs from API');
        
        let data = await response.json();
        if (data?.blogs) data = data.blogs;
        if (!Array.isArray(data)) data = [data];

        setBlogs(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching blogs:", error);
        toast.error("Failed to load blog items.");
        setLoading(false);
      }
    };
    fetchBlogs();
  }, [API_BASE]);

  const totalPages = Math.ceil(blogs.length / itemsPerPage);
  const displayedBlogs = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return blogs.slice(indexOfFirstItem, indexOfLastItem);
  }, [blogs, currentPage]);

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return; 
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return <div className="loading-container"><p>Loading Blogs...</p></div>;
  }

  return (
    <main id="portfolio">
      <Helmet>
        <title>Mugcrater Blog | Web Development Insights</title>
        <meta name="description" content="Brewing Ideas, Brewing Innovations. Explore our latest articles." />
      </Helmet>
      
      <div className="container">
         <h1 className="visually-hidden">Mugcrater Blog Posts</h1>
      </div>

      {displayedBlogs.length > 0 ? (
        <>
          {displayedBlogs.map((blog) => (
            <article className="portfolioSection" key={blog.id}>
              <div className="container">
                <div className="row">
                  {/* Image Clickable */}
                  <div className="col-12 cursor-pointer" onClick={() => navigate(`/blog/${blog.id}`)}>
                    <img 
                      src={`${API_BASE}/uploads/blog/${blog.image}`} 
                      alt={blog.title} 
                      loading="lazy"
                      className="img-fluid blog-main-img"
                      style={{ cursor: 'pointer' }}
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/800x400?text=No+Image'; }}
                    />
                  </div>
                  
                  {/* Title Clickable */}
                  <div className="col-12 aboutTitle mt-3">
                    <Link to={`/blog/${blog.id}`} className="blog-link-title">
                      <h2 className="contentTitle"> {blog.title || "Untitled Blog Post"} </h2>
                    </Link>
                  </div>

                  {/* Content Preview */}
                  <div className="col-12 aboutDesc">
                    <p className="contentDesc">
                      {getPreviewText(blog.content, 200)} 
                    </p>
                    <Link to={`/blog/${blog.id}`} className="read-more-btn" style={{ color: '#cb3694', fontWeight: 'bold' }}>
                      Read Full Article →
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          ))}
          
          {/* Pagination */}
          <nav className="container portfolio-list" aria-label="Blog pagination">
             <div className="row text-center">
              <div className="col-12 pagination">
                <ul className="nav justify-content-center" style={{ display: 'flex', alignItems: 'center', listStyle: 'none' }}>
                  <li onClick={() => handlePageChange(currentPage - 1)} style={{ cursor: 'pointer', margin: '0 15px', opacity: currentPage === 1 ? 0.3 : 1 }}>&lt;&lt;</li>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                    <li 
                      key={number} 
                      onClick={() => handlePageChange(number)}
                      style={{ cursor: 'pointer', margin: '0 15px', color: currentPage === number ? '#cb3694' : 'inherit', fontWeight: currentPage === number ? 'bold' : 'normal' }}
                    >
                      {number < 10 ? `0${number}` : number}
                    </li>
                  ))}
                  <li onClick={() => handlePageChange(currentPage + 1)} style={{ cursor: 'pointer', margin: '0 15px', opacity: currentPage === totalPages ? 0.3 : 1 }}>&gt;&gt;</li>
                </ul>
              </div>
            </div>
          </nav>
        </>
      ) : (
        <div className="container p-5"><p className="text-center">No blog posts found.</p></div>
      )}
    </main>
  );
};

export default Blog;