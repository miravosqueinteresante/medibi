interface Props {
    cirugia: any
    onVolver: () => void
    onEditar: () => void
  }
  
  export default function DetallePaciente({ cirugia, onVolver, onEditar }: Props) {
    const campo = (label: string, valor: string) => valor ? (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
        <span style={{ fontSize: '11px', color: '#888' }}>{label}</span>
        <span style={{ fontSize: '13px', color: '#333' }}>{valor}</span>
      </div>
    ) : null
  
    const seccion = (titulo: string, color: string, children: any) => (
      <div style={{ background: '#fff', border: '0.5px solid #e0e0e0', borderRadius: '10px', padding: '14px 16px' }}>
        <div style={{ fontSize: '12px', fontWeight: 500, marginBottom: '12px', paddingBottom: '9px', borderBottom: '0.5px solid #e0e0e0', display: 'flex', alignItems: 'center', gap: '7px' }}>
          <div style={{ width: '18px', height: '18px', borderRadius: '4px', background: color }} />
          {titulo}
        </div>
        {children}
      </div>
    )
  
    const grid2 = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }
    const grid3 = { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }
  
    return (
      <div style={{ padding: '16px 20px 30px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
  
        {/* Header del paciente */}
        <div style={{ background: '#fff', border: '0.5px solid #e0e0e0', borderRadius: '10px', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#E6F1FB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 500, color: '#185FA5', flexShrink: 0 }}>
              {cirugia.nombre?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 500, color: '#333' }}>{cirugia.nombre}</div>
              <div style={{ fontSize: '12px', color: '#888', marginTop: '2px' }}>
                CI {cirugia.ci || '—'} · {cirugia.edad ? `${cirugia.edad} años` : 'Edad no registrada'} · {cirugia.telefono || 'Sin teléfono'}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={onVolver} style={{ fontSize: '12px', padding: '7px 14px', background: '#fff', border: '0.5px solid #ddd', borderRadius: '6px', cursor: 'pointer', color: '#666' }}>← Volver</button>
            <button onClick={onEditar} style={{ fontSize: '12px', padding: '7px 14px', background: '#185FA5', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 500 }}>✏️ Editar</button>
          </div>
        </div>
  
        {/* Fila 1: Diagnóstico + Fechas */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          {seccion('Diagnóstico', '#FAEEDA', (
            <div style={{ display: 'grid', gap: '12px' }}>
              {campo('Dx principal', cirugia.diagnostico)}
              {campo('Dx clínico', cirugia.diagnostico_clinico)}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                <span style={{ fontSize: '11px', color: '#888' }}>Ev. Cl.</span>
                <span style={{
                  display: 'inline-block', fontSize: '11px', padding: '3px 10px',
                  borderRadius: '20px', width: 'fit-content',
                  background: cirugia.ev_cl === 'Ok' ? '#E1F5EE' : '#FAEEDA',
                  color: cirugia.ev_cl === 'Ok' ? '#0F6E56' : '#854F0B'
                }}>{cirugia.ev_cl || '—'}</span>
              </div>
            </div>
          ))}
          {seccion('Fechas', '#E1F5EE', (
            <div style={{ display: 'grid', gap: '12px' }}>
              {campo('Fecha de consulta (FC)', cirugia.fecha_consulta ? new Date(cirugia.fecha_consulta).toLocaleDateString('es-PY') : '')}
              {campo('Fecha de cirugía (F.Cx)', cirugia.fecha_cirugia ? new Date(cirugia.fecha_cirugia).toLocaleDateString('es-PY') : '')}
              {campo('Horario', cirugia.horario)}
            </div>
          ))}
        </div>
  
        {/* Fila 2: Derivación + Seguro */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          {seccion('Derivación', '#FBEAF0', (
            <div style={grid3}>
              {campo('Remitido por', cirugia.remitido_por)}
              {campo('Profesión', cirugia.profesion_derivante)}
              {campo('N° de registro', cirugia.nro_registro_derivante)}
            </div>
          ))}
          {seccion('Seguro médico', '#EAF3DE', (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingTop: '4px' }}>
              <span style={{
                fontSize: '16px', fontWeight: 500, padding: '6px 16px',
                background: '#E6F1FB', color: '#185FA5', borderRadius: '8px'
              }}>{cirugia.seguro || '—'}</span>
              <span style={{ fontSize: '12px', color: '#888' }}>Lugar: {cirugia.lugar || '—'}</span>
            </div>
          ))}
        </div>
  
        {/* Fila 3: Técnicas */}
        {seccion('Cirugía', '#EEEDFE', (
          <div style={grid2}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
              <span style={{ fontSize: '11px', color: '#888' }}>Técnica pre-op (planificada)</span>
              <span style={{ fontSize: '13px', color: '#333', lineHeight: 1.6 }}>{cirugia.tecnica_preop || '—'}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
              <span style={{ fontSize: '11px', color: '#888' }}>Técnica realizada</span>
              <span style={{ fontSize: '13px', color: '#333', lineHeight: 1.6 }}>{cirugia.tecnica_realizada || '—'}</span>
            </div>
          </div>
        ))}
  
        {/* Fila 4: Post-operatorio */}
        {seccion('Post-operatorio', '#EAF3DE', (
          <div style={grid2}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
              <span style={{ fontSize: '11px', color: '#888' }}>Medicación post-op</span>
              <span style={{ fontSize: '13px', color: '#333', lineHeight: 1.6 }}>{cirugia.medicacion_postop || '—'}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
              <span style={{ fontSize: '11px', color: '#888' }}>Notas y observaciones</span>
              <span style={{ fontSize: '13px', color: '#333', lineHeight: 1.6 }}>{cirugia.notas || '—'}</span>
            </div>
          </div>
        ))}
  
        {/* Fila 5: Fotos */}
        {seccion('Fotos de la cirugía', '#E6F1FB', (
          <div>
            {cirugia.fotos && cirugia.fotos.length > 0 ? (
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {cirugia.fotos.map((url: string, i: number) => (
                  <img key={i} src={url} alt={`Foto ${i + 1}`} style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '8px', border: '0.5px solid #e0e0e0', cursor: 'pointer' }} />
                ))}
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ fontSize: '12px', color: '#aaa' }}>No hay fotos cargadas para esta cirugía</div>
                <button style={{ fontSize: '12px', padding: '6px 12px', background: '#E6F1FB', color: '#185FA5', border: '0.5px solid #185FA5', borderRadius: '6px', cursor: 'pointer' }}>
                  + Agregar fotos
                </button>
              </div>
            )}
          </div>
        ))}
  
      </div>
    )
  }