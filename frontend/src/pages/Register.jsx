import { useState } from "react";
import { register as registerApi } from "../api/auth.js";
import { useNavigate, Link } from "react-router-dom";

const CATEGORIES = [
  { id: 1,  name: "Electricidad" },
  { id: 2,  name: "Gas y Calefacción" },
  { id: 3,  name: "Plomería" },
  { id: 4,  name: "Pintura" },
  { id: 5,  name: "Albañilería" },
  { id: 6,  name: "Carpintería" },
  { id: 7,  name: "Cerrajería" },
  { id: 8,  name: "Limpieza" },
  { id: 9,  name: "Jardinería y Paisajismo" },
  { id: 10, name: "Mudanzas" },
  { id: 11, name: "Aire Acondicionado" },
  { id: 12, name: "Herrería" },
  { id: 13, name: "Techado e Impermeabilización" },
  { id: 14, name: "Redes y Computación" },
  { id: 15, name: "Diseño Gráfico" },
  { id: 16, name: "Costura y Modistería" },
  { id: 17, name: "Peluquería y Estética" },
  { id: 18, name: "Masajes y Bienestar" },
  { id: 19, name: "Catering y Cocina" },
  { id: 20, name: "Clases Particulares" },
  { id: 21, name: "Idiomas" },
  { id: 22, name: "Música y Arte" },
  { id: 23, name: "Contabilidad y Finanzas" },
  { id: 24, name: "Asesoría Legal" },
  { id: 25, name: "Psicología y Coaching" },
  { id: 26, name: "Fotografía y Video" },
  { id: 27, name: "Veterinaria a Domicilio" },
  { id: 28, name: "Cuidado de Niños" },
  { id: 29, name: "Cuidado de Adultos Mayores" },
  { id: 30, name: "Mecánica a Domicilio" },
];

export default function Register() {
  const nav = useNavigate();
  const [role, setRole]           = useState("client");
  const [fullName, setFullName]   = useState("");
  const [email, setEmail]         = useState("");
  const [phone, setPhone]         = useState("");
  const [city, setCity]           = useState("");
  const [headline, setHeadline]   = useState("");
  const [bio, setBio]             = useState("");
  const [password, setPassword]   = useState("");
  const [categoryIds, setCategoryIds] = useState([]);
  const [err, setErr]             = useState("");

  function toggleCat(id) {
    setCategoryIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  }

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    if (role === "provider" && categoryIds.length === 0) {
      setErr("Seleccioná al menos un rubro.");
      return;
    }
    try {
      await registerApi({ role, fullName, email, phone, city, headline, bio, password, categoryIds });
      nav("/login", { replace: true });
    } catch (e) {
      setErr(e.message);
    }
  }

  return (
    <div className="container auth-shell">
      <div className="card auth-panel wide">
        {/* Logo */}
        <div style={{
          display:"inline-flex", alignItems:"center", gap:12,
          padding:"10px 14px", borderRadius:999,
          background:"rgba(255,255,255,.6)", border:"1px solid rgba(23,49,59,.06)",
          marginBottom:18,
        }}>
          <div style={{
            width:34, height:34, borderRadius:12,
            background:"linear-gradient(135deg, var(--primary), var(--accent))",
            boxShadow:"0 10px 24px rgba(31,111,120,.22)",
          }}/>
          <div>
            <div style={{fontWeight:800, lineHeight:1}}>Zerbis</div>
            <div className="muted" style={{fontSize:12}}>Servicios con confianza</div>
          </div>
        </div>

        <h2 style={{margin:"0 0 8px"}}>Crear cuenta</h2>
        <p className="muted" style={{marginTop:0, marginBottom:22}}>
          Cliente para encontrar prestadores. Prestador para ofrecer servicios.
        </p>

        <form onSubmit={onSubmit} style={{display:"grid", gap:14}}>
          {/* Rol */}
          <div>
            <label className="muted" style={{fontSize:13, display:"block", marginBottom:6}}>Rol</label>
            <select className="input" value={role} onChange={e => { setRole(e.target.value); setCategoryIds([]); }}>
              <option value="client">Cliente</option>
              <option value="provider">Prestador</option>
            </select>
          </div>

          {/* Datos básicos */}
          <input className="input" placeholder="Nombre completo" value={fullName} onChange={e=>setFullName(e.target.value)} />

          <div className="row">
            <input className="input" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
            <input className="input" placeholder="Teléfono (opcional)" value={phone} onChange={e=>setPhone(e.target.value)} />
          </div>

          <div className="row">
            <input className="input" placeholder="Ciudad (opcional)" value={city} onChange={e=>setCity(e.target.value)} />
            {role === "provider" && (
              <input
                className="input"
                placeholder="Titular (ej: Plomería + urgencias)"
                value={headline}
                onChange={e=>setHeadline(e.target.value)}
              />
            )}
          </div>

          <textarea
            className="input"
            style={{minHeight:80}}
            placeholder="Bio (opcional)"
            value={bio}
            onChange={e=>setBio(e.target.value)}
          />

          {/* Selector de rubros — solo para prestadores */}
          {role === "provider" && (
            <div>
              <div style={{display:"flex", justifyContent:"space-between", alignItems:"baseline", marginBottom:8}}>
                <label className="muted" style={{fontSize:13}}>
                  Rubros <span style={{color:"var(--danger)"}}>*</span>
                </label>
                {categoryIds.length > 0 && (
                  <span style={{fontSize:12, color:"var(--primary)", fontWeight:700}}>
                    {categoryIds.length} seleccionado{categoryIds.length > 1 ? "s" : ""}
                  </span>
                )}
              </div>
              <div style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
                padding: "14px",
                borderRadius: 14,
                border: "1px solid var(--stroke)",
                background: "rgba(255,255,255,.6)",
                maxHeight: 220,
                overflowY: "auto",
              }}>
                {CATEGORIES.map(cat => {
                  const active = categoryIds.includes(cat.id);
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => toggleCat(cat.id)}
                      style={{
                        padding: "6px 14px",
                        borderRadius: 999,
                        border: "1px solid",
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: "pointer",
                        transition: "background .12s, color .12s",
                        background: active ? "var(--primary)" : "rgba(255,255,255,.7)",
                        borderColor: active ? "transparent" : "var(--stroke)",
                        color: active ? "#f4fbfb" : "var(--text)",
                      }}
                    >
                      {cat.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <input
            className="input"
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={e=>setPassword(e.target.value)}
          />

          {err && <div style={{color:"var(--danger)", fontSize:14}}>{err}</div>}

          <button className="btn secondary" type="submit">Registrarme</button>

          <div className="muted">
            ¿Ya tenés cuenta?{" "}
            <Link to="/login" style={{textDecoration:"underline"}}>Iniciar sesión</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
