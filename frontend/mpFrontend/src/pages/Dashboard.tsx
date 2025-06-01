// src/components/Dashboard.tsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Dashboard.css";
import { listarCasos, crearCaso } from "../services/casoService";
import type { Fiscal } from "../models/Fiscal";
import type { Caso } from "../models/Caso";

export default function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();

  // Extraemos el usuario desde el state de la navegación.
  // Hacemos un “type guard” sencillo para evitar que crashing si location.state viene undefined.
  const state = location.state as { fiscal: Fiscal } | undefined;
  const user = state?.fiscal;

  const [showForm, setShowForm] = React.useState(false);
  const [descripcion, setDescripcion] = React.useState("");
  const [casos, setCasos] = React.useState<Caso[]>([]);
  const [loadingCasos, setLoadingCasos] = React.useState<boolean>(true);
  const [errorCasos, setErrorCasos] = React.useState<string | null>(null);
  const [searchTerm, setSearchTerm] = React.useState<string>("");
  const [isCreating, setIsCreating] = React.useState<boolean>(false);
  const [errorCreate, setErrorCreate] = React.useState<string | null>(null);

  // Si por alguna razón no llegó el usuario, redirigimos de vuelta al Login.
  React.useEffect(() => {
    if (!user) {
      navigate("/", { replace: true });
      return;
    }
    // Al entrar, llamar al endpoint listarCasos
    setLoadingCasos(true);
    setErrorCasos(null);
    listarCasos(user.CorreoElectronico)
      .then((data) => setCasos(data))
      .catch((err) => setErrorCasos(err.message ?? "Error al cargar casos"))
      .finally(() => setLoadingCasos(false));
  }, [user, navigate]);

  if (!user) {
    // Mientras redirigimos (o si no hay user), podemos devolver null o un mensaje de carga.
    return null;
  }

  const filteredCasos = casos.filter((caso) =>
    caso.Descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Bienvenido {user.Usuario}</h1>
      <div className="dashboard-card">
        <p>
          <strong>{user.Rol}:</strong> {user.Nombre}
        </p>
        {/* Si tu User tuviera más campos, muéstralos aquí */}
        {/* <p><strong>Nombre:</strong> {user.nombre}</p>
        <p><strong>Rol:</strong> {user.rol}</p> */}
        {typeof user.Permisos === "string" && user.Permisos.includes("CREAR_CASO") && !showForm && (
          <button className="dashboard-button" onClick={() => setShowForm(true)} disabled={isCreating}>
            Crear Caso
          </button>
        )}
      </div>
      {showForm && (
        <form
          className="dashboard-form"
          onSubmit={(e) => {
            e.preventDefault();
            setErrorCreate(null);
            setIsCreating(true);
            const nuevoCasoPayload = {
              correoElectronico: user.CorreoElectronico,
              descripcion: descripcion,
            };
            crearCaso(nuevoCasoPayload)
              .then(() => {
                // Al crear exitosamente, ocultar el formulario, limpiar descripción
                setShowForm(false);
                setDescripcion("");
                // Recargar la lista de casos
                setLoadingCasos(true);
                return listarCasos(user.CorreoElectronico);
              })
              .then((data) => {
                setCasos(data);
              })
              .catch((err) => {
                setErrorCreate(err.message ?? "Error al crear caso");
              })
              .finally(() => {
                setIsCreating(false);
                setLoadingCasos(false);
              });
          }}
        >
          <div className="dashboard-form-field">
            <label>
              Descripción:
              <br />
              <textarea
                className="dashboard-textarea"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                rows={4}
                required
                disabled={isCreating}
              />
            </label>
            {errorCreate && <p style={{ color: "#dc2626", marginTop: "0.5rem" }}>{errorCreate}</p>}
          </div>
          <button type="submit" className="dashboard-form-button" disabled={isCreating}>
            {isCreating ? "Creando..." : "Enviar Caso"}
          </button>
        </form>
      )}
      <div className="dashboard-casos">
        {loadingCasos && <p>Cargando casos...</p>}
        {errorCasos && <p style={{ color: "#dc2626" }}>{errorCasos}</p>}
        {!loadingCasos && !errorCasos && (
          <>
            <div className="dashboard-search">
              <input
                type="text"
                placeholder="Buscar caso..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="dashboard-search-input"
              />
            </div>
            <div className="dashboard-table-container">
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Descripción</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCasos.map((caso) => (
                    <tr key={caso.CasoID}>
                      <td>{caso.Descripcion}</td>
                      <td className={`case-status status-${caso.Estado.toLowerCase()}`}>
                        {caso.Estado}
                      </td>
                      <td>
                        <button className="case-button modify-button">Modificar</button>
                        {user.Rol === "SUPERVISOR" && (
                          <button className="case-button assign-button">Asignar</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
// Se eliminó el objeto styles; ahora se usa CSS en Dashboard.css