import React from "react";
import "./volunteers.css";
import { useNavigate } from "react-router-dom";

const Volunteer = ({ volunteerdata }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/profilepage/${volunteerdata.id}`);
  };

  return (
    <div key={volunteerdata.id} onClick={handleClick}>
      <div className="vol-card d-flex flex-column ">
        <div className="volimg">
          <img
            decoding="async"
            loading="lazy"
            src={volunteerdata.image}
            alt={volunteerdata.name}
            className="img-fluid vol-img"
          />
        </div>
        <div className="d-flex flex-column p-3 justify-content-center gap-2">
          <h5 className="vol-name">{volunteerdata.name}</h5>
          <div className="d-flex flex-column justify-content-center align-items-center">
            <div className="underline-container">
              <div className="dark-line"></div>
              <div className="light-line"></div>
            </div>
            <p className="vol-role">{volunteerdata.role}</p>
          </div>
          <div className="scard">
            {volunteerdata.instagram && (
              <a
                className="socialContainer containerOne"
                href={volunteerdata.instagram}
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg viewBox="0 0 16 16" className="socialSvg instagramSvg">
                  <path
                    d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9S160.5 370.9 224.1 370.9 
S339 319.6 339 255.9 287.7 141 224.1 141zm0 188.6c-40.7 
0-73.7-33-73.7-73.7s33-73.7 73.7-73.7 73.7 33 73.7 
73.7-33 73.7-73.7 73.7zm146.4-194.3c0 14.9-12 26.9-26.9 
26.9s-26.9-12-26.9-26.9 12-26.9 
26.9-26.9 26.9 12 26.9 26.9zm76.1 
27.2c-1.7-35.9-9.9-67.7-36.2-93.9s-58-34.5-93.9-36.2c-37-2.1-147.9-2.1-184.9 
0-35.9 1.7-67.7 9.9-93.9 36.2s-34.5 58-36.2 
93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 
36.2 93.9s58 34.5 93.9 36.2c37 2.1 147.9 2.1 
184.9 0 35.9-1.7 67.7-9.9 93.9-36.2s34.5-58 
36.2-93.9c2.1-37 2.1-147.9 
0-184.9zM398.8 388c-7.8 19.7-23 35-42.6 
42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.7-7.8-35-23-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 
9-132.1c7.8-19.7 23-35 42.6-42.6 29.5-11.7 99.5-9 
132.1-9s102.7-2.6 132.1 9c19.7 7.8 35 23 
42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.6 
102.7-9 132.1z"
                  />
                </svg>
              </a>
            )}

            {volunteerdata.twitter && (
              <a
                className="socialContainer containerTwo"
                href={volunteerdata.twitter}
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg viewBox="0 0 16 16" className="socialSvg twitterSvg">
                  <path
                    d="M459.4 151.7c.3 4.5 .3 9.1 .3 13.6 0 138.7-105.6 
298.7-298.7 298.7-59.5 0-114.9-17.2-161.6-47.1 
8.4 1 16.8 1.4 25.6 1.4 49.1 0 
94.2-16.8 130.2-45.5-46.1-1-84.8-31.2-98.1-72.8 
6.4 1 12.8 1.7 19.6 1.7 9.1 
0 18.1-1.2 26.6-3.6-48.1-9.7-84.3-52-84.3-103v-1.4c14 
7.8 30.3 12.8 47.5 13.6-28.3-18.9-47.1-51-47.1-87.4 
0-19.6 5.2-37.8 14.3-53.6 51.9 
63.7 129.4 105.6 216.4 110.1-1.7-7.8-2.6-15.9-2.6-24 
0-57.8 47.5-104.9 104.9-104.9 30.3 
0 57.5 12.8 76.6 33.2 23.8-4.5 
46.4-13.6 66.5-25.9-7.8 24.3-24.3 
44.8-46.1 57.8 21.1-2.3 41.6-8.1 
60.5-16.2-14.3 20.6-32.1 39.1-52.6 
53.6z"
                  />
                </svg>
              </a>
            )}

            {volunteerdata.linkedin && (
              <a
                className="socialContainer containerThree"
                href={volunteerdata.linkedin}
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg viewBox="0 0 448 512" className="socialSvg linkdinSvg">
                  <path d="M100.28 448H7.4V148.9h92.88zM53.84 109.4C24.4 109.4 0 85 0 55.9 0 26.3 24.9 0 55.2 0c30.6 0 55.6 26.3 55.6 55.9 0 29.1-25 53.5-56 53.5zM447.9 448h-92.7V302.4c0-34.7-.7-79.2-48.3-79.2-48.3 0-55.7 37.7-55.7 76.6V448h-92.7V148.9h89V184h1.3c12.4-23.6 42.7-48.5 87.9-48.5 94 0 111.3 61.9 111.3 142.3V448z" />
                </svg>
              </a>
            )}

            {volunteerdata.whatsapp && (
              <a
                className="socialContainer containerFour"
                href={`https://wa.me/${volunteerdata.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg viewBox="0 0 16 16" className="socialSvg whatsappSvg">
                  <path
                    d="M380.9 97.1C339-6.5 220.8-34.5 127.5 
27.5 67.7 68.4 33.6 136.9 35.5 
210.5c1.9 70.8 35.5 136.6 92.8 
178.4L91.7 482c-3.1 8.8 5.6 17.5 
14.3 14.3l93.1-36.6c46.9 18.6 100.6 
22.7 151.2 10.2 76.4-18.7 
139.4-77.8 159.7-153.4 26.5-97.1-23.1-198-128.1-219.4zM255.3 
389.6c-39.4-3.1-77.2-20.3-105.6-48.8-27.5-27.5-44.7-65.3-47.8-104.7-4.4-58.1 
20.6-114.1 67.8-149.4 46.3-34.1 110.3-42.8 
165-22.5 50 18.7 87.5 61.3 
100.3 113.8 10.9 44.7 3.1 92.8-21.9 
131.6-27.2 42.8-70.3 70.9-120.3 
80-13.1 2.5-26.2 3.8-38.4 3.8zM323.4 
322.5c-6.3-3.1-36.6-18.4-42.2-20.6-5.6-1.9-9.4-3.1-13.4 
3.1s-15.6 20.6-19.1 24.7c-3.4 
3.8-7.2 4.4-13.4 1.3-36.3-18.1-60-32.2-83.8-73.1-6.3-10.9 
6.3-10.9 18.1-36.9 2.5-5 
1.3-9.4-.6-13.1-1.9-3.8-13.4-32.5-18.4-44.4-4.7-11.3-9.7-9.7-13.4-9.7-3.4 0-7.2-.6-11.3-.6s-10.3 
1.3-15.6 7.2c-5.3 6.3-20.6 20.3-20.6 
49.7s21.2 57.8 24.1 61.9c3.1 4.4 41.9 63.4 
101.6 89.1 14.2 6.3 25.3 10 33.8 
12.8 14.2 4.4 27.2 3.8 37.5 
2.5 11.6-1.9 36.6-15 41.9-29.4 
5-13.8 5-25.6 3.4-28.1-1.5-2.5-5.9-4-12.2-7.2z"
                  />
                </svg>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Volunteer;
