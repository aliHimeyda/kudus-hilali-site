import React from "react";
import "./logo.css";

const Logo = () => {
  return (
    <div className="logocontainer d-flex flex-column align-items-center ">
      <div className="logohead rounded-circle"></div>
      <div className="logobody rounded-circle position-relative">
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
