// Header.jsx
import React, { useEffect, useState } from "react";

import "./Header.css";
import { Link, useLocation } from "react-router-dom";
import Logo from "../logo/logo";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../languageswitcher/language-switcher";
const Header = () => {
  const { i18n } = useTranslation();
  const { t } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const height = window.innerHeight - 300;
  const location = useLocation();
  useEffect(() => {
    if (
      location.pathname !== "/" &&
      location.pathname !== "/aboutuspage" &&
      location.pathname !== "/contactuspage"
    ) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
    const onScroll = () => {
      if (
        location.pathname === "/" ||
        location.pathname === "/aboutuspage" ||
        location.pathname === "/contactuspage"
      ) {
        setIsScrolled(false);
        //sadece homepage icin
        setIsScrolled(window.scrollY > height); // 962px sonra background gelsin
      } else {
        setIsScrolled(true);
      }
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [location.pathname]);

  return (
    <header
      className={`main-header ${
        isScrolled ? "scrolled-header" : "transparent-header"
      }`}
      
    >
      <nav className="navbar navbar-expand-lg d-none d-md-block  py-3 fontsize " dir={i18n.language === "ar" ? "rtl" : "ltr"}>
        <div className="container-fluid d-flex justify-content-between align-items-center px-5">
          <div className="d-flex align-items-end gap-2">
            <Logo />
            <div className="logostext d-md-flex flex-column d-none">
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

          <ul className="navbar-nav d-md-flex d-none flex-row gap-4 mb-0 align-items-center">
            <li className="nav-item" id="home-item">
              <Link className="nav-link" to="/">
                {t("nav_home")}
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/projects">
                {t("nav_projects")}
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/teampage">
                {t("nav_team")}
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/newspage">
                {t("nav_news")}
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/aboutuspage">
                {t("nav_about")}
              </Link>
            </li>
            <li>
              <LanguageSwitcher />
            </li>
            <li>
              <a href="/annual-report-2025.pdf" target="_blank" rel="noopener noreferrer" className="btn report-btn fontsize">{t("nav_annual_report")}</a>
            </li>
          </ul>

          <Link
            to="/contactuspage"
            className="btn contact-btn ms-3 d-md-block d-none fontsize"
          >
            {t("nav_contact")}
          </Link>
        </div>
      </nav>

      <nav
        className={`mobile-navbar navbar-light bg-transparent d-md-none position-relative p-2`}
        
      >
        <div className="container-fluid d-flex justify-content-between align-items-center ">
          <div className="d-flex align-items-center">
            <Logo />
          </div>
          <div className="d-flex justify-content-center align-items-center">
            <LanguageSwitcher />
            {/* Mobil Menü */}
            <div className="menu-toggle ">
              <div
                className={`navbar-toggler ${
                  isScrolled ? "" : "n-top"
                } border-0 `}
              >
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 40 40"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="20" cy="12" r="2" fill="white" />

                  <circle cx="20" cy="20" r="2" fill="white" />
                  <circle cx="20" cy="28" r="2" fill="white" />
                </svg>
              </div>
              <ul className="hover-menu navbar-nav text-center w-100">
                <li className="nav-item">
                  <Link
                    className={`nav-link ${
                      location.pathname === "/Projects" ? "fw-bold" : ""
                    }`}
                    to="/Projects"
                  >
                    {t("nav_projects")}
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className={`nav-link ${
                      location.pathname === "/teampage" ? "fw-bold" : ""
                    }`}
                    to="/teampage"
                  >
                    {t("nav_team")}
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className={`nav-link text-uppercase ${
                      location.pathname === "/newspage" ? "fw-bold" : ""
                    }`}
                    to="/newspage"
                  >
                    {t("nav_news")}
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className={`nav-link ${
                      location.pathname === "/aboutuspage" ? "fw-bold" : ""
                    }`}
                    to="/aboutuspage"
                  >
                    {t("nav_about")}
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className={`nav-link ${
                      location.pathname === "/contactuspage" ? "fw-bold" : ""
                    }`}
                    to="/contactuspage"
                  >
                    {t("nav_contact")}
                  </Link>
                </li>
                <li className="nav-item">
                  <a href="/annual-report-2025.pdf" target="_blank" rel="noopener noreferrer" className="nav-link report-btn-mobile">{t("nav_annual_report")}</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
