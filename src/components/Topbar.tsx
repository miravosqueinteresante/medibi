interface Props {
  titulo: string
  subtitulo: string
  onNuevaCirugia: () => void
  mostrarBotonNueva: boolean
}

export default function Topbar({ titulo, subtitulo, onNuevaCirugia, mostrarBotonNueva }: Props) {
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
        <div style={{ fontSize: '14px', fontWeight: 500 }}>{titulo}</div>
        <div style={{ fontSize: '11px', color: '#888', marginTop: '1px' }}>{subtitulo}</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {mostrarBotonNueva && (
          <button
            onClick={onNuevaCirugia}
            style={{
              fontSize: '12px', padding: '7px 14px',
              background: '#185FA5', color: '#fff',
              border: 'none', borderRadius: '6px',
              cursor: 'pointer', fontWeight: 500,
              display: 'flex', alignItems: 'center', gap: '5px'
            }}
          >
            + Nueva cirugía
          </button>
        )}
        <div style={{
          fontSize: '11px', padding: '4px 10px',
          background: '#f5f5f5', border: '0.5px solid #e0e0e0',
          borderRadius: '6px', color: '#666',
        }}>
          Año 2020
        </div>
      </div>
    </div>
  )
}