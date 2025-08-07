import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./newspage.css";
import Newscard from "../../components/newscard/newscard";
import Bottomline from "../../components/bottomline/bottomline";
import Logo from "../../components/logo/logo";

const BASE_URL = "http://localhost:8888/kudus/backend/news/news_CRUD.php";
const categories = [
  "All",
  "Education",
  "Health",
  "Medical",
  "Homeless",
  "Relief Food",
  "Kids World",
];

const Newspage = () => {
  const sectionRef = useRef(null);
  const elementRef = useRef(null);
  const [isloading, setIsLoading] = useState(false);
  const [news, setNews] = useState([]);
  const [catActive, setActive] = useState("All");

  const fetchNews = async (category = "All") => {
    setIsLoading(true);
    try {
      const url =
        category === "All"
          ? `${BASE_URL}?action=view`
          : `${BASE_URL}?action=view&category=${encodeURIComponent(category)}`;
      const res = await axios.get(url);
      setNews(res.data.data);
    } catch (err) {
      console.error(err);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const GetNewsByCategory = (category) => {
    setActive(category);
    fetchNews(category);
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.innerHeight + window.scrollY;
      const bottomPosition = elementRef.current.offsetHeight;
      if (bottomPosition - scrollPosition < 100 && !isloading) {
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 500);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isloading]);

  return (
    <div
      className="newspage d-flex flex-column align-items-center justify-content-center"
      ref={elementRef}
    >
      <h4 className="h4">ARTICLES</h4>
      <h2 className="h2">Latest News & Articles</h2>
      <div className="categoriescontainer justify-content-md-center justify-content-start  d-flex mt-5">
        {categories.map((category, index) => (
          <div
            key={index}
            className={`category-box ${
              catActive === category ? "active" : ""
            }`}
            onClick={() => GetNewsByCategory(category)}
          >
            {category}
          </div>
        ))}
      </div>
      <Bottomline />
      <div
        className="d-flex flex-row align-items-center justify-content-center flex-wrap gap-5 pt-5"
        ref={sectionRef}
      >
        {news.map((newvalue) => (
          <Newscard newsvalue={newvalue} key={newvalue.id} />
        ))}
      </div>
      <div
        className={`loading ${
          isloading ? "visible" : ""
        } d-flex justify-content-center align-items-center mt-5`}
      ><Logo/></div>
    </div>
  );
};

export default Newspage;
