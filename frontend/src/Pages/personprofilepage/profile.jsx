import React, { useEffect, useState, useRef } from "react";
import "./profile.css";
import { useParams } from "react-router-dom";
import Bottomline from "../../components/bottomline/bottomline";
import axios from "axios";
import { useTranslation } from "react-i18next";

const UserProfile = () => {
  const { personid } = useParams();
  const [person, setPerson] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const { t, i18n } = useTranslation();
  const infoRef = useRef(null);
  const bioRef = useRef(null);
  const expRef = useRef(null);

  useEffect(() => {
    const fetchPerson = async () => {
      try {
        const res = await axios.get(
          `http://kudushilali.org/backend/teams/teams_CRUD.php?id=${personid}`,
          {
            params: {
              lang: i18n.language,
            },
          }
        );
        if (res.data.status === "success" && res.data.data) {
          const result = Array.isArray(res.data.data)
            ? res.data.data[0]
            : res.data.data;
          if (result) {
            setPerson(result);
            setNotFound(false);
          } else {
            setPerson(null);
            setNotFound(true);
          }
        } else {
          setPerson(null);
          setNotFound(true);
        }
      } catch (err) {
        setPerson(null);
        setNotFound(true);
        console.error("Kullanıcı verisi alınırken hata:", err);
      }
    };
    fetchPerson();
  }, [personid]);

  useEffect(() => {
    if (person) {
      [infoRef, bioRef, expRef].forEach((ref, i) => {
        setTimeout(() => {
          if (ref.current) {
            ref.current.classList.add("fade-in-visible");
          }
        }, 200 + i * 200);
      });
    }
  }, [person]);

  if (notFound) {
    return <div className="container py-5">Kullanıcı bulunamadı.</div>;
  }
  if (!person) {
    return <div className="container py-5">Yükleniyor...</div>;
  }

  return (
    <div
      className="container py-5 "
      dir={i18n.language === "ar" ? "rtl" : "ltr"}
    >
      <div
        className="personinfo d-flex align-items-center fade-in-section"
        ref={infoRef}
      >
        {person.image && (
          <div
            className="profile-pic rounded-circle shadow"
            style={{ backgroundImage: `url(${person.image})` }}
          ></div>
        )}

        <div className="m-5">
          {person.name && <h2 className="username">{person.name}</h2>}
          {person.role && <h5 className="charity-title">{person.role}</h5>}

          {person.address && (
            <div className="mt-3">
              <p className="address-label">{t("person_address_label")}</p>
              <p className="address">{person.address}</p>
            </div>
          )}

          {(person.facebook ||
            person.linkedin ||
            person.twitter ||
            person.instagram) && (
            <div className="mt-3">
              <p className="social-label">{t("person_social_label")}</p>
              <div className="d-flex gap-2 mt-1">
                {person.facebook && (
                  <div
                    className="icon fb"
                    onClick={() => (window.location.href = person.facebook)}
                    style={{ cursor: "pointer" }}
                  ></div>
                )}
                {person.linkedin && (
                  <div
                    className="icon linkedin"
                    onClick={() => (window.location.href = person.linkedin)}
                    style={{ cursor: "pointer" }}
                  ></div>
                )}
                {person.twitter && (
                  <div
                    className="icon twitter"
                    onClick={() => (window.location.href = person.twitter)}
                    style={{ cursor: "pointer" }}
                  ></div>
                )}
                {person.instagram && (
                  <div
                    className="icon insta"
                    onClick={() => (window.location.href = person.instagram)}
                    style={{ cursor: "pointer" }}
                  ></div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <Bottomline />

      {person.bio && (
        <div className="bio-box fade-in-section" ref={bioRef}>
          <h4
            className="bio-title"
            dir={i18n.language === "ar" ? "rtl" : "ltr"}
          >
            {t("person_bio_title")}
          </h4>
          <p className="bio-text" dir={i18n.language === "ar" ? "rtl" : "ltr"}>
            {person.bio}
          </p>
        </div>
      )}

      <div
        className="fade-in-section d-flex flex-column align-items-center align-items-md-start mt-5"
        ref={expRef}
        dir={i18n.language === "ar" ? "rtl" : "ltr"}
      >
        <h4 className="experience-title">{t("person_contact_title")}</h4>
        <div className="d-flex flex-column flex-md-row gap-3 mt-3">
          {person.phone && (
            <div className="info-box">
              <p className="info-label">{t("phone_label")}</p>
              <p className="info-text">{person.phone}</p>
            </div>
          )}

          {person.email && (
            <div className="info-box">
              <p className="info-label">{t("email_label")}</p>
              <p className="info-text">{person.email}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
