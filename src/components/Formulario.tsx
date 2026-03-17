import { useState } from 'react'
import { supabase } from '../supabase'

interface Props {
  onVolver: () => void
  onGuardado: () => void
}

export default function Formulario({ onVolver, onGuardado }: Props) {
  const [form, setForm] = useState({
    nombre: '', ci: '', edad: '', telefono: '',
    fecha_consulta: '', fecha_cirugia: '',
    diagnostico: '', diagnostico_clinico: '', ev_cl: 'Ok',
    remitido_por: '', profesion_derivante: '', nro_registro_derivante: '',
    seguro: '', lugar: '', horario: '',
    tecnica_preop: '', tecnica_realizada: '',
    medicacion_postop: '', notas: ''
  })
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleGuardar = async () => {
    if (!form.nombre) { setError('El nombre es obligatorio'); return }
    setGuardando(true)
    setError('')
    const { error } = await supabase.from('cirugias').insert([form])
    if (error) {
      setError('Error al guardar. Intentá de nuevo.')
      setGuardando(false)
    } else {
      onGuardado()
    }
  }

  const input = (name: string, placeholder: string, type = 'text') => (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={(form as any)[name]}
      onChange={handleChange}
      style={{
        fontSize: '12px', padding: '7px 10px', width: '100%',
        border: '0.5px solid #ddd', borderRadius: '6px',
        background: '#fff', color: '#333', outline: 'none'
      }}
    />
  )

  const section = (title: string, color: string, children: any) => (
    <div style={{ background: '#fff', border: '0.5px solid #e0e0e0', borderRadius: '10px', padding: '14px 16px' }}>
      <div style={{ fontSize: '12px', fontWeight: 500, marginBottom: '12px', paddingBottom: '9px', borderBottom: '0.5px solid #e0e0e0', display: 'flex', alignItems: 'center', gap: '7px' }}>
        <div style={{ width: '18px', height: '18px', borderRadius: '4px', background: color }} />
        {title}
      </div>
      {children}
    </div>
  )

  const grid2 = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '9px' }
  const grid3 = { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '9px' }
  const label = (text: string) => <div style={{ fontSize: '11px', color: '#888', marginBottom: '3px' }}>{text}</div>

  return (
    <div style={{ padding: '16px 20px 30px', display: 'flex', flexDirection: 'column', gap: '10px' }}>

      {/* Fila 1: Identificación + Diagnóstico */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        {section('Identificación del paciente', '#E6F1FB', (
          <div style={{ display: 'grid', gap: '9px' }}>
            <div><div style={{ gridColumn: '1/-1' }}>{label('Nombre completo')}{input('nombre', 'Apellido y nombre')}</div></div>
            <div style={grid2}>
              <div>{label('CI')}{input('ci', 'Ej: 1.234.567')}</div>
              <div>{label('Edad')}{input('edad', 'Años', 'number')}</div>
            </div>
            <div>{label('Teléfono')}{input('telefono', 'Ej: 0981-123-456')}</div>
          </div>
        ))}
        {section('Diagnóstico', '#FAEEDA', (
          <div style={{ display: 'grid', gap: '9px' }}>
            <div>{label('Dx principal')}{input('diagnostico', 'Ej: Pterigión OI')}</div>
            <div>{label('Dx clínico')}{input('diagnostico_clinico', 'Diagnóstico clínico complementario')}</div>
            <div>
              {label('Ev. Cl.')}
              <div style={{ display: 'flex', gap: '6px' }}>
                {['Ok', 'Autorizó', 'Pendiente'].map(op => (
                  <div key={op} onClick={() => setForm({ ...form, ev_cl: op })} style={{
                    fontSize: '12px', padding: '5px 10px', borderRadius: '20px', cursor: 'pointer',
                    border: `0.5px solid ${form.ev_cl === op ? '#185FA5' : '#ddd'}`,
                    background: form.ev_cl === op ? '#E6F1FB' : '#fff',
                    color: form.ev_cl === op ? '#185FA5' : '#666'
                  }}>{op}</div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Fila 2: Fechas + Seguro + Derivación */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
        {section('Fechas', '#E1F5EE', (
          <div style={{ display: 'grid', gap: '9px' }}>
            <div>{label('Fecha de consulta (FC)')}{input('fecha_consulta', '', 'date')}</div>
            <div>{label('Fecha de cirugía (F.Cx)')}{input('fecha_cirugia', '', 'date')}</div>
          </div>
        ))}
        {section('Seguro médico', '#EAF3DE', (
          <div style={{ display: 'grid', gap: '9px' }}>
            <div>
              {label('Seguro')}
              <select name="seguro" value={form.seguro} onChange={handleChange} style={{ fontSize: '12px', padding: '7px 10px', width: '100%', border: '0.5px solid #ddd', borderRadius: '6px', background: '#fff', color: '#333', outline: 'none' }}>
                <option value="">Seleccionar...</option>
                <option>IPS</option>
                <option>Asism</option>
                <option>Sancord</option>
                <option>Particular</option>
                <option>Otro</option>
              </select>
            </div>
          </div>
        ))}
        {section('Derivación', '#FBEAF0', (
          <div style={{ display: 'grid', gap: '9px' }}>
            <div>{label('Remitido por')}{input('remitido_por', 'Nombre del profesional')}</div>
            <div>{label('Profesión')}{input('profesion_derivante', 'Ej: Clínico')}</div>
            <div>{label('N° de registro')}{input('nro_registro_derivante', 'Matrícula')}</div>
          </div>
        ))}
      </div>

      {/* Fila 3: Cirugía */}
      {section('Cirugía', '#EEEDFE', (
        <div style={{ display: 'grid', gap: '9px' }}>
          <div style={grid3}>
            <div>
              {label('Lugar')}
              <select name="lugar" value={form.lugar} onChange={handleChange} style={{ fontSize: '12px', padding: '7px 10px', width: '100%', border: '0.5px solid #ddd', borderRadius: '6px', background: '#fff', color: '#333', outline: 'none' }}>
                <option value="">Seleccionar...</option>
                <option>CMLC</option>
                <option>CMUC</option>
                <option>Clínica propia</option>
                <option>S. Juárez</option>
                <option>Caue</option>
                <option>Otro</option>
              </select>
            </div>
            <div>{label('Horario (hs)')}{input('horario', '', 'time')}</div>
            <div />
          </div>
          <div style={grid2}>
            <div>{label('Técnica pre-op (planificada)')}<textarea name="tecnica_preop" placeholder="Describí la técnica planificada..." value={form.tecnica_preop} onChange={handleChange} style={{ fontSize: '12px', padding: '7px 10px', width: '100%', border: '0.5px solid #ddd', borderRadius: '6px', background: '#fff', color: '#333', outline: 'none', resize: 'vertical', minHeight: '68px', lineHeight: 1.5 }} /></div>
            <div>{label('Técnica realizada')}<textarea name="tecnica_realizada" placeholder="Describí la técnica realizada..." value={form.tecnica_realizada} onChange={handleChange} style={{ fontSize: '12px', padding: '7px 10px', width: '100%', border: '0.5px solid #ddd', borderRadius: '6px', background: '#fff', color: '#333', outline: 'none', resize: 'vertical', minHeight: '68px', lineHeight: 1.5 }} /></div>
          </div>
        </div>
      ))}

      {/* Fila 4: Post-operatorio */}
      {section('Post-operatorio', '#EAF3DE', (
        <div style={grid2}>
          <div>{label('Medicación post-op')}<textarea name="medicacion_postop" placeholder="Ej: Timolol + Cladyp + Isa..." value={form.medicacion_postop} onChange={handleChange} style={{ fontSize: '12px', padding: '7px 10px', width: '100%', border: '0.5px solid #ddd', borderRadius: '6px', background: '#fff', color: '#333', outline: 'none', resize: 'vertical', minHeight: '68px', lineHeight: 1.5 }} /></div>
          <div>{label('Notas y observaciones')}<textarea name="notas" placeholder="Cualquier detalle adicional..." value={form.notas} onChange={handleChange} style={{ fontSize: '12px', padding: '7px 10px', width: '100%', border: '0.5px solid #ddd', borderRadius: '6px', background: '#fff', color: '#333', outline: 'none', resize: 'vertical', minHeight: '68px', lineHeight: 1.5 }} /></div>
        </div>
      ))}

      {/* Error y botones */}
      {error && <div style={{ fontSize: '12px', color: '#E24B4A', padding: '8px 12px', background: '#FCEBEB', borderRadius: '6px' }}>{error}</div>}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
        <button onClick={onVolver} style={{ fontSize: '12px', padding: '8px 16px', background: '#fff', border: '0.5px solid #ddd', borderRadius: '6px', cursor: 'pointer', color: '#666' }}>Cancelar</button>
        <button onClick={handleGuardar} disabled={guardando} style={{ fontSize: '12px', padding: '8px 16px', background: '#185FA5', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 500 }}>
          {guardando ? 'Guardando...' : 'Guardar registro'}
        </button>
      </div>

    </div>
  )
}