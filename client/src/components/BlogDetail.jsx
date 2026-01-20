import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from 'react-helmet';
import { toast } from "react-toastify";
import "../css/Blog.css";

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5002";

  useEffect(() => {
    const fetchSingleBlog = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/getblog/${id}`);
        
        if (!response.ok) {
          throw new Error('Blog not found');
        }

        const data = await response.json();
        setBlog(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching blog details:", error);
        toast.error("Failed to load the blog post.");
        setLoading(false);
      }
    };

    fetchSingleBlog();
    window.scrollTo(0, 0); // Ensure page starts at the top
  }, [id, API_BASE]);

  if (loading) {
    return <div className="loading-container"><p>Loading Blog Content...</p></div>;
  }

  if (!blog) {
    return (
      <div className="container p-5 text-center">
        <h2>Blog Post Not Found</h2>
        <Link to="/blog" className="btn btn-primary mt-3">Back to Blogs</Link>
      </div>
    );
  }

  return (
    <main id="portfolio">
      <Helmet>
        <title>{blog.title} - Mugcrater Blog</title>
        <meta name="description" content={blog.title} />
        <meta property="og:title" content={blog.title} />
        <meta property="og:image" content={`${API_BASE}/uploads/blog/${blog.image}`} />
      </Helmet>

      <article className="portfolioSection">
        <div className="container">
          <div className="row">
            {/* Back Button */}
            <div className="col-12 mb-4">
               <Link to="/blog" style={{ color: '#cb3694', textDecoration: 'none', fontWeight: 'bold' }}>
                 ← Back to All Posts
               </Link>
            </div>

            {/* Main Blog Image */}
            <div className="col-12">
              <img 
                src={`${API_BASE}/uploads/blog/${blog.image}`} 
                alt={blog.title} 
                className="img-fluid w-100 rounded"
                style={{ maxHeight: '600px', objectFit: 'cover' }}
                onError={(e) => { e.target.src = 'https://via.placeholder.com/800x400?text=No+Image'; }}
              />
            </div>

            {/* Blog Title */}
            <div className="col-12 aboutTitle mt-4">
              <h1 className="contentTitle" style={{ fontSize: '2.5rem' }}> 
                {blog.title || "Untitled Blog Post"} 
              </h1>
            </div>

            {/* Full Blog Content (dangerouslySetInnerHTML is used here to show formatting) */}
            <div className="col-12 aboutDesc mt-3">
              <div 
                className="contentDesc full-view" 
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />
            </div>
          </div>
        </div>
      </article>
    </main>
  );
};

export default BlogDetail;