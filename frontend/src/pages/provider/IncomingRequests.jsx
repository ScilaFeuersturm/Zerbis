import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar.jsx";
import { http } from "../../api/http.js";
import { useAuth } from "../../context/AuthContext.jsx";

const STATUS_LABELS = {
  pending:  "Pendiente",
  accepted: "Aceptado",
  rejected: "Rechazado",
  closed:   "Cerrado",
};

export default function IncomingRequests(){
  const { token } = useAuth();
  const [rows, setRows] = useState([]);
  const [err, setErr] = useState("");

  async function load(){
    setErr("");
    try{
      const data = await http("/contact-requests/incoming", { token });
      setRows(data);
    }catch(e){ setErr(e.message); }
  }

  useEffect(()=>{ load(); }, []);

  async function setStatus(id, status){
    setErr("");
    try{
      await http(`/contact-requests/${id}/status`, { method:"PATCH", token, body:{ status }});
      await load();
    }catch(e){ setErr(e.message); }
  }

  return (
    <>
      <Navbar />
      <div className="container">
        <h2>Pedidos entrantes</h2>
        {err && <div style={{color:"var(--danger)"}}>{err}</div>}

        <div className="card" style={{padding:16}}>
          <div style={{display:"grid", gap:10}}>
            {rows.map(r => (
              <div key={r.id} className="card" style={{padding:12}}>
                <div style={{display:"flex", justifyContent:"space-between", gap:12}}>
                  <div>
                    <div style={{fontWeight:800}}>{r.client_name}</div>
                    <div className="muted" style={{fontSize:13}}>Estado: {STATUS_LABELS[r.status] ?? r.status}</div>
                    <div style={{marginTop:8}}>{r.message || <span className="muted">Sin mensaje</span>}</div>
                  </div>
                  <div style={{display:"flex", gap:8, flexWrap:"wrap", alignItems:"flex-start", justifyContent:"flex-end"}}>
                    <button className="btn secondary" onClick={()=>setStatus(r.id,"accepted")}>Aceptar</button>
                    <button className="btn" style={{background:"var(--danger)", color:"#fff"}} onClick={()=>setStatus(r.id,"rejected")}>Rechazar</button>
                    <button className="btn" style={{background:"var(--muted)", color:"#fff"}} onClick={()=>setStatus(r.id,"closed")}>Cerrar</button>
                  </div>
                </div>
              </div>
            ))}
            {rows.length === 0 && <div className="muted">No tenés pedidos por ahora.</div>}
          </div>
        </div>
      </div>
    </>
  );
}
