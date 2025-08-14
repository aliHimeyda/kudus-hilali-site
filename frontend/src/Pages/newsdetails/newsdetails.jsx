import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './newsdetails.css';
import Customnewscard from '../../components/newscard/customnewscard';
import { useParams } from 'react-router-dom';
import Comments from '../../components/commentarea/commentarea';

const BASE_URL = "http://mediumslateblue-pony-639793.hostingersite.com/backend/news/news_CRUD.php";

const NewsDetails = () => {
  const { newsid } = useParams();
  const [newsDetail, setNewsDetail] = useState(null);
  const [moreNews, setMoreNews] = useState([]);
  const animatedRefs = useRef([]);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await axios.get(`${BASE_URL}?action=view&id=${newsid}`);
        setNewsDetail(res.data.data[0]);
      } catch (err) {
        console.error(err);
      }
    };
    const fetchMore = async () => {
      try {
        const res = await axios.get(`${BASE_URL}?action=view`);
        const others = res.data.data.filter(
          item => item.id !== parseInt(newsid, 10)
        );

        const shuffled = [...others].sort(() => Math.random() - 0.5);
        setMoreNews(shuffled.slice(0, 3));
      } catch (err) {
        console.error(err);
      }
    };
    fetchDetail();
    fetchMore();
  }, [newsid]);

  useEffect(() => {
    const observers = animatedRefs.current.map(ref => {
      if (!ref) return null;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) entry.target.classList.add('show');
        },
        { threshold: 0.3 }
      );
      obs.observe(ref);
      return obs;
    });
    return () => observers.forEach(obs => obs && obs.disconnect());
  }, [newsDetail, moreNews]);

  if (!newsDetail) return <div>Loading...</div>;

  return (
    <div className="newsdetailspage d-flex flex-column flex-md-row justify-content-center gap-4">
      <div className='news-wrapper d-flex flex-column align-items-center gap-4'>


        <div
          className="news-image fade-section"
          ref={el => (animatedRefs.current[0] = el)}
          style={{ overflow: 'hidden', position: 'relative' }}
        >
          <img decoding="async" loading="lazy"
            src={newsDetail.image}
            alt={newsDetail.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '20px' }}
          />
          <div
            className="news-d-meta d-flex gap-3 fade-section"
            ref={el => (animatedRefs.current[1] = el)}
          >
            <div className="lesson">
              <img decoding="async" loading="lazy" src="/assets/dateicon.svg" alt="" /> {newsDetail.publish_date}
            </div>
          </div>
        </div>


        <div className='d-flex flex-column'>
          <h2
            className="news-title fade-section"
            ref={el => (animatedRefs.current[2] = el)}
          >
            {newsDetail.title}
          </h2>
          <p
            className="news-text fade-section"
            ref={el => (animatedRefs.current[3] = el)}
          >
            {newsDetail.content}
          </p>
        </div>


        <div
          className="visit-experience fade-section d-flex flex-column p-5 gap-4"
          ref={el => (animatedRefs.current[4] = el)}
        >
          <h4>Global Visit Experience</h4>
          <p>{newsDetail.content.split('\n')[0]}</p>

          <div
            className="image-gallery fade-section d-flex flex-column flex-md-row justify-content-center align-items-center gap-4"
            ref={el => (animatedRefs.current[5] = el)}
          >
            {moreNews.map((item, i) => (
              <div className="image-box" key={i}>
                <img decoding="async" loading="lazy"
                  src={item.image}
                  alt={item.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            ))}
          </div>

          <p className="news-end">
            {newsDetail.content.split('\n').pop()}
          </p>
        </div>

        <Comments />
      </div>


      <div
        className="side-panel fade-section d-flex flex-column pt-5"
        ref={el => (animatedRefs.current[6] = el)}
      >
        <h4>More News</h4>
        <div className='morenews d-flex flex-column gap-2 mt-2 mb-4'>
          {moreNews.map(item => (
            <Customnewscard news={item} key={item.id} />
          ))}
        </div>
        <h5>Contact Info?</h5>
        <div className="contact-email">Email: <u>kudushilali@gmail.com</u></div>
        <div className="contact-phone">Phone: +90 505 878 50 40</div>
        <div className="map-box">
          <iframe
            title="Google Map"
            src="https://www.google.com/maps?q=Arabacıalanı,605%20nolu%20sokak%20No:%201/1,%2054100%20Serdivan/Sakarya&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0, borderRadius: '10px' }}
            allowFullScreen
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default NewsDetails;
