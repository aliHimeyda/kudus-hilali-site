import React, { useEffect, useRef, useState } from "react";
import "./kpi.css";
import axios from "axios";

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

  useEffect(() => {
    const fetchKPI = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8888/kudus/backend/Home/home_kpi.php"
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
        { value: kpi.months, label: "Months" },
        { value: kpi.projects, label: "Projects" },
        { value: kpi.partners, label: "Partners" },
        { value: parseInt(kpi.budget), suffix: "M", label: "Budget" },
      ];
      statRefs.current.forEach((el, i) => {
        const { value, suffix } = dynamicStats[i];
        animateCount(el, value, suffix);
      });
    }
  }, [kpi]);

  if (!kpi)
    return <p className="text-center text-light mt-3">Loading KPIs...</p>;

  const stats = [
    { value: kpi.months, label: "Months" },
    { value: kpi.projects, label: "Projects" },
    { value: kpi.partners, label: "Partners" },
    { value: parseInt(kpi.budget), suffix: "M", label: "Budget" },
  ];

  return (
    <div className="stats-container animate-stats p-3 p-md-4 rounded-4">
      <div className="row text-center text-white">
        {stats.map((stat, idx) => (
          <div key={idx} className="col-6 col-md-3">
            <h2
              ref={(el) => (statRefs.current[idx] = el)}
              className="stat-number shadow-text"
            >
              0
            </h2>
            <p className="stat-label text-light">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KPIS;
