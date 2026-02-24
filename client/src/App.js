import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import AddStation from "./pages/AddStation";
import EditStation from "./pages/EditStation";
import StationDetails from "./pages/StationDetails";
import AdminDashboard from "./pages/AdminDashboard";
import 'leaflet/dist/leaflet.css';
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
        <Route path="/station/:id" element={<StationDetails />} />
        <Route path="/dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;