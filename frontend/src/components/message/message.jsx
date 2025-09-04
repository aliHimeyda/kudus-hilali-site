import React from "react";
import "./message.css";
import Logo from "../logo/logo";
import { Link } from "react-router-dom";

export default function CookiePopup({ show, onClose, onAccept, onManage }) {
  if (!show) return null; // Gösterilmeyecekse hiç render etme

  return (
    <div className="popup-overlay">
      <div className="cookie-card">
        <div className="d-flex flex-row gap-1 align-items-center">
          <Logo />
          <div className="messagetitle d-md-flex flex-column d-none">
            <span className="fw-bold ">KUDÜS HILALI</span>
            <span className="fw-light">Organization</span>
          </div>
        </div>
        <p className="description">
          Thank you for your donation. Our team will contact you as soon as
          possible. <Link to="/aboutuspage">Read more about us</Link>.
        </p>
        <div className="actions">
          <button
            className="accept"
            onClick={() => {
              if (onAccept) onAccept();
              if (onClose) onClose();
            }}
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
