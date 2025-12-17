import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

// Define the component, it takes the list of stations as a prop
function StationMap({ stations }) {
  // Use a sensible default center point (e.g., a major city or central area)
  // You can adjust this default based on your expected user base
  const defaultCenter = [12.9716, 77.5946]; // Example: Bengaluru, India

  return (
    // Set a fixed height for the map container
    <div style={{ height: '70vh', width: '100%', margin: '20px 0', borderRadius: '10px', overflow: 'hidden' }}>
        <MapContainer 
            center={defaultCenter} 
            zoom={13} 
            scrollWheelZoom={true} 
            style={{ height: '100%', width: '100%' }}
        >
            {/* The TileLayer provides the visual map background (like Google Maps) */}
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Loop through the stations and place a marker for each one */}
            {stations.map((station) => (
                // Use a key for React to track elements
                <Marker 
                    key={station._id} 
                    position={[station.latitude, station.longitude]}
                >
                    {/* The Popup shows details when the user clicks the marker */}
                    <Popup>
                        <h4 style={{ margin: '5px 0', color: '#007bff' }}>{station.name}</h4>
                        <p style={{ margin: '2px 0' }}>📍 {station.address}</p>
                        <p style={{ margin: '2px 0' }}>⚡ Type: {station.type}</p>
                        <p style={{ margin: '2px 0' }}>🔋 Power: {station.power} kW</p>
                        <p style={{ margin: '2px 0' }}>💰 Price: ₹{station.price}/kWh</p>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    </div>
  );
}

export default StationMap;