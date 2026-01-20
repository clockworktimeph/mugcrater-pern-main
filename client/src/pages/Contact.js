
import React from 'react';
import { Helmet } from 'react-helmet';
import ContactHeader from "../components/ContactHeader";
import "../css/Contact.css";

const PageContact = () => {
  return (
    <div className="contact">
      <ContactHeader/>
      <div className="container">
        <div className="row">
          <img src={process.env.PUBLIC_URL + '/img/Contact.svg'} className="aboutImg" alt="About"></img>
        </div>
      </div>
      <Helmet>
        <script src="/js/main.js" async></script>
      </Helmet>
    </div>
  );
};

export default PageContact;
