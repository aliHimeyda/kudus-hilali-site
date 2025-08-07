// src/utils/PageCache.js
import React, { useRef, useEffect } from "react";
const PageCache = ({ isActive, children }) => {
  const containerRef = useRef();
 
  useEffect(() => {
    if (!isActive && containerRef.current) {
      // Gizlemeden once scroll pozisyonunu kaydet
      containerRef.current.scrollTop = window.scrollY;
    } else if (isActive && containerRef.current) {
      // Aktif olunca scroll'u geri yukle
      window.scrollTo(0, containerRef.current.scrollTop || 0);
    }
  }, [isActive]);

  return (
    <div
      ref={containerRef}
      style={{ display: isActive ? "block" : "none", width: "100%" }}
    >
      {children}
    </div>
  );
};

export default PageCache;
