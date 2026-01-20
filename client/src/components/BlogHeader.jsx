import React from "react";
import "../css/SectionGreyBanner.css";

const BlogHeader = () => {
  return (

    <div className="contentSectionGreyBanner">
      <div className="container">
        <div className="row">
          <div className="col-12 aboutTitle">
            <span className="contentTitle"> Subscribe to our Blog </span>
          </div>
          <div className="col-12 aboutIntro">
            <span className="contentIntro"> Stay updated with the latest posts and insights! </span>
          </div>
          <hr className="borderLineContent"></hr>
          <div className="col-12 aboutDesc">
            <span className="contentDesc"> Join our community by subscribing today. </span>
          </div>
          <div className="col-12 aboutDesc">
            <div className="col contentBtn">
              <a className="bannerBtn" href="#contact">Submit</a>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    // <div className="contentSectionGreyBanner">
    //   <div className="container">
    //     <div className="row">
    //       <div className="col-12 aboutTitle">
    //         <span className="contentTitle"> Subscribe to our Blog. </span>
    //       </div>
    //       <div className="col-12 aboutIntro">
    //         <span className="contentIntro"> Stay updated with the latest posts and insights! </span>
    //       </div>
    //       <hr className="borderLineContent"></hr>
    //       <div className="col-12 aboutDesc">
    //         <span className="contentDesc"> Join our community by subscribing today. </span>
    //       </div>
    //       {/* <div className="col-12 aboutDesc">
    //         <form>
    //           <div className="container form-row align-items-center">
    //             <div className="row">
    //               <input type="email" className="form-control mb-2" placeholder="Email"/>
    //               <button type="submit" className="btn btn-primary mb-2">Submit</button>
    //             </div>
    //           </div>
    //         </form>
    //       </div> */}
    //     </div>
    //   </div>
    // </div>
  );
};

export default BlogHeader;
