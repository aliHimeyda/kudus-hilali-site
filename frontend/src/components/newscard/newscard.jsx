import React from "react";
import "./newscard.css";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Newscard = ({ newsvalue }) => {
  const { t,i18n } = useTranslation();
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/newsdetailspage/${newsvalue.id}`);
  };

  return (
    <div className="news-card d-flex flex-md-row flex-column justify-content-md-center align-items-md-center" dir={i18n.language === "ar" ? "rtl" : "ltr"} onClick={handleClick}>
      <img decoding="async" loading="lazy" src={newsvalue.image_url || newsvalue.image} alt="News" className="news-img" />
      <div className="news-content">
        <div className="news-meta" dir={i18n.language === "ar" ? "rtl" : "ltr"}>
          <img decoding="async" loading="lazy" src="/assets/dateicon.svg" alt="calendar" className="meta-icon" />
          <span>{newsvalue.date}</span>
          <span className="divider">|</span>
          <img decoding="async" loading="lazy" src="/assets/commenticon.svg" alt="comment" className="meta-icon" />
          <span>1 Comment ({newsvalue.comments})</span>
        </div>
        <h5 className="news-title" dir={i18n.language === "ar" ? "rtl" : "ltr"}>{newsvalue.title}</h5>
        <div className="news-admin " dir={i18n.language === "ar" ? "rtl" : "ltr"}>
          <div className="admin-avatar" >
            <img decoding="async" loading="lazy" src={newsvalue.admin_image || newsvalue.adminimage} alt="" />
          </div>
          <p className="text-center m-0 fs-6">{newsvalue.admin_name || newsvalue.admin}</p>
        </div>
      </div>
      <div className="ellipse">
  <p>{t("read_more")}</p>
</div>

    </div>
  );
};

export default Newscard;
