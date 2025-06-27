// src/components/NavBar.jsx
import { Link, useNavigate } from "react-router-dom";

export default function NavBar() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("token");
    // navigate("/login");
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm mb-4">
      <div className="container">
        <Link className="navbar-brand" to="/dashboard">
          🍏 Produtividade de Pomares
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#main-navbar"
          aria-controls="main-navbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="main-navbar">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/dashboard">
                Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/orchards">
                Orchards
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/harvests">
                Harvests
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/productivity">
                Productivity
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/reports">
                Reports
              </Link>
            </li>
          </ul>
          <button
            onClick={handleLogout}
            className="btn btn-outline-danger"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
