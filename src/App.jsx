import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Head from "./components/Header";
import Footer from "./components/Footer";
import Pages from "./pages/Pages";
import "./index.css";

function App() {
  return (
    <>
      <Head />
      <Router>
        <Pages />
      </Router>
      <Footer />
    </>
  );
}

export default App;
