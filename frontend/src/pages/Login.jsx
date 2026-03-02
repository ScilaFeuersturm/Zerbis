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

  async function onSubmit(e){
    e.preventDefault();
    setErr("");
    try{
      const data = await http("/auth/login", { method:"POST", body:{ email, password }});
      login(data);
      nav("/", { replace:true });
    }catch(e){
      setErr(e.message);
    }
  }

  return (
    <div className="container" style={{maxWidth:520}}>
      <div className="card" style={{padding:20}}>
        <h2 style={{marginTop:0}}>Zerbis</h2>
        <p className="muted">Tu match para resolver cosas.</p>

        <form onSubmit={onSubmit} style={{display:"grid", gap:10}}>
          <input className="input" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
          <input className="input" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
          {err && <div style={{color:"var(--danger)"}}>{err}</div>}
          <button className="btn" type="submit">Entrar</button>
          <div className="muted">¿No tenés cuenta? <Link to="/register" style={{textDecoration:"underline"}}>Crear cuenta</Link></div>
        </form>
      </div>
    </div>
  );
}