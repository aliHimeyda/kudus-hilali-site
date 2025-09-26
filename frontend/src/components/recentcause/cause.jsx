import React, { useEffect, useRef, useState } from "react";
import "./cause.css";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const CauseCard = ({ value }) => {
  const percent = Math.min((value.raised / value.goal) * 100, 100);
  const sectionRef = useRef(null);
  const { t, i18n } = useTranslation();
   const isAr = i18n.language === "ar";
  const [isVisible, setIsVisible] = useState(false);
  const [width, setWidth] = useState(0);
  const categoryColors = {
    [t("project_categories.0")]: "bg-secondary",
    [t("project_categories.1")]: "bg-danger",
    [t("project_categories.2")]: "bg-success",
    [t("project_categories.3")]: "bg-warning",
    [t("project_categories.4")]: "bg-primary",
    [t("project_categories.5")]: "bg-info",
  };

  const colorClass = categoryColors[value.category] || "bg-dark";
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
        <span className={`badge ${colorClass}`}>{value.category}</span>
      </div>
       <div className={`p-3 ${isAr ? "text-end rtl-text" : ""}`} dir={isAr ? "rtl" : "ltr"}>
      <strong>{value.title}</strong>

      <div className="d-flex justify-content-between small mt-5 d-none">
        <span>${value.raised.toLocaleString()}</span>
        <span className="text-muted">
          ${value.goal.toLocaleString()} {t("cause_goal")}
        </span>
      </div>

      <div className="progress mt-1 d-none">
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
        />
      </div>

      <button className="btn btn-success btn-sm mt-4">
        {t("cause_know_more")}
      </button>
    </div>
    </div>
  );
};

export default CauseCard;
