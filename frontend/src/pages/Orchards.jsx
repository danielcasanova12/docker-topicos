// src/pages/Orchards.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";

export default function Orchards() {
  const navigate = useNavigate();
  const [orchards, setOrchards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(""); // Estado para mensagens de erro

  // URL base da sua API REST (ajuste se estiver diferente)
  const API1_BASE = "http://localhost:8080/api";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      // Se não existe token, redireciona para o login imediatamente
      // navigate("/login");
      return;
    }

    async function fetchOrchards() {
      setLoading(true);
      setFetchError("");

      try {
        const res = await fetch(`${API1_BASE}/orchards`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        // Se status 401 ou 403, token inválido → logout
        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem("token");
          // navigate("/login");
          return;
        }

        // Se outro status não for 200, exiba mensagem de erro (sem logout)
        if (!res.ok) {
          throw new Error(`Erro ${res.status}: não foi possível buscar orchards.`);
        }

        const data = await res.json();
        setOrchards(data);
      } catch (err) {
        console.error(">>> Erro ao buscar orchards:", err);
        // Se chegar aqui, foi erro de rede ou 5xx ou erro customizado
        setFetchError("Não foi possível carregar os Orchards. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    }

    fetchOrchards();
  }, [navigate]);

  return (
    <>
      <NavBar />

      <div className="container mt-4">
        <h1 className="mb-4">Orchards</h1>

        {loading && (
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Carregando...</span>
            </div>
          </div>
        )}

        {/* Se não está carregando e existe um erro, mostra um alert-warning */}
        {!loading && fetchError && (
          <div className="alert alert-warning text-center" role="alert">
            {fetchError}
          </div>
        )}

        {/* Se não está carregando e não há erro, exibe a lista de orchards */}
        {!loading && !fetchError && (
          <div className="row">
            {orchards.map((o) => (
              <div key={o.id} className="col-md-4 mb-4">
                <div className="card h-100 shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title">{o.name}</h5>
                    <p className="card-text mb-1">
                      <strong>Location:</strong> {o.location || "—"}
                    </p>
                    <p className="card-text mb-3">
                      <strong>Área (ha):</strong> {o.totalAreaHa}
                    </p>
                    <p className="text-muted text-truncate mb-0">
                      <small>ID: {o.id}</small>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
