// src/components/Footer/Footer.jsx
import React from "react";
import "./Footer.css";
import Logo from "../logo/logo";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();
  const { i18n } = useTranslation();
return (
  <footer className="footer-section py-5">
    <div className="container my-0 pt-5">
      <div className="footerflex d-flex flex-md-row flex-column gap-4">
        {/* Sol logo ve açıklama */}
        <div className="col-md-3 ">
          <div className="d-flex align-items-center justify-content-center mb-3">
            <div className="d-flex align-items-end gap-2">
              <Logo />
              <div className="flogostext d-md-flex flex-column d-none">
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
          </div>
          <p className="text-center small text-justify">
            {t("footer_about")}
          </p>
        </div>

        {/* Explore Links */}
        <div className="d-flex flex-column align-items-center ">
          <h6 className="footer-title">{t("footer_explore")}</h6>
          <ul className="list-unstyled text-center">
            <li>
              <Link to="/Projects">{t("footer_latest_projects")}</Link>
            </li>
            <li>
              <Link to="/newspage">{t("footer_latest_news")}</Link>
            </li>
            <li>
              <Link to="/teampage">{t("nav_team")}</Link>
            </li>
            <li>
              <Link to="/aboutuspage">{t("footer_mission_vision")}</Link>
            </li>
          </ul>
        </div>

        {/* Support Us */}
        <div className="d-flex flex-column align-items-center ">
          <h6 className="footer-title">{t("footer_support_us")}</h6>
          <ul className="list-unstyled text-center">
            <li>
              <Link to="/aboutuspage">{t("footer_our_story")}</Link>
            </li>
            <li>
              <Link to="/contactuspage">{t("nav_contact")}</Link>
            </li>
          </ul>
        </div>

        {/* Get Support */}
        <div className="d-flex flex-column align-items-center justify-content-center">
          <h6 className="footer-title">{t("footer_get_support")}</h6>
          <ul className="list-unstyled small">
            <li>
              <img
                decoding="async"
                loading="lazy"
                src="/assets/EmailVector.svg"
                alt=""
              />{" "}
              <a href="mailto:kudushilali@gmail.com">info@kudushilali.org</a>
            </li>
            <li>
              <img
                decoding="async"
                loading="lazy"
                src="/assets/CallVector.svg"
                alt=""
              />{" "}
              +90 505 878 50 40
            </li>
            <li>
              <img
                decoding="async"
                loading="lazy"
                src="/assets/LocationVector.svg"
                alt=""
              />{" "}
              {t("footer_address_line1")}
              <br />
              {t("footer_address_line2")}
            </li>
          </ul>

          <div className="d-flex align-items-center mt-3">
            <Link to="/contactuspage" className="btn contact-btn me-3">
              {t("nav_contact")}
            </Link>
            <div className="d-flex gap-3">
              <a href="https://www.facebook.com/KudusHilali/">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="https://www.linkedin.com/company/kudus-hilali/">
                <i className="bi bi-linkedin"></i>
              </a>
              <a href="https://www.instagram.com/kudus_hilali/">
                <i className="bi bi-instagram"></i>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Alt yazı */}
      <hr className="my-4" />
      <div className="bottomtext text-center small text-muted ">
        info@kudushilali.org 2025{" "}
        <span className="spantext">{t("footer_all_rights")}</span>{" "}
        {t("footer_reserved")}
      </div>
    </div>
  </footer>
);

};

export default Footer;
