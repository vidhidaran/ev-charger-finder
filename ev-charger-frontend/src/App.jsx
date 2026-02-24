import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [chargers, setChargers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [particles, setParticles] = useState([])

  // Generate floating particles
  useEffect(() => {
    const particleArray = []
    for (let i = 0; i < 30; i++) {
      particleArray.push({
        id: i,
        left: Math.random() * 100,
        animationDelay: Math.random() * 15,
        animationDuration: 10 + Math.random() * 10
      })
    }
    setParticles(particleArray)
  }, [])

  // Simulate loading chargers data
  useEffect(() => {
    setTimeout(() => {
      setChargers([
        {
          id: 1,
          name: 'Tesla Supercharger',
          location: 'Downtown Plaza',
          distance: '0.5 km',
          power: '250 kW',
          available: 8,
          total: 12,
          status: 'available',
          price: '₹15/kWh',
          lat: 13.0827,
          lng: 80.2707
        },
        {
          id: 2,
          name: 'ChargePoint Station',
          location: 'Tech Park Avenue',
          distance: '1.2 km',
          power: '150 kW',
          available: 3,
          total: 6,
          status: 'available',
          price: '₹12/kWh',
          lat: 13.0878,
          lng: 80.2785
        },
        {
          id: 3,
          name: 'Ather Grid',
          location: 'Green Valley Mall',
          distance: '2.1 km',
          power: '50 kW',
          available: 0,
          total: 4,
          status: 'busy',
          price: '₹10/kWh',
          lat: 13.0732,
          lng: 80.2612
        },
        {
          id: 4,
          name: 'Tata Power EZ Charge',
          location: 'City Center',
          distance: '3.5 km',
          power: '120 kW',
          available: 5,
          total: 8,
          status: 'available',
          price: '₹13/kWh',
          lat: 13.0915,
          lng: 80.2823
        },
        {
          id: 5,
          name: 'Fortum Charge & Drive',
          location: 'Airport Road',
          distance: '5.0 km',
          power: '180 kW',
          available: 2,
          total: 10,
          status: 'available',
          price: '₹14/kWh',
          lat: 13.0995,
          lng: 80.2901
        },
        {
          id: 6,
          name: 'Statiq EV Charging',
          location: 'Business District',
          distance: '1.8 km',
          power: '100 kW',
          available: 0,
          total: 5,
          status: 'busy',
          price: '₹11/kWh',
          lat: 13.0765,
          lng: 80.2689
        }
      ])
      setLoading(false)
    }, 2000)
  }, [])

  const filteredChargers = chargers.filter(charger =>
    charger.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    charger.location.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const openInMaps = (lat, lng, name) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
    const newWindow = window.open(url, '_blank')

    // Check if popup was blocked
    if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
      // Popup was blocked, show alert with link
      alert(`Please allow popups to open maps.\n\nOr copy this link:\n${url}`)
      // Try to copy to clipboard as fallback
      navigator.clipboard.writeText(url).catch(() => { })
    }
  }

  return (
    <div className="app-container">
      {/* Floating Particles */}
      {particles.map(particle => (
        <div
          key={particle.id}
          className="particle"
          style={{
            left: `${particle.left}%`,
            animationDelay: `${particle.animationDelay}s`,
            animationDuration: `${particle.animationDuration}s`
          }}
        />
      ))}

      {/* Hero Section */}
      <section className="hero-section">
        <div className="charging-icon-3d">
          <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="iconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00d4ff" />
                <stop offset="50%" stopColor="#6b0fff" />
                <stop offset="100%" stopColor="#00fff5" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            {/* Charging Station Icon */}
            <rect x="60" y="40" width="80" height="120" rx="10" fill="url(#iconGradient)" filter="url(#glow)" opacity="0.9" />
            <rect x="70" y="50" width="60" height="40" rx="5" fill="#0a0e27" />
            <circle cx="100" cy="70" r="8" fill="#00ff88" />
            <path d="M85 110 L100 90 L95 100 L110 80 L100 95 L115 75" stroke="#00d4ff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <rect x="75" y="130" width="50" height="8" rx="4" fill="#00fff5" />
            <rect x="75" y="145" width="50" height="8" rx="4" fill="#00fff5" />
          </svg>
        </div>

        <h1 className="hero-title text-3d">
          ⚡ EV CHARGER FINDER
        </h1>
        <p className="hero-subtitle">
          Find Your Nearest Electric Vehicle Charging Station
        </p>

        {/* Search Section */}
        <div className="search-section">
          <div className="search-container">
            <input
              type="text"
              className="search-input"
              placeholder="🔍 Search by location or station name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="neon-button">
              🗺️ Find Chargers
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <div className="stats-container">
        <div className="stat-card glass-card">
          <span className="stat-number">{chargers.length}</span>
          <span className="stat-label">Stations Nearby</span>
        </div>
        <div className="stat-card glass-card">
          <span className="stat-number">
            {chargers.reduce((acc, c) => acc + c.available, 0)}
          </span>
          <span className="stat-label">Available Ports</span>
        </div>
        <div className="stat-card glass-card">
          <span className="stat-number">24/7</span>
          <span className="stat-label">Support</span>
        </div>
      </div>

      {/* Chargers Grid */}
      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p className="loading-text">Locating Charging Stations...</p>
        </div>
      ) : filteredChargers.length > 0 ? (
        <div className="chargers-grid">
          {filteredChargers.map((charger) => (
            <div key={charger.id} className="charger-card glass-card">
              <div className="energy-wave"></div>

              <div className="charger-header">
                <div className="charger-icon">⚡</div>
                <h3 className="charger-title">{charger.name}</h3>
              </div>

              <div className="charger-details">
                <div className="detail-row">
                  <span className="detail-icon">📍</span>
                  <span>{charger.location}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-icon">🛣️</span>
                  <span>{charger.distance} away</span>
                </div>
                <div className="detail-row">
                  <span className="detail-icon">⚡</span>
                  <span>{charger.power} Fast Charging</span>
                </div>
                <div className="detail-row">
                  <span className="detail-icon">💰</span>
                  <span>{charger.price}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-icon">🔌</span>
                  <span>{charger.available}/{charger.total} Ports Available</span>
                </div>
              </div>

              <span className={`status-badge ${charger.status === 'available' ? 'status-available' : 'status-busy'}`}>
                {charger.status === 'available' ? '✓ Available' : '⏳ Busy'}
              </span>

              <div className="card-actions">
                <button
                  className="map-button"
                  onClick={() => openInMaps(charger.lat, charger.lng, charger.name)}
                >
                  🗺️ Open Map
                </button>
                <button className="details-button">
                  📋 Details
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <p className="empty-text">No charging stations found</p>
        </div>
      )}

      {/* Features Section */}
      <section className="features-section">
        <h2 className="hero-title text-3d" style={{ fontSize: '3rem', marginBottom: '1rem' }}>
          Why Choose Us?
        </h2>
        <div className="features-grid">
          <div className="feature-card glass-card">
            <div className="feature-icon">🚀</div>
            <h3 className="feature-title">Ultra Fast Charging</h3>
            <p className="feature-description">
              Experience lightning-fast charging speeds up to 250kW for your electric vehicle
            </p>
          </div>
          <div className="feature-card glass-card">
            <div className="feature-icon">🌍</div>
            <h3 className="feature-title">Wide Network</h3>
            <p className="feature-description">
              Access thousands of charging stations across the country with real-time availability
            </p>
          </div>
          <div className="feature-card glass-card">
            <div className="feature-icon">💳</div>
            <h3 className="feature-title">Easy Payment</h3>
            <p className="feature-description">
              Seamless payment integration with multiple options for your convenience
            </p>
          </div>
          <div className="feature-card glass-card">
            <div className="feature-icon">📱</div>
            <h3 className="feature-title">Smart App</h3>
            <p className="feature-description">
              Monitor charging status, reserve slots, and navigate with our intelligent app
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default App
