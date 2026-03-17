import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import Dashboard from './components/Dashboard'

function App() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f5f5f5' }}>
      <Sidebar />
      <div style={{ marginLeft: '180px', flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <Topbar />
        <Dashboard />
      </div>
    </div>
  )
}

export default App