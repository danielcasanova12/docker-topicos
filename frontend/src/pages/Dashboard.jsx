import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import { request, gql, ClientError } from "graphql-request";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

export default function Dashboard() {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [productivityData, setProductivityData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  const API2_GQL = "http://localhost:4000/graphql";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    async function fetchDashboardData() {
      setLoading(true);
      setFetchError("");

      const productivityQuery = gql`
        {
          productivities {
            date
            KgPerTree
          }
        }
      `;

      const reportsQuery = gql`
        {
          reports {
            id
            generatedAt
            content
          }
        }
      `;

      try {
        const [prodData, repData] = await Promise.all([
          request(API2_GQL, productivityQuery, undefined, {
            Authorization: `Bearer ${token}`,
          }),
          request(API2_GQL, reportsQuery, undefined, {
            Authorization: `Bearer ${token}`,
          }),
        ]);

        const formattedProductivity = prodData.productivities.map((p) => ({
          date: new Date(p.date).toLocaleDateString(),
          KgPerTree: p.KgPerTree,
        }));

        setProductivityData(formattedProductivity);
        setReports(repData.reports.slice(-5)); // últimos 5 reports
      } catch (err) {
        console.error("Erro ao buscar dados:", err);
        setFetchError("Erro ao carregar dados do dashboard.");
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, [navigate]);

  return (
    <>
      <NavBar />
      <div className="container mt-4">
        <h1 className="mb-4">Dashboard</h1>

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
          <>
            <div className="row mb-4">
              <div className="col-12">
                <h4>Produtividade (Kg/Árvore)</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={productivityData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <Line type="monotone" dataKey="KgPerTree" stroke="#82ca9d" strokeWidth={3} />
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="row">
              <div className="col-12">
                <h4>Últimos Relatórios</h4>
                <ul className="list-group">
                  {reports.map((r) => (
                    <li key={r.id} className="list-group-item">
                      <strong>{new Date(r.generatedAt).toLocaleDateString()}</strong>: {r.content}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
