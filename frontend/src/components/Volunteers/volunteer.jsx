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
            {/* Instagram */}
            {volunteerdata.instagram && (
              <a
                className="socialContainer containerOne"
                href={volunteerdata.instagram}
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg viewBox="0 0 512 512" className="socialSvg instagramSvg">
                  <path
                    d="M349.33 69.33H162.67A93.39 93.39 0 0 0 69.33 162.67v186.66A93.39 
          93.39 0 0 0 162.67 442.67h186.66A93.39 93.39 0 0 0 442.67 
          349.33V162.67A93.39 93.39 0 0 0 349.33 69.33zm61.34 
          280a61.39 61.39 0 0 1-61.34 61.34H162.67a61.39 61.39 0 0 1-61.34-61.34V162.67a61.39 
          61.39 0 0 1 61.34-61.34h186.66a61.39 61.39 0 0 1 61.34 61.34zM256 
          149.33a106.67 106.67 0 1 0 106.67 106.67A106.77 106.77 0 0 0 256 
          149.33zm0 176a69.33 69.33 0 1 1 69.33-69.33A69.42 69.42 0 0 1 256 
          325.33zm108.53-194.4a25.6 25.6 0 1 1-25.6 25.6 25.63 25.63 0 0 1 25.6-25.6z"
                  />
                </svg>
              </a>
            )}

            {/* Facebook */}
            {volunteerdata.facebook && (
              <a
                className="socialContainer containerOne"
                href={volunteerdata.facebook}
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg viewBox="0 0 320 512" className="socialSvg facebookSvg">
                  <path
                    d="M279.14 288l14.22-92.66h-88.91V127.09c0-25.35 
          12.42-50.06 52.24-50.06h40.42V6.26S260.43 
          0 225.36 0c-73.22 0-121.05 44.38-121.05 
          124.72v70.62H22.89V288h81.42v224h100.17V288z"
                  />
                </svg>
              </a>
            )}

            {/* LinkedIn */}
            {volunteerdata.linkedin && (
              <a
                className="socialContainer containerOne"
                href={volunteerdata.linkedin}
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg viewBox="0 0 448 512" className="socialSvg linkedinSvg">
                  <path
                    d="M100.28 448H7.4V148.9h92.88zm-46.44-340a53.66 
          53.66 0 1 1 53.66-53.66 53.66 53.66 0 0 1-53.66 
          53.66zM447.9 448h-92.68V302.4c0-34.7-.7-79.24-48.24-79.24-48.3 
          0-55.7 37.7-55.7 76.7V448H158.6V148.9h89V196h1.3c12.4-23.5 
          42.6-48.3 87.7-48.3 93.8 0 111 61.8 111 142.3V448z"
                  />
                </svg>
              </a>
            )}

            {/* Twitter / X */}
            {volunteerdata.twitter && (
              <a
                className="socialContainer containerOne"
                href={volunteerdata.twitter}
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg viewBox="0 0 512 512" className="socialSvg twitterSvg">
                  <path
                    d="M459.37 151.716c.325 4.548.325 9.097.325 
          13.645 0 138.72-105.583 298.558-298.558 
          298.558-59.452 0-114.68-17.219-161.137-47.106 
          8.447.974 16.568 1.299 25.34 1.299 
          49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 
          6.498.974 12.995 1.624 19.818 1.624 
          9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-103.001v-1.299c14.182 
          7.91 30.355 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 
          0-19.492 5.197-37.36 14.508-52.954 
          52.954 64.3 132.507 106.496 221.792 111.13-1.624-7.91-2.599-15.821-2.599-24.081 
          0-57.828 46.782-104.934 104.934-104.934 
          30.355 0 57.502 12.67 76.67 33.137 
          24.081-4.548 46.456-13.32 66.599-25.34-7.91 
          24.73-24.73 45.433-46.456 58.48 
          21.366-2.273 41.833-8.122 60.665-16.243-14.292 
          20.791-32.161 39.308-52.628 54.253z"
                  />
                </svg>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Volunteer;
