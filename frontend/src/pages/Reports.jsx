// src/pages/Reports.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import { request, gql, ClientError } from "graphql-request";

export default function Reports() {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loadingReports, setLoadingReports] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [creating, setCreating] = useState(false);

  // estado novo: orchards
  const [form, setForm] = useState({
    content: "",
  });

  const API2_GQL = "http://localhost:4000/graphql";

  // traz os reports GraphQL
  const fetchReports = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setLoadingReports(true);
    setFetchError("");

    const query = gql`
      {
        reports {
          id
          generatedAt
          content
        }
      }
    `;

    try {
      const data = await request(
        API2_GQL,
        query,
        undefined,
        { Authorization: `Bearer ${token}` }
      );
      setReports(data.reports);
    } catch (err) {
      console.error("Erro ao buscar reports:", err);
      if (err instanceof ClientError && err.response.status >= 400 && err.response.status < 500) {
        localStorage.removeItem("token");
        return;
      }
      setFetchError("Não foi possível carregar os Reports. Tente novamente mais tarde.");
    } finally {
      setLoadingReports(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCreating(true);
    setFetchError("");

    const mutation = gql`
      mutation CreateReport($input: ReportInput!) {
        createReport(input: $input) {
          id
        }
      }
    `;

    try {
      const token = localStorage.getItem("token");
      await request(
        API2_GQL,
        mutation,
        { input: { ...form, generatedAt: new Date().toISOString() } },
        { Authorization: `Bearer ${token}` }
      );

      await fetchReports();
      setForm({ content: "" });
    } catch (err) {
      console.error("Erro ao criar report:", err);
      setFetchError("Erro ao criar report. Verifique os dados e tente novamente.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <>
      <NavBar />

      <div className="container mt-4">
        <h1 className="mb-4">Reports</h1>

        <div className="card mb-5">
          <div className="card-header">Novo Report</div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Conteúdo</label>
                <textarea
                  name="content"
                  className="form-control"
                  rows="3"
                  value={form.content}
                  onChange={handleChange}
                  required
                />
              </div>

              <button className="btn btn-primary" type="submit" disabled={creating}>
                {creating ? "Criando..." : "Criar Report"}
              </button>
            </form>
          </div>
        </div>

        {loadingReports && (
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Carregando...</span>
            </div>
          </div>
        )}

        {!loadingReports && fetchError && (
          <div className="alert alert-warning text-center" role="alert">
            {fetchError}
          </div>
        )}

        {!loadingReports && !fetchError && (
          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>Data</th>
                  <th>Conteúdo</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((r) => (
                  <tr key={r.id}>
                    <td>{new Date(r.generatedAt).toLocaleDateString()}</td>
                    <td>{r.content}</td>
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
