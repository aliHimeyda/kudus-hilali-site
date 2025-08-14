import React, { useEffect, useRef, useState } from "react";
import "./projects.css";
import CauseCard from "../../components/recentcause/cause";
import Bottomline from "../../components/bottomline/bottomline";
import axios from "axios";
import Logo from "../../components/logo/logo";

const categories = [
  "All",
  "Education",
  "Health",
  "Medical",
  "Homeless",
  "Relief Food",
  "Kids World",
];

const Projects = () => {
  const sectionRef = useRef(null);
  const elementRef = useRef(null);
  const [isloading, setIsLoading] = useState(false);
  const [causes, setCauses] = useState([]);
  const [catActive, setActive] = useState("All");
  const fetchProjects = async (category = "All") => {
    setIsLoading(true);
    try {
      const url =
        category === "All"
          ? "https://kudushilali.org/backend/projects/projects_CRUD.php"
          : `https://kudushilali.org/backend/projects/projects_CRUD.php?category=${category}`;
      const res = await axios.get(url);
      if (res.data.status === "success") {
        setCauses(res.data.data);
      }
    } catch (error) {
      console.error("Projeler alınırken hata oluştu:", error);
    }
    setIsLoading(false);
  };
  useEffect(() => {
    fetchProjects();
  }, []);
  const GetProjectsByCategory = (category) => {
    setActive(category);
    fetchProjects(category);
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
      className="projectspage d-flex flex-column align-items-center justify-content-center"
      ref={elementRef}
    >
      <h4 className="h4">OUR WORKS</h4>
      <h2 className="h2">What We Do ?</h2>
      <div className="categoriescontainer justify-content-md-center justify-content-start d-flex mt-5">
        {categories.map((category, index) => (
          <div
            key={index}
            className={`category-box ${catActive === category ? "active" : ""}`}
            onClick={() => GetProjectsByCategory(category)}
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
        {causes.length > 0 ? (
          causes.map((cause) => <CauseCard key={cause.id} value={cause} />)
        ) : (
          <p>No projects found.</p>
        )}
      </div>
      <div
        className={`loading ${
          isloading ? "visible" : ""
        } d-flex justify-content-center align-items-center mt-5`}
      >
        <Logo />
      </div>
    </div>
  );
};

export default Projects;
