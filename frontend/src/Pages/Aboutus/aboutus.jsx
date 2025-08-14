import React, { useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./aboutus.css";
import { Link } from "react-router-dom";

const AnimatedSection = ({
  children,
  className = "",
  triggerPercent = 0.3,
}) => {
  const ref = useRef(null);
  const imageCacheRef = useRef();
  useEffect(() => {
    imageCacheRef.current = (src) => {
      if (!"/assets/200.webp") return null;
      const img = new Image();
      img.src = src;
      return img;
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-show");
          observer.unobserve(entry.target);
        }
      },
      { threshold: triggerPercent }
    );
    if (ref.current) observer.observe(ref.current);
  }, [triggerPercent]);

  return (
    <div ref={ref} className={`animated-section ${className}`}>
      {children}
    </div>
  );
};

const Aboutus = () => {
  return (
    <div className="container-fluid p-0">
      <div className="hero-section position-relative text-center">
        <img
          decoding="async"
          loading="lazy"
          src="/assets/200.webp"
          alt="Hero"
        />

        <div className="hero-text position-absolute start-50 translate-middle d-none">
          <button className="btn btn-warning px-4">
            Wach Our Story's Video
          </button>
        </div>
        <div class="curved-container"></div>
      </div>

      <div className="py-5">
        <div className="container d-flex flex-column gap-3 p-5 mt-0">
          <h6
            className="h4 text-uppercase text-danger mb-3"
            style={{ fontSize: "11px" }}
          >
            About Us
          </h6>
          <div className="w-100 d-flex flex-md-row flex-column gap-5">
            <h2 className="fw-bold" style={{ fontSize: "33px" }}>
              We are a humanitarian organization dedicated to serving the people
              of Gaza and beyond.
            </h2>

            <p className="text-muted" style={{ fontSize: "15px" }}>
              Through emergency aid, healthcare support, meal distribution,
              education, and community programs, we work to uplift vulnerable
              individuals and families affected by conflict, poverty, and
              displacement. <br /> Our efforts are rooted in compassion, social
              development, and mutual support as we strive to restore dignity,
              hope, and opportunity where it’s needed most.
            </p>
          </div>
        </div>
      </div>

      <AnimatedSection className="image-gallery d-flex flex-row justify-content-center align-items-center gap-3 py-5">
        <AnimatedSection className="imgpacket1 d-flex flex-column align-items-end w-50 gap-4">
          <img
            decoding="async"
            loading="lazy"
            src="/assets/200.webp"
            alt=""
            style={{ width: "250px", height: "450px", objectFit: "cover" }}
            className="image1"
          />
          <AnimatedSection className="d-flex flex-row w-100 justify-content-end gap-4">
            <img
              decoding="async"
              loading="lazy"
              src="/assets/4000.webp"
              alt=""
              style={{ width: "300px", height: "200px", objectFit: "cover" }}
              className="image2"
            />
            <img
              decoding="async"
              loading="lazy"
              src="/assets/a6.webp"
              alt=""
              style={{ width: "200px", height: "170px", objectFit: "cover" }}
              className="px-3 image3"
            />
          </AnimatedSection>
        </AnimatedSection>
        <AnimatedSection className="imgpacket2 d-flex flex-column w-50 gap-3">
          <AnimatedSection className="d-flex flex-row w-100 align-items-end gap-3">
            <img
              decoding="async"
              loading="lazy"
              src="/assets/a5.webp"
              alt=""
              style={{ width: "200px", height: "200px", objectFit: "cover" }}
              className="image4"
            />
            <img
              decoding="async"
              loading="lazy"
              src="/assets/a4.webp"
              alt=""
              style={{ width: "300px", height: "250px", objectFit: "cover" }}
              className="image5"
            />
          </AnimatedSection>
          <img
            decoding="async"
            loading="lazy"
            src="/assets/a2.webp"
            alt=""
            style={{ width: "300px", height: "300px", objectFit: "cover" }}
            className="image6"
          />
        </AnimatedSection>
      </AnimatedSection>

      <AnimatedSection className="py-5 mt-5 d-flex flex-column align-items-center text-center">
        <h6
          className="h4 text-uppercase text-danger mb-3"
          style={{ fontSize: "11px" }}
        >
          Our Values
        </h6>
        <h2
          className="fw-bold mb-4 "
          style={{ width: "100%", fontSize: "33px" }}
        >
          We Stand By Principles That Guide Our Humanitarian Mission.
        </h2>
        <div className="d-flex flex-column flex-md-row justify-content-center w-50">
          <div>
            <div className="d-flex flex-column">
              <div className="value-card p-3">
                <div className="icon-box mb-2">
                  <img
                    decoding="async"
                    loading="lazy"
                    src="/assets/Workflow.svg"
                    alt=""
                  />
                </div>
                <h5 className="fw-bold" style={{ fontSize: "17px" }}>
                  Solidarity
                </h5>
                <p className="text-muted" style={{ fontSize: "13px" }}>
                  We believe in uniting people and communities to create
                  meaningful, lasting change.
                </p>
              </div>
            </div>
            <div className="d-flex flex-column">
              <div className="value-card p-3">
                <div className="icon-box mb-2">
                  <img
                    decoding="async"
                    loading="lazy"
                    src="/assets/Iconshape.svg"
                    alt=""
                  />
                </div>
                <h5 className="fw-bold" style={{ fontSize: "17px" }}>
                  Resilience
                </h5>
                <p className="text-muted" style={{ fontSize: "13px" }}>
                  We are committed to long-term solutions that empower
                  communities to recover, rebuild, and thrive through and after
                  crises.
                </p>
              </div>
            </div>
          </div>
          <div>
            <div className="d-flex flex-column">
              <div className="value-card p-3">
                <div className="icon-box mb-2">
                  <img
                    decoding="async"
                    loading="lazy"
                    src="/assets/likeicon.svg"
                    alt=""
                  />
                </div>
                <h5 className="fw-bold" style={{ fontSize: "17px" }}>
                  Accountability
                </h5>
                <p className="text-muted" style={{ fontSize: "13px" }}>
                  We act with transparency and responsibility, honoring the
                  trust of our supporters and the needs of the communities we
                  serve.
                </p>
              </div>
            </div>
            <div className="d-flex flex-column">
              <div className="value-card p-3">
                <div className="icon-box mb-2">
                  <img
                    decoding="async"
                    loading="lazy"
                    src="/assets/Integrity.svg"
                    alt=""
                  />
                </div>
                <h5 className="fw-bold" style={{ fontSize: "17px" }}>
                  Compassion
                </h5>
                <p className="text-muted" style={{ fontSize: "13px" }}>
                  We approach every individual and family with empathy and
                  kindness, ensuring dignity is at the heart of our work.
                </p>
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="our-team-container container py-5 text-start d-flex flex-row justify-content-around align-items-center">
        <div className="team-container d-flex flex-column">
          <h6
            className="text-uppercase text-danger mb-3"
            style={{ fontSize: "11px" }}
          >
            Our Team
          </h6>
          <h2 className="fw-bold" style={{ fontSize: "33px" }}>
            Dedication and leadership behind every effort
          </h2>
          <p className="text-muted" style={{ fontSize: "15px" }}>
            With deep experience and a shared passion for service, our team
            leads with heart and purpose. From fieldwork to public outreach,
            each member plays a vital role in delivering hope and aid to those
            in need.
          </p>
          <Link to="/teampage">
            <button className="btn btn-outline-danger">Meet our team</button>
          </Link>
        </div>
        <div className="shape-container">
          {[...Array(5)].map((_, i) => (
            <div key={i} className={`shape-box shape-${i + 1}`}>
              <img
                decoding="async"
                loading="lazy"
                src={`/assets/v${i + 1}.webp`}
                alt={i}
                style={{
                  objectFit: "cover",
                  width: "100%",
                  height: "100%",
                  borderRadius: "10px",
                }}
              />
            </div>
          ))}
        </div>
      </AnimatedSection>
    </div>
  );
};

export default Aboutus;
