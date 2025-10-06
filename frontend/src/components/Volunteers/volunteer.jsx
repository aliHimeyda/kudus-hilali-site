import React from "react";
import "./volunteers.css";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Volunteer = ({ volunteerdata }) => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const isAr = i18n.language && i18n.language.startsWith("ar");

  const handleClick = () => {
    navigate(`/profilepage/${volunteerdata.id}`);
  };

  return (
    <div key={volunteerdata.id} onClick={handleClick}>
      <div className="vol-card d-flex flex-column">
        <div className="volimg">
          <img
            decoding="async"
            loading="lazy"
            src={volunteerdata.image}
            alt={volunteerdata.name}
            className="img-fluid vol-img"
          />
        </div>

        <div className="d-flex flex-column p-3 justify-content-center gap-2">
          {/* Arapça ise adı sağa hizala */}
          <h5 className={`vol-name ${isAr ? "text-end" : ""}`}>
            {volunteerdata.name}
          </h5>

          <div className="d-flex flex-column justify-content-center align-items-center">
            <div className="underline-container">
              {/* Arapça ise dark-line'a float-start ekle */}
              <div className={`dark-line ${isAr ? "float-end" : ""}`}></div>
              <div className="light-line"></div>
            </div>

            <p className="vol-role" dir={isAr ? "rtl" : "ltr"}>
              {volunteerdata.role}
            </p>
          </div>

          <div className="scard">
            {volunteerdata.instagram && (
              <a
                className="socialContainer containerOne"
                href={volunteerdata.instagram}
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg viewBox="0 0 16 16" className="socialSvg instagramSvg">
                  <path
                    d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9S160.5 370.9 224.1 370.9 
S339 319.6 339 255.9 287.7 141 224.1 141zm0 188.6c-40.7 
0-73.7-33-73.7-73.7s33-73.7 73.7-73.7 73.7 33 73.7 
73.7-33 73.7-73.7 73.7zm146.4-194.3c0 14.9-12 26.9-26.9 
26.9s-26.9-12-26.9-26.9 12-26.9 
26.9-26.9 26.9 12 26.9 26.9zm76.1 
27.2c-1.7-35.9-9.9-67.7-36.2-93.9s-58-34.5-93.9-36.2c-37-2.1-147.9-2.1-184.9 
0-35.9 1.7-67.7 9.9-93.9 36.2s-34.5 58-36.2 
93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 
36.2 93.9s58 34.5 93.9 36.2c37 2.1 147.9 2.1 
184.9 0 35.9-1.7 67.7-9.9 93.9-36.2s34.5-58 
36.2-93.9c2.1-37 2.1-147.9 
0-184.9zM398.8 388c-7.8 19.7-23 35-42.6 
42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.7-7.8-35-23-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 
9-132.1c7.8-19.7 23-35 42.6-42.6 29.5-11.7 99.5-9 
132.1-9s102.7-2.6 132.1 9c19.7 7.8 35 23 
42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.6 
102.7-9 132.1z"
                  />
                </svg>
              </a>
            )}

            {/* diğer sosyal ikonlar aynı */}
            {/* ... */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Volunteer;
