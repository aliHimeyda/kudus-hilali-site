import React, { useEffect, useRef } from "react";
import "./contactuspage.css";
import Bottomline from "../../components/bottomline/bottomline";
import Morebtn from "../../components/btns/morebtn";

const Contactuspage = () => {
  const animatedRefs = useRef([]);
  const imageCacheRef = useRef();
  useEffect(() => {
    imageCacheRef.current = (src) => {
      if (!"/public/assets/sky1.webp") return null;
      const img = new Image();
      img.src = src;
      return img;
    };
    const card = animatedRefs.current[1];

    // 1. Mouse move effect
    const handleMouseMove = (e) => {
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty("--x", `${x}px`);
      card.style.setProperty("--y", `${y}px`);
    };

    if (card) {
      card.addEventListener("mousemove", handleMouseMove);
    }

    // 2. Intersection Observer for all animatedRefs
    const observers = animatedRefs.current.map((ref) => {
      if (!ref) return null;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
          }
        },
        { threshold: 0.3 }
      );
      observer.observe(ref);
      return observer;
    });

    // Cleanup
    return () => {
      if (card) {
        card.removeEventListener("mousemove", handleMouseMove);
      }
      observers.forEach((obs) => obs?.disconnect());
    };
  }, []);

  return (
    <div className="contactuspage">
      <div className="earthcontainer d-flex justify-content-center align-items-center position-relative">
        <div class="section-banner">
          <div id="star-1">
            <div class="curved-corner-star">
              <div id="curved-corner-bottomright"></div>
              <div id="curved-corner-bottomleft"></div>
            </div>
            <div class="curved-corner-star">
              <div id="curved-corner-topright"></div>
              <div id="curved-corner-topleft"></div>
            </div>
          </div>

          <div id="star-2">
            <div class="curved-corner-star">
              <div id="curved-corner-bottomright"></div>
              <div id="curved-corner-bottomleft"></div>
            </div>
            <div class="curved-corner-star">
              <div id="curved-corner-topright"></div>
              <div id="curved-corner-topleft"></div>
            </div>
          </div>

          <div id="star-3">
            <div class="curved-corner-star">
              <div id="curved-corner-bottomright"></div>
              <div id="curved-corner-bottomleft"></div>
            </div>
            <div class="curved-corner-star">
              <div id="curved-corner-topright"></div>
              <div id="curved-corner-topleft"></div>
            </div>
          </div>

          <div id="star-4">
            <div class="curved-corner-star">
              <div id="curved-corner-bottomright"></div>
              <div id="curved-corner-bottomleft"></div>
            </div>
            <div class="curved-corner-star">
              <div id="curved-corner-topright"></div>
              <div id="curved-corner-topleft"></div>
            </div>
          </div>

          <div id="star-5">
            <div class="curved-corner-star">
              <div id="curved-corner-bottomright"></div>
              <div id="curved-corner-bottomleft"></div>
            </div>
            <div class="curved-corner-star">
              <div id="curved-corner-topright"></div>
              <div id="curved-corner-topleft"></div>
            </div>
          </div>

          <div id="star-6">
            <div class="curved-corner-star">
              <div id="curved-corner-bottomright"></div>
              <div id="curved-corner-bottomleft"></div>
            </div>
            <div class="curved-corner-star">
              <div id="curved-corner-topright"></div>
              <div id="curved-corner-topleft"></div>
            </div>
          </div>

          <div id="star-7">
            <div class="curved-corner-star">
              <div id="curved-corner-bottomright"></div>
              <div id="curved-corner-bottomleft"></div>
            </div>
            <div class="curved-corner-star">
              <div id="curved-corner-topright"></div>
              <div id="curved-corner-topleft"></div>
            </div>
          </div>
        </div>
        <div className="position-absolute eagradient-overlay d-flex justify-content-center"></div>
      </div>
      <div className="contacthero position-relative d-flex flex-column ">
        <div className="contactinfo d-flex flex-column w-100 mt-5 pt-5 align-items-center pb-5">
          <span
            className=" h2 follow-text text-center text-wrap"
            ref={(el) => (animatedRefs.current[0] = el)}
          >
            Wherever you are in the world, you can be the hope of a family.
          </span>
          <Bottomline />
          <div
            className="contactuscard mt-5 d-flex flex-column align-items-center gap-1"
            ref={(el) => (animatedRefs.current[1] = el)}
          >
            <span className=" h4 text-wrap">CONTACT INFO</span>
            <span className=" h2 text-wrap">CONTACT US</span>
            <span className="text-center text-wrap fw-bold w-50 mt-2">
              Have a project in mind that you think we’d be a great fit for it?
              We’d love to know what you’re thinking
            </span>
            <div className="mt-5 d-flex flex-column gap-4">
              <div className="d-flex flex-row gap-3">
                <img loading="lazy" src="/assets/EmailVector.svg" alt="" />
                <button class="button" data-text="Awesome">
                  <span class="actual-text text-start">
                    kudushilali@gmail.com
                  </span>
                  <span aria-hidden="true" class="hover-text text-start">
                    kudushilali@gmail.com
                  </span>
                </button>
              </div>
              <div className="d-flex flex-row gap-3">
                <img loading="lazy" src="/assets/CallVector.svg" alt="" />
                <button class="button" data-text="Awesome">
                  <span class="actual-text text-start">+90 505 878 50 40</span>
                  <span aria-hidden="true" class="hover-text text-start">
                    +90 505 878 50 40
                  </span>
                </button>
              </div>
              <div className="d-flex flex-row gap-3">
                <img loading="lazy" src="/assets/LocationVector.svg" alt="" />
                <span className="fw-bold">
                  Arabacıalanı, 605 nolu sokak <br />
                  No: 1/1, 54100 Serdivan/Sakarya
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="map-box position-relative w-100 m-0">
          <div className="position-absolute map-gradient-overlay d-flex justify-content-center"></div>
          <iframe
            title="Google Map"
            src="https://www.google.com/maps?q=Arabacıalanı,605%20nolu%20sokak%20No:%201/1,%2054100%20Serdivan/Sakarya&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0, borderRadius: "10px" }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </div>
  );
};
export default Contactuspage;
