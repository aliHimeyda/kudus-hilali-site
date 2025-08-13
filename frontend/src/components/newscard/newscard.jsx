import React from "react";
import "./newscard.css";
import { useNavigate } from "react-router-dom";

const Newscard = ({ newsvalue }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/newsdetailspage/${newsvalue.id}`);
  };

  return (
    <div className="news-card d-flex flex-md-row flex-column justify-content-md-center align-items-md-center" onClick={handleClick}>
      <img loading="lazy" src={newsvalue.image_url || newsvalue.image} alt="News" className="news-img" />
      <div className="news-content">
        <div className="news-meta">
          <img loading="lazy" src="/assets/dateicon.svg" alt="calendar" className="meta-icon" />
          <span>{newsvalue.date}</span>
          <span className="divider">|</span>
          <img loading="lazy" src="/assets/commenticon.svg" alt="comment" className="meta-icon" />
          <span>1 Comment ({newsvalue.comments})</span>
        </div>
        <h5 className="news-title">{newsvalue.title}</h5>
        <div className="news-admin ">
          <div className="admin-avatar" >
            <img loading="lazy" src={newsvalue.admin_image || newsvalue.adminimage} alt="" />
          </div>
          <p className="text-center m-0 fs-6">{newsvalue.admin_name || newsvalue.admin}</p>
        </div>
      </div>
      <div className="ellipse" >
        <p>Read More</p>
      </div>
    </div>
  );
};

export default Newscard;
