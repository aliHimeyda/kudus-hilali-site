import React, { useState, useEffect, useRef } from "react";
import "./whatwedo.css";
import Bottomline from "../bottomline/bottomline";
import Morebtn from "../btns/morebtn";
import { useTranslation } from "react-i18next";

// const items1 = [
//   {
//     id: 1,
//     title: "Emergency assistance",
//     description:
//       "We deliver urgent relief, seasonal food aid, and winter support to those in need.",
//     color: "var(--color-red)",
//     icon: "/assets/healthcare.webp",
//   },
//   {
//     id: 2,
//     title: "Community Development",
//     description:
//       "Building stronger communities through empowerment, inclusion, and local action.",
//     color: "var(--color-orange)",
//     icon: "/assets/partners.webp",
//   },
// ];
// const items2 = [
//   {
//     id: 3,
//     title: "Children & Education",
//     description:
//       "We empower children through education, care, and emotional support for a brighter future.",
//     color: "var(--color-orange)",
//     icon: "/assets/open-book.webp",
//   },
//   {
//     id: 4,
//     title: "Advocacy & Awareness",
//     description:
//       "Raising voices for Palestine through art, stories, and community action.",
//     color: "var(--color-green)",
//     icon: "/assets/loudspeaker.webp",
//   },
// ];
// const descriptions = [
//   "We provide urgent response to crises (war, earthquakes, displacement), Ramadan food campaigns, Qurban meat distribution and winter kits (blankets, heating support).",
//   "We strengthen communities by supporting refugees and families (especially in Turkey), empowering women and youth, promoting local initiatives in Sakarya, and fostering skills-building and volunteer integration.",
//   "We provide orphan support and child sponsorship, school kits and uniforms, education programs (tutoring, literacy), and mental health & trauma care.",
//   "We advocate for Palestine through impactful campaigns, social media storytelling, art exhibitions and events, and active participation in NGO summits, youth panels, and mosque information booths.",
// ];
// const titles = [
//   "<strong>Emergency</strong> Relief & Seasonal Aid",
//   "Community <strong>Development</strong>",
//   "Children & <strong>Education</strong>",
//   "<strong>Advocacy</strong> & Awareness",
// ];

// 1) Dil bağımsız meta (ikon & renk)

const WhatWeDo = () => {
  const [selected, setSelected] = useState(1);
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);
  const leftRef = useRef(null);
  const { t, i18n } = useTranslation();
  const itemsMeta = [
    { id: 1, color: "var(--color-red)", icon: "/assets/healthcare.webp" },
    { id: 2, color: "var(--color-orange)", icon: "/assets/partners.webp" },
    { id: 3, color: "var(--color-orange)", icon: "/assets/open-book.webp" },
    { id: 4, color: "var(--color-green)", icon: "/assets/loudspeaker.webp" },
  ];

  // 2) Çeviriden metinleri çek (returnObjects ile)
  const i18nItems = t("whatwedo.items", { returnObjects: true });

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
      <h4 className="h4">{t("whatwedo.causes")}</h4>
      <h2 className="h2">{t("whatwedo.title")}</h2>

      <div
        className={`what-we-do-section ${visible ? "visible" : ""}`}
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
            dangerouslySetInnerHTML={{
              __html: t("whatwedo.titles", { returnObjects: true })[
                selected - 1
              ],
            }}
          />
          <p className="description text-center" dir={i18n.language === "ar" ? "rtl" : "ltr"}>
            {t("whatwedo.descriptions", { returnObjects: true })[selected - 1]}
          </p>
          <Morebtn title={t("read_more")} path={"/aboutuspage"} />
        </div>

        <div className="right gap-4 d-flex flex-md-row flex-column">
          <div className="d-flex flex-column gap-4 pt-5">
            {t("whatwedo.items", { returnObjects: true })
              .slice(0, 2)
              .map((item, idx) => (
                <div
                  key={item.id}
                  className={`card d-flex gap-3 ${
                    selected === item.id ? "active" : ""
                  }`}
                  style={{
                    backgroundColor:
                      selected === item.id
                        ? itemsMeta[idx].color
                        : "var(--color-cream)",
                    boxShadow:
                      selected === item.id
                        ? "0 10px 20px rgba(0,0,0,0.2)"
                        : "none",
                  }}
                  onClick={() => setSelected(item.id)}
                >
                  <div className="icon d-flex">
                    <img
                      decoding="async"
                      loading="lazy"
                      src={itemsMeta[idx].icon}
                      alt=""
                      className="wicon"
                    />
                  </div>
                  <h1
                    className="witemtitle"
                    style={{
                      fontSize: "0.8rem",
                      color:
                        selected === item.id ? "white" : "var(--color-black)",
                    }}
                  >
                    {item.title}
                  </h1>
                  <p
                    className="d-none d-md-block"
                    style={{ fontSize: "0.8rem" }} dir={i18n.language === "ar" ? "rtl" : "ltr"}
                  >
                    {item.description}
                  </p>
                  <div
                    className={`bottom ${visible ? "visible" : ""} ${
                      selected === item.id ? "d-block" : "d-none"
                    } d-md-none`}
                  >
                    <h5
                      dangerouslySetInnerHTML={{
                        __html: t("whatwedo.titles", {
                          returnObjects: true,
                        })[selected - 1],
                      }}
                    />
                    <p
                      dir={i18n.language === "ar" ? "rtl" : "ltr"}
                      dangerouslySetInnerHTML={{
                        __html: t("whatwedo.descriptions", {
                          returnObjects: true,
                        })[selected - 1],
                      }}
                    />
                  </div>
                </div>
              ))}
          </div>

          <div className="d-flex flex-column gap-4 ">
            {t("whatwedo.items", { returnObjects: true })
              .slice(2, 4)
              .map((item, idx) => (
                <div
                  key={item.id}
                  className={`card d-flex gap-3 ${
                    selected === item.id ? "active" : ""
                  }`}
                  style={{
                    backgroundColor:
                      selected === item.id
                        ? itemsMeta[idx + 2].color
                        : "var(--color-cream)",
                    boxShadow:
                      selected === item.id
                        ? "0 10px 20px rgba(0,0,0,0.2)"
                        : "none",
                  }}
                  onClick={() => setSelected(item.id)}
                >
                  <div className="icon d-flex">
                    <img
                      decoding="async"
                      loading="lazy"
                      src={itemsMeta[idx + 2].icon}
                      alt=""
                      className="wicon"
                    />
                  </div>
                  <h1
                    className="witemtitle"
                    style={{
                      fontSize: "0.8rem",
                      color:
                        selected === item.id ? "white" : "var(--color-black)",
                    }}
                  >
                    {item.title}
                  </h1>
                  <p
                    className="d-none d-md-block"
                    style={{ fontSize: "0.8rem" }}
                    dir={i18n.language === "ar" ? "rtl" : "ltr"}
                  >
                    {item.description}
                  </p>
                  <div
                    className={`bottom ${visible ? "visible" : ""} ${
                      selected === item.id ? "d-block" : "d-none"
                    } d-md-none`}
                  >
                    <h5
                      dangerouslySetInnerHTML={{
                        __html: t("whatwedo.titles", {
                          returnObjects: true,
                        })[selected - 1],
                      }}
                    />
                    <p className="bdescription" dir={i18n.language === "ar" ? "rtl" : "ltr"}>
                      {
                        t("whatwedo.descriptions", {
                          returnObjects: true,
                        })[selected - 1]
                      }
                    </p>
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
