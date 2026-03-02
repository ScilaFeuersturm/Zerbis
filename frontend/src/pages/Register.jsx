import { useState } from "react";
import { register as registerApi } from "../api/auth.js";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const nav = useNavigate();
  const [role, setRole] = useState("client");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [headline, setHeadline] = useState("");
  const [bio, setBio] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    try {
      await registerApi({ role, fullName, email, phone, city, headline, bio, password });
      nav("/login", { replace: true });
    } catch (e) {
      setErr(e.message);
    }
  }

  return (
    <div className="container" style={{maxWidth:720}}>
      <div className="card" style={{padding:20}}>
        <h2 style={{marginTop:0}}>Crear cuenta</h2>
        <p className="muted">Cliente para encontrar prestadores. Prestador para ofrecer servicios.</p>

        <form onSubmit={onSubmit} style={{display:"grid", gap:10}}>
          <label className="muted">Rol</label>
          <select className="input" value={role} onChange={(e)=>setRole(e.target.value)}>
            <option value="client">Cliente</option>
            <option value="provider">Prestador</option>
          </select>

          <input className="input" placeholder="Nombre completo" value={fullName} onChange={e=>setFullName(e.target.value)} />
          <div className="row">
            <input className="input" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
            <input className="input" placeholder="Teléfono (opcional)" value={phone} onChange={e=>setPhone(e.target.value)} />
          </div>

          <div className="row">
            <input className="input" placeholder="Ciudad (opcional)" value={city} onChange={e=>setCity(e.target.value)} />
            {role === "provider" && (
              <input className="input" placeholder="Titular (ej: Plomería + urgencias)" value={headline} onChange={e=>setHeadline(e.target.value)} />
            )}
          </div>

          <textarea className="input" style={{minHeight:90}} placeholder="Bio (opcional)" value={bio} onChange={e=>setBio(e.target.value)} />

          <input className="input" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />

          {err && <div style={{color:"var(--danger)"}}>{err}</div>}

          <button className="btn secondary" type="submit">Registrarme</button>

          <div className="muted">
            ¿Ya tenés cuenta? <Link to="/login" style={{textDecoration:"underline"}}>Iniciar sesión</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
