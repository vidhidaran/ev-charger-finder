import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// ✅ FIX: Hardcode the Backend URL directly
const API_URL = "https://ev-charger-finder.onrender.com";

function AddStation() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    latitude: "",
    longitude: "",
    connectorTypeInput: "CCS2",
    powerKW: "",
    pricePerKWh: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const dataToSend = {
        name: formData.name,
        address: formData.address,
        latitude: formData.latitude,
        longitude: formData.longitude,
        connectorTypes: [formData.connectorTypeInput],
        powerKW: formData.powerKW,
        pricePerKWh: formData.pricePerKWh
    };

    try {
      // ✅ FIX: Use API_URL here
      await axios.post(`${API_URL}/api/stations/add`, dataToSend);
      alert("Station Added Successfully! ✅");
      navigate("/"); 
    } catch (error) {
      console.error("Error adding station:", error);
      alert("Failed to add station ❌");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "30px" }}>
      <h2>➕ Add New EV Station</h2>
      <form className="form-container" onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Station Name" value={formData.name} onChange={handleChange} required className="form-input" />
        <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} required className="form-input" />
        
        <div className="form-input-group">
          <input type="number" name="latitude" placeholder="Latitude" value={formData.latitude} onChange={handleChange} required className="form-input" />
          <input type="number" name="longitude" placeholder="Longitude" value={formData.longitude} onChange={handleChange} required className="form-input" />
        </div>

        <select name="connectorTypeInput" value={formData.connectorTypeInput} onChange={handleChange} className="form-select">
          <option value="CCS2">CCS2</option>
          <option value="CHAdeMO">CHAdeMO</option>
          <option value="Type 2">Type 2</option>
          <option value="DC Fast">DC Fast</option>
        </select>

        <input type="number" name="powerKW" placeholder="Power (kW)" value={formData.powerKW} onChange={handleChange} required className="form-input" />
        <input type="number" name="pricePerKWh" placeholder="Price per kWh (₹)" value={formData.pricePerKWh} onChange={handleChange} required className="form-input" />
        
        <button type="submit" className="form-button">Submit Station</button>
      </form>
    </div>
  );
}

export default AddStation;