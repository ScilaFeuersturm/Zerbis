const palette = {
  primaryBlue: '#2A7BDE',
  deepViolet: '#4C2ADE',
  cobalt: '#2A42DE',
  aqua: '#2AB4DE',
  purple: '#872ADE',
  softLavender: '#A2AAE1'
};

export default function App() {
  return (
    <main className="login-page">
      <section className="login-card" aria-label="Inicio de sesión Zerbis">
        <header className="login-header">
          <span className="brand-pill">ZERBIS</span>
          <h1>Bienvenido de vuelta</h1>
          <p>Ingresa a tu espacio de trabajo de forma segura.</p>
        </header>

        <form className="login-form" onSubmit={(event) => event.preventDefault()}>
          <label htmlFor="email">Correo electrónico</label>
          <input id="email" type="email" placeholder="nombre@empresa.com" required />

          <label htmlFor="password">Contraseña</label>
          <input id="password" type="password" placeholder="••••••••" required />

          <button type="submit">Iniciar sesión</button>
        </form>

        <footer className="login-footer">
          <a href="#">¿Olvidaste tu contraseña?</a>
          <a href="#">Solicitar acceso</a>
        </footer>
      </section>

      <aside className="decorative-panel" aria-hidden="true">
        <div className="gradient-orb" />
        <div className="palette-row">
          {Object.values(palette).map((color) => (
            <div key={color} className="palette-swatch" style={{ '--swatch-color': color }}>
              <span>{color}</span>
            </div>
          ))}
        </div>
      </aside>
    </main>
  );
}
