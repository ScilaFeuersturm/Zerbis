export default function SearchBar({ value, onChange, placeholder = "Buscar..." }) {
  return (
    <div className="card" style={{padding:12}}>
      <input
        className="input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}
