
import { useEffect, useState } from 'react';
import './App.css';
import MyRouter from './router/router';

function App() {
  const [height, setHeight] = useState(window.innerHeight *0.7); 
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;

      // Örnek: scroll'a göre yüksekliği artır (100px scroll için 1vh)
      const newHeight = height + scrollY;

      // Sınırlama: minimum 30vh, maksimum 100vh yapalım
      const minHeight =window.innerHeight *0.7;
      const maxHeight = scrollY + minHeight;
      const clampedHeight = Math.max(minHeight, Math.min(newHeight, maxHeight));

      setHeight(clampedHeight);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [window.scrollY]);

  return (
    <div>
      <div
  className="lefticons position-absolute d-flex flex-column"
  style={{
    height: `${height}px`,
    backgroundImage: 'url(/assets/backgroundicons.svg)',
    backgroundRepeat: 'repeat-y',
    backgroundSize: '100%',   // ikon genişliği
    backgroundPosition: 'center',
    transition: 'height 0.2s ',
  }}
/>
 <div
  className="righticons position-absolute d-flex flex-column"
  style={{
    height: `${height}px`,
    backgroundImage: 'url(/assets/backgroundicons.svg)',
    backgroundRepeat: 'repeat-y',
    backgroundSize: '100%',   // ikon genişliği
    transform: 'scaleX(-1)', 
    backgroundPosition: 'center',
    transition: 'height 0.2s ',
  }}
/>
      <div className='righticons'></div>
    <MyRouter/>
    </div>
  );
}

export default App;
