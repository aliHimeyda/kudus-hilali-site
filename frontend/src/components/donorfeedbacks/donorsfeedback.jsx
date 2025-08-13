
import React from "react";
import "./donorfeedback.css";

const DonorFeedback = ({ name, text, image, stars }) => {
  return (
    <div className="feedback-card text-center d-flex flex-md-column flex-row justify-content-center align-items-center">
      <img loading="lazy" src={image} alt={name} className="feedback-img mb-3" />
      <div className="values">
        <h5 className="feedback-name">{name}</h5>
      <p className="feedback-text">{text}</p>
      <div className="feedback-stars">
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i}>{i < stars ? "★" : "☆"}</span>
        ))}
      </div>
      </div>
    </div>
  );
};

export default DonorFeedback;
