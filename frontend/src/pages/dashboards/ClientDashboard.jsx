import Navbar from "../../components/Navbar.jsx";

export default function ClientDashboard(){
  return (
    <>
      <Navbar />
      <div className="container">
        <h2>Inicio Cliente</h2>
        <div className="card" style={{padding:16}}>
          <p className="muted" style={{marginTop:0}}>
            Descubrí prestadores, pedí contacto y chateá desde Zerbis.
          </p>
          <div className="row">
            <a className="btn secondary" href="/client/discover">Descubrir prestadores</a>
            <a className="btn" href="/client/conversations">Mis chats</a>
          </div>
        </div>
      </div>
    </>
  );
}
