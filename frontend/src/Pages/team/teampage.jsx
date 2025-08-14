import React, { useEffect, useState } from "react";
import './team.css';
import Volunteer from "../../components/Volunteers/volunteer";
import axios from "axios";

const Teampage = () => {
  const [team, setTeam] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchTeam = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get("https://kudushilali.org/backend/teams/teams_CRUD.php");
        if (res.data.status === "success" && Array.isArray(res.data.data)) {
          setTeam(res.data.data);
        }
      } catch (error) {
        console.error("Takım alınamadı:", error);
      }
      setIsLoading(false);
    };
    fetchTeam();
  }, []);

  return (
    <div className="teampage d-flex flex-column align-items-center justify-content-center">
      <h4 className="h4">TEAM</h4>
      <h2 className="h2">OUR TEAM</h2>
      <div className="d-flex flex-row align-items-center justify-content-center flex-wrap gap-5 pt-5">
        {team.length === 0 ? (
          <p>Takım bulunamadı.</p>
        ) : (
          team.map((person) => (
            <Volunteer key={person.id} volunteerdata={person} />
          ))
        )}
      </div>
      {isLoading && (
        <div className="loading d-flex justify-content-center align-items-center">
          <p>Yükleniyor...</p>
        </div>
      )}
    </div>
  );
};

export default Teampage;
