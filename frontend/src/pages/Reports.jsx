// src/pages/Reports.jsx
import { useState } from "react";
import NavBar from "../components/NavBar";
import { request, gql } from "graphql-request";

export default function Reports() {
  const [form, setForm] = useState({ content: "" });
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  const API2_GQL = "http://localhost:4000/graphql";

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCreating(true);
    setError("");

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
      setForm({ content: "" });
    } catch (err) {
      console.error("Erro ao criar report:", err);
      setError("Erro ao criar report. Verifique os dados e tente novamente.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <>
      <NavBar />

      <div className="container mt-4" style={{ maxWidth: '600px' }}>
        <h1 className="mb-4">Novo Report</h1>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="content" className="form-label">Conteúdo</label>
            <textarea
              id="content"
              name="content"
              className="form-control"
              rows="4"
              value={form.content}
              onChange={handleChange}
              placeholder="Descreva o report aqui..."
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={creating}>
            {creating ? "Criando..." : "Criar Report"}
          </button>
        </form>
      </div>
    </>
  );
}
