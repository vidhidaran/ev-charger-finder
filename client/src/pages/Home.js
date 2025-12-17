import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 
import StationMap from "../components/StationMap";

function Home() {
  const [stations, setStations] = useState([]);
  const [view, setView] = useState('list'); 
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");

  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchStations = async () => {
        try {
          // FIX 1: Use the full VITE_API_URL from your .env file
          const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/stations`);
          setStations(response.data);
        } catch (error) {
          console.error("Error fetching stations:", error);
        }
      };
      fetchStations();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this station?")) {
      try {
        // FIX 2: Use the full URL here too
        await axios.delete(`${import.meta.env.VITE_API_URL}/api/stations/${id}`);
        setStations(stations.filter((station) => station._id !== id));
      } catch (error) {
        console.error("Error deleting station:", error);
      }
    }
  };

  const filteredStations = stations.filter((station) => {
    const matchesSearch = station.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          station.address.toLowerCase().includes(searchTerm.toLowerCase());
    const typeToCheck = station.connectorTypes ? station.connectorTypes[0] : "";
    const matchesType = filterType === "All" || typeToCheck === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div>
      <div className="hero-banner">
        <h1 className="hero-title">⚡ Find Your Charge</h1>
        <p className="hero-subtitle">Locate the best EV charging stations instantly.</p>
      </div>
      
      <div className="search-bar-container">
          <input 
            className="search-input"
            type="text" 
            placeholder="🔍 Search by name or address..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <select 
            className="filter-select"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="All">All Types</option>
            <option value="CCS2">CCS2</option>
            <option value="CHAdeMO">CHAdeMO</option>
            <option value="Type 2">Type 2</option>
            <option value="DC Fast">DC Fast</option>
          </select>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button className={`btn btn-toggle ${view === 'list' ? 'active' : ''}`} onClick={() => setView('list')}>List</button>
            <button className={`btn btn-toggle ${view === 'map' ? 'active' : ''}`} onClick={() => setView('map')}>Map</button>
          </div>
      </div>

      {filteredStations.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#666', marginTop: '50px' }}>No stations found matching your search.</p>
      ) : (
        <>
            {view === 'map' && <StationMap stations={filteredStations} />}

            {view === 'list' && (
                <div className="stations-container">
                    {filteredStations.map((station) => (
                        <div key={station._id} className="station-card">
                            <div className="card-header-bg">
                                <h3>{station.name}</h3>
                            </div>
                            
                            <div className="card-body">
                                <div className="info-row">
                                    <span className="icon">📍</span> 
                                    {station.address}
                                </div>
                                <div className="info-row">
                                    <span className="icon">⚡</span> 
                                    Type: <span className="badge badge-type">{station.connectorTypes ? station.connectorTypes.join(', ') : 'N/A'}</span>
                                </div>
                                <div className="info-row">
                                    <span className="icon">🔋</span> 
                                    Power: <span className="badge badge-power">{station.powerKW} kW</span>
                                </div>
                                <div className="info-row">
                                    <span className="icon">💰</span> 
                                    Price: <span className="badge badge-price">₹{station.pricePerKWh}/kWh</span>
                                </div>

                                <div className="btn-group">
                                    <button className="btn btn-delete" onClick={() => handleDelete(station._id)}>Delete</button>
                                    <button className="btn btn-edit" onClick={() => navigate(`/edit/${station._id}`)}>Edit</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>
      )}
    </div>
  );
}

export default Home;