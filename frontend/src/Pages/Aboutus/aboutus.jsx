import React, { useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./aboutus.css";
import { Link } from "react-router-dom";

const AnimatedSection = ({ children, className = "", triggerPercent = 0.3 }) => {
  const ref = useRef(null);
 const imageCacheRef = useRef();
  useEffect(() => {
     imageCacheRef.current = (src) => {
      if (!"/assets/200.webp") return null;
      const img = new Image();
      img.src = src;
      return img;
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-show");
          observer.unobserve(entry.target);
        }
      },
      { threshold: triggerPercent }
    );
    if (ref.current) observer.observe(ref.current);
  }, [triggerPercent]);

  return (
    <div ref={ref} className={`animated-section ${className}`}>
      {children}
    </div>
  );
};

const Aboutus = () => {
  return (
    <div className="container-fluid p-0">
      <div className="hero-section position-relative text-center">
        <img
          src="/assets/200.webp"
          alt="Hero"
        />
        
        <div className="hero-text position-absolute start-50 translate-middle">
          <button className="btn btn-warning px-4">Wach Our Story's Video</button>
        </div>
        <div class="curved-container"></div>
      </div>

      <div className="py-5">
        <div className="container d-flex flex-column gap-3 p-5 mt-0">
              <h6 className="h4 text-uppercase text-danger mb-3" style={{ fontSize: "11px" }}>About Us</h6>
         <div className="w-100 d-flex flex-md-row flex-column gap-5">
           
                <h2 className="fw-bold" style={{ fontSize: "33px" }}>We provide enterprises
with innovative technology
for small to space enterprises</h2>

          <p className="text-muted" style={{ fontSize: "15px" }}>
           We supply enterprises, organizations and institutes of 
high-tech industries with modern components. We build long-term trusting relationships with our customers and partnes for further fruitful cooperations. <br />

From year to year we strive to invent the most innovative technology that is used by both small enterprises and space enterprises.
          </p>
         </div>
        </div>
      </div>

      <AnimatedSection className="image-gallery d-flex flex-row justify-content-center align-items-center gap-3 py-5">
        <AnimatedSection className="imgpacket1 d-flex flex-column align-items-end w-50 gap-4">
            <img src="/assets/200.webp" alt="" style={{width:'250px',height:'450px', objectFit:'cover'}} className="image1"/>
            <AnimatedSection  className="d-flex flex-row w-100 justify-content-end gap-4">
                <img src="/assets/4000.webp" alt="" style={{width:'300px',height:'200px', objectFit:'cover'}} className="image2"/>
                <img src="/assets/a6.webp" alt="" style={{width:'200px',height:'170px', objectFit:'cover' }} className="px-3 image3"/>
            </AnimatedSection>
        </AnimatedSection>
        <AnimatedSection className="imgpacket2 d-flex flex-column w-50 gap-3">
            <AnimatedSection className="d-flex flex-row w-100 align-items-end gap-3">
            <img src="/assets/a5.webp" alt="" style={{width:'200px',height:'200px', objectFit:'cover'}} className="image4"/>
            <img src="/assets/a4.webp" alt="" style={{width:'300px',height:'250px', objectFit:'cover'}} className="image5"/>
            </AnimatedSection>
         <img src="/assets/a2.webp" alt="" style={{width:'300px',height:'300px', objectFit:'cover'}} className="image6"/>
        </AnimatedSection>
      </AnimatedSection>

      <AnimatedSection className="py-5 mt-5 d-flex flex-column align-items-center text-center">
        <h6 className="h4 text-uppercase text-danger mb-3" style={{ fontSize: "11px" }}>Our Values</h6>
        <h2 className="fw-bold mb-4 " style={{width:'100%', fontSize: "33px" }}>We Strive To Redefine The Standard Of Excellence.</h2>
        <div className="d-flex flex-column flex-md-row justify-content-center w-50">
          <div>
            <div className="d-flex flex-column">
              <div className="value-card p-3">
                <div className="icon-box mb-2"><img src="/assets/Workflow.svg" alt="" /></div>
                <h5 className="fw-bold" style={{ fontSize: "17px" }}>Collaboration</h5>
                <p className="text-muted" style={{ fontSize: "13px" }}>
                  Collaboration Collaboration is the process of two or more people or organizations working together to complete a task or achieve a goal. 
                </p>
              </div>
            </div>
            <div className="d-flex flex-column">
              <div className="value-card p-3">
                <div className="icon-box mb-2"><img src="/assets/Iconshape.svg" alt="" /></div>
                <h5 className="fw-bold" style={{ fontSize: "17px" }}>Transparency</h5>
                <p className="text-muted" style={{ fontSize: "13px" }}>
                  Transparency Collaboration is the process of two or more people or organizations working together to complete a task or achieve a goal. 
                </p>
              </div>
            </div>
         </div>
         <div>
            <div className="d-flex flex-column">
              <div className="value-card p-3">
                <div className="icon-box mb-2"><img src="/assets/likeicon.svg" alt="" /></div>
                <h5 className="fw-bold" style={{ fontSize: "17px" }}>Trust</h5>
                <p className="text-muted" style={{ fontSize: "13px" }}>
                  Trust Collaboration is the process of two or more people or organizations working together to complete a task or achieve a goal. 
                </p>
              </div>
            </div>
            <div className="d-flex flex-column">
              <div className="value-card p-3">
                <div className="icon-box mb-2"><img src="/assets/Integrity.svg" alt="" /></div>
                <h5 className="fw-bold" style={{ fontSize: "17px" }}>Integrity</h5>
                <p className="text-muted" style={{ fontSize: "13px" }}>
                  Integrity Collaboration is the process of two or more people or organizations working together to complete a task or achieve a goal. 
                </p>
              </div>
            </div>
         </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="our-team-container container py-5 text-start d-flex flex-row justify-content-around align-items-center">
        <div className="team-container d-flex flex-column">
         
             <h6 className="text-uppercase text-danger mb-3" style={{ fontSize: "11px" }}>Our Team</h6>
          <h2 className="fw-bold" style={{ fontSize: "33px" }}>Experience and integrity by our team</h2>
          <p className="text-muted" style={{ fontSize: "15px" }}>
            The right tools wielded by the right people to make anything possible. From year to year we strive to invent the most innovative technology produced by our creative people
          </p>
          <Link to="/teampage"><button className="btn btn-outline-danger" >Meet our team</button></Link>
         
         
        </div>
         <div className="shape-container">
          {[...Array(5)].map((_, i) => (
            <div key={i} className={`shape-box shape-${i + 1}`}><img src={`/assets/v${i+1}.webp`} alt={i} style={{objectFit:'cover', width:'100%',height:'100%' , borderRadius:'10px'}}/></div>
          ))}
        </div>
      </AnimatedSection>
    </div>
  );
};

export default Aboutus;
