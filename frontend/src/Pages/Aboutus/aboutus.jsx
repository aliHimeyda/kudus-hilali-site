import React, { useEffect, useRef } from "react";
import "./aboutus.css";
import { Link } from "react-router-dom";
import { useState } from "react";
import Preloader from "../../components/preloader/preloader";
import { useTranslation } from "react-i18next";

const files = ["abdulrahman-alshayeb", "ammar-alhalabi", "azmi-moroglu"];
const AnimatedSection = ({
  children,
  className = "",
  triggerPercent = 0.3,
}) => {
  const ref = useRef(null);

  const imageCacheRef = useRef();
  useEffect(() => {
    imageCacheRef.current = (src) => {
      if (!"/assets/2000.webp") return null;
      const img = new Image();
      img.src = src;
      return img;
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-show");
          observer.unobserve(entry.target);
        }
      },
      { threshold: triggerPercent }
    );
    if (ref.current) observer.observe(ref.current);
  }, [triggerPercent]);

  return (
    <div ref={ref} className={`animated-section ${className}`}>
      {children}
    </div>
  );
};

const Aboutus = () => {
  const [loading, setLoading] = useState(true);
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === "ar";
  useEffect(() => {
    // Örnek: 2 sn sonra kapat
    const t = setTimeout(() => setLoading(false), 0);
    return () => clearTimeout(t);
  }, []);
  return (
    <>
      <Preloader show={loading} />
      <div className="container-fluid p-0">
        <div className="hero-section position-relative text-center">
          <img loading="eager" src="/assets/2000.webp" alt={t("hero_alt")} />

          <div className="hero-text position-absolute start-50 translate-middle d-none">
            <button className="btn btn-warning px-4">
              {t("hero_watch_video")}
            </button>
          </div>
          <div className="curved-container"></div>
        </div>

        <div className="py-5">
          <div className="container d-flex flex-column gap-3 p-5 mt-0">
            <h6
              className="h4 text-uppercase text-danger mb-3"
              dir={i18n.language === "ar" ? "rtl" : "ltr"}
              style={{ fontSize: "11px" }}
            >
              {t("about_label")}
            </h6>

            <div
              className="w-100 d-flex flex-md-row flex-column gap-5 "
              dir={i18n.language === "ar" ? "rtl" : "ltr"}
            >
              <h2 className="fw-bold " style={{ fontSize: "33px" }}>
                {t("about_heading")}
              </h2>

              <p className="text-muted " style={{ fontSize: "15px" }}>
                {t("about_p1")} <br /> {t("about_p2")}
              </p>
            </div>
          </div>
        </div>

        <AnimatedSection className="image-gallery d-flex flex-row justify-content-center align-items-center gap-3 py-5">
          <AnimatedSection className="imgpacket1 d-flex flex-column align-items-end w-50 gap-4">
            <img
              src="/assets/200.webp"
              alt={t("gallery_alt_1")}
              style={{ width: "250px", height: "450px", objectFit: "cover" }}
              className="image1"
            />
            <AnimatedSection className="d-flex flex-row w-100 justify-content-end gap-4">
              <img
                src="/assets/5000.webp"
                alt={t("gallery_alt_2")}
                style={{
                  width: "300px",
                  height: "200px",
                  objectFit: "contain",
                }}
                className="image2"
              />
              <img
                src="/assets/a6.webp"
                alt={t("gallery_alt_3")}
                style={{ width: "200px", height: "200px", objectFit: "cover" }}
                className="px-3 image3"
              />
            </AnimatedSection>
          </AnimatedSection>

          <AnimatedSection className="imgpacket2 d-flex flex-column w-50 gap-3">
            <AnimatedSection className="d-flex flex-row w-100 align-items-end gap-3">
              <img
                src="/assets/a5.webp"
                alt={t("gallery_alt_4")}
                style={{
                  width: "180px",
                  height: "200px",
                  objectFit: "contain",
                }}
                className="image4"
              />
              <img
                src="/assets/a4.webp"
                alt={t("gallery_alt_5")}
                style={{ width: "300px", height: "300px", objectFit: "cover" }}
                className="image5"
              />
            </AnimatedSection>
            <img
              src="/assets/a2.webp"
              alt={t("gallery_alt_6")}
              style={{ width: "250px", height: "300px", objectFit: "contain" }}
              className="image6"
            />
          </AnimatedSection>
        </AnimatedSection>

        <br />
        <br />

        <AnimatedSection className="py-5 mt-5 d-flex flex-column align-items-center text-center">
          <h6
            className="h4 text-uppercase text-danger mb-3"
            style={{ fontSize: "11px" }}
          >
            {t("values_label")}
          </h6>
          <h2
            className="fw-bold mb-4 "
            style={{ width: "100%", fontSize: "33px" }}
            dir={i18n.language === "ar" ? "rtl" : "ltr"}
          >
            {t("values_heading")}
          </h2>

          <div className="d-flex flex-column flex-md-row justify-content-center w-50">
            <div dir={i18n.language === "ar" ? "rtl" : "ltr"}>
              <div className="d-flex flex-column">
                <div className="value-card p-3">
                  <div className="icon-box mb-2">
                    <img
                      decoding="async"
                      loading="lazy"
                      src="/assets/Workflow.svg"
                      alt=""
                    />
                  </div>
                  <h5 className="fw-bold" style={{ fontSize: "17px" }}>
                    {t("values_solidarity_title")}
                  </h5>
                  <p className="text-muted" style={{ fontSize: "13px" }}>
                    {t("values_solidarity_text")}
                  </p>
                </div>
              </div>

              <div className="d-flex flex-column">
                <div className="value-card p-3">
                  <div className="icon-box mb-2">
                    <img
                      decoding="async"
                      loading="lazy"
                      src="/assets/Iconshape.svg"
                      alt=""
                    />
                  </div>
                  <h5 className="fw-bold" style={{ fontSize: "17px" }}>
                    {t("values_resilience_title")}
                  </h5>
                  <p className="text-muted" style={{ fontSize: "13px" }}>
                    {t("values_resilience_text")}
                  </p>
                </div>
              </div>
            </div>

            <div dir={i18n.language === "ar" ? "rtl" : "ltr"}>
              <div className="d-flex flex-column">
                <div className="value-card p-3">
                  <div className="icon-box mb-2">
                    <img
                      decoding="async"
                      loading="lazy"
                      src="/assets/likeicon.svg"
                      alt=""
                    />
                  </div>
                  <h5 className="fw-bold" style={{ fontSize: "17px" }}>
                    {t("values_accountability_title")}
                  </h5>
                  <p className="text-muted" style={{ fontSize: "13px" }}>
                    {t("values_accountability_text")}
                  </p>
                </div>
              </div>

              <div className="d-flex flex-column">
                <div className="value-card p-3">
                  <div className="icon-box mb-2">
                    <img
                      decoding="async"
                      loading="lazy"
                      src="/assets/Integrity.svg"
                      alt=""
                    />
                  </div>
                  <h5 className="fw-bold" style={{ fontSize: "17px" }}>
                    {t("values_compassion_title")}
                  </h5>
                  <p className="text-muted" style={{ fontSize: "13px" }}>
                    {t("values_compassion_text")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection
          className="our-team-container container py-5 d-flex flex-row justify-content-around align-items-center"
          dir={isAr ? "rtl" : "ltr"}
        >
          <div
            className={`team-container d-flex flex-column ${
              isAr ? "text-end" : "text-start"
            }`}
          >
            <h6
              className="text-uppercase text-danger mb-3"
              style={{ fontSize: "11px" }}
            >
              {t("team_label")}
            </h6>
            <h2 className="fw-bold" style={{ fontSize: "33px" }}>
              {t("team_heading")}
            </h2>
            <p
              className="text-muted"
              style={{ fontSize: "15px", textAlign: "ustify" }}
              dir={i18n.language === "ar" ? "rtl" : "ltr"}
            >
              {t("team_text")}
            </p>
            <Link to="/teampage">
              <button className="btn btn-outline-danger">
                {t("team_button")}
              </button>
            </Link>
          </div>

          <div className="shape-container">
            {files.map((name, i) => (
              <div key={name} className={`shape-box shape-${i + 1}`}>
                <img
                  decoding="async"
                  loading="lazy"
                  src={`/team/${name}.avif`}
                  alt={name
                    .split("-")
                    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                    .join(" ")}
                  style={{
                    objectFit: "cover",
                    width: "100%",
                    height: "100%",
                    borderRadius: "10px",
                  }}
                />
              </div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </>
  );
};

export default Aboutus;
