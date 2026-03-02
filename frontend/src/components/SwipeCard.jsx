export default function SwipeCard({ provider, onLike, onSkip }) {
  return (
    <div className="card" style={{padding:16, minHeight:320}}>
      <div className="row" style={{alignItems:"center"}}>
        <div style={{
          width:56,height:56,borderRadius:14,
          background:"rgba(255,255,255,.08)",
          border:"1px solid var(--stroke)"
        }}/>
        <div>
          <div style={{fontSize:18, fontWeight:700}}>{provider.full_name}</div>
          <div className="muted">{provider.city || "—"} • ⭐ {provider.avg_rating}</div>
        </div>
      </div>

      <div style={{marginTop:12, fontWeight:600}}>{provider.headline || "Prestador"}</div>
      <p className="muted" style={{marginBottom:0}}>{provider.bio || "Sin descripción."}</p>

      <div className="row" style={{marginTop:14}}>
        <button className="btn" type="button" onClick={onSkip} style={{background:"rgba(255,255,255,.10)"}}>
          Pasar
        </button>
        <button className="btn secondary" type="button" onClick={onLike}>
          Contactar
        </button>
      </div>
    </div>
  );
}