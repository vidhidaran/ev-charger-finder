import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function EditStation() {
  const navigate = useNavigate();
  const { id } = useParams(); // Get the ID from the URL (e.g., /edit/12345)

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    latitude: "",
    longitude: "",
    type: "CCS2",
    power: "",
    price: "",
  });

  // 1. Fetch the existing station data when the page loads
  useEffect(() => {
    const fetchStationData = async () => {
      try {
        // We reuse the "Get All" logic but filter for the specific ID
        // (Optimally, we'd have a specific "Get One" endpoint, but this works for now)
        const response = await axios.get("/api/stations");
        const station = response.data.find((s) => s._id === id);
        
        if (station) {
          setFormData(station);
        }
      } catch (error) {
        console.error("Error fetching station data:", error);
      }
    };
    fetchStationData();
  }, [id]);

  // 2. Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 3. Handle Update (PUT Request)
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/stations/${id}`, formData);
      alert("Station Updated Successfully! ✅");
      navigate("/"); // Go back to Home
    } catch (error) {
      console.error("Error updating station:", error);
      alert("Failed to update station ❌");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "30px" }}>
      <h2>✏️ Edit Station</h2>
      <form className="form-container" onSubmit={handleUpdate}>
        <input
          type="text"
          name="name"
          placeholder="Station Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="form-input"
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          required
          className="form-input"
        />
        <div className="form-input-group">
          <input
            type="number"
            name="latitude"
            placeholder="Latitude"
            value={formData.latitude}
            onChange={handleChange}
            required
            className="form-input"
          />
          <input
            type="number"
            name="longitude"
            placeholder="Longitude"
            value={formData.longitude}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="form-select"
        >
          <option value="CCS2">CCS2</option>
          <option value="CHAdeMO">CHAdeMO</option>
          <option value="Type 2">Type 2</option>
          <option value="DC Fast">DC Fast</option>
        </select>
        <input
          type="number"
          name="power"
          placeholder="Power (kW)"
          value={formData.power}
          onChange={handleChange}
          required
          className="form-input"
        />
        <input
          type="number"
          name="price"
          placeholder="Price per kWh (₹)"
          value={formData.price}
          onChange={handleChange}
          required
          className="form-input"
        />
        <button
          type="submit"
          className="form-button"
          style={{ backgroundColor: "#ffc107", color: "black" }} // Yellow button for Edit
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}

export default EditStation;