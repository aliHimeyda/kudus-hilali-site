import React, { useRef, useEffect, useState } from "react";
import "./volunteers.css";
import Bottomline from "../bottomline/bottomline";
import Allsbtn from "../btns/allsbtn";
import Volunteer from "./volunteer";
import axios from "axios";

const Volunteers = () => {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [volunteers, setVolunteers] = useState([]);

  useEffect(() => {
    const fetchVolunteers = async () => {
      try {
        const res = await axios.get("http://mediumslateblue-pony-639793.hostingersite.com/backend/teams/teams_CRUD.php?limit=3");
        if (res.data.status === "success" && Array.isArray(res.data.data)) {
          setVolunteers(res.data.data);
        }
      } catch (error) {
        console.error("Gönüllüler çekilemedi:", error);
      }
    };
    fetchVolunteers();
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

  return (
    <>
      <div
        ref={sectionRef}
        className={`volunteers-section container text-center py-5 mt-5 ${visible ? "fade-in-up" : ""}`}
      >
        <h4 className="h4">TEAM</h4>
        <h2 className="h2">Our TEAM</h2>
        <div className="d-flex flex-column flex-md-row flex-wrap justify-content-center align-items-center p-5 mt-5 gap-4">
          {volunteers.length === 0 ? (
            <p>Hiç gönüllü bulunamadı.</p>
          ) : (
            volunteers.map((vol) => (
              <Volunteer key={vol.id} volunteerdata={vol} />
            ))
          )}
        </div>
        <Allsbtn title={'ALL TEAM'} path={'/teampage'} />
      </div>
      <Bottomline />
    </>
  );
};

export default Volunteers;
