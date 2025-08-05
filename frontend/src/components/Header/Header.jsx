// Header.jsx
import React, { useEffect, useState } from "react";
import "./Header.css";
import { Link, useLocation } from "react-router-dom";
const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const height = window.innerHeight - 300;
  const location = useLocation();
  useEffect(() => {
    const onScroll = () => {
      if (
        location.pathname === "/" ||
        location.pathname === "/aboutuspage" ||
        location.pathname === "/contactuspage"
      ) {
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
      <nav className="navbar navbar-expand-lg d-none d-md-block px-4 py-3 fontsize ">
        <div className="container-fluid d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <img
              src="/assets/logo.webp"
              alt="Logo"
              height="40"
              className="me-2"
            />
            <span className="fw-bold d-none d-md-inline">KUDÜS HILALI</span>
          </div>

          <ul className="navbar-nav d-md-flex d-none flex-row gap-4 mb-0 ">
            <li className="nav-item" id="home-item">
              <Link className="nav-link" to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/projects">
                Projects
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/teampage">
                Our Team
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/newspage">
                News & Articles
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/aboutuspage">
                About Us
              </Link>
            </li>
          </ul>

          <Link
            to="/contactuspage"
            className="btn contact-btn ms-3 d-md-block d-none fontsize"
          >
            Contact Us
          </Link>
        </div>
      </nav>

      <nav className="navbar navbar-light bg-transparent d-md-none position-relative">
        <div className="container-fluid d-flex justify-content-between align-items-center position-relative">
          <div className="d-flex align-items-center">
            <img
              src="/assets/logo.webp"
              alt="Logo"
              height="40"
              className="me-2"
            />
            <span className="fw-bold d-none d-md-inline">KUDÜS HILALI</span>
          </div>

          {/* Üç çizgi buton */}
          <div className="menu-toggle ">
            <div className="navbar-toggler border-0">
              <span className="navbar-toggler-icon"></span>
            </div>
            <ul className="hover-menu navbar-nav text-center w-100">
              <li className="nav-item">
                <Link className="nav-link" to="/Projects">
                  Projects
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/teampage">
                  Our Team
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link fw-bold text-uppercase"
                  to="/newspage"
                >
                  News & Articles
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/aboutuspage">
                  About Us
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/contactuspage">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
