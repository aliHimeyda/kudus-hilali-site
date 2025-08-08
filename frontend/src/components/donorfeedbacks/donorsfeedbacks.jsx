import React, { useState, useRef, useEffect } from "react";
import DonorFeedback from "./donorsfeedback";
import "./donorfeedback.css";
import axios from "axios";

const DonorFeedbacks = () => {
  const [feedbackData, setFeedbackData] = useState([]);
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const [direction, setDirection] = useState("right");
  const sectionRef = useRef(null);

  const fetchFeedbacks = async () => {
    try {
      const res = await axios.get(
        "http://mediumslateblue-pony-639793.hostingersite.com/backend/donors_feedbacks/donors_feedbacks_CRUD.php"
      );
      if (res.data.status === "success" && Array.isArray(res.data.data)) {
        const formatted = res.data.data.map((item) => ({
          name: item.donor_name,
          text: item.feedback,
          image: item.image_url,
          stars: item.stars,
        }));
        setFeedbackData(formatted);
      }
    } catch (err) {
      console.error("Donor feedbacks alınırken hata:", err);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const next = () => {
    if (index + 3 < feedbackData.length) setIndex(index + 3);
    setDirection("right");
  };

  const prev = () => {
    if (index - 3 >= 0) setIndex(index - 3);
    setDirection("left");
  };

  const currentPage = Math.floor(index / 3);
  const animationClass =
    direction === "right" ? "feedback-animate-right" : "feedback-animate-left";

  return (
    <section
      ref={sectionRef}
      className={`feedback-section d-flex flex-column align-items-center justify-content-center ${
        visible ? "animate" : ""
      }`}
    >
      <h4 className="h4">TESTIMONIALS</h4>
      <h2 className="h2">
        What Our Donor <span>Say ?</span>
      </h2>

      <div
        className={`feedback-cards d-flex flex-md-row flex-column justify-content-center align-items-center gap-0 gap-md-4 mt-5 ${animationClass}`}
      >
        {feedbackData.length > 0 ? (
          feedbackData.slice(index, index + 3).map((item, i) => (
            <DonorFeedback key={i} {...item} />
          ))
        ) : (
          <p className="text-center">No feedbacks available.</p>
        )}
      </div>

      {feedbackData.length > 3 && (
        <div className="feedback-controls mt-5 d-flex justify-content-center align-items-center gap-5">
          <div className="arrow-btn" onClick={prev}>
            <img src="/assets/leftslider.svg" alt="Previous" />
          </div>

          <div className="dots d-flex gap-2">
            {Array.from({ length: Math.ceil(feedbackData.length / 3) }).map(
              (_, i) => (
                <div
                  key={i}
                  className={`dot ${currentPage === i ? "active" : ""}`}
                ></div>
              )
            )}
          </div>

          <div className="arrow-btn" onClick={next}>
            <img src="/assets/rightslider.svg" alt="Next" />
          </div>
        </div>
      )}
    </section>
  );
};

export default DonorFeedbacks;
