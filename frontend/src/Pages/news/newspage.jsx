import React, { useCallback, useEffect, useRef, useState } from "react";
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
 const { t, i18n } = useTranslation();
const sectionRef = useRef(null);
const elementRef = useRef(null);

const PAGE_SIZE = 5;

const [pagenum, setPagenum]     = useState(0);
const [hasMore, setHasMore]     = useState(true);
const [isLoading, setIsLoading] = useState(false);
const [news, setNews]           = useState([]);
const [loading, setLoading]     = useState(true);

const categories = t("news_categories", { returnObjects: true });
const [catActive, setActive] = useState(categories[0]);

useEffect(() => {
  const tmr = setTimeout(() => setLoading(false), 0);
  return () => clearTimeout(tmr);
}, []);

const fetchNews = useCallback(async (category = categories[0], num = 0) => {
  if (isLoading || (!hasMore && num > 0)) return;

  setIsLoading(true);
  try {
    const base = `${BASE_URL}?action=view`;
    const params =
      category === categories[0]
        ? `&limit=${PAGE_SIZE}&page=${num}`
        : `&category=${encodeURIComponent(category)}&limit=${PAGE_SIZE}&page=${num}`;

    const res = await axios.get(base + params, { params: { lang: i18n.language } });
    const items = res?.data?.data ?? [];

    // İlk sayfa ise replace, devamında append
    setNews(prev => (num === 0 ? items : [...prev, ...items]));

    // Has more: son paket PAGE_SIZE'tan küçükse bitti
    if (items.length < PAGE_SIZE) setHasMore(false);

    // Sadece sonuç geldiyse sayfayı ilerlet
    if (items.length > 0) setPagenum(n => n + 1);
  } catch (err) {
    console.error(err);
  } finally {
    setIsLoading(false);
  }
}, [i18n.language, categories, isLoading, hasMore]);

// İlk yükleme + dil değişince yeniden yükle
useEffect(() => {
  setPagenum(0);
  setHasMore(true);
  fetchNews(catActive, 0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [i18n.language, catActive]);

const GetNewsByCategory = (category) => {
  setActive(category);
  setPagenum(0);
  setHasMore(true);
  fetchNews(category, 0);
};

useEffect(() => {
  const handleScroll = () => {
    if (isLoading || !hasMore) return;

    const scrollPos = window.innerHeight + window.scrollY;
    const docHeight = document.documentElement.scrollHeight;

    if (docHeight - scrollPos < 120) {
      fetchNews(catActive, pagenum);
    }
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  return () => window.removeEventListener("scroll", handleScroll);
}, [isLoading, hasMore, fetchNews, catActive, pagenum]);


  return (
    <>
      <Preloader show={loading} />
      <div
        className="newspage d-flex flex-column align-items-center justify-content-center"
        ref={elementRef}
      >
        <h2 className="h2">{t("news_latest_n")}</h2>
        <div
          className="categoriescontainer justify-content-md-center justify-content-start d-flex mt-5"
          dir={i18n.language === "ar" ? "rtl" : "ltr"}
        >
          {categories.map((category, index) => (
            <div
              key={index}
              className={`category-btn ${
                catActive === category ? "active" : ""
              }`}
              onClick={() => GetNewsByCategory(category,pagenum)}
            >
              {category}
            </div>
          ))}
        </div>
        <Bottomline />
        <div
          className="news-container d-flex flex-row align-items-center justify-content-center flex-wrap gap-5 pt-5"
          ref={sectionRef}
          dir={i18n.language === "ar" ? "rtl" : "ltr"}
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
            isLoading ? "visible" : ""
          } d-flex justify-content-center align-items-center mt-5`}
        >
          <Logo />
        </div>
      </div>
    </>
  );
};

export default Newspage;
