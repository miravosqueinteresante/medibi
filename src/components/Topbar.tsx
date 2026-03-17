export default function Topbar() {
  return (
    <div style={{
      background: '#fff',
      borderBottom: '0.5px solid #e0e0e0',
      padding: '12px 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 10,
    }}>
      <div>
        <div style={{ fontSize: '14px', fontWeight: 500 }}>Dashboard</div>
        <div style={{ fontSize: '11px', color: '#888', marginTop: '1px' }}>
          Resumen de actividad quirúrgica
        </div>
      </div>
      <div style={{
        fontSize: '11px',
        padding: '4px 10px',
        background: '#f5f5f5',
        border: '0.5px solid #e0e0e0',
        borderRadius: '6px',
        color: '#666',
      }}>
        Año 2020
      </div>
    </div>
  )
}