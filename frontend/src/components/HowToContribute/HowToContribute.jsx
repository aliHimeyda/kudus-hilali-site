import React, { useEffect, useRef, useState } from "react";

import "./HowToContribute.css";
import Bottomline from "../bottomline/bottomline";
import Morebtn from "../btns/morebtn";
import Paths from "../../router/Paths";

const HowToContribute = () => {
  const [visible, setVisible] = useState(false);
  const contributeRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      {
        threshold: 0.3,
      }
    );

    if (contributeRef.current) {
      observer.observe(contributeRef.current);
    }

    return () => {
      if (contributeRef.current) observer.unobserve(contributeRef.current);
    };
  }, []);

  return (
    <>
      <div
        ref={contributeRef}
        className={`d-flex flex-column justify-content-center align-items-center mt-5 pt-5 animate-section ${
          visible ? "fade-in-up" : ""
        }`}
      >
        {/* Başlıklar */}
        <h4 className="h4">CONTRIBUTE US</h4>
        <h2 className="h2">How To Contribute ?</h2>

        <div className="contribute-container">
          {/* Sol Görseller */}
          <div className="imagesection">
            <div className="playiconshadow">
              <div className="play-icon">
                <img decoding="async" loading="lazy" src="/assets/playVector.svg" alt="Play" />
              </div>
            </div>
            <img decoding="async" loading="lazy" src="/assets/4000.webp" alt="Scene" className="img-top" />
            <div className="img-boxed">
              <img decoding="async"
              loading="lazy"
                src="/assets/200.webp"
                alt="Helping Hands"
                className="img-bottom"
              />
            </div>

            <div className="small-rect" />
            <div className="faded-square" />
          </div>

          {/* Sağ İçerik */}
          <div className="content-section">
            <h3 className="headline">
              Be a Part of the <span>Change</span>
            </h3>
            <p className="desc">
              Together, we can bring hope to those in need. 
            </p>
            <p className="desc">Your contribution helps us provide food, clean water, healthcare, and aid to struggling families in Gaza and beyond.
            
            </p>
            <p className="icon-title ">Ways You Can Help:</p> <br />
            <div className="donationcontainer d-flex justify-content-center align-items-center gap-4">
              <div className="icon-card d-flex flex-row gap-2 ">
                <div className="icon-bg " />
                <div className="d-flex flex-row justify-content-center align-items-center gap-4">
                  <div className="image-container">
                    <img decoding="async"
                    loading="lazy"
                      src="/assets/DonationVector.webp"
                      alt="Donation"
                      className="icon-img"
                    />
                  </div>
                  <div>
                    <p className="icon-title ">Donate</p>
                    <p className="icon-text">
                      Your donation supports the life-saving programs on the ground. Every amount makes a difference.
                    </p>
                  </div>
                </div>
              </div>
              <div className="icon-card d-flex flex-row gap-2 ">
                <div className="icon-bg" />
                <div className="d-flex flex-row justify-content-center align-items-center gap-4">
                  <div className="image-container">
                    <img decoding="async"
                    loading="lazy"
                      src="/assets/Volunteerector.webp"
                      alt="Donation"
                      className="icon-img"
                    />
                  </div>
                  <div>
                    <p className="icon-title ">Spread the Word</p>
                    <p className="icon-text">
                     Share with your friends and loved ones to raise awareness and expand our reach.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Morebtn title={"Donate Now"} path={"/Projects"} />
          </div>
        </div>
      </div>
      <Bottomline />
    </>
  );
};

export default HowToContribute;
