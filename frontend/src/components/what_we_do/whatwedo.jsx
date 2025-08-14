import React, { useState, useEffect, useRef } from "react";
import "./whatwedo.css";
import Bottomline from "../bottomline/bottomline";
import Morebtn from "../btns/morebtn";

const items1 = [
  {
    id: 1,
    title: "Emergency assistance",
    description:
      "We deliver urgent relief, seasonal food aid, and winter support to those in need.",
    color: "var(--color-red)",
    icon: "🌪️",
  },
  {
    id: 2,
    title: "Community Development",
    description:
      "Building stronger communities through empowerment, inclusion, and local action.",
    color: "var(--color-orange)",
    icon: "🌪️",
  },
];
const items2 = [
  {
    id: 3,
    title: "Children & Education",
    description:
      "We empower children through education, care, and emotional support for a brighter future.",
    color: "var(--color-orange)",
    icon: "🏥",
  },
  {
    id: 4,
    title: "Advocacy & Awareness",
    description:
      "Raising voices for Palestine through art, stories, and community action.",
    color: "var(--color-green)",
    icon: "🚰",
  },
];
const descriptions = [
  "We provide urgent response to crises (war, earthquakes, displacement), Ramadan food campaigns, Qurban meat distribution and winter kits (blankets, heating support).",
  "We strengthen communities by supporting refugees and families (especially in Turkey), empowering women and youth, promoting local initiatives in Sakarya, and fostering skills-building and volunteer integration.",
  "We provide orphan support and child sponsorship, school kits and uniforms, education programs (tutoring, literacy), and mental health & trauma care.",
  "We advocate for Palestine through impactful campaigns, social media storytelling, art exhibitions and events, and active participation in NGO summits, youth panels, and mosque information booths.",
];
const titles = [
  "<strong>Emergency</strong> Relief & Seasonal Aid",
  "Community <strong>Development</strong>",
  "Children & <strong>Education</strong>",
  "<strong>Advocacy</strong> & Awareness",
];

const WhatWeDo = () => {
  const [selected, setSelected] = useState(1);
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);
  const leftRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (leftRef.current) {
      leftRef.current.classList.remove("left-animate");
      void leftRef.current.offsetWidth;
      leftRef.current.classList.add("left-animate");
    }
  }, [selected]);

  return (
    <div className="what-we-do-container ">
      <h4 className="h4">OUR CAUSES</h4>
      <h2 className="h2">What We Do ?</h2>
      <div
        className={`what-we-do-section  ${visible ? "visible" : ""}`}
        ref={sectionRef}
      >
        <div
          className={`left ${
            visible ? "visible" : ""
          } d-none d-md-flex flex-md-column align-items-md-center justify-content-md-center`}
          ref={leftRef}
        >
          <h1
            className="d-inline fw-bold text-center"
            dangerouslySetInnerHTML={{ __html: titles[selected - 1] }}
          />
          <p className="description text-center">
            {descriptions[selected - 1]}
          </p>
          <Morebtn title={"Read More"} path={"/aboutuspage"} />
        </div>
        <div className="right gap-4 d-flex flex-md-row flex-column">
          <div className="d-flex flex-column gap-4 pt-5">
            {items1.map((item) => (
              <div
                key={item.id}
                className={`card d-flex gap-3 ${
                  selected === item.id ? "active" : ""
                }`}
                style={{
                  backgroundColor:
                    selected === item.id ? item.color : "var(--color-cream)",
                  boxShadow:
                    selected === item.id
                      ? "0 10px 20px rgba(0,0,0,0.2)"
                      : "none",
                }}
                onClick={() => setSelected(item.id)}
              >
                <div className="icon d-flex">
                  <img decoding="async"
                    loading="lazy"
                    src="/assets/disastericon.png"
                    alt=""
                    className="wicon"
                  />
                </div>
                <strong
                  className="witemtitle"
                  style={{
                    fontSize: "0.8rem",
                    color:
                      selected === item.id ? "white" : "var(--color-black)",
                  }}
                >
                  {item.title}
                </strong>
                <p className="d-none d-md-block" style={{ fontSize: "0.8rem" }}>
                  {item.description}
                </p>
                <div
                  className={`bottom ${visible ? "visible" : ""} ${
                    selected === item.id ? "d-block" : "d-none"
                  } d-md-none`}
                >
                  <h5
                    dangerouslySetInnerHTML={{ __html: titles[selected - 1] }}
                  />
                  <p
                    dangerouslySetInnerHTML={{ __html: descriptions[selected - 1] }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="d-flex flex-column gap-4 ">
            {items2.map((item) => (
              <div
                key={item.id}
                className={`card d-flex gap-3 ${
                  selected === item.id ? "active" : ""
                }`}
                style={{
                  backgroundColor:
                    selected === item.id ? item.color : "var(--color-cream)",
                  boxShadow:
                    selected === item.id
                      ? "0 10px 20px rgba(0,0,0,0.2)"
                      : "none",
                }}
                onClick={() => setSelected(item.id)}
              >
                <div className="icon d-flex">
                  <img decoding="async"
                    loading="lazy"
                    src="/assets/puzzleicon.png"
                    alt=""
                    className="wicon"
                  />
                </div>
                <strong
                  className="witemtitle"
                  style={{
                    fontSize: "0.8rem",
                    color:
                      selected === item.id ? "white" : "var(--color-black)",
                  }}
                >
                  {item.title}
                </strong>
                <p className="d-none d-md-block" style={{ fontSize: "0.8rem" }}>
                  {item.description}
                </p>
                <div
                  className={`bottom ${visible ? "visible" : ""} ${
                    selected === item.id ? "d-block" : "d-none"
                  } d-md-none`}
                >
                  <h5
                    dangerouslySetInnerHTML={{ __html: titles[selected - 1] }}
                  />
                  <p className="bdescription">{descriptions[selected - 1]}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Bottomline />
    </div>
  );
};

export default WhatWeDo;
