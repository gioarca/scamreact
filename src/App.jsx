import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Pages from "./pages/Pages";
import "./index.css";

function App() {
  return (
    <>
      <Router>
        <Header />
        <Pages />
        <Footer />
      </Router>
    </>
  );
}

export default App;
