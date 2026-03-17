import { useEffect, useState } from 'react'
import { supabase } from '../supabase'

interface Props {
  onNuevaCirugia: () => void
  onVerPaciente: (cirugia: any) => void
}

const BADGES: Record<string, string> = {
  'Pterigión': '#E6F1FB',
  'Chalazión': '#E1F5EE',
  'Catarata': '#FAEEDA',
  'Dermatocalasia': '#EEEDFE',
  'Tumor': '#FBEAF0',
  'VV': '#FAEEDA',
  'Escleromolastia': '#FBEAF0',
  'TCCO': '#E6F1FB',
  'Mima': '#EAF3DE',
}

const BADGE_TEXT: Record<string, string> = {
  'Pterigión': '#185FA5',
  'Chalazión': '#0F6E56',
  'Catarata': '#854F0B',
  'Dermatocalasia': '#534AB7',
  'Tumor': '#993556',
  'VV': '#854F0B',
  'Escleromolastia': '#993556',
  'TCCO': '#185FA5',
  'Mima': '#3B6D11',
}

function getBadgeColor(dx: string) {
  const key = Object.keys(BADGES).find(k => dx?.startsWith(k))
  return key ? { bg: BADGES[key], text: BADGE_TEXT[key] } : { bg: '#f0f0f0', text: '#666' }
}

export default function Historial({ onNuevaCirugia, onVerPaciente }: Props) {
  const [cirugias, setCirugias] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [filtroDx, setFiltroDx] = useState('')
  const [filtroSeguro, setFiltroSeguro] = useState('')
  const [filtroLugar, setFiltroLugar] = useState('')
  const [filtroMes, setFiltroMes] = useState('')
  const [pagina, setPagina] = useState(1)
  const POR_PAGINA = 8

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase.from('cirugias').select('*').order('fecha_cirugia', { ascending: false })
      if (data) setCirugias(data)
      setLoading(false)
    }
    fetch()
  }, [])

  const filtrados = cirugias.filter(c => {
    const matchBusqueda = !busqueda || c.nombre?.toLowerCase().includes(busqueda.toLowerCase())
    const matchDx = !filtroDx || c.diagnostico?.toLowerCase().includes(filtroDx.toLowerCase())
    const matchSeguro = !filtroSeguro || c.seguro === filtroSeguro
    const matchLugar = !filtroLugar || c.lugar === filtroLugar
    const matchMes = !filtroMes || c.fecha_cirugia?.startsWith(`2020-${filtroMes}`)
    return matchBusqueda && matchDx && matchSeguro && matchLugar && matchMes
  })

  const totalPaginas = Math.ceil(filtrados.length / POR_PAGINA)
  const paginados = filtrados.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA)

  const seguros = [...new Set(cirugias.map(c => c.seguro).filter(Boolean))]
  const lugares = [...new Set(cirugias.map(c => c.lugar).filter(Boolean))]

  const limpiarFiltros = () => {
    setBusqueda('')
    setFiltroDx('')
    setFiltroSeguro('')
    setFiltroLugar('')
    setFiltroMes('')
    setPagina(1)
  }

  const select = (value: string, onChange: (v: string) => void, options: string[], placeholder: string) => (
    <select value={value} onChange={e => { onChange(e.target.value); setPagina(1) }} style={{
      fontSize: '11px', padding: '5px 8px', border: `0.5px solid ${value ? '#185FA5' : '#ddd'}`,
      borderRadius: '6px', background: value ? '#E6F1FB' : '#fff',
      color: value ? '#185FA5' : '#666', outline: 'none', cursor: 'pointer'
    }}>
      <option value="">{placeholder}</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  )

  if (loading) return <div style={{ padding: '40px', textAlign: 'center', color: '#888' }}>Cargando...</div>

  return (
    <div style={{ padding: '16px 20px 30px', display: 'flex', flexDirection: 'column', gap: '12px' }}>

      {/* Buscador y filtros */}
      <div style={{ background: '#fff', border: '0.5px solid #e0e0e0', borderRadius: '10px', padding: '12px 14px' }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '10px' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', fontSize: '13px', color: '#aaa' }}>🔍</span>
            <input
              type="text"
              placeholder="Buscar por nombre del paciente..."
              value={busqueda}
              onChange={e => { setBusqueda(e.target.value); setPagina(1) }}
              style={{
                width: '100%', fontSize: '12px', padding: '8px 10px 8px 30px',
                border: '0.5px solid #ddd', borderRadius: '6px',
                background: '#f5f5f5', outline: 'none', color: '#333'
              }}
            />
          </div>
          <span style={{ fontSize: '11px', color: '#888', whiteSpace: 'nowrap' }}>
            {filtrados.length} registros
          </span>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '11px', color: '#888' }}>Filtrar por:</span>
          {select(filtroMes, setFiltroMes, ['01','02','03','04','05','06','07','08','09','10','11','12'].map(m => m), 'Mes')}
          <input
            type="text"
            placeholder="Diagnóstico..."
            value={filtroDx}
            onChange={e => { setFiltroDx(e.target.value); setPagina(1) }}
            style={{
              fontSize: '11px', padding: '5px 8px', border: `0.5px solid ${filtroDx ? '#185FA5' : '#ddd'}`,
              borderRadius: '6px', background: filtroDx ? '#E6F1FB' : '#fff',
              color: filtroDx ? '#185FA5' : '#666', outline: 'none', width: '120px'
            }}
          />
          {select(filtroSeguro, setFiltroSeguro, seguros, 'Seguro')}
          {select(filtroLugar, setFiltroLugar, lugares, 'Lugar')}
          {(busqueda || filtroDx || filtroSeguro || filtroLugar || filtroMes) && (
            <button onClick={limpiarFiltros} style={{
              fontSize: '11px', padding: '5px 8px', border: '0.5px solid #ddd',
              borderRadius: '6px', background: '#fff', color: '#888', cursor: 'pointer', marginLeft: 'auto'
            }}>Limpiar filtros</button>
          )}
        </div>
      </div>

      {/* Lista */}
      <div style={{ background: '#fff', border: '0.5px solid #e0e0e0', borderRadius: '10px', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{
          display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1fr 70px',
          gap: '8px', padding: '9px 16px',
          background: '#f5f5f5', borderBottom: '0.5px solid #e0e0e0'
        }}>
          {['Paciente', 'Diagnóstico', 'Fecha cx', 'Seguro', 'Lugar', ''].map(h => (
            <span key={h} style={{ fontSize: '10px', color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</span>
          ))}
        </div>

        {/* Filas */}
        {paginados.length === 0 ? (
          <div style={{ padding: '30px', textAlign: 'center', color: '#888', fontSize: '12px' }}>
            No se encontraron registros
          </div>
        ) : paginados.map(c => {
          const badge = getBadgeColor(c.diagnostico)
          return (
            <div key={c.id} style={{
              display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1fr 70px',
              gap: '8px', padding: '11px 16px',
              borderBottom: '0.5px solid #f0f0f0', alignItems: 'center',
              cursor: 'pointer'
            }}
              onMouseEnter={e => (e.currentTarget.style.background = '#f9f9f9')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <div>
                <div style={{ fontSize: '12px', fontWeight: 500, color: '#333', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.nombre}</div>
                <div style={{ fontSize: '11px', color: '#aaa' }}>CI {c.ci || '—'}</div>
              </div>
              <div>
                <span style={{
                  fontSize: '10px', padding: '3px 8px', borderRadius: '20px',
                  background: badge.bg, color: badge.text, whiteSpace: 'nowrap'
                }}>
                  {c.diagnostico?.slice(0, 25)}{c.diagnostico?.length > 25 ? '...' : ''}
                </span>
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>
                {c.fecha_cirugia ? new Date(c.fecha_cirugia).toLocaleDateString('es-PY') : '—'}
              </div>
              <div>
                {c.seguro ? (
                  <span style={{ fontSize: '10px', padding: '3px 8px', borderRadius: '20px', background: '#E6F1FB', color: '#185FA5' }}>{c.seguro}</span>
                ) : '—'}
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>{c.lugar || '—'}</div>
              <div style={{ display: 'flex', gap: '5px', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => onVerPaciente(c)}
                  style={{ width: '26px', height: '26px', borderRadius: '6px', border: '0.5px solid #e0e0e0', background: '#fff', cursor: 'pointer', fontSize: '12px' }}
                  title="Ver detalle"
                >👁</button>
                <button
                  style={{ width: '26px', height: '26px', borderRadius: '6px', border: '0.5px solid #e0e0e0', background: '#fff', cursor: 'pointer', fontSize: '12px' }}
                  title="Editar"
                >✏️</button>
              </div>
            </div>
          )
        })}

        {/* Paginación */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', borderTop: '0.5px solid #f0f0f0' }}>
          <span style={{ fontSize: '11px', color: '#888' }}>
            Mostrando {Math.min((pagina - 1) * POR_PAGINA + 1, filtrados.length)}–{Math.min(pagina * POR_PAGINA, filtrados.length)} de {filtrados.length} registros
          </span>
          <div style={{ display: 'flex', gap: '4px' }}>
            <button onClick={() => setPagina(p => Math.max(1, p - 1))} disabled={pagina === 1} style={{ fontSize: '11px', padding: '4px 10px', border: '0.5px solid #e0e0e0', borderRadius: '6px', background: '#fff', color: '#666', cursor: 'pointer' }}>←</button>
            {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPagina(p)} style={{
                fontSize: '11px', padding: '4px 10px', border: '0.5px solid #e0e0e0',
                borderRadius: '6px', cursor: 'pointer',
                background: pagina === p ? '#185FA5' : '#fff',
                color: pagina === p ? '#fff' : '#666'
              }}>{p}</button>
            ))}
            <button onClick={() => setPagina(p => Math.min(totalPaginas, p + 1))} disabled={pagina === totalPaginas} style={{ fontSize: '11px', padding: '4px 10px', border: '0.5px solid #e0e0e0', borderRadius: '6px', background: '#fff', color: '#666', cursor: 'pointer' }}>→</button>
          </div>
        </div>
      </div>
    </div>
  )
}