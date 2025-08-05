// src/App.js
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "../layout";
import Home from "../Pages/home/home";
import Projects from "../Pages/projects/projects";
import ScrollToTop from "../utils/scrolltotop";
import Teampage from "../Pages/team/teampage";
import Newspage from "../Pages/news/newspage";
import ProfilePage from "../Pages/personprofilepage/profile";
import NewsDetails from "../Pages/newsdetails/newsdetails";
import ProjectDetailsPage from "../Pages/projectdetails/projectdetailspage";
import Aboutus from "../Pages/Aboutus/aboutus";
import Contactuspage from "../Pages/contactus/contactuspage";
import Admin from './../Pages/admin/admin';
import Loginpage from './../Pages/login/loginpage';
import Signuppage from './../Pages/login/signuppage';
const MyRouter = () => {
  return (
    <BrowserRouter>
    <ScrollToTop/>
    
      <Routes>
        <Route path={"/"} element={<Layout />}>
          <Route index element={<Home />} />
          <Route path={"/Projects"} element={<Projects />} />
          <Route path={"/teampage"} element={<Teampage />} />
          <Route path={"/newspage"} element={<Newspage />} />
          <Route path={"/aboutuspage"} element={<Aboutus />} />
          <Route path={"/contactuspage"} element={<Contactuspage />} />
          <Route path="/profilepage/:personid" element={<ProfilePage />} />
          <Route path="/newsdetailspage/:newsid" element={<NewsDetails />} />
          <Route path="/projectdetailspage/:projectid" element={<ProjectDetailsPage />} />
          {/* diğer sayfalar */}
          <Route path="/login" element={<Loginpage />} />
        <Route path="/signup" element={<Signuppage />}/>
        </Route>
        <Route path="/admin" element={<Admin />} />
        
      </Routes>
    </BrowserRouter>
  );
};

export default MyRouter;
