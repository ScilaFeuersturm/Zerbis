import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar.jsx";
import { http } from "../../api/http.js";
import { useAuth } from "../../context/AuthContext.jsx";

export default function ReviewsModeration(){
  const { token } = useAuth();
  const [rows, setRows] = useState([]);
  const [err, setErr] = useState("");

  async function load(){
    setErr("");
    try{
      const data = await http("/admin/reviews", { token });
      setRows(data);
    }catch(e){
      setErr(e.message);
    }
  }

  useEffect(()=>{ load(); }, []);

  async function setStatus(id, status){
    try{
      await http(`/admin/reviews/${id}/status`, { method:"PATCH", token, body:{ status }});
      await load();
    }catch(e){
      setErr(e.message);
    }
  }

  return (
    <>
      <Navbar />
      <div className="container">
        <h2>Moderar reseñas</h2>
        {err && <div style={{color:"var(--danger)"}}>{err}</div>}
        <div className="card" style={{padding:16}}>
          <div style={{display:"grid", gap:10}}>
            {rows.map(r => (
              <div key={r.id} className="card" style={{padding:12}}>
                <div style={{display:"flex", justifyContent:"space-between", gap:12}}>
                  <div>
                    <div style={{fontWeight:700}}>
                      ⭐ {r.rating} <span className="muted" style={{fontWeight:500}}>({r.status})</span>
                    </div>
                    <div className="muted" style={{fontSize:13}}>
                      {r.from_name} → {r.to_name}
                    </div>
                    <div style={{marginTop:8}}>{r.comment || <span className="muted">Sin comentario</span>}</div>
                  </div>
                  <div style={{display:"flex", gap:8, flexWrap:"wrap", alignItems:"flex-start", justifyContent:"flex-end"}}>
                    <button className="btn secondary" onClick={()=>setStatus(r.id,"visible")}>Visible</button>
                    <button className="btn" style={{background:"rgba(255,255,255,.10)"}} onClick={()=>setStatus(r.id,"hidden")}>Ocultar</button>
                    <button className="btn" style={{background:"rgba(255,84,112,.85)"}} onClick={()=>setStatus(r.id,"flagged")}>Flag</button>
                  </div>
                </div>
              </div>
            ))}
            {rows.length === 0 && <div className="muted">No hay reseñas.</div>}
          </div>
        </div>
      </div>
    </>
  );
}
