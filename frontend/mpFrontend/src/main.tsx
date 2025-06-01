// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import Login from "./components/Auth/Login";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css"; // si tienes estilos globales
import Dashboard from "./pages/Dashboard";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);