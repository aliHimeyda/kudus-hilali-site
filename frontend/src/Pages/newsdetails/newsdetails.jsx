import React, { useEffect, useState, useRef, useMemo } from "react";
import axios from "axios";
import "./newsdetails.css";
import Customnewscard from "../../components/newscard/customnewscard";
import { useParams } from "react-router-dom";
import Comments from "../../components/commentarea/commentarea";
import Preloader from "../../components/preloader/preloader";
import DOMPurify from "dompurify";
import { useTranslation } from "react-i18next";

const BASE_URL = "http://kudushilali.org/backend/news/news_CRUD.php";

const NewsDetails = () => {
  const { newsid } = useParams();
  const [newsDetail, setNewsDetail] = useState(null);
  const [moreNews, setMoreNews] = useState([]);
  const animatedRefs = useRef([]);
  const [loading, setLoading] = useState(true);
  const { t, i18n } = useTranslation();
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 0);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await axios.get(`${BASE_URL}?action=view&id=${newsid}`, {
          params: {
            lang: i18n.language,
          },
        });
        setNewsDetail(res.data.data[0]);
      } catch (err) {
        console.error(err);
      }
    };
    const fetchMore = async () => {
      try {
        const res = await axios.get(`${BASE_URL}?action=view`, {
          params: {
            lang: i18n.language,
          },
        });
        const others = res.data.data.filter(
          (item) => item.id !== parseInt(newsid, 10)
        );
        const shuffled = [...others].sort(() => Math.random() - 0.5);
        setMoreNews(shuffled.slice(0, 3));
      } catch (err) {
        console.error(err);
      }
    };
    fetchDetail();
    fetchMore();
  }, [newsid]);

  useEffect(() => {
    const observers = animatedRefs.current.map((ref) => {
      if (!ref) return null;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) entry.target.classList.add("show");
        },
        { threshold: 0.3 }
      );
      obs.observe(ref);
      return obs;
    });
    return () => observers.forEach((obs) => obs && obs.disconnect());
  }, [newsDetail, moreNews]);

  // Tüm biçimlendirmeyi koruyarak güvenli HTML'e çevir (script/on* vs. kırpılır).
  const safeHtml = useMemo(() => {
    const raw = newsDetail?.content || "";
    return DOMPurify.sanitize(raw);
  }, [newsDetail]);

  // visit-experience için ilk ve son "blok"u (p/h*/ul/ol/blockquote/figure/table/img vb.) DOMPurify ile çıkar
  const { firstBlockHTML, lastBlockHTML } = useMemo(() => {
    const out = { firstBlockHTML: "", lastBlockHTML: "" };
    if (typeof window === "undefined" || !newsDetail?.content) return out;

    // DOMPurify ile DOM fragment üret (DOMParser kullanmadan)
    const frag = DOMPurify.sanitize(newsDetail.content, { RETURN_DOM: true });
    const container = document.createElement("div");
    container.appendChild(frag);

    // anlamlı çocukları topla
    const kids = Array.from(container.childNodes).filter((n) => {
      if (n.nodeType === 1) return n.outerHTML?.trim();
      if (n.nodeType === 3) return (n.textContent || "").trim();
      return false;
    });

    if (kids.length > 0) {
      const first = kids[0];
      out.firstBlockHTML =
        first.nodeType === 1
          ? first.outerHTML
          : DOMPurify.sanitize(first.textContent || "");
    }
    if (kids.length > 1) {
      const last = kids[kids.length - 1];
      out.lastBlockHTML =
        last.nodeType === 1
          ? last.outerHTML
          : DOMPurify.sanitize(last.textContent || "");
      // ilk ve son aynıysa yinelenmesin
      if (out.lastBlockHTML === out.firstBlockHTML) out.lastBlockHTML = "";
    }
    return out;
  }, [newsDetail]);

  if (!newsDetail) return <div>Loading...</div>;

  return (
    <>
      <Preloader show={loading} />
      <div className="newsdetailspage d-flex flex-column flex-md-row justify-content-center gap-4">
        <div
          className="news-wrapper d-flex flex-column align-items-center gap-4"
          dir={i18n.language === "ar" ? "rtl" : "ltr"}
        >
          <div
            className="news-image fade-section"
            ref={(el) => (animatedRefs.current[0] = el)}
            style={{ overflow: "hidden", position: "relative" }}
          >
            <img
              decoding="async"
              loading="lazy"
              src={newsDetail.detail_image_url || newsDetail.image}
              alt={newsDetail.title}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "20px",
              }}
            />
            <div
              className="news-d-meta d-flex gap-3 fade-section"
              ref={(el) => (animatedRefs.current[1] = el)}
            >
              <div className="lesson">
                <img
                  decoding="async"
                  loading="lazy"
                  src="/assets/dateicon.svg"
                  alt=""
                />{" "}
                {newsDetail.publish_date}
              </div>
            </div>
          </div>

          <div className="d-flex flex-column">
            <h2
              className="news-title fade-section"
              ref={(el) => (animatedRefs.current[2] = el)}
            >
              {newsDetail.title}
            </h2>

            {/* Tüm HTML biçimi güvenli şekilde render */}
            <div
              className="news-text fade-section"
              ref={(el) => (animatedRefs.current[3] = el)}
              dangerouslySetInnerHTML={{ __html: safeHtml }}
            />
          </div>
        </div>

        <div
          className="side-panel fade-section d-flex flex-column pt-5"
          ref={(el) => (animatedRefs.current[6] = el)}
          dir={i18n.language === "ar" ? "rtl" : "ltr"}
        >
          <h4>{t("more_news")}</h4>
          <div className="morenews d-flex flex-column gap-2 mt-2 mb-4">
            {moreNews.map((item) => (
              <Customnewscard news={item} key={item.id} />
            ))}
          </div>

          <h5>{t("contact_info_q")}</h5>
          <div className="contact-email">
            {t("email_label")}: <u>kudushilali@gmail.com</u>
          </div>
          <div className="contact-phone">
            {t("phone_label")}: +90 505 878 50 40
          </div>

          <div className="map-box">
            <iframe
              title={t("map_title")}
              src="https://www.google.com/maps?q=Arabacıalanı,605%20nolu%20sokak%20No:%201/1,%2054100%20Serdivan/Sakarya&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0, borderRadius: "10px" }}
              allowFullScreen
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewsDetails;
