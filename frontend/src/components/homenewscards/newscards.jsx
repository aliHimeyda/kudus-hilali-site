import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./newscards.css";
import Newscard from "../newscard/newscard";
import Bottomline from "../bottomline/bottomline";
import Allsbtn from "../btns/allsbtn";
import { useTranslation } from "react-i18next";

const BASE_URL = "http://kudushilali.org/backend/news/news_CRUD.php?limit=5";

const NewsCards = () => {
  const [cards, setCards] = useState([]);
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);
  const { t, i18n } = useTranslation();
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await axios.get(`${BASE_URL}?action=view`, {
          params: {
            lang: i18n.language,
          },
        });
        setCards(res.data.data.slice(0, 3)); // Dikkat: .data.data
      } catch (err) {
        console.error("News fetch error:", err);
      }
    };
    fetchNews();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={`${cards.length === 0 ? "d-none" : ""}`}>
      <section
        ref={sectionRef}
        className={`news-section d-flex flex-column align-items-center ${
          visible ? "animate" : ""
        } mt-5 pt-5 `}
      >
        <h4 className="h4">{t("news_keep_up")}</h4>
        <h2 className="h2">
          {t("news_latest")} <span>{t("news_articles")}</span>
        </h2>
        <div className="cards-container mt-5  ">
          {cards.map((card, index) => (
            <Newscard key={card.id || index} newsvalue={card} />
          ))}
        </div>
        <Allsbtn title={t("news_view_all")} path={"/newspage"} />
      </section>
      <Bottomline />
    </div>
  );
};

export default NewsCards;
