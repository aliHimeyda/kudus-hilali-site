// src/Layout.js
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import React, { useEffect, useRef, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Home from "./Pages/home/home";
import PageCeche from "./Pages/pageCeche";
const Layout = () => {
  const [showLayout, setShowLayout] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";
  const hasVisited = useRef(false);

  useEffect(() => {
    if (!hasVisited.current && isHome) {
      const timer = setTimeout(() => {
        setShowLayout(true);
      }, 3200);
      return () => clearTimeout(timer);
    } else {
      setShowLayout(true);
      hasVisited.current = true;
    }
  }, [location.pathname]);

  return (
    <>
      {showLayout && <Header />}
      <main className="d-flex justify-content-center">
        <PageCeche isActive={isHome}>
          <Home />
        </PageCeche>
        {!isHome && <Outlet />}
      </main>
      {showLayout && <Footer />}
    </>
  );
};

export default Layout;
