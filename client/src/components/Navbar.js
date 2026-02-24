import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const [isAdmin, setIsAdmin] = useState(localStorage.getItem('isAdmin') === 'true');
  const [showLogin, setShowLogin] = useState(false);
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleAdminToggle = () => {
    if (isAdmin) {
      localStorage.removeItem('isAdmin');
      setIsAdmin(false);
      navigate('/');
      window.location.reload();
    } else {
      setShowLogin(!showLogin);
    }
  };

  const submitLogin = (e) => {
    e.preventDefault();
    if (password === 'admin') {
      localStorage.setItem('isAdmin', 'true');
      setIsAdmin(true);
      setShowLogin(false);
      setPassword("");
      window.location.reload();
    } else {
      alert("Incorrect Password!");
    }
  }

  return (
    <nav>
      <h1>⚡ EV Finder</h1>

      <div className="nav-links">
        <Link to="/">Home</Link>
        {isAdmin && <Link to="/dashboard">Dashboard</Link>}
        {isAdmin && <Link to="/add">Add Station</Link>}

        {showLogin && !isAdmin && (
          <form className="login-form" onSubmit={submitLogin}>
            <input
              type="password"
              placeholder="Password (admin)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
            />
            <button type="submit">Login</button>
          </form>
        )}

        <button onClick={handleAdminToggle}>
          {isAdmin ? 'Logout Admin' : (showLogin ? 'Cancel' : 'Admin Login')}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;