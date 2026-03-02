import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../../components/Navbar.jsx";
import { http } from "../../api/http.js";
import { useAuth } from "../../context/AuthContext.jsx";

export default function ProviderProfile(){
  const { id } = useParams();
  const { token } = useAuth();
  const [provider, setProvider] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [err, setErr] = useState("");

  useEffect(()=>{
    (async () => {
      setErr("");
      try{
        const p = await http(`/providers/${id}`, { token });
        setProvider(p);
        const r = await http(`/reviews/to/${id}`, { token });
        setReviews(r);
      }catch(e){ setErr(e.message); }
    })();
  }, [id, token]);

  return (
    <>
      <Navbar />
      <div className="container" style={{maxWidth:820}}>
        <Link className="muted" to="/client/discover" style={{textDecoration:"underline"}}>← Volver</Link>
        {err && <div style={{color:"var(--danger)"}}>{err}</div>}

        {!provider ? (
          <div className="card" style={{padding:16, marginTop:12}}>Cargando...</div>
        ) : (
          <>
            <div className="card" style={{padding:16, marginTop:12}}>
              <div style={{display:"flex", justifyContent:"space-between", gap:12, alignItems:"center"}}>
                <div>
                  <div style={{fontSize:22, fontWeight:800}}>{provider.full_name}</div>
                  <div className="muted">{provider.city || "—"} • ⭐ {provider.avg_rating}</div>
                  <div style={{marginTop:10, fontWeight:700}}>{provider.headline || "Prestador"}</div>
                  <div className="muted">{provider.bio || "Sin descripción."}</div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div className="muted" style={{fontSize:13}}>Contacto directo</div>
                  <div style={{marginTop:6}}>
                    <div className="muted" style={{fontSize:13}}>{provider.email}</div>
                    <div className="muted" style={{fontSize:13}}>{provider.phone || "—"}</div>
                  </div>
                </div>
              </div>

              <hr style={{border:"0", borderTop:"1px solid var(--stroke)", margin:"14px 0"}}/>

              <div style={{fontWeight:800, marginBottom:8}}>Servicios</div>
              <div style={{display:"grid", gap:10}}>
                {(provider.services || []).map(s => (
                  <div key={s.id} className="card" style={{padding:12}}>
                    <div style={{fontWeight:700}}>{s.title} <span className="muted" style={{fontWeight:500}}>• {s.category}</span></div>
                    <div className="muted">{s.description || "—"}</div>
                    <div className="muted" style={{marginTop:6}}>
                      {s.price_from ? `$${s.price_from}` : "Precio a convenir"} {s.price_unit ? `/${s.price_unit}` : ""}
                    </div>
                  </div>
                ))}
                {(provider.services || []).length === 0 && <div className="muted">Sin servicios cargados.</div>}
              </div>
            </div>

            <div className="card" style={{padding:16, marginTop:12}}>
              <div style={{fontWeight:800, marginBottom:8}}>Reseñas</div>
              <div style={{display:"grid", gap:10}}>
                {reviews.map(r => (
                  <div key={r.id} className="card" style={{padding:12}}>
                    <div style={{fontWeight:700}}>⭐ {r.rating} <span className="muted" style={{fontWeight:500}}>por {r.from_name}</span></div>
                    <div style={{marginTop:6}}>{r.comment || <span className="muted">Sin comentario</span>}</div>
                  </div>
                ))}
                {reviews.length === 0 && <div className="muted">Todavía no hay reseñas visibles.</div>}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
