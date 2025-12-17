import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  const navStyle = {
    backgroundColor: "#333",
    color: "white",
    padding: "15px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  };

  const linkStyle = {
    color: "white",
    textDecoration: "none",
    marginLeft: "20px",
    fontSize: "18px"
  };

  return (
    <nav style={navStyle}>
      <h1 style={{ margin: 0 }}>⚡ EV Finder</h1>
      <div>
        {/* These Links allow us to switch pages without reloading */}
        <Link to="/" style={linkStyle}>Home</Link>
        <Link to="/add" style={linkStyle}>Add Station</Link>
      </div>
    </nav>
  );
}

export default Navbar;