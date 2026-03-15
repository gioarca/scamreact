import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Home from "./Home.jsx";
import Truffe from "./Truffe.jsx";
import Manifesto from "./Manifesto.jsx";
import ArticlePage from "./ArticlePage.jsx";

// dentro il tuo <Routes>

function Pages() {
  const location = useLocation();

  return (
    <>
      <AnimatePresence>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/truffe" element={<Truffe />} />
          <Route path="/manifesto" element={<Manifesto />} />
          <Route path="/articoli/:id" element={<ArticlePage />} />
        </Routes>
      </AnimatePresence>
    </>
  );
}

export default Pages;
