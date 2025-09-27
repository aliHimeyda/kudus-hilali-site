import React, { useEffect, useState } from "react";
import "./team.css";
import Volunteer from "../../components/Volunteers/volunteer";
import axios from "axios";
import Preloader from "../../components/preloader/preloader";
import { useTranslation } from "react-i18next";

const Teampage = () => {
  const [team, setTeam] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setPreLoading] = useState(true);
  const { t, i18n } = useTranslation();
  useEffect(() => {
    const t = setTimeout(() => setPreLoading(false), 0);
    return () => clearTimeout(t);
  }, []);
  useEffect(() => {
    const fetchTeam = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(
          "http://kudushilali.org/backend/teams/teams_CRUD.php",
          { params: { lang: i18n.language } }
        );
        if (res.data.status === "success" && Array.isArray(res.data.data)) {
          setTeam(res.data.data);
        }
      } catch (error) {
        console.error("Takım alınamadı:", error);
      }
      setIsLoading(false);
    };
    fetchTeam();
  }, );

  return (
    <>
      <Preloader show={loading} />
      <div className="teampage d-flex flex-column align-items-center justify-content-center">
        <h4 className="h4">{t("team_section_title")}</h4>
        <h2 className="h2">{t("team_our_team")}</h2>

        <div className="d-flex flex-row align-items-center justify-content-center flex-wrap gap-5 pt-5">
          {team.length === 0 ? (
            <p dir={i18n.language === "ar" ? "rtl" : "ltr"}>{t("team_not_found")}</p>
          ) : (
            team.map((person) => (
              <Volunteer key={person.id} volunteerdata={person} />
            ))
          )}
        </div>

        {isLoading && (
          <div className="loading d-flex justify-content-center align-items-center">
            <p>{t("loading_text")}</p>
          </div>
        )}
      </div>
    </>
  );
};

export default Teampage;
