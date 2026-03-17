import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import Dashboard from './components/Dashboard'
import Formulario from './components/Formulario'

type Pantalla = 'dashboard' | 'formulario'

function App() {
  const [pantalla, setPantalla] = useState<Pantalla>('dashboard')

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f5f5f5' }}>
      <Sidebar
        pantallaActiva={pantalla}
        onNavegar={setPantalla}
      />
      <div style={{ marginLeft: '180px', flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <Topbar
          titulo={pantalla === 'dashboard' ? 'Dashboard' : 'Nueva cirugía'}
          subtitulo={pantalla === 'dashboard' ? 'Resumen de actividad quirúrgica' : 'Completá todos los campos del registro'}
          onNuevaCirugia={() => setPantalla('formulario')}
          mostrarBotonNueva={pantalla === 'dashboard'}
        />
        {pantalla === 'dashboard' && (
          <Dashboard onNuevaCirugia={() => setPantalla('formulario')} />
        )}
        {pantalla === 'formulario' && (
          <Formulario
            onVolver={() => setPantalla('dashboard')}
            onGuardado={() => setPantalla('dashboard')}
          />
        )}
      </div>
    </div>
  )
}

export default App