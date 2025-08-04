
import React, { useState, useEffect } from "react";
import "./home.css";
import Hero from "../../components/herospace/herospace";
import KPIS from "../../components/kpi/kpi";
import RecentCauses from "../../components/recentcauses/causes";
import WhatWeDo from "../../components/what_we_do/whatwedo";
import HowToContribute from "../../components/HowToContribute/HowToContribute";
import Volunteers from "../../components/Volunteers/volunteers";
import NewsCards from "../../components/homenewscards/newscards";
import DonorFeedbacks from "../../components/donorfeedbacks/donorsfeedbacks";
const Home = () => {
     const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 3500);

    return () => clearTimeout(timer);
  }, []);
return(
    <div style={{ height: "auto" ,width:"100vw"  }}>
      <div className="w-100">
        <Hero />
        {showContent && (
          <div className="stats-container-mockup">
        <KPIS />
      </div>
        )}
      </div>

      {showContent && (
        <>
        
          <RecentCauses/>
          <WhatWeDo/>
          <HowToContribute/>
          <Volunteers/>
          <NewsCards/>
          <DonorFeedbacks/>
          
        </>
      )}
    </div>
  );}
export default Home;
