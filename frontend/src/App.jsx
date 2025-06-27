// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Orchards from "./pages/Orchards";
import Harvests from "./pages/Harvests";
import Productivity from "./pages/Productivity";
import Reports from "./pages/Reports";
import HarvestForm from "./pages/HarvestForm";
function RequireAuth({ children }) {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota de login (sem NavBar) */}
        <Route path="/login" element={<Login />} />

        {/* Rotas protegidas */}
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          }
        />
        <Route
          path="/orchards"
          element={
            <RequireAuth>
              <Orchards />
            </RequireAuth>
          }
        />
        <Route
          path="/harvests"
          element={
            <RequireAuth>
              <Harvests />
            </RequireAuth>
          }
        />
        <Route
          path="/productivity"
          element={
            <RequireAuth>
              <Productivity />
            </RequireAuth>
          }
        />
        <Route
          path="/reports"
          element={
            <RequireAuth>
              <Reports />
            </RequireAuth>
          }
        />
        {/* Raiz redireciona */}
        <Route
          path="/"
          element={
            localStorage.getItem("token") ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
        <Route path="/harvests/new" element={<HarvestForm />} />
      </Routes>
    </BrowserRouter>
  );
}
