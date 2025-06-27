// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (username.trim() === "" || password.trim() === "") {
      setError("Username e senha são obrigatórios.");
      return;
    }
    // Simula token apenas para demonstração
    const fakeToken = btoa(`${username}:${Date.now()}`);
    localStorage.setItem("token", fakeToken);
    navigate("/dashboard");
  }

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <div className="card shadow-sm p-4" style={{ maxWidth: "400px", width: "100%" }}>
        <div className="d-flex flex-column align-items-center mb-4">
          {/* Ícone de cadeado dentro de um círculo azul */}
          <div
            className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mb-3"
            style={{ width: "60px", height: "60px" }}
          >
            {/* Pode trocar por <i className="bi bi-lock-fill fs-2"></i> se usar Bootstrap Icons */}
            <span className="fs-2">🔒</span>
          </div>
          <h2 className="card-title text-center">Sign in</h2>
        </div>

        {error && (
          <div className="alert alert-danger small mb-3" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Floating input para Email/Username */}
          <div className="form-floating mb-3">
            <input
              id="username"
              type="text"
              className="form-control"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <label htmlFor="username">Email Address</label>
          </div>

          {/* Floating input para Password */}
          <div className="form-floating mb-3">
            <input
              id="password"
              type="password"
              className="form-control"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label htmlFor="password">Password</label>
          </div>

          {/* Remember me */}
          <div className="form-check mb-3">
            <input
              id="rememberMe"
              type="checkbox"
              className="form-check-input"
            />
            <label htmlFor="rememberMe" className="form-check-label">
              Remember me
            </label>
          </div>

          {/* Botão Sign In */}
          <button type="submit" className="btn btn-primary w-100 mb-3">
            SIGN IN
          </button>

          {/* Links “Forgot password?” e “Sign up” */}
          <div className="d-flex justify-content-between small">
            <a href="#" className="text-decoration-none">
              Forgot password?
            </a>
            <a href="#" className="text-decoration-none">
              Don't have an account? Sign Up
            </a>
          </div>
        </form>

        {/* Rodapé com copyright */}
        <div className="text-center text-muted small mt-4">
          © Your Website 2025.
        </div>
      </div>
    </div>
  );
}
