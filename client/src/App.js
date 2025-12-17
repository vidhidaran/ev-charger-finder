import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import AddStation from "./pages/AddStation";
import EditStation from "./pages/EditStation"; // <-- 1. Import the new page
import "./App.css";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add" element={<AddStation />} />
        {/* 2. Add the Edit Route with a dynamic ID parameter */}
        <Route path="/edit/:id" element={<EditStation />} />
      </Routes>
    </Router>
  );
}

export default App;