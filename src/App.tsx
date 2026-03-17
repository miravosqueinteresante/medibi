import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import Dashboard from './components/Dashboard'
import Formulario from './components/Formulario'
import Historial from './components/Historial'
import DetallePaciente from './components/DetallePaciente'

type Pantalla = 'dashboard' | 'formulario' | 'pacientes' | 'detalle' | 'analisis'

function App() {
  const [pantalla, setPantalla] = useState<Pantalla>('dashboard')
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState<any>(null)

  const titulos: Record<Pantalla, { titulo: string, subtitulo: string }> = {
    dashboard: { titulo: 'Dashboard', subtitulo: 'Resumen de actividad quirúrgica' },
    formulario: { titulo: 'Nueva cirugía', subtitulo: 'Completá todos los campos del registro' },
    pacientes: { titulo: 'Historial de pacientes', subtitulo: 'Todos los registros quirúrgicos' },
    detalle: { titulo: pacienteSeleccionado?.nombre || 'Detalle', subtitulo: 'Ficha completa del paciente' },
    analisis: { titulo: 'Análisis', subtitulo: 'Análisis detallado de tu práctica' },
  }

  const handleVerPaciente = (cirugia: any) => {
    setPacienteSeleccionado(cirugia)
    setPantalla('detalle')
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f5f5f5' }}>
      <Sidebar pantallaActiva={pantalla} onNavegar={setPantalla} />
      <div style={{ marginLeft: '180px', flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <Topbar
          titulo={titulos[pantalla].titulo}
          subtitulo={titulos[pantalla].subtitulo}
          onNuevaCirugia={() => setPantalla('formulario')}
          mostrarBotonNueva={pantalla !== 'formulario'}
        />
        {pantalla === 'dashboard' && (
          <Dashboard onNuevaCirugia={() => setPantalla('formulario')} />
        )}
        {pantalla === 'formulario' && (
          <Formulario
            onVolver={() => setPantalla('dashboard')}
            onGuardado={() => setPantalla('pacientes')}
          />
        )}
        {pantalla === 'pacientes' && (
          <Historial
            onNuevaCirugia={() => setPantalla('formulario')}
            onVerPaciente={handleVerPaciente}
          />
        )}
        {pantalla === 'detalle' && pacienteSeleccionado && (
          <DetallePaciente
            cirugia={pacienteSeleccionado}
            onVolver={() => setPantalla('pacientes')}
            onEditar={() => setPantalla('formulario')}
          />
        )}
        {pantalla === 'analisis' && (
          <div style={{ padding: '40px', textAlign: 'center', color: '#888', fontSize: '14px' }}>
            Próximamente — Análisis detallado
          </div>
        )}
      </div>
    </div>
  )
}

export default App