// src/components/Footer/Footer.jsx
import React from 'react';
import './Footer.css';
import Logo from '../logo/logo';
import { Link } from 'react-router-dom';

const Footer = () => {
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
              <span className="fw-bold ">KUDÜS HILALI</span>
              <span className="fw-light">Association</span>
            </div>
          </div>
            </div>
            <p className="text-center small">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut et dolore magna aliqua.
            </p>
          </div>

          {/* Explore Links */}
          <div className="d-flex flex-column align-items-center ">
            <h6 className="footer-title">Explore Links</h6>
            <ul className="list-unstyled text-center">
              <li><a href="/Projects">Latest Projects</a></li>
              <li><a href="/newspage">Latest News</a></li>
              <li><a href="/teampage">Our Team</a></li>
              <li><a href="/aboutuspage">Our Mission & Vision</a></li>
            </ul>
          </div>

          {/* Support Us */}
          <div className="d-flex flex-column align-items-center ">
            <h6 className="footer-title">SUPPORT US</h6>
            <ul className="list-unstyled text-center">
              <li><a href="/aboutuspage">About Us</a></li>
              <li><a href="#">Our Story</a></li>
              <li><a href="#">Contact Us</a></li>
            </ul>
          </div>

          {/* Get Support */}
          <div className="d-flex flex-column align-items-center justify-content-center">
            <h6 className="footer-title">GET SUPPORT</h6>
            <ul className="list-unstyled small">
              <li><img decoding="async" loading="lazy" src="/assets/EmailVector.svg" alt="" /> <a href="mailto:kudushilali@gmail.com">kudushilali@gmail.com</a></li>
              <li><img decoding="async" loading="lazy" src="/assets/CallVector.svg" alt="" /> +90 505 878 50 40</li>
              <li><img decoding="async" loading="lazy" src="/assets/LocationVector.svg" alt="" /> Arabacıalanı, 605 nolu sokak<br />No: 1/1, 54100 Serdivan/Sakarya</li>
            </ul>

            <div className="d-flex align-items-center mt-3">
              <Link to="/contactuspage" className="btn contact-btn me-3">Contact Us</Link>
              <div className="d-flex gap-3">
                <a href="#"><i className="bi bi-facebook"></i></a>
                <a href="#"><i className="bi bi-linkedin"></i></a>
                <a href="#"><i className="bi bi-instagram"></i></a>
              </div>
            </div>
          </div>
        </div>

        {/* Alt yazı */}
        <hr className="my-4" />
        <div className="text-center small text-muted">
          kudushilali@gmail.com 2025 <span className="text-primary">all right</span> Received
        </div>
      </div>
    </footer>
  );
};

export default Footer;
