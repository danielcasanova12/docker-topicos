// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// Importa o CSS do Bootstrap
import "bootstrap/dist/css/bootstrap.min.css";

// Se precisar do JS do Bootstrap (dropdowns, tooltips, modals...), descomente estas linhas:
// import "bootstrap/dist/js/bootstrap.bundle.min.js";

import "./index.css"; // agora apenas para estilos customizados (pode ficar vazio)

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
