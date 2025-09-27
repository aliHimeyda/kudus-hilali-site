import React, { useEffect, useRef, useState } from "react";
import "./causes.css";
import CauseCard from "../recentcause/cause";
import Bottomline from "../bottomline/bottomline";
import Allsbtn from "../btns/allsbtn";
import axios from "axios";
import { useTranslation } from "react-i18next";

const RecentCauses = () => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t,i18n } = useTranslation();
  const fetchLatestProjects = async () => {
    try {
      const res = await axios.get(
        "http://kudushilali.org/backend/projects/projects_CRUD.php",
        {
          params: {
            lang: i18n.language,
          },
        }
      );
      if (res.data.status === "success") {
        setProjects(res.data.data.slice(0, 3));
      }
    } catch (error) {
      console.error("Latest projects fetch error:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLatestProjects();

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={`recent-causes-section ${isVisible ? "animate-cards" : ""}`}
      ref={sectionRef}
    >
      <h6 className="text-danger text-center mt-5">{t("projects_section")}</h6>
      <h2 className="text-center title h2">{t("projects_latest")}</h2>

      {loading ? (
        <p className="text-center mt-4">{t("loading")}</p>
      ) : (
        <div className="d-flex flex-column flex-md-row align-items-center justify-content-center flex-wrap gap-5 my-5">
          {projects.length > 0 ? (
            projects.map((cause) => <CauseCard key={cause.id} value={cause} />)
          ) : (
            <p className="text-center">{t("projects_none")}</p>
          )}
        </div>
      )}

      <Allsbtn title={t("projects_explore_all")} path={"/Projects"} />
      <Bottomline />
    </div>
  );
};

export default RecentCauses;
