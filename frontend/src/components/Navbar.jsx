import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { http } from "../api/http.js";

function Badge({ count }) {
  if (!count) return null;
  return (
    <span style={{
      position: "absolute", top: -6, right: -6,
      background: "var(--danger)", color: "#fff",
      fontSize: 10, fontWeight: 800, lineHeight: 1,
      padding: "3px 5px", borderRadius: 999,
      minWidth: 16, textAlign: "center",
    }}>
      {count > 9 ? "9+" : count}
    </span>
  );
}

export default function Navbar() {
  const { role, token, logout } = useAuth();
  const nav = useNavigate();
  const { pathname } = useLocation();
  const [unread, setUnread] = useState(0);

  // Polling de mensajes no leídos cada 30 segundos
  useEffect(() => {
    if (!token || role === "admin") return;

    function fetchUnread() {
      http("/conversations/unread-count", { token })
        .then(data => setUnread(data.count))
        .catch(() => {});
    }

    fetchUnread();
    const interval = setInterval(fetchUnread, 30_000);
    return () => clearInterval(interval);
  }, [token, role]);

  // Al entrar a Chats, limpiar el badge
  useEffect(() => {
    if (pathname.includes("/conversations")) setUnread(0);
  }, [pathname]);

  const links = [];
  if (role === "client") {
    links.push(["/client", "Inicio", false]);
    links.push(["/client/conversations", "Chats", true]);
  }
  if (role === "provider") {
    links.push(["/provider", "Inicio", false]);
    links.push(["/provider/requests", "Pedidos", false]);
    links.push(["/provider/conversations", "Chats", true]);
  }
  if (role === "admin") {
    links.push(["/admin", "Panel", false]);
    links.push(["/admin/users", "Usuarios", false]);
    links.push(["/admin/reviews", "Reseñas", false]);
  }

  return (
    <div style={{
      position:"sticky", top:0, zIndex:20,
      backdropFilter:"blur(14px)",
      background:"rgba(244,248,247,.84)",
      borderBottom:"1px solid var(--stroke)"
    }}>
      <div className="container" style={{display:"flex", alignItems:"center", justifyContent:"space-between", gap:16, flexWrap:"wrap", padding:"12px 0"}}>
        <Link to="/" style={{display:"flex", alignItems:"center", gap:10}}>
          <div style={{
            width:34, height:34, borderRadius:12,
            background:"linear-gradient(135deg, var(--primary), var(--accent))",
            boxShadow:"0 10px 24px rgba(31,111,120,.22)"
          }}/>
          <div>
            <div style={{fontWeight:800, lineHeight:1}}>Zerbis</div>
            <div className="muted" style={{fontSize:12}}>match de servicios</div>
          </div>
        </Link>

        <div style={{display:"flex", gap:8, alignItems:"center", flexWrap:"wrap"}}>
          {links.map(([to, label, isChats]) => {
            const isActive = pathname === to || (to !== "/client" && to !== "/provider" && to !== "/admin" && pathname.startsWith(to));
            return (
              <Link
                key={to}
                to={to}
                style={{
                  position: "relative",
                  padding:"8px 14px",
                  borderRadius:14,
                  background: isActive ? "var(--primary)" : "rgba(255,255,255,.5)",
                  border: isActive ? "1px solid transparent" : "1px solid rgba(23,49,59,.06)",
                  fontWeight:600,
                  color: isActive ? "#f4fbfb" : "var(--muted)",
                  transition:"background .15s, color .15s",
                }}
              >
                {label}
                {isChats && <Badge count={unread} />}
              </Link>
            );
          })}
          <button
            className="btn"
            type="button"
            style={{background:"rgba(23,49,59,.08)", color:"var(--text)", boxShadow:"none"}}
            onClick={() => { logout(); nav("/login", { replace:true }); }}
          >
            Salir
          </button>
        </div>
      </div>
    </div>
  );
}
