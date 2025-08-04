import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import KPIS from "../kpi/kpi";
import "./herospace.css";
import { useRef } from "react";

const Hero = () => {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    //animasyon resimleri gecikme yapiyordu ahmet hocam bu yuzden onceden yuklenmesini istedim >
    preloadImages(backgroundImages);
    const interval = setInterval(() => {
      setStep((prev) => {
        if (prev === 3) {
          clearInterval(interval);
          setTimeout(1000);
        }
        return prev + 1;
      });
    }, 500); // her 0.5 saniyede bir ilerle

    return () => clearInterval(interval);
  }, [navigate]);

  const backgroundImages = [
    null,
    "/assets/1.webp",
    "/assets/2.webp",
    "/assets/3.webp",
    "/assets/heroimage.webp",
  ];
  const positions = [
    [null, null, null, null],
    ["5px", null, "6px", null],
    [null, '5px', null, '6px'],
    ['25%', 0,'25%' , 0],
  ];

 const imageCacheRef = useRef([]);

const preloadImages = (imageArray) => {
  imageCacheRef.current = imageArray.map((src) => {
    if (!src) return null;
    const img = new Image();
    img.src = src;
    return img;
  });
};



  return (
      <div className="image-wrapper">
        {step <= 3 && step > 0 && (
          <img
            src={backgroundImages[step]}
            alt="intro"
            className="intro-bg"
            style={{
              top:
                positions[step]?.[0] != null
                  ? positions[step][0] 
                  : undefined,
              bottom:
                positions[step]?.[1] != null
                  ? positions[step][1] 
                  : undefined,
              left:
                positions[step]?.[2] != null
                  ? positions[step][2] 
                  : undefined,
              right:
                positions[step]?.[3] != null
                  ? positions[step][3] 
                  : undefined,
            }}
          />
        )}
        {step > 3 && (
          <>
             <img
              className="woman-image"
              src="/assets/herowoman.webp"
              alt="herowoman"
            ></img>
            <img
              className="background-image"
              src={backgroundImages[step]}
              alt="heroimage"
            ></img>
             <div className="gradient-overlay"></div>
          </>
            

           
        )}
        <div className="hero-title-wrapper">
          <h1 className="hero-title">KUDÜS HİLALİ</h1>
        </div>
      </div>
  );
};

export default Hero;
