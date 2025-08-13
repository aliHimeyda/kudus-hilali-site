import React, { useState, useEffect, useRef } from "react";
import "./whatwedo.css";
import Bottomline from "../bottomline/bottomline";
import Morebtn from "../btns/morebtn";

const items1 = [
  {
    id: 1,
    title: "Natural Disasters",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the",
    color: "var(--color-red)",
    icon: "🌪️",
  },
  {
    id: 2,
    title: "Natural Disasters",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the",
    color: "var(--color-orange)",
    icon: "🌪️",
  },
];
const items2 = [
  {
    id: 3,
    title: "Healthcare Services",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the",
    color: "var(--color-orange)",
    icon: "🏥",
  },
  {
    id: 4,
    title: "Clean Water Projects",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the",
    color: "var(--color-green)",
    icon: "🚰",
  },
];
const descriptions = [
  "Committed to global upliftment, we offer aid to those facing diverse challenges, aiming to empower, inspire resilience, and drive positive change for brighter futures in communities worldwide. Our dedication spans borders, fostering hope and transformation.",
  "Committed to global upliftment, we offer aid to those facing diverse challenges, aiming to empower, inspire resilience, and drive positive change for brighter futures in communities worldwide. Our dedication spans borders, fostering hope and transformation.",
  "Committed to global upliftment, we offer aid to those facing diverse challenges, aiming to empower, inspire resilience, and drive positive change for brighter futures in communities worldwide. Our dedication spans borders, fostering hope and transformation.",
  "Committed to global upliftment, we offer aid to those facing diverse challenges, aiming to empower, inspire resilience, and drive positive change for brighter futures in communities worldwide. Our dedication spans borders, fostering hope and transformation.",
];
const titles = [
  "Global <strong>Struggles</strong> Aid Assistance",
  "Global <strong>Struggles</strong> Aid Assistance",
  "<strong>Healthcare</strong> Services",
  "Clean <strong>Water</strong> Projects",
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
                  <img
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
                  <p className="bdescription">{descriptions[selected - 1]}</p>
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
                  <img
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
