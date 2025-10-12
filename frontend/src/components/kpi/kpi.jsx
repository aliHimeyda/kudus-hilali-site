import React, { useEffect, useRef, useState } from "react";
import "./kpi.css";
import axios from "axios";
import { useTranslation } from "react-i18next";

const animateCount = (el, to, duration = 2000) => {
  if (!el) return;
  let start = 0;
  const safeTo = Math.max(1, Number(to) || 0);
  const stepTime = Math.max(15, Math.floor(duration / safeTo));
  const counter = setInterval(() => {
    start++;
    el.textContent = `${start}`;
    if (start >= safeTo) clearInterval(counter);
  }, stepTime);
};

const KPIS = () => {
  const [kpi, setKpi] = useState(null);
  const statRefs = useRef([]);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const fetchKPI = async () => {
      try {
        const res = await axios.get(
          "http://kudushilali.org/backend/Home/home_kpi.php"
        );
        if (res.data.status === "success" && res.data.data) {
          setKpi(res.data.data);
        }
      } catch (err) {
        console.error("KPI fetch error:", err);
      }
    };
    fetchKPI();
  }, []);

  useEffect(() => {
    if (!kpi) return;

    const dynamicStats = [
      { value: kpi.months, label: t("month") },
      { value: kpi.projects, label: t("projects") },
      { value: kpi.partners, label: t("partners") },
      {
        value: parseInt(kpi.budget),
        suffix: kpi.budgetchar,
        label: t("budget"),
      },
    ];

    const timer = setTimeout(() => {
      statRefs.current.forEach((el, i) => {
        const { value } = dynamicStats[i];
        animateCount(el, value);
      });
    }, 3200);

    return () => clearTimeout(timer);
  }, [kpi, t]);

  if (!kpi)
    return <p className="text-center text-light mt-3">Loading KPIs...</p>;

  const suffixMap = { K: "thousand", M: "million", T: "trillion" };

  const stats = [
    { value: kpi.months, label: t("month") },
    { value: kpi.projects, label: t("projects") },
    { value: kpi.partners, label: t("partners") },
    { value: parseInt(kpi.budget), suffix: kpi.budgetchar, label: t("budget") },
  ];

  return (
    <div
      className="stats-container animate-stats p-3 p-md-4 rounded-4"
      dir={i18n.language === "ar" ? "rtl" : "ltr"}
    >
      <div className="row text-center text-white">
        {stats.map((stat, idx) => (
          <div key={idx} className="col-6 col-md-3">
            <h2 className="stat-number shadow-text">
              <span
                className="stat-value"
                ref={(el) => (statRefs.current[idx] = el)}
              >
                0
              </span>
              <h6 className={i18n.language === "ar" ? "fs-6-smaller" : ""}>
                {t(suffixMap[stat.suffix]) || stat.suffix || ""}
              </h6>
            </h2>
            <p className="stat-label text-light">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KPIS;
