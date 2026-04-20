import React from 'https://esm.sh/react@18.3.1'
import htm from 'https://esm.sh/htm@3.1.1'

const html = htm.bind(React.createElement)

const barriosCaba = [
  'Agronomía', 'Almagro', 'Balvanera', 'Barracas', 'Belgrano', 'Boedo', 'Caballito',
  'Chacarita', 'Coghlan', 'Colegiales', 'Constitución', 'Flores', 'Floresta', 'La Boca',
  'La Paternal', 'Liniers', 'Mataderos', 'Monte Castro', 'Monserrat', 'Nueva Pompeya',
  'Núñez', 'Palermo', 'Parque Avellaneda', 'Parque Chacabuco', 'Parque Chas', 'Parque Patricios',
  'Puerto Madero', 'Recoleta', 'Retiro', 'Saavedra', 'San Cristóbal', 'San Nicolás',
  'San Telmo', 'Vélez Sarsfield', 'Versalles', 'Villa Crespo', 'Villa del Parque',
  'Villa Devoto', 'Villa General Mitre', 'Villa Lugano', 'Villa Luro', 'Villa Ortúzar',
  'Villa Pueyrredón', 'Villa Real', 'Villa Riachuelo', 'Villa Santa Rita', 'Villa Soldati',
  'Villa Urquiza',
]

const rubros = ['Plomería', 'Electricidad', 'Pintura', 'Limpieza', 'Carpintería', 'Mudanzas']

const prestadoresMock = [
  {
    id: 1,
    nombreCompleto: 'Lucía Gómez',
    rubro: 'Plomería',
    barrio: 'Palermo',
    telefono: '11-5555-1122',
    referencias: 'Trabajó en 3 edificios de la zona durante 5 años.',
    reseniasPublicas: [
      { autor: 'Matías R.', texto: 'Llegó puntual y resolvió todo en una visita.', puntaje: 5 },
      { autor: 'Delfina M.', texto: 'Muy prolija y clara al explicar el arreglo.', puntaje: 4 },
    ],
    reseniasPrivadasPrestadores: [
      { autor: 'Juan P. (cliente)', texto: 'Le costó coordinar horario al principio.' },
    ],
  },
  {
    id: 2,
    nombreCompleto: 'Carlos Benítez',
    rubro: 'Electricidad',
    barrio: 'Caballito',
    telefono: '11-4444-8910',
    referencias: '',
    reseniasPublicas: [
      { autor: 'Sofía T.', texto: 'Excelente trabajo con una instalación compleja.', puntaje: 5 },
    ],
    reseniasPrivadasPrestadores: [
      { autor: 'Romina A. (cliente)', texto: 'Solicitó seña para materiales con anticipación.' },
    ],
  },
]

const initialForm = {
  rol: 'contratante', nombre: '', apellido: '', dni: '', telefono: '', referencias: '',
}

export function App() {
  const [filtroBarrio, setFiltroBarrio] = React.useState('Todos')
  const [filtroRubro, setFiltroRubro] = React.useState('Todos')
  const [registro, setRegistro] = React.useState(initialForm)

  const prestadoresFiltrados = React.useMemo(() => prestadoresMock.filter((p) => {
    const cumpleBarrio = filtroBarrio === 'Todos' || p.barrio === filtroBarrio
    const cumpleRubro = filtroRubro === 'Todos' || p.rubro === filtroRubro
    return cumpleBarrio && cumpleRubro
  }), [filtroBarrio, filtroRubro])

  const onChange = (event) => setRegistro((prev) => ({ ...prev, [event.target.name]: event.target.value }))

  const onSubmit = (event) => {
    event.preventDefault()
    alert('Mock de registro enviado. En producción se guardaría en base de datos.')
    setRegistro(initialForm)
  }

  return html`
    <div className="page">
      <header className="hero">
        <h1>Zerbis</h1>
        <p>Páginas amarillas digitales para conectar clientes y prestadores en CABA.</p>
      </header>

      <section className="card">
        <h2>Registrate en Zerbis</h2>
        <p>Contratantes y prestadores usan los mismos datos básicos. Las referencias son opcionales para prestadores.</p>
        <form className="form-grid" onSubmit=${onSubmit}>
          <label>Rol
            <select name="rol" value=${registro.rol} onChange=${onChange}>
              <option value="contratante">Quiero contratar</option>
              <option value="prestador">Soy prestador</option>
            </select>
          </label>
          <label>Nombre<input required name="nombre" value=${registro.nombre} onChange=${onChange} /></label>
          <label>Apellido<input required name="apellido" value=${registro.apellido} onChange=${onChange} /></label>
          <label>DNI<input required name="dni" value=${registro.dni} onChange=${onChange} /></label>
          <label>Teléfono<input required name="telefono" value=${registro.telefono} onChange=${onChange} /></label>
          ${registro.rol === 'prestador' && html`<label className="full-width">Referencias (opcional)
            <textarea name="referencias" value=${registro.referencias} onChange=${onChange}></textarea>
          </label>`}
          <button type="submit">Crear cuenta</button>
        </form>
      </section>

      <section className="card">
        <h2>Buscar prestadores en CABA</h2>
        <div className="filters">
          <label>Barrio
            <select value=${filtroBarrio} onChange=${(e) => setFiltroBarrio(e.target.value)}>
              <option>Todos</option>
              ${barriosCaba.map((barrio) => html`<option key=${barrio}>${barrio}</option>`) }
            </select>
          </label>
          <label>Rubro
            <select value=${filtroRubro} onChange=${(e) => setFiltroRubro(e.target.value)}>
              <option>Todos</option>
              ${rubros.map((rubro) => html`<option key=${rubro}>${rubro}</option>`) }
            </select>
          </label>
        </div>

        <div className="grid">
          ${prestadoresFiltrados.map((prestador) => html`
            <article key=${prestador.id} className="provider-card">
              <h3>${prestador.nombreCompleto}</h3>
              <p><strong>Rubro:</strong> ${prestador.rubro}</p>
              <p><strong>Barrio:</strong> ${prestador.barrio}</p>
              <p><strong>Teléfono:</strong> ${prestador.telefono}</p>
              <p><strong>Referencias:</strong> ${prestador.referencias || 'Sin referencias cargadas'}</p>
              <h4>Reseñas públicas</h4>
              <ul>
                ${prestador.reseniasPublicas.map((r, i) => html`<li key=${i}><strong>${r.autor}</strong> (${r.puntaje}/5): ${r.texto}</li>`)}
              </ul>
              <h4>Reseñas privadas (solo prestadores)</h4>
              ${prestador.reseniasPrivadasPrestadores.length > 0
                ? html`<ul>${prestador.reseniasPrivadasPrestadores.map((r, i) => html`<li key=${i}><strong>${r.autor}</strong>: ${r.texto}</li>`)}</ul>`
                : html`<p>No hay reseñas privadas todavía.</p>`}
            </article>
          `)}
        </div>
      </section>
    </div>
  `
}
