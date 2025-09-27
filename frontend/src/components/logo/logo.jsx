import React from "react";
import "./logo.css";
import { useNavigate } from "react-router-dom";

const Logo = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/`);
  };
  return (
    <div
      className="logocontainer d-flex flex-column "
      onClick={handleClick}
      style={{ cursor: "pointer" }}
    >
      <div className="logohead rounded-circle"></div>
      <div className="logobody rounded-circle">
        <img src="/assets/hilal.svg" alt="" />
        <div className="logobodyscircle rounded-circle ">
          <svg viewBox="0 0 24 24">
            <polygon points="12,2 15,9 22,9 17,14 18.5,21 12,17 5.5,21 7,14 2,9 9,9" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Logo;
