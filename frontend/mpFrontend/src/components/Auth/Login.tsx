// src/components/Auth/Login.tsx
import { useState } from "react";
import type { FormEvent } from "react";

import { useNavigate } from "react-router-dom";
// 1. Importa tu CSS
import "./Login.css";
// 2. Importa el logo (asegúrate de que la ruta coincida con donde lo guardaste)
import mplogo from "../../assets/mplogo.png";
import { login } from "../../services/authService";
import type { User } from "../../models/User";
import type { Fiscal } from "../../models/Fiscal";


export default function Login() {

  const navigate = useNavigate();

  const [correo, setcorreo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const user: User = { correo, password };
      const fiscalResponse: Fiscal = await login(user);
      console.table(fiscalResponse)
      navigate("/dashboard", { state: { fiscal: fiscalResponse } });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ocurrió un error desconocido");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        {/* 3. Inserta el logo arriba del título */}
        <img src={mplogo} alt="Logo MP" className="logo" />
        <h2>Iniciar sesión</h2>
        {error && <p className="error-message">{error}</p>}
        <div>
          <label>Correo</label>
          <input
            type="text"
            value={correo}
            onChange={(e) => setcorreo(e.target.value)}
            placeholder="Ingresa tu correo"
            autoComplete="correo"
            required
          />
        </div>
        <div>
          <label>Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Ingresa tu contraseña"
            autoComplete="current-password"
            required
          />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Cargando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}