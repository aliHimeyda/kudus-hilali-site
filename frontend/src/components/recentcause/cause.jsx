import React, { useEffect, useRef, useState } from "react";
import "./cause.css";
import { useNavigate } from "react-router-dom";

const CauseCard = ({ value }) => {
  const percent = Math.min((value.raised / value.goal) * 100, 100);
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [width, setWidth] = useState(0);

  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/projectdetailspage/${value.id}`);
  };
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        root: null,
        threshold: 0.3,
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setWidth(percent);
      }, 50);

      return () => clearTimeout(timer);
    }
  }, [isVisible, percent]);

  return (
    <div
      key={value.id}
      className={`cause-card ${isVisible ? "visible" : ""} shadow-xl`}
      ref={sectionRef}
      onClick={handleClick}
    >
      <div
        className="image-area"
        style={{ backgroundImage: `url(${value.image})` }}
      >
        <span className="badge bg-danger">{value.category}</span>
      </div>
      <div className="p-3">
        <strong>{value.title}</strong>
        <div className="d-flex justify-content-between small mt-5">
          <span>${value.raised.toLocaleString()}</span>
          <span className="text-muted">
            ${value.goal.toLocaleString()} Goal
          </span>
        </div>
        <div className="progress mt-1">
          <div
            className="progress-bar"
            role="progressbar"
            style={{
              width: `${width}%`,
              transition: "width 3s",
              backgroundColor:
                percent < 40
                  ? "var(--color-red)"
                  : percent < 70
                  ? "var(--color-orange)"
                  : "var(--color-green)",
            }}
          ></div>
        </div>
        <button className="btn btn-success btn-sm mt-4">MAKE A DONATION</button>
      </div>
    </div>
  );
};

export default CauseCard;
