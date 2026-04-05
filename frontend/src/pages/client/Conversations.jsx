import { useEffect, useRef, useState } from "react";
import Navbar from "../../components/Navbar.jsx";
import { http } from "../../api/http.js";
import { useAuth } from "../../context/AuthContext.jsx";

const STATUS_LABELS = {
  pending:  "Pendiente",
  accepted: "Aceptado",
  rejected: "Rechazado",
  closed:   "Cerrado",
};

function ConversationItem({ c, active, role, onClick }) {
  const label = role === "client" ? c.provider_name : c.client_name;

  return (
    <button
      className="card"
      onClick={onClick}
      style={{
        padding: "14px 16px",
        textAlign: "left",
        cursor: "pointer",
        border: active ? "1px solid rgba(31,111,120,.38)" : "1px solid var(--stroke)",
        background: active ? "linear-gradient(180deg, rgba(216,236,233,.95), rgba(255,255,255,.82))" : undefined,
        boxShadow: active ? "0 18px 40px rgba(31,111,120,.12)" : undefined,
        width: "100%",
      }}
      type="button"
    >
      <div style={{ fontWeight: 700, fontSize: 15, lineHeight: 1.35 }}>{label}</div>
      <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>
        {STATUS_LABELS[c.status] ?? c.status}
      </div>
    </button>
  );
}

export default function Conversations() {
  const { token, userId, role } = useAuth();
  const [convos, setConvos] = useState([]);
  const [active, setActive] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [err, setErr] = useState("");
  const messagesEndRef = useRef(null);

  async function loadConvos() {
    setErr("");
    try {
      const data = await http("/conversations", { token });
      setConvos(data);
      if (!active && data[0]) setActive(data[0]);
    } catch (e) {
      setErr(e.message);
    }
  }

  async function loadMessages(conversationId) {
    setErr("");
    try {
      const data = await http(`/conversations/${conversationId}/messages`, { token });
      setMessages(data);
    } catch (e) {
      setErr(e.message);
    }
  }

  useEffect(() => { loadConvos(); }, []);

  useEffect(() => {
    if (active) loadMessages(active.conversation_id);
  }, [active?.conversation_id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send() {
    if (!active) return;
    const content = text.trim();
    if (!content) return;
    setText("");
    try {
      await http(`/conversations/${active.conversation_id}/messages`, {
        method: "POST",
        token,
        body: { content },
      });
      await loadMessages(active.conversation_id);
    } catch (e) {
      setErr(e.message);
    }
  }

  function onKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  const otherName = active
    ? (role === "client" ? active.provider_name : active.client_name)
    : null;

  return (
    <>
      <Navbar />
      <div className="container">
        <div style={{ marginBottom: 20 }}>
          <h2 style={{ margin: "0 0 8px", fontSize: "clamp(2rem, 3vw, 2.6rem)" }}>Chats</h2>
          <p className="muted" style={{ margin: 0, maxWidth: 680 }}>
            Coordiná tus servicios en un espacio claro y cómodo.
          </p>
        </div>

        {err && <div style={{ color: "var(--danger)", marginBottom: 12 }}>{err}</div>}

        <div className="page-grid">
          {/* Sidebar */}
          <div className="card" style={{ padding: 18, display: "grid", gap: 10, alignContent: "start" }}>
            <div style={{
              fontSize: 12,
              letterSpacing: ".08em",
              textTransform: "uppercase",
              color: "var(--primary)",
              fontWeight: 800,
              marginBottom: 2,
            }}>
              Conversaciones
            </div>

            {convos.map((c) => (
              <ConversationItem
                key={c.conversation_id}
                c={c}
                role={role}
                active={active?.conversation_id === c.conversation_id}
                onClick={() => setActive(c)}
              />
            ))}

            {convos.length === 0 && (
              <div className="muted" style={{ fontSize: 14 }}>Todavía no tenés conversaciones.</div>
            )}
          </div>

          {/* Chat panel */}
          <div className="card" style={{ padding: 18, minHeight: 560, display: "flex", flexDirection: "column", gap: 0 }}>
            {/* Header */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
              paddingBottom: 14,
              marginBottom: 14,
              borderBottom: "1px solid rgba(23,49,59,.08)",
              flexWrap: "wrap",
            }}>
              <div>
                <div style={{
                  fontSize: 12,
                  letterSpacing: ".08em",
                  textTransform: "uppercase",
                  color: "var(--primary)",
                  fontWeight: 800,
                }}>
                  {active ? otherName : "Seleccioná una conversación"}
                </div>
                {active && (
                  <div className="muted" style={{ fontSize: 13, marginTop: 3 }}>
                    {role === "client" ? active.client_name : active.provider_name} · vos
                  </div>
                )}
              </div>

              {active && (
                <div style={{
                  padding: "6px 12px",
                  borderRadius: 999,
                  background: "var(--primary-soft)",
                  color: "var(--primary-strong)",
                  fontWeight: 700,
                  fontSize: 12,
                }}>
                  {STATUS_LABELS[active.status] ?? active.status}
                </div>
              )}
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column", gap: 8, paddingRight: 4 }}>
              {messages.map((m) => {
                const isOwn = m.sender_id === userId;
                const senderName = isOwn ? "Vos" : otherName;
                return (
                  <div
                    key={m.id}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: isOwn ? "flex-end" : "flex-start",
                    }}
                  >
                    <div style={{
                      maxWidth: "72%",
                      padding: "10px 14px",
                      borderRadius: isOwn ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                      background: isOwn ? "var(--primary)" : "var(--bg-accent)",
                      color: isOwn ? "#f4fbfb" : "var(--text)",
                      lineHeight: 1.5,
                      fontSize: 14,
                    }}>
                      {m.content}
                    </div>
                    <div className="muted" style={{ fontSize: 11, marginTop: 3 }}>
                      {senderName} · {new Date(m.created_at).toLocaleString("es-AR", { hour: "2-digit", minute: "2-digit", day: "numeric", month: "short" })}
                    </div>
                  </div>
                );
              })}

              {active && messages.length === 0 && (
                <div className="muted" style={{ textAlign: "center", marginTop: 40, fontSize: 14 }}>
                  Sin mensajes todavía. ¡Escribí el primero!
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Composer */}
            {active && (
              <div className="composer-row" style={{ paddingTop: 14, marginTop: 14, borderTop: "1px solid rgba(23,49,59,.08)" }}>
                <input
                  className="input"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={onKeyDown}
                  placeholder="Escribí un mensaje… (Enter para enviar)"
                />
                <button className="btn secondary" type="button" onClick={send}>
                  Enviar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
