import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import { gql, ClientError } from "graphql-request";
import { graphqlRequest } from "../api/graphqlClient";

export default function Harvests() {
  const navigate = useNavigate();
  const [harvests, setHarvests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  useEffect(() => {
    async function fetchHarvests() {
      setLoading(true);
      setFetchError("");

      const query = gql`
        {
          harvests {
            id
            date
            quantityKg
            notes
            orchardId
          }
        }
      `;

      try {
        const data = await graphqlRequest(query);
        setHarvests(data.harvests);
      } catch (err) {
        console.error(">>> Erro ao buscar harvests:", err);

        if (err instanceof ClientError && err.response.status >= 400 && err.response.status < 500) {
          localStorage.removeItem("token");
          // navigate("/login");
          return;
        }

        setFetchError("Não foi possível carregar os Harvests. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    }

    fetchHarvests();
  }, [navigate]);

  // Handlers de clique
  const handleCreate = () => {
    navigate("/harvests/new"); // deve apontar para a rota da criação
  };

  const handleEdit = (id) => {
    navigate(`/harvests/edit/${id}`); // rota da edição
  };

  return (
    <>
      <NavBar />

      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>Harvests</h1>
          <button className="btn btn-success" onClick={handleCreate}>
            + Nova Colheita
          </button>
        </div>

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
                  <th>Quantidade (Kg)</th>
                  <th>Notas</th>
                  <th>Orchard ID</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {harvests.map((h) => (
                  <tr key={h.id}>
                    <td>{new Date(h.date).toLocaleDateString()}</td>
                    <td>{h.quantityKg}</td>
                    <td>{h.notes || "—"}</td>
                    <td>
                      <code className="text-monospace">{h.orchardId}</code>
                    </td>
                    <td>
                      <button className="btn btn-outline-primary btn-sm" onClick={() => handleEdit(h.id)}>
                        Editar
                      </button>
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
