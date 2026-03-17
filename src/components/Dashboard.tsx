import { useEffect, useState } from 'react'
import { supabase } from '../supabase'
import MetricCard from './MetricCard'
import AsistenteIA from './AsistenteIA'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const COLORS = ['#378ADD', '#1D9E75', '#BA7517', '#D4537E', '#7F77DD']
const MESES = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic']

export default function Dashboard({ onNuevaCirugia }: { onNuevaCirugia: () => void }) {
  const [cirugias, setCirugias] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  void onNuevaCirugia

  useEffect(() => {
    async function fetchData() {
      const { data } = await supabase.from('cirugias').select('*')
      if (data) setCirugias(data)
      setLoading(false)
    }
    fetchData()
  }, [])

  if (loading) return <div style={{ padding: '40px', textAlign: 'center', color: '#888' }}>Cargando datos...</div>

  const total = cirugias.length
  const pacientes = new Set(cirugias.map(c => c.ci)).size
  const derivantes = new Set(cirugias.filter(c => c.remitido_por).map(c => c.remitido_por)).size

  const seguroCount: Record<string, number> = {}
  cirugias.forEach(c => { if (c.seguro) seguroCount[c.seguro] = (seguroCount[c.seguro] || 0) + 1 })
  const seguroPrincipal = Object.entries(seguroCount).sort((a, b) => b[1] - a[1])[0]

  const porMes = Array(12).fill(0)
  cirugias.forEach(c => {
    if (c.fecha_cirugia) {
      const mes = new Date(c.fecha_cirugia).getMonth()
      porMes[mes]++
    }
  })
  const dataMes = MESES.map((mes, i) => ({ mes, cantidad: porMes[i] }))

  const dxCount: Record<string, number> = {}
  cirugias.forEach(c => {
    if (c.diagnostico) {
      const dx = c.diagnostico.split(' ').slice(0, 2).join(' ')
      dxCount[dx] = (dxCount[dx] || 0) + 1
    }
  })
  const dataDx = Object.entries(dxCount).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([name, value]) => ({ name, value }))

  const lugarCount: Record<string, number> = {}
  cirugias.forEach(c => { if (c.lugar) lugarCount[c.lugar] = (lugarCount[c.lugar] || 0) + 1 })
  const dataLugar = Object.entries(lugarCount).sort((a, b) => b[1] - a[1]).map(([lugar, cantidad]) => ({ lugar, cantidad }))

  const dataSeguros = Object.entries(seguroCount).sort((a, b) => b[1] - a[1]).map(([seguro, cantidad]) => ({ seguro, cantidad }))
  const totalSeguros = dataSeguros.reduce((acc, s) => acc + s.cantidad, 0)

  const derivanteCount: Record<string, number> = {}
  cirugias.forEach(c => { if (c.remitido_por) derivanteCount[c.remitido_por] = (derivanteCount[c.remitido_por] || 0) + 1 })
  const dataDerivantes = Object.entries(derivanteCount).sort((a, b) => b[1] - a[1]).slice(0, 5)

  return (
    <div style={{ padding: '16px 20px 30px', display: 'flex', flexDirection: 'column', gap: '12px' }}>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
        <MetricCard label="Total cirugías" value={total} trend="Año completo" trendUp />
        <MetricCard label="Pacientes atendidos" value={pacientes} trend={`${total - pacientes} con más de 1 cx`} />
        <MetricCard label="Médicos derivantes" value={derivantes} trend="Red activa" />
        <MetricCard label="Seguro principal" value={seguroPrincipal ? seguroPrincipal[0] : '—'} trend={seguroPrincipal ? `${Math.round(seguroPrincipal[1] / total * 100)}% del total` : ''} trendUp />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr', gap: '12px' }}>
        <div style={{ background: '#fff', border: '0.5px solid #e0e0e0', borderRadius: '10px', padding: '14px 16px' }}>
          <div style={{ fontSize: '12px', fontWeight: 500, marginBottom: '12px' }}>Cirugías por mes</div>
          <ResponsiveContainer width="100%" height={170}>
            <BarChart data={dataMes}>
              <XAxis dataKey="mes" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Bar dataKey="cantidad" fill="#B5D4F4" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={{ background: '#fff', border: '0.5px solid #e0e0e0', borderRadius: '10px', padding: '14px 16px' }}>
          <div style={{ fontSize: '12px', fontWeight: 500, marginBottom: '8px' }}>Diagnósticos</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '8px' }}>
            {dataDx.map((d, i) => (
              <span key={d.name} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#666' }}>
                <span style={{ width: '7px', height: '7px', borderRadius: '2px', background: COLORS[i], display: 'inline-block' }} />
                {d.name}
              </span>
            ))}
          </div>
          <ResponsiveContainer width="100%" height={130}>
            <PieChart>
              <Pie data={dataDx} dataKey="value" cx="50%" cy="50%" outerRadius={55} innerRadius={30}>
                {dataDx.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr', gap: '12px' }}>
        <div style={{ background: '#fff', border: '0.5px solid #e0e0e0', borderRadius: '10px', padding: '14px 16px' }}>
          <div style={{ fontSize: '12px', fontWeight: 500, marginBottom: '12px' }}>Lugares de cirugía</div>
          <ResponsiveContainer width="100%" height={155}>
            <BarChart data={dataLugar} layout="vertical">
              <XAxis type="number" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="lugar" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} width={80} />
              <Tooltip />
              <Bar dataKey="cantidad" fill="#B5D4F4" radius={[0,4,4,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={{ background: '#fff', border: '0.5px solid #e0e0e0', borderRadius: '10px', padding: '14px 16px' }}>
          <div style={{ fontSize: '12px', fontWeight: 500, marginBottom: '12px' }}>Seguros médicos</div>
          {dataSeguros.map((s, i) => (
            <div key={s.seguro} style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '9px' }}>
              <span style={{ fontSize: '11px', color: '#666', width: '68px', flexShrink: 0 }}>{s.seguro}</span>
              <div style={{ flex: 1, height: '7px', background: '#f0f0f0', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${Math.round(s.cantidad / totalSeguros * 100)}%`, height: '100%', background: COLORS[i % COLORS.length], borderRadius: '4px' }} />
              </div>
              <span style={{ fontSize: '11px', color: '#888', width: '28px', textAlign: 'right' }}>{Math.round(s.cantidad / totalSeguros * 100)}%</span>
            </div>
          ))}
        </div>
        <div style={{ background: '#fff', border: '0.5px solid #e0e0e0', borderRadius: '10px', padding: '14px 16px' }}>
          <div style={{ fontSize: '12px', fontWeight: 500, marginBottom: '12px' }}>Top derivantes</div>
          {dataDerivantes.map(([nombre, cantidad]) => (
            <div key={nombre} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#E6F1FB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: 500, color: '#185FA5', flexShrink: 0 }}>
                {nombre.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
              </div>
              <span style={{ fontSize: '12px', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{nombre}</span>
              <span style={{ fontSize: '11px', fontWeight: 500, color: '#185FA5' }}>{cantidad}</span>
            </div>
          ))}
        </div>
      </div>

      <AsistenteIA resumen={{
        total,
        pacientes,
        seguroPrincipal: seguroPrincipal?.[0] || '—',
        mesMaximo: MESES[porMes.indexOf(Math.max(...porMes))],
        diagnosticos: cirugias.map(c => c.diagnostico).filter(Boolean)
      }} />

    </div>
  )
}