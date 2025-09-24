import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./newspage.css";
import Newscard from "../../components/newscard/newscard";
import Bottomline from "../../components/bottomline/bottomline";
import Logo from "../../components/logo/logo";
import { Link } from "react-router-dom";
import Preloader from "../../components/preloader/preloader";
import { useTranslation } from "react-i18next";

const BASE_URL = "http://kudushilali.org/backend/news/news_CRUD.php";


const Newspage = () => {
  const { t } = useTranslation();
  const sectionRef = useRef(null);
  const elementRef = useRef(null);
  const [isloading, setIsLoading] = useState(false);
  const [news, setNews] = useState([]);
  const [catActive, setActive] = useState(t("news_categories", { returnObjects: true })[0]);
 const [loading, setLoading] = useState(true);

const categories = t("news_categories", { returnObjects: true });
const { i18n } = useTranslation();
  useEffect(() => {
    // Örnek: 2.5 sn sonra kapat
    const t = setTimeout(() => setLoading(false), 0);
    return () => clearTimeout(t);
  }, []);

  const fetchNews = async (category = "All") => {
    setIsLoading(true);
    try {
      const url =
        category === "All"
          ? `${BASE_URL}?action=view`
          : `${BASE_URL}?action=view&category=${encodeURIComponent(category)}`;
      const res = await axios.get(url, {
        params: {
          lang: i18n.language
        }
      });
      setNews(res.data.data);
    } catch (err) {
      console.error(err);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const GetNewsByCategory = (category) => {
    setActive(category);
    fetchNews(category);
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
      className="newspage d-flex flex-column align-items-center justify-content-center"
      ref={elementRef}
    >
      <h2 className="h2">{t("news_latest_n")}</h2>
      <div className="categoriescontainer justify-content-md-center justify-content-start d-flex mt-5">
        {categories.map((category, index) => (
          <div
            key={index}
            className={`category-btn ${
              catActive === category ? "active" : ""
            }`}
            onClick={() => GetNewsByCategory(category)}
          >
            {category}
          </div>
        ))}
      </div>
      <Bottomline />
      <div
        className="d-flex flex-row align-items-center justify-content-center flex-wrap gap-5 pt-5"
        ref={sectionRef}
      >
        {news.length > 0 ? (
          news.map((newvalue) => (
            <Newscard newsvalue={newvalue} key={newvalue.id} />
          ))
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

export default Newspage;
