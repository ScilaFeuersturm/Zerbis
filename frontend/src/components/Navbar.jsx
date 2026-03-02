import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { role, logout } = useAuth();
  const nav = useNavigate();

  const links = [];
  if (role === "client") {
    links.push(["/client", "Inicio"]);
    links.push(["/client/discover", "Descubrir"]);
    links.push(["/client/conversations", "Chats"]);
  }
  if (role === "provider") {
    links.push(["/provider", "Inicio"]);
    links.push(["/provider/requests", "Pedidos"]);
    links.push(["/provider/conversations", "Chats"]);
  }
  if (role === "admin") {
    links.push(["/admin", "Panel"]);
    links.push(["/admin/users", "Usuarios"]);
    links.push(["/admin/reviews", "Reseñas"]);
  }

  return (
    <div style={{
      position:"sticky", top:0, zIndex:20,
      backdropFilter:"blur(10px)",
      background:"rgba(11,18,32,.65)",
      borderBottom:"1px solid var(--stroke)"
    }}>
      <div className="container" style={{display:"flex", alignItems:"center", justifyContent:"space-between"}}>
        <Link to="/" style={{display:"flex", alignItems:"center", gap:10}}>
          <div style={{
            width:34, height:34, borderRadius:12,
            background:"linear-gradient(135deg, rgba(124,92,255,.95), rgba(46,229,157,.85))"
          }}/>
          <div>
            <div style={{fontWeight:800, lineHeight:1}}>Zerbis</div>
            <div className="muted" style={{fontSize:12}}>match de servicios</div>
          </div>
        </Link>

        <div style={{display:"flex", gap:12, alignItems:"center"}}>
          {links.map(([to,label]) => (
            <Link key={to} to={to} className="muted" style={{padding:"8px 10px", borderRadius:12}}>
              {label}
            </Link>
          ))}
          <button
            className="btn"
            type="button"
            style={{background:"rgba(255,255,255,.10)"}}
            onClick={() => { logout(); nav("/login", { replace:true }); }}
          >
            Salir
          </button>
        </div>
      </div>
    </div>
  );
}
