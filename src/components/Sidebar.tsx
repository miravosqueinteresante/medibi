export default function Sidebar() {
  return (
    <div style={{
      width: '180px', minWidth: '180px', background: 'var(--color-bg)',
      borderRight: '0.5px solid #e0e0e0', display: 'flex',
      flexDirection: 'column', height: '100vh', position: 'fixed',
      left: 0, top: 0
    }}>
      <div style={{ padding: '16px 14px 12px', borderBottom: '0.5px solid #e0e0e0' }}>
        <div style={{ fontSize: '15px', fontWeight: 500 }}>MediBI</div>
        <div style={{ fontSize: '11px', color: '#888', marginTop: '2px' }}>Inteligencia médica</div>
      </div>

      <nav style={{ padding: '12px 8px' }}>
        <div style={{ fontSize: '10px', color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0 8px', marginBottom: '6px' }}>Principal</div>
        {[
          { label: 'Dashboard', active: true },
          { label: 'Pacientes', active: false },
          { label: 'Nueva cirugía', active: false },
          { label: 'Análisis', active: false },
        ].map((item) => (
          <div key={item.label} style={{
            padding: '7px 10px', borderRadius: '6px', fontSize: '12px',
            marginBottom: '2px', cursor: 'pointer',
            background: item.active ? '#E6F1FB' : 'transparent',
            color: item.active ? '#185FA5' : '#666',
            fontWeight: item.active ? 500 : 400,
          }}>
            {item.label}
          </div>
        ))}
      </nav>

      <div style={{ margin: 'auto 8px 14px', padding: '10px', background: '#f5f5f5', borderRadius: '10px' }}>
        <div style={{
          width: '28px', height: '28px', borderRadius: '50%', background: '#E6F1FB',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '10px', fontWeight: 500, color: '#185FA5', marginBottom: '6px'
        }}>DM</div>
        <div style={{ fontSize: '11px', fontWeight: 500 }}>Dra. Diana Melgarejo</div>
        <div style={{ fontSize: '10px', color: '#888' }}>Oftalmología · CPC</div>
      </div>
    </div>
  )
}