import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar.jsx";
import { http } from "../../api/http.js";
import { useAuth } from "../../context/AuthContext.jsx";

// ─── Estrellas ───────────────────────────────────────────────────────────────
function Stars({ value }) {
  const full  = Math.floor(value);
  const half  = value - full >= 0.4 ? 1 : 0;
  const empty = 5 - full - half;
  return (
    <span style={{ color: "#f5a623", fontSize: 14, letterSpacing: 1 }}>
      {"★".repeat(full)}
      {half ? "½" : ""}
      {"☆".repeat(empty)}
      <span style={{ color: "var(--muted)", fontSize: 12, marginLeft: 4 }}>
        {Number(value).toFixed(1)}
      </span>
    </span>
  );
}

// ─── Avatar ───────────────────────────────────────────────────────────────────
function Avatar({ src, name, size = 56 }) {
  const [error, setError] = useState(false);
  if (src && !error) {
    return (
      <img
        src={src}
        alt={name}
        onError={() => setError(true)}
        style={{ width: size, height: size, borderRadius: 14, objectFit: "cover", flexShrink: 0 }}
      />
    );
  }
  const initials = name?.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase() || "?";
  return (
    <div style={{
      width: size, height: size, borderRadius: 14, flexShrink: 0,
      background: "linear-gradient(135deg, var(--primary), var(--accent))",
      display: "flex", alignItems: "center", justifyContent: "center",
      color: "#fff", fontWeight: 800, fontSize: size * 0.3,
    }}>
      {initials}
    </div>
  );
}

// ─── Modal de contacto ────────────────────────────────────────────────────────
function ContactModal({ provider, token, onClose, onSent }) {
  const [msg, setMsg] = useState("Hola! Me gustaría contactarte.");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function send() {
    setLoading(true);
    setErr("");
    try {
      await http("/contact-requests", {
        method: "POST", token,
        body: { providerId: provider.id, message: msg },
      });
      onSent();
    } catch (e) {
      setErr(e.message);
      setLoading(false);
    }
  }

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 100,
      background: "rgba(23,49,59,.45)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 20,
    }} onClick={onClose}>
      <div className="card" style={{ width: "min(100%, 480px)", padding: 28 }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
          <Avatar src={provider.avatar_url} name={provider.full_name} size={48} />
          <div>
            <div style={{ fontWeight: 800, fontSize: 16 }}>{provider.full_name}</div>
            <div className="muted" style={{ fontSize: 13 }}>{provider.headline}</div>
          </div>
        </div>

        <label className="muted" style={{ fontSize: 13, display: "block", marginBottom: 6 }}>
          Tu mensaje inicial
        </label>
        <textarea
          className="input"
          style={{ minHeight: 100, resize: "vertical", marginBottom: 14 }}
          value={msg}
          onChange={e => setMsg(e.target.value)}
        />

        {err && <div style={{ color: "var(--danger)", marginBottom: 10, fontSize: 13 }}>{err}</div>}

        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button className="btn" type="button" onClick={onClose}
            style={{ background: "rgba(23,49,59,.08)", color: "var(--text)", boxShadow: "none" }}>
            Cancelar
          </button>
          <button className="btn secondary" type="button" onClick={send} disabled={loading}>
            {loading ? "Enviando…" : "Enviar pedido"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Card de prestador ────────────────────────────────────────────────────────
function ProviderCard({ provider, onContact }) {
  return (
    <div className="card" style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Header */}
      <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
        <Avatar src={provider.avatar_url} name={provider.full_name} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 800, fontSize: 16, lineHeight: 1.2 }}>{provider.full_name}</div>
          <div className="muted" style={{ fontSize: 13, marginTop: 2 }}>
            {provider.city || "—"}
          </div>
          <div style={{ marginTop: 6 }}>
            <Stars value={provider.avg_rating || 0} />
          </div>
        </div>
      </div>

      {/* Headline */}
      <div style={{ fontWeight: 600, fontSize: 14, lineHeight: 1.4 }}>
        {provider.headline || "Prestador"}
      </div>

      {/* Bio */}
      {provider.bio && (
        <div className="muted" style={{ fontSize: 13, lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {provider.bio}
        </div>
      )}

      {/* Categorías */}
      {provider.categories && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {provider.categories.split(", ").map(cat => (
            <span key={cat} style={{
              padding: "3px 10px", borderRadius: 999, fontSize: 12, fontWeight: 600,
              background: "var(--primary-soft)", color: "var(--primary-strong)",
            }}>
              {cat}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginTop: "auto", flexWrap: "wrap" }}>
        {provider.price_from ? (
          <div style={{ fontWeight: 700, color: "var(--primary)" }}>
            Desde ${Number(provider.price_from).toLocaleString("es-AR")}
            {provider.price_unit && <span className="muted" style={{ fontWeight: 400, fontSize: 13 }}> / {provider.price_unit}</span>}
          </div>
        ) : (
          <div className="muted" style={{ fontSize: 13 }}>Consultar precio</div>
        )}
        <button className="btn secondary" type="button" style={{ fontSize: 14, padding: "9px 16px" }} onClick={() => onContact(provider)}>
          Contactar
        </button>
      </div>
    </div>
  );
}

// ─── Categorías (lista estática como punto de partida) ────────────────────────
const STATIC_CATEGORIES = [
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

// ─── Página principal ─────────────────────────────────────────────────────────
export default function ClientDashboard() {
  const { token } = useAuth();

  const [providers, setProviders] = useState([]);
  const [selectedCat, setSelectedCat] = useState(null); // nombre de categoría
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [contacting, setContacting] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [err, setErr] = useState("");

  // Debounce del buscador
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  // Cargar prestadores al cambiar filtros
  useEffect(() => {
    setErr("");
    const params = new URLSearchParams();
    if (debouncedSearch) params.set("q", debouncedSearch);
    if (selectedCat)     params.set("category", selectedCat);
    const qs = params.toString();
    http(`/providers${qs ? `?${qs}` : ""}`, { token })
      .then(setProviders)
      .catch(e => setErr(e.message));
  }, [token, debouncedSearch, selectedCat]);

  function handleSent() {
    setContacting(null);
    setSuccessMsg(`¡Pedido enviado a ${contacting?.full_name}! Podés seguirlo desde Chats.`);
    setTimeout(() => setSuccessMsg(""), 5000);
  }

  return (
    <>
      <Navbar />

      {contacting && (
        <ContactModal
          provider={contacting}
          token={token}
          onClose={() => setContacting(null)}
          onSent={handleSent}
        />
      )}

      <div className="container">
        {/* Hero */}
        <div style={{ marginBottom: 28 }}>
          <h2 style={{ margin: "0 0 8px", fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)" }}>
            Encontrá tu prestador ideal
          </h2>
          <p className="muted" style={{ margin: 0, maxWidth: 580 }}>
            Filtrá por categoría, buscá por nombre y contactá directo desde Zerbis.
          </p>
        </div>

        {/* Buscador */}
        <div style={{ marginBottom: 20 }}>
          <input
            className="input"
            style={{ maxWidth: 480 }}
            placeholder="Buscar por nombre o especialidad…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Filtro de categorías */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
          <button
            type="button"
            onClick={() => setSelectedCat(null)}
            style={{
              padding: "7px 16px", borderRadius: 999, border: "1px solid",
              fontSize: 13, fontWeight: 600, cursor: "pointer",
              background: selectedCat === null ? "var(--primary)" : "rgba(255,255,255,.6)",
              borderColor: selectedCat === null ? "transparent" : "var(--stroke)",
              color: selectedCat === null ? "#f4fbfb" : "var(--text)",
            }}
          >
            Todos
          </button>
          {STATIC_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCat(selectedCat === cat.name ? null : cat.name)}
              style={{
                padding: "7px 16px", borderRadius: 999, border: "1px solid",
                fontSize: 13, fontWeight: 600, cursor: "pointer",
                background: selectedCat === cat.name ? "var(--primary)" : "rgba(255,255,255,.6)",
                borderColor: selectedCat === cat.name ? "transparent" : "var(--stroke)",
                color: selectedCat === cat.name ? "#f4fbfb" : "var(--text)",
              }}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Mensajes de estado */}
        {successMsg && (
          <div style={{
            marginBottom: 16, padding: "12px 16px", borderRadius: 12,
            background: "var(--accent-soft)", color: "#08432a", fontWeight: 600, fontSize: 14,
          }}>
            {successMsg}
            <Link to="/client/conversations" style={{ marginLeft: 10, textDecoration: "underline" }}>
              Ir a Chats →
            </Link>
          </div>
        )}
        {err && <div style={{ color: "var(--danger)", marginBottom: 16 }}>{err}</div>}

        {/* Grid de prestadores */}
        {providers.length === 0 ? (
          <div className="card" style={{ padding: 32, textAlign: "center" }}>
            <div style={{ fontSize: 32, marginBottom: 10 }}>🔍</div>
            <div className="muted">No hay prestadores que coincidan con tu búsqueda.</div>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: 20,
          }}>
            {providers.map(p => (
              <ProviderCard key={p.id} provider={p} onContact={setContacting} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
