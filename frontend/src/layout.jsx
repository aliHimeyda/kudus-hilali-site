// src/Layout.js
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import React, { useEffect, useRef, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
let hasVisited=false;
const Layout = () => {
  const [showLayout, setShowLayout] = useState(true);
  const location = useLocation();

  
  useEffect(() => {

    if (!hasVisited) {
      setShowLayout(false);
      const timer = setTimeout(() => {
        setShowLayout(true);
         hasVisited=true;
      }, 3500);
     
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
