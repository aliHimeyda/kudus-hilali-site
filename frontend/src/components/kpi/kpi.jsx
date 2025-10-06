import React, { useEffect, useRef, useState } from "react";
import "./kpi.css";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { t } from "i18next";

const animateCount = (el, to, suffix = "", duration = 2000) => {
  let start = 0;
  const stepTime = Math.abs(Math.floor(duration / to));
  const counter = setInterval(() => {
    start++;
    el.innerText = suffix ? `$${start}${suffix}+` : `${start}+`;
    if (start >= to) clearInterval(counter);
  }, stepTime);
};

const KPIS = () => {
  const [kpi, setKpi] = useState(null);
  const statRefs = useRef([]);
  const { i18n } = useTranslation();
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
    if (kpi) {
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

      // 3200 ms bekle sonra animasyonu başlat
      const timer = setTimeout(() => {
        statRefs.current.forEach((el, i) => {
          const { value, suffix } = dynamicStats[i];
          animateCount(el, value, suffix);
        });
      }, 3200);

      return () => clearTimeout(timer);
    }
  }, [kpi]);

  if (!kpi)
    return <p className="text-center text-light mt-3">Loading KPIs...</p>;

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
            <h2
              ref={(el) => (statRefs.current[idx] = el)}
              className="stat-number shadow-text"
            >
              0<h6>{stat.suffix}</h6>
            </h2>
            <p className="stat-label text-light">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KPIS;
