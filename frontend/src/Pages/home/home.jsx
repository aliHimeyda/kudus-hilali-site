import React, { useState, useEffect, useRef } from "react";
import "./home.css";
import Hero from "../../components/herospace/herospace";
import KPIS from "../../components/kpi/kpi";
import RecentCauses from "../../components/recentcauses/causes";
import WhatWeDo from "../../components/what_we_do/whatwedo";
import HowToContribute from "../../components/HowToContribute/HowToContribute";
import Volunteers from "../../components/Volunteers/volunteers";
import NewsCards from "../../components/homenewscards/newscards";
import DonorFeedbacks from "../../components/donorfeedbacks/donorsfeedbacks";
// let hasVisited = false;
const Home = () => {
  const [showContent, setShowContent] = useState(false);
  useEffect(() => {
    let timer;
    // if (!hasVisited) {
    timer = setTimeout(() => {
      setShowContent(true);
      //  hasVisited=true;
    }, 3200);

    // } else {
    //   setShowContent(true);
    // }

    return () => clearTimeout(timer);
  }, []);
  return (
    <div style={{ width: "100vw" }}>
      <Hero />
      {showContent && (
        <div className="stats-container-mockup">
          <KPIS />
        </div>
      )}

      {showContent && (
        <>
          <RecentCauses />
          <WhatWeDo />
          <HowToContribute />
          <Volunteers />
          <NewsCards />
          <DonorFeedbacks />
        </>
      )}
    </div>
  );
};
export default Home;
