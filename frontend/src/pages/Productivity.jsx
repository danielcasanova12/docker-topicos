// src/pages/Productivity.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import { request, gql, ClientError } from "graphql-request";

export default function Productivity() {
  const navigate = useNavigate();
  const [productivities, setProductivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(""); // Para exibir mensagem de erro na tela

  const API2_GQL = "http://localhost:4000/graphql";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      // Se não há token, força o redirect
      // navigate("/login");
      return;
    }

    async function fetchProductivities() {
      const query = gql`
        {
          productivities {
            id
            date
            KgPerTree
            totalTrees
            orchardId
          }
        }
      `;
      try {
        setLoading(true);
        setFetchError(""); // limpa erro anterior

        const data = await request(
          API2_GQL,
          query,
          undefined,
          {
            Authorization: `Bearer ${token}`,
          }
        );
        setProductivities(data.productivities);
      } catch (err) {
        console.error(">>> Erro ao buscar productivities:", err);

        // Se o GraphQL devolveu um 4xx (ClientError), provavelmente token inválido
        if (err instanceof ClientError && err.response.status >= 400 && err.response.status < 500) {
          localStorage.removeItem("token");
          // navigate("/login");
        } else {
          // Erro de rede, 500, CORS, GraphQL off-line, etc
          setFetchError("Não conseguimos carregar os dados agora. Tente novamente em alguns instantes.");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchProductivities();
  }, [navigate]);

  return (
    <>
      <NavBar />
      <div className="container mt-4">
        <h1 className="mb-4">Productivity</h1>

        {loading && (
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Carregando...</span>
            </div>
          </div>
        )}

        {!loading && fetchError && (
          <div className="alert alert-warning text-center" role="alert">
            {fetchError}
          </div>
        )}

        {!loading && !fetchError && (
          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>Data</th>
                  <th>Kg/Árvore</th>
                  <th>Total Árvores</th>
                  <th>Orchard ID</th>
                </tr>
              </thead>
              <tbody>
                {productivities.map((p) => (
                  <tr key={p.id}>
                    <td>{new Date(p.date).toLocaleDateString()}</td>
                    <td>{p.KgPerTree}</td>
                    <td>{p.totalTrees}</td>
                    <td>
                      <code className="text-monospace">{p.orchardId}</code>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
