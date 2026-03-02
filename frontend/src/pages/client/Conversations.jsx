import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar.jsx";
import { http } from "../../api/http.js";
import { useAuth } from "../../context/AuthContext.jsx";

function ConversationItem({ c, active, onClick }) {
  const label = `${c.client_name} ↔ ${c.provider_name}`;
  return (
    <button
      className="card"
      onClick={onClick}
      style={{
        padding:12,
        textAlign:"left",
        cursor:"pointer",
        border: active ? "1px solid rgba(124,92,255,.6)" : "1px solid var(--stroke)",
        background: active ? "rgba(124,92,255,.10)" : undefined
      }}
      type="button"
    >
      <div style={{fontWeight:700}}>{label}</div>
      <div className="muted" style={{fontSize:13}}>Estado: {c.status}</div>
    </button>
  );
}

export default function Conversations(){
  const { token } = useAuth();
  const [convos, setConvos] = useState([]);
  const [active, setActive] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [err, setErr] = useState("");

  async function loadConvos(){
    setErr("");
    try{
      const data = await http("/conversations", { token });
      setConvos(data);
      if (!active && data[0]) setActive(data[0]);
    }catch(e){ setErr(e.message); }
  }

  async function loadMessages(conversationId){
    setErr("");
    try{
      const data = await http(`/conversations/${conversationId}/messages`, { token });
      setMessages(data);
    }catch(e){ setErr(e.message); }
  }

  useEffect(()=>{ loadConvos(); }, []);
  useEffect(()=>{ if (active) loadMessages(active.conversation_id); }, [active?.conversation_id]);

  async function send(){
    if (!active) return;
    const content = text.trim();
    if (!content) return;
    setText("");
    try{
      await http(`/conversations/${active.conversation_id}/messages`, { method:"POST", token, body:{ content }});
      await loadMessages(active.conversation_id);
    }catch(e){ setErr(e.message); }
  }

  return (
    <>
      <Navbar />
      <div className="container">
        <h2>Chats</h2>
        {err && <div style={{color:"var(--danger)"}}>{err}</div>}

        <div className="row" style={{alignItems:"stretch"}}>
          <div style={{flex:1, minWidth:260, display:"grid", gap:10}}>
            {convos.map(c => (
              <ConversationItem
                key={c.conversation_id}
                c={c}
                active={active?.conversation_id === c.conversation_id}
                onClick={()=>setActive(c)}
              />
            ))}
            {convos.length === 0 && <div className="muted">Todavía no tenés conversaciones.</div>}
          </div>

          <div style={{flex:2}}>
            <div className="card" style={{padding:12, minHeight:420, display:"flex", flexDirection:"column", gap:10}}>
              <div className="muted" style={{fontSize:13}}>
                {active ? `Conversación #${active.request_id}` : "Seleccioná una conversación"}
              </div>

              <div style={{flex:1, overflow:"auto", display:"grid", gap:10, paddingRight:4}}>
                {messages.map(m => (
                  <div key={m.id} className="card" style={{padding:10}}>
                    <div className="muted" style={{fontSize:12}}>De: {m.sender_id} • {new Date(m.created_at).toLocaleString()}</div>
                    <div>{m.content}</div>
                  </div>
                ))}
                {active && messages.length === 0 && <div className="muted">Sin mensajes todavía.</div>}
              </div>

              {active && (
                <div className="row">
                  <input className="input" value={text} onChange={e=>setText(e.target.value)} placeholder="Escribí un mensaje..." />
                  <button className="btn secondary" type="button" onClick={send}>Enviar</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
