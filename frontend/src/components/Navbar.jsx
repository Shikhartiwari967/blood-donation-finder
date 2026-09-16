import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const goToDashboard = () => {
    if (user?.role === "admin") {
      navigate("/admin");
    } else if (user?.role === "recipient") {
      navigate("/recipient");
    } else {
      navigate("/donor");
    }

    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div
        className="navbar-logo"
        onClick={() => navigate("/")}
      >
        <span className="navbar-logo-icon">♥</span>
        <span className="navbar-logo-text">
          Blood Donation Finder
        </span>
      </div>

      <div className={`navbar-menu ${menuOpen ? "open" : ""}`}>
        <button
          className="navbar-link"
          onClick={() => {
            navigate("/");
            setMenuOpen(false);
          }}
        >
          Home
        </button>

        <button
          className="navbar-link"
          onClick={() => {
            navigate("/find-donor");
            setMenuOpen(false);
          }}
        >
          Find Donor
        </button>

        {isAuthenticated ? (
          <>
            <button
              className="navbar-dashboard"
              onClick={goToDashboard}
            >
              Dashboard
            </button>

            <div className="navbar-user">
              <div className="navbar-avatar">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>

              <span className="navbar-user-name">
                {user?.name}
              </span>
            </div>

            <button
              className="navbar-logout"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button
              className="navbar-login"
              onClick={() => {
                navigate("/login");
                setMenuOpen(false);
              }}
            >
              Login
            </button>

            <button
              className="navbar-register"
              onClick={() => {
                navigate("/register");
                setMenuOpen(false);
              }}
            >
              Register
            </button>
          </>
        )}
      </div>

      <button
        className="navbar-toggle"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle navigation"
      >
        ☰
      </button>
    </nav>
  );
}

export default Navbar;