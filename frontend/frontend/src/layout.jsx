// src/Layout.js
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
const Layout = () => {
  const [showLayout, setShowLayout] = useState(true);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/") {
      setShowLayout(false);
      const timer = setTimeout(() => {
        setShowLayout(true);
      }, 3000);
      return () => clearTimeout(timer);
    } else {
      setShowLayout(true);
    }
  }, [location]);

  return (
    <>
    
      {showLayout && <Header />}
      <main className='d-flex justify-content-center'>
        <Outlet />
      </main>
      {showLayout && <Footer />}
    </>
  );
};

export default Layout;
