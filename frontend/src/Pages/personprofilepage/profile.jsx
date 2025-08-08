import React, { useEffect, useState, useRef } from 'react';
import './profile.css';
import { useParams } from 'react-router-dom';
import Bottomline from '../../components/bottomline/bottomline';
import axios from 'axios';

const UserProfile = () => {
  const { personid } = useParams();
  const [person, setPerson] = useState(null);
  const [notFound, setNotFound] = useState(false);


  const infoRef = useRef(null);
  const bioRef = useRef(null);
  const expRef = useRef(null);

  useEffect(() => {
    const fetchPerson = async () => {
      try {
        const res = await axios.get(`http://mediumslateblue-pony-639793.hostingersite.com/backend/teams/teams_CRUD.php?id=${personid}`);
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
            ref.current.classList.add('fade-in-visible');
          }
        }, 200 + i * 200);
      });
    }
  }, [person]);

  if (notFound) {
    return <div className="container py-5">Kullanıcı bulunamadı.</div>
  }
  if (!person) {
    return <div className="container py-5">Yükleniyor...</div>
  }

  return (
    <div className="container py-5 ">

      <div className="personinfo d-flex align-items-center fade-in-section" ref={infoRef}>
        <div className="profile-pic rounded-circle shadow" style={{ backgroundImage: `url(${person.image})` }}></div>
        <div className="ms-5">
          <h2 className="username">{person.name}</h2>
          <h5 className="charity-title">{person.role}</h5>
          <div className="mt-3">
            <p className="address-label">Address :</p>
            <p className="address">{person.address || 'Turkey, Istanbul , Umraniye ....'}</p>
            <p className="social-label">Social Media :</p>
            <div className="d-flex gap-2 mt-1">
              <div className="icon fb"></div>
              <div className="icon linkedin"></div>
              <div className="icon twitter"></div>
              <div className="icon insta"></div>
            </div>
          </div>
        </div>
      </div>
      <Bottomline />

      <div className="bio-box fade-in-section" ref={bioRef}>
        <h4 className="bio-title">Professional Bio :</h4>
        <p className="bio-text">
          {person.bio || `Career startup guy.

          Lorem Ipsum is simply dummy text of typesetting industry. (www.skylinktechsaas.com)

          Lorem Ipsum has been the industry's standard dummy text ever since the 1500s...`}
        </p>
      </div>

      <div className="fade-in-section d-flex flex-column align-items-center align-items-md-start mt-5" ref={expRef}>
        <h4 className="experience-title">Experiences & Skills</h4>
        <div className="d-flex flex-column flex-md-row gap-3 mt-3">
          <div className="info-box">
            <p className="info-label">Phone</p>
            <p className="info-text">{person.phone || '+91 12345 67890'}</p>
          </div>
          <div className="info-box">
            <p className="info-label">Email</p>
            <p className="info-text">{person.email || 'charity@example.com'}</p>
          </div>
          <div className="info-box">
            <p className="info-label">Experiences</p>
            <p className="info-text">{person.experience || '10+ Years Experiences'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
