import { useState } from "react";
import { http } from "../api/http.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const { login } = useAuth();
  const nav = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    try {
      const data = await http("/auth/login", { method: "POST", body: { email, password } });
      login(data);
      nav("/", { replace: true });
    } catch (e) {
      setErr(e.message);
    }
  }

  return (
    <div className="container auth-shell">
      <div className="card auth-panel">
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 12,
            padding: "10px 14px",
            borderRadius: 999,
            background: "rgba(255,255,255,.6)",
            border: "1px solid rgba(23,49,59,.06)",
            marginBottom: 18,
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 12,
              background: "linear-gradient(135deg, var(--primary), var(--accent))",
              boxShadow: "0 10px 24px rgba(31,111,120,.22)",
            }}
          />
          <div>
            <div style={{ fontWeight: 800, lineHeight: 1 }}>Zerbis</div>
            <div className="muted" style={{ fontSize: 12 }}>
              Servicios con confianza
            </div>
          </div>
        </div>

        <h2 style={{ margin: "0 0 10px", fontSize: "clamp(2rem, 4vw, 2.8rem)" }}>Bienvenida de nuevo</h2>
        <p className="muted" style={{ marginTop: 0, marginBottom: 22, maxWidth: 420 }}>
          Conecta clientes y prestadores en un entorno claro, cercano y profesional.
        </p>

        <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
          <input className="input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input
            className="input"
            placeholder="Contraseña"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {err && <div style={{ color: "var(--danger)" }}>{err}</div>}
          <button className="btn" type="submit">
            Entrar
          </button>
          <div className="muted">
            No tienes cuenta? <Link to="/register" style={{ textDecoration: "underline", color: "var(--primary-strong)" }}>Crear cuenta</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
