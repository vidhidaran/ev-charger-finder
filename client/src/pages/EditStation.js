import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

// ✅ FIX: Hardcode the Backend URL directly
const API_URL = "https://ev-charger-finder.onrender.com";

function EditStation() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    latitude: "",
    longitude: "",
    type: "CCS2",
    power: "",
    price: "",
  });

  useEffect(() => {
    const fetchStationData = async () => {
      try {
        // ✅ FIX: Use API_URL here
        const response = await axios.get(`${API_URL}/api/stations`);
        const station = response.data.find((s) => s._id === id);
        
        if (station) {
          // Map backend data to form state (handling name mismatch if any)
          setFormData({
            name: station.name,
            address: station.address,
            latitude: station.latitude,
            longitude: station.longitude,
            type: station.connectorTypes ? station.connectorTypes[0] : "CCS2",
            power: station.powerKW,      // Backend uses powerKW
            price: station.pricePerKWh   // Backend uses pricePerKWh
          });
        }
      } catch (error) {
        console.error("Error fetching station data:", error);
      }
    };
    fetchStationData();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      // Convert form state back to backend format
      const updateData = {
          name: formData.name,
          address: formData.address,
          latitude: formData.latitude,
          longitude: formData.longitude,
          connectorTypes: [formData.type],
          powerKW: formData.power,
          pricePerKWh: formData.price
      };

      // ✅ FIX: Use API_URL here
      await axios.put(`${API_URL}/api/stations/${id}`, updateData);
      alert("Station Updated Successfully! ✅");
      navigate("/");
    } catch (error) {
      console.error("Error updating station:", error);
      alert("Failed to update station ❌");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "30px" }}>
      <h2>✏️ Edit Station</h2>
      <form className="form-container" onSubmit={handleUpdate}>
        <input type="text" name="name" placeholder="Station Name" value={formData.name} onChange={handleChange} required className="form-input"/>
        <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} required className="form-input"/>
        <div className="form-input-group">
          <input type="number" name="latitude" placeholder="Latitude" value={formData.latitude} onChange={handleChange} required className="form-input"/>
          <input type="number" name="longitude" placeholder="Longitude" value={formData.longitude} onChange={handleChange} required className="form-input"/>
        </div>
        <select name="type" value={formData.type} onChange={handleChange} className="form-select">
          <option value="CCS2">CCS2</option>
          <option value="CHAdeMO">CHAdeMO</option>
          <option value="Type 2">Type 2</option>
          <option value="DC Fast">DC Fast</option>
        </select>
        <input type="number" name="power" placeholder="Power (kW)" value={formData.power} onChange={handleChange} required className="form-input"/>
        <input type="number" name="price" placeholder="Price per kWh (₹)" value={formData.price} onChange={handleChange} required className="form-input"/>
        <button type="submit" className="form-button" style={{ backgroundColor: "#ffc107", color: "black" }}>
          Save Changes
        </button>
      </form>
    </div>
  );
}

export default EditStation;