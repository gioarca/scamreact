import React from "react";
import { Route, Router, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
// import Home from "./Home.jsx";
import Truffe from "./Truffe.jsx";
import ArticlePage from "./ArticlePage.jsx";
import HomePage from "./HomePage.jsx";
import ScrollToTop from "../components/ScrollToTop.jsx";
import ScamsPage from "./ScamsPage.jsx";
import Header from "../components/Header.jsx";

function Pages() {
  const location = useLocation();

  return (
    <>
      <AnimatePresence mode="wait">
        <Header />
        <ScrollToTop />
        <Routes location={location} key={location.pathname}>
          {/* <Route path="/" element={<Home />} /> */}
          <Route path="/" element={<HomePage />} />
          <Route path="/truffe" element={<Truffe />} />
          <Route path="/articoli/:id" element={<ArticlePage />} />
          <Route path="/scams" element={<ScamsPage />} />
        </Routes>
      </AnimatePresence>
    </>
  );
}

export default Pages;
