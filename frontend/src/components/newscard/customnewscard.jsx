import React from "react";
import "./newscard.css";
import { useNavigate } from "react-router-dom";

const Customnewscard = ({ news }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/newsdetailspage/${news.id}`);
  };

  return (
    <div
      className="customnewscard d-flex flex-row align-items-center justify-content-center gap-3 p-2"
      onClick={handleClick}
    >
      <div
        className="newsimage"
        style={{
          backgroundImage: `url(${news.image})`,
          width: "80px",
          height: "80px",
          backgroundSize: "cover",
          backgroundPosition: "center",
          borderRadius: "8px",
          flexShrink: 0
        }}
      ></div>

      <div className="newsdata d-flex flex-column gap-2">
        <div className="newsmeta d-flex flex-row align-items-center gap-1">
          <img decoding="async" loading="lazy" src="/assets/dateicon.svg" alt="" />
          <p className="m-0">{news.publish_date || news.date}</p>
        </div>
        <p className="newstitle m-0">{news.title}</p>
      </div>
    </div>
  );
};

export default Customnewscard;
