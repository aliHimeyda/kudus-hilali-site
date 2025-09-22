import React from "react";
import "./message.css";
import Logo from "../logo/logo";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function CookiePopup({ show, onClose, onAccept, onManage }) {
  const { t } = useTranslation();
  const { i18n } = useTranslation();
  if (!show) return null; // Gösterilmeyecekse hiç render etme

  return (
  <div className="popup-overlay">
    <div className="cookie-card">
      <div className="d-flex flex-row gap-1 align-items-center">
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
        {t("popup_thanks")}{" "}
        <Link to="/aboutuspage">{t("popup_read_more")}</Link>.
      </p>

      <div className="actions">
        <button
          className="accept"
          onClick={() => {
            if (onAccept) onAccept();
            if (onClose) onClose();
          }}
        >
          {t("popup_accept")}
        </button>
      </div>
    </div>
  </div>
);

}
