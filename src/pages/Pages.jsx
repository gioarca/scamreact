import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Truffe from "./Truffe.jsx";
import ArticlePage from "./ArticlePage.jsx";
import HomePage from "./HomePage.jsx";
import ScrollToTop from "../components/ScrollToTop.jsx";
import ScamsPage from "./ScamsPage.jsx";
import ScamreactVerificaWaitlist from "./ScamreactVerificaWaitlist.jsx";
import Header from "../components/Header.jsx";
import Verifica from "./Verifica.jsx";
import ThankYouPage from "./ThankYouPage.jsx";

function Pages() {
  const location = useLocation();

  return (
    <>
      {/*
        Header e ScrollToTop vivono FUORI da AnimatePresence.
        Non sono pagine, non devono mai essere smontati al cambio
        di route — metterli dentro AnimatePresence mode="wait"
        confondeva Framer Motion (più figli da animare insieme)
        e causava il bug del menu che restava aperto.
      */}
      <Header />
      <ScrollToTop />

      {/*
        AnimatePresence avvolge SOLO Routes: esattamente un figlio
        diretto. La key={location.pathname} su Routes è il segnale
        che dice a Framer Motion "questa pagina sta uscendo, quella
        nuova sta per entrare" — senza quella key non funziona.
        mode="wait" ora è corretto: aspetta che la pagina uscente
        finisca la sua animazione prima di mostrare la successiva.
      */}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<HomePage />} />
          <Route path="/truffe" element={<Truffe />} />
          <Route path="/articoli/:id" element={<ArticlePage />} />
          <Route path="/scams" element={<ScamsPage />} />
          <Route path="/verifica" element={<ScamreactVerificaWaitlist />} />
          <Route path="/grazie" element={<ThankYouPage />} />
        </Routes>
      </AnimatePresence>
    </>
  );
}

export default Pages;
