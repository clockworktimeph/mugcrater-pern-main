import React, { useState, useEffect, useMemo } from "react";
import { Helmet } from 'react-helmet';
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import "../css/Blog.css";

const makeAbsoluteUrl = (url) => {
  if (!url) return "#";
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  return `https://${url}`;
};

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; 

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch("http://localhost:5002/api/getblogs");
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
  }, []);
  
  const totalPages = Math.ceil(blogs.length / itemsPerPage);
  const displayedBlogs = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return blogs.slice(indexOfFirstItem, indexOfLastItem);
  }, [blogs, currentPage]);

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
    return <div className="loading-container"><p>Loading Blogs...</p></div>;
  }

  return (
    <main id="portfolio">
      <Helmet>
        <title>Mugcrater Blog - Web Development & Innovation Insights</title>
        <meta name="description" content="Read the latest insights on web development, Agile processes, and pixel-perfect design from the Mugcrater." />
        <link rel="canonical" href={window.location.href} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Mugcrater Blog" />
        <meta property="og:description" content="Brewing Ideas, Brewing Innovations." />
      </Helmet>
      
      <div className="container">
         <h1 className="visually-hidden">Mugcrater Blog Posts</h1>
      </div>

      {displayedBlogs.length > 0 ? (
        <>
          {displayedBlogs.map((blog) => (
            <article className="portfolioSection" key={blog.id}>
              <script type="application/ld+json">
                {JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "BlogPosting",
                  "headline": blog.title,
                  "description": blog.content,
                  "image": `http://localhost:5002/uploads/blog/${blog.image}`,
                  "url": makeAbsoluteUrl(blog.url)
                })}
              </script>

              <div className="container">
                <div className="row">
                  <div className="col-12">
                    {/* <a href={makeAbsoluteUrl(blog.url)}rel="noopener noreferrer">
                      <img 
                        src={`http://localhost:5002/uploads/blog/${blog.image}`} 
                        alt={blog.title} 
                        loading="lazy"
                        className="img-fluid"
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/800x400?text=No+Image'; }}
                      />
                    </a> */}
                    {/* Link to the internal Blog Details page using the blog ID */}
                    <Link to={`/blog/${blog.id}`}>
                      <img 
                        src={`${process.env.REACT_APP_API_URL || 'http://localhost:5002'}/uploads/blog/${blog.image}`} 
                        alt={blog.title} 
                        loading="lazy"
                        className="img-fluid blog-card-img"
                        style={{ cursor: 'pointer', transition: '0.3s' }} 
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/800x400?text=No+Image'; }}
                      />
                    </Link>
                  </div>
                  <div className="col-12 aboutTitle">
                    <h2 className="contentTitle"> {blog.title || "Untitled Blog Post"} </h2>
                  </div>
                  {/* <div className="col-12 aboutDesc">
                    <div className="contentDesc" dangerouslySetInnerHTML={{ __html: blog.content}}/>
                  </div> */}
                  <div className="col-12 aboutDesc">
                    {blog.content ? (
                      <div className="contentDesc">
                        {blog.content.replace(/<[^>]*>?/gm, '').length > 200
                          ? blog.content.replace(/<[^>]*>?/gm, '').substring(0, 200) + "..."
                          : blog.content.replace(/<[^>]*>?/gm, '')}
                      </div>
                    ) : (
                      "No content available."
                    )}
                  </div>
                </div>
              </div>
            </article>
          ))}
          <nav className="container portfolio-list" aria-label="Blog pagination">
            <div className="row text-center">
              <div className="col-12 pagination">
                <ul className="nav justify-content-center" style={{ display: 'flex', alignItems: 'center', listStyle: 'none' }}>
                  <li 
                    onClick={() => handlePageChange(currentPage - 1)}
                    style={{ 
                        cursor: currentPage === 1 ? 'not-allowed' : 'pointer', 
                        opacity: currentPage === 1 ? 0.3 : 1, 
                        margin: '0 15px' 
                    }}
                    aria-label="Previous page"
                  >
                    &lt;&lt;
                  </li>
                  {pageNumbers.map(number => (
                    <li 
                      key={number} 
                      onClick={() => handlePageChange(number)}
                      className={currentPage === number ? "filter-active" : ""}
                      style={{ 
                        cursor: 'pointer', 
                        margin: '0 15px',
                        color: currentPage === number ? '#cb3694' : 'inherit',
                        fontWeight: currentPage === number ? 'bold' : 'normal'
                      }}
                    >
                      {number < 10 ? `0${number}` : number}
                    </li>
                  ))}
                  <li 
                    onClick={() => handlePageChange(currentPage + 1)}
                    style={{ 
                        cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', 
                        opacity: currentPage === totalPages ? 0.3 : 1, 
                        margin: '0 15px' 
                    }}
                    aria-label="Next page"
                  >
                    &gt;&gt;
                  </li>
                </ul>
              </div>
            </div>
          </nav>
        </>
      ) : (
        <div className="container p-5">
            <p className="text-center">No blog posts found.</p>
        </div>
      )}
    </main>
  );
};

export default Blog;