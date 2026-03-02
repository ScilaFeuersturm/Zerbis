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
            <a className="btn secondary" href="/provider/requests">Ver pedidos</a>
            <a className="btn" href="/provider/conversations">Chats</a>
          </div>
        </div>
      </div>
    </>
  );
}
