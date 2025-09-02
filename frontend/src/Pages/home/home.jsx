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
    <div style={{ width: "100vw" ,overflow:"hidden"}}>
      <Hero />

      <div className={showContent ? "d-block" : "d-none"}>
        <div className="stats-container-mockup">
          <KPIS />
        </div>
        <>
          <RecentCauses />
          <WhatWeDo />
          <HowToContribute />
          <Volunteers />
          <NewsCards />
          <DonorFeedbacks />
        </>
      </div>
    </div>
  );
};
export default Home;
