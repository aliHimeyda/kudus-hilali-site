import React from "react";
import "./volunteers.css";
import { useNavigate } from "react-router-dom";

const Volunteer = ({ volunteerdata }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/profilepage/${volunteerdata.id}`);
  };

  return (
    <div key={volunteerdata.id} onClick={handleClick}>
      <div className="vol-card d-flex flex-column ">
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
          <h5 className="vol-name">{volunteerdata.name}</h5>
          <div className="d-flex flex-column justify-content-center align-items-center">
            <div className="underline-container">
              <div className="dark-line"></div>
              <div className="light-line"></div>
            </div>
            <p className="vol-role">{volunteerdata.role}</p>
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
                  {/* ... Instagram path ... */}
                </svg>
              </a>
            )}

            {volunteerdata.twitter && (
              <a
                className="socialContainer containerTwo"
                href={volunteerdata.twitter}
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg viewBox="0 0 16 16" className="socialSvg twitterSvg">
                  {/* ... Twitter path ... */}
                </svg>
              </a>
            )}

            {volunteerdata.linkedin && (
              <a
                className="socialContainer containerThree"
                href={volunteerdata.linkedin}
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg viewBox="0 0 448 512" className="socialSvg linkdinSvg">
                  {/* ... LinkedIn path ... */}
                </svg>
              </a>
            )}

            {volunteerdata.whatsapp && (
              <a
                className="socialContainer containerFour"
                href={`https://wa.me/${volunteerdata.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg viewBox="0 0 16 16" className="socialSvg whatsappSvg">
                  
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
