import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar.jsx";

export default function ProviderDashboard(){
  return (
    <>
      <Navbar />
      <div className="container">
        <h2>Inicio Prestador</h2>
        <div className="card" style={{padding:16}}>
          <p className="muted" style={{marginTop:0}}>
            Revisá pedidos entrantes y respondé por mensajería interna.
          </p>
          <div className="row">
            <Link className="btn secondary" to="/provider/requests">Ver pedidos</Link>
            <Link className="btn" to="/provider/conversations">Chats</Link>
          </div>
        </div>
      </div>
    </>
  );
}
