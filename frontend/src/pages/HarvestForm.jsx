import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import { gql } from "graphql-request";
import { graphqlRequest } from "../api/graphqlClient";

const CREATE_HARVEST = gql`
  mutation CreateHarvest($input: HarvestInput!) {
    createHarvest(input: $input) {
      id
    }
  }
`;

const UPDATE_HARVEST = gql`
  mutation UpdateHarvest($id: ID!, $input: HarvestInput!) {
    updateHarvest(id: $id, input: $input) {
      id
    }
  }
`;

const GET_HARVEST = gql`
  query GetHarvest($id: ID!) {
    harvest(id: $id) {
      id
      orchardId
      date
      quantityKg
      notes
    }
  }
`;

export default function HarvestForm() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    orchardId: "",
    date: "",
    quantityKg: "",
    notes: "",
  });
  const [orchards, setOrchards] = useState([]);
  const [fetchError, setFetchError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(!!id);

  const API1_BASE = "http://localhost:8080/api";

  // Fetch orchards for the select dropdown
  useEffect(() => {
    async function fetchOrchards() {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API1_BASE}/orchards`, {
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const data = await res.json();
        setOrchards(data);
      } catch (err) {
        console.error("Erro ao buscar pomares:", err);
        setFetchError("Não foi possível carregar os pomares.");
      }
    }
    fetchOrchards();
  }, []);

  // Fetch harvest when editing
  useEffect(() => {
    if (!id) return;
    async function loadHarvest() {
      try {
        const data = await graphqlRequest(GET_HARVEST, { id });
        setForm({
          orchardId: data.harvest.orchardId,
          date: data.harvest.date.split("T")[0],
          quantityKg: data.harvest.quantityKg,
          notes: data.harvest.notes || "",
        });
      } catch (err) {
        console.error("Erro ao carregar colheita:", err);
      } finally {
        setLoading(false);
      }
    }
    loadHarvest();
  }, [id]);

  const handleChange = (e) => {
    let value = e.target.value;
    if (e.target.name === "orchardId") {
      const parsed = parseInt(value, 10);
      value = Number.isNaN(parsed) ? value : parsed;
    }
    setForm({ ...form, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const input = {
        orchardId: form.orchardId,
        date: form.date,
        quantityKg: parseFloat(form.quantityKg),
        notes: form.notes,
      };
      if (id) {
        await graphqlRequest(UPDATE_HARVEST, { id, input });
      } else {
        await graphqlRequest(CREATE_HARVEST, { input });
      }
      navigate("/harvests");
    } catch (err) {
      console.error("Erro ao salvar colheita:", err);
      alert("Erro ao salvar colheita. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <NavBar />
      <div className="container mt-4">
        <h2 className="mb-4">{id ? "Editar Colheita" : "Nova Colheita"}</h2>

        {(loading) ? (
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Carregando...</span>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {fetchError && (
              <div className="alert alert-warning">{fetchError}</div>
            )}

            <div className="mb-3">
              <label className="form-label">Pomar</label>
              <select
                name="orchardId"
                className="form-select"
                value={form.orchardId}
                onChange={handleChange}
                required
              >
                <option value="">Selecione um pomar...</option>
                {orchards.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Data</label>
              <input
                type="date"
                name="date"
                className="form-control"
                value={form.date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Quantidade (Kg)</label>
              <input
                type="number"
                name="quantityKg"
                className="form-control"
                value={form.quantityKg}
                onChange={handleChange}
                required
                min="0"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Notas (opcional)</label>
              <textarea
                name="notes"
                className="form-control"
                value={form.notes}
                onChange={handleChange}
              ></textarea>
            </div>

            <button type="submit" className="btn btn-success" disabled={submitting}>
              {submitting ? "Salvando..." : "Salvar"}
            </button>
          </form>
        )}
      </div>
    </>
  );
}
