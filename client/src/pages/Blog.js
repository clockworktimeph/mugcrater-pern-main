import React from 'react';
import { Helmet } from 'react-helmet';
import Blog from "../components/Blog";
import BlogHeader from "../components/BlogHeader";
import "../css/Blog.css";

const PageBlog = () => {
  return (
    <>
      <div className="container">
        <div className="row">
        </div>
      </div>
      <BlogHeader/>
      <Blog/>
      <Helmet>
        <script src="/js/main.js" async></script>
      </Helmet>
    </>
  );
};

export default PageBlog;
