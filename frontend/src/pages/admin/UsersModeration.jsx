import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar.jsx";
import { http } from "../../api/http.js";
import { useAuth } from "../../context/AuthContext.jsx";

export default function UsersModeration(){
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [err, setErr] = useState("");

  async function load(){
    setErr("");
    try{
      const data = await http("/admin/users", { token });
      setUsers(data);
    }catch(e){
      setErr(e.message);
    }
  }

  useEffect(()=>{ load(); }, []);

  async function setStatus(id, status){
    try{
      await http(`/admin/users/${id}/status`, { method:"PATCH", token, body:{ status }});
      await load();
    }catch(e){
      setErr(e.message);
    }
  }

  return (
    <>
      <Navbar />
      <div className="container">
        <h2>Usuarios</h2>
        {err && <div style={{color:"var(--danger)"}}>{err}</div>}
        <div className="card" style={{padding:16}}>
          <div className="muted" style={{marginBottom:10}}>Alta/baja y bloqueo</div>
          <div style={{display:"grid", gap:10}}>
            {users.map(u => (
              <div key={u.id} className="card" style={{padding:12}}>
                <div style={{display:"flex", justifyContent:"space-between", gap:12, alignItems:"center"}}>
                  <div>
                    <div style={{fontWeight:700}}>{u.full_name} <span className="muted" style={{fontWeight:500}}>({u.role})</span></div>
                    <div className="muted" style={{fontSize:13}}>{u.email} {u.phone ? `• ${u.phone}` : ""}</div>
                    <div className="muted" style={{fontSize:13}}>Estado: {u.status}</div>
                  </div>
                  <div style={{display:"flex", gap:8, flexWrap:"wrap", justifyContent:"flex-end"}}>
                    <button className="btn secondary" onClick={()=>setStatus(u.id,"active")}>Activar</button>
                    <button className="btn" style={{background:"rgba(255,255,255,.10)"}} onClick={()=>setStatus(u.id,"inactive")}>Inactivar</button>
                    <button className="btn" style={{background:"rgba(255,84,112,.85)"}} onClick={()=>setStatus(u.id,"banned")}>Ban</button>
                  </div>
                </div>
              </div>
            ))}
            {users.length === 0 && <div className="muted">No hay usuarios.</div>}
          </div>
        </div>
      </div>
    </>
  );
}
