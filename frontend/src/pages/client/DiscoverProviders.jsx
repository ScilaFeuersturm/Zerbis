import { useEffect, useState } from "react";
import { http } from "../../api/http.js";
import { useAuth } from "../../context/AuthContext.jsx";
import SwipeCard from "../../components/SwipeCard.jsx";

export default function DiscoverProviders(){
  const { token } = useAuth();
  const [providers, setProviders] = useState([]);
  const [i, setI] = useState(0);
  const [msg, setMsg] = useState("Hola! Me gustaría contactarte.");
  const [err, setErr] = useState("");

  useEffect(() => {
    http("/providers", { token })
      .then(setProviders)
      .catch(e => setErr(e.message));
  }, [token]);

  const current = providers[i];

  async function like(){
    setErr("");
    try{
      await http("/contact-requests", {
        method:"POST",
        token,
        body:{ providerId: current.id, message: msg }
      });
      setI(i+1);
    }catch(e){
      setErr(e.message);
    }
  }

  function skip(){ setI(i+1); }

  return (
    <div className="container" style={{maxWidth:720}}>
      <h2>Descubrir prestadores</h2>
      <p className="muted">Buscá, encontrá match y chateá adentro de Zerbis.</p>

      <div className="card" style={{padding:16, marginBottom:12}}>
        <div className="muted" style={{marginBottom:8}}>Mensaje inicial</div>
        <textarea
          className="input"
          style={{minHeight:90, resize:"vertical"}}
          value={msg}
          onChange={e=>setMsg(e.target.value)}
        />
      </div>

      {err && <div style={{color:"var(--danger)", marginBottom:12}}>{err}</div>}

      {!current ? (
        <div className="card" style={{padding:16}}>
          No hay más prestadores para mostrar.
        </div>
      ) : (
        <SwipeCard provider={current} onLike={like} onSkip={skip} />
      )}
    </div>
  );
}