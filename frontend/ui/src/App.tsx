import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import LandingPage from "./pages/LandingPage";
import GenerateReportPage from "./pages/GenerateReportPage";

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/generate" element={<GenerateReportPage />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
