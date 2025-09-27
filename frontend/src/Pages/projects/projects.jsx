import React, { useEffect, useRef, useState } from "react";
import "./projects.css";
import CauseCard from "../../components/recentcause/cause";
import Bottomline from "../../components/bottomline/bottomline";
import axios from "axios";
import Logo from "../../components/logo/logo";
import { Link } from "react-router-dom";
import Preloader from "../../components/preloader/preloader";
import { useTranslation } from "react-i18next";



const Projects = () => {
  const { t } = useTranslation();
  const sectionRef = useRef(null);
  const elementRef = useRef(null);
  const [isloading, setIsLoading] = useState(false);
  const [causes, setCauses] = useState([]);
  const [catActive, setActive] = useState(t("project_categories", { returnObjects: true })[0]);
   const [loading, setLoading] = useState(true);

const categories = t("project_categories", { returnObjects: true });
const { i18n } = useTranslation();
  useEffect(() => {
    // Örnek: 2.5 sn sonra kapat
    const t = setTimeout(() => setLoading(false), 0);
    return () => clearTimeout(t);
  }, []);
  const fetchProjects = async (category = t("project_categories", { returnObjects: true })[0]) => {
    setIsLoading(true);
    try {
      const url =
        category === t("project_categories", { returnObjects: true })[0]
          ? "http://kudushilali.org/backend/projects/projects_CRUD.php"
          : `http://kudushilali.org/backend/projects/projects_CRUD.php?category=${encodeURIComponent(
              category
            )}`;
      const res = await axios.get(url,
  {
    params: {
      lang: i18n.language
    }
  }
);
      if (res.data.status === "success") {
        setCauses(res.data.data);
      }
    } catch (error) {
      console.error("Projeler alınırken hata oluştu:", error);
    }
    setIsLoading(false);
  };
  useEffect(() => {
    fetchProjects();
  }, []);
  const GetProjectsByCategory = (category) => {
    setActive(category);
    fetchProjects(category);
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.innerHeight + window.scrollY;
      const bottomPosition = elementRef.current.offsetHeight;
      if (bottomPosition - scrollPosition < 100 && !isloading) {
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 500);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isloading]);

 return (
  <>
    <Preloader show={loading} />
    <div
      className="projectspage d-flex flex-column align-items-center justify-content-center"
      ref={elementRef}
    >
      <h2 className="h2">{t("whatwedo_title")}</h2>

      <div className="categoriescontainer justify-content-md-center justify-content-start d-flex mt-5" dir={i18n.language === "ar" ? "rtl" : "ltr"}>
        {categories.map((category, index) => (
          <div
            key={index}
            className={`category-btn btn ${
              catActive === category ? "active" : ""
            }`}
            onClick={() => GetProjectsByCategory(category)}
          >
            {category}
          </div>
        ))}
      </div>

      <Bottomline />

      <div
        className="d-flex flex-row align-items-center justify-content-center flex-wrap gap-5 pt-5"
        dir={i18n.language === "ar" ? "rtl" : "ltr"}
        ref={sectionRef}
      >
        {causes.length > 0 ? (
          causes.map((cause) => <CauseCard key={cause.id} value={cause} />)
        ) : (
          <div className="text-center">
            <div className="d-flex flex-row gap-1 align-items-center justify-content-center mb-3">
              <Logo />
              <div className="messagetitle d-md-flex flex-column d-none">
                {i18n.language === "ar" ? (
                  <>
                    <span className="fw-light">{t("logo_subtitle")}</span>
                    <span className="fw-bold">{t("logo_title")}</span>
                  </>
                ) : (
                  <>
                    <span className="fw-bold">{t("logo_title")}</span>
                    <span className="fw-light">{t("logo_subtitle")}</span>
                  </>
                )}
              </div>
            </div>

            <p className="description">
              {t("news_empty_line1")} <br />
              {t("news_empty_line2")} <br />
              {t("news_empty_line3")} <br />
              <Link to="/aboutuspage">{t("read_more_about")}</Link>.
            </p>
          </div>
        )}
      </div>

      <div
        className={`loading ${
          isloading ? "visible" : ""
        } d-flex justify-content-center align-items-center mt-5`}
      >
        <Logo />
      </div>
    </div>
  </>
);

};

export default Projects;
