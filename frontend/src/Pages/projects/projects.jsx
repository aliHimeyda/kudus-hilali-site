import React, { useCallback, useEffect, useRef, useState } from "react";
import "./projects.css";
import CauseCard from "../../components/recentcause/cause";
import Bottomline from "../../components/bottomline/bottomline";
import axios from "axios";
import Logo from "../../components/logo/logo";
import { Link } from "react-router-dom";
import Preloader from "../../components/preloader/preloader";
import { useTranslation } from "react-i18next";

const BASE = "http://kudushilali.org/backend/projects/projects_CRUD.php";
const Projects = () => {
  const PAGE_SIZE = 5;
  const { t, i18n } = useTranslation();
  const categories = t("project_categories", { returnObjects: true });
  const firstCategory = categories[0];

  const sectionRef = useRef(null);
  const elementRef = useRef(null);

  const [catActive, setActive] = useState(firstCategory);
  const [causes, setCauses] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  // splash/ilk yükleme bekleyicisi
  useEffect(() => {
    const tmr = setTimeout(() => setLoading(false), 0);
    return () => clearTimeout(tmr);
  }, []);

  const fetchProjects = useCallback(
    async (category = firstCategory, p = 0) => {
      if (isLoading || (!hasMore && p > 0)) return;
      setIsLoading(true);
      try {
        const baseUrl =
          category === firstCategory
            ? `${BASE}?limit=${PAGE_SIZE}&page=${p}`
            : `${BASE}?category=${encodeURIComponent(
                category
              )}&limit=${PAGE_SIZE}&page=${p}`;

        const res = await axios.get(baseUrl, {
          params: { lang: i18n.language },
        });
        const items = res?.data?.data ?? [];

        // p === 0 ise replace (ilk sayfa), >0 ise append
        setCauses((prev) => (p === 0 ? items : [...prev, ...items]));

        // gelen paket PAGE_SIZE'tan küçükse devam yok
        if (items.length < PAGE_SIZE) setHasMore(false);

        // eleman gelmişse sayfayı artır
        if (items.length > 0) setPage((n) => n + 1);
      } catch (error) {
        console.error("Projeler alınırken hata oluştu:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [firstCategory, i18n.language, isLoading, hasMore]
  );

  // ilk yükleme + dil veya kategori değişince resetleyip ilk sayfayı çek
  useEffect(() => {
    setPage(0);
    setHasMore(true);
    setCauses([]);
    fetchProjects(catActive, 0);
  }, [i18n.language, catActive]);

  const GetProjectsByCategory = (category) => {
    setActive(category); // effect tetiklenecek ve fetchProjects(category, 0) çalışacak
  };

  // sonsuz kaydırma
  useEffect(() => {
    const handleScroll = () => {
      if (isLoading || !hasMore) return;

      const scrollPos = window.innerHeight + window.scrollY;
      const docHeight = document.documentElement.scrollHeight;

      if (docHeight - scrollPos < 120) {
        fetchProjects(catActive, page);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isLoading, hasMore, fetchProjects, catActive, page]);

  return (
    <>
      <Preloader show={loading} />
      <div
        className="projectspage d-flex flex-column align-items-center justify-content-center"
        ref={elementRef}
      >
        <h2 className="h2">{t("whatwedo_title")}</h2>

        <div
          className="categoriescontainer justify-content-md-center justify-content-start d-flex mt-5"
          dir={i18n.language === "ar" ? "rtl" : "ltr"}
        >
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
            isLoading ? "visible" : ""
          } d-flex justify-content-center align-items-center mt-5`}
        >
          <Logo />
        </div>
      </div>
    </>
  );
};

export default Projects;
