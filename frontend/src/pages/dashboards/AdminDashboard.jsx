import Navbar from "../../components/Navbar.jsx";

export default function AdminDashboard(){
  return (
    <>
      <Navbar />
      <div className="container">
        <h2>Panel Admin</h2>
        <div className="card" style={{padding:16}}>
          <p className="muted" style={{marginTop:0}}>
            Desde acá podés dar de alta/baja usuarios y moderar reseñas.
          </p>
          <div className="row">
            <a className="btn" href="/admin/users">Gestionar usuarios</a>
            <a className="btn secondary" href="/admin/reviews">Moderar reseñas</a>
          </div>
        </div>
      </div>
    </>
  );
}
