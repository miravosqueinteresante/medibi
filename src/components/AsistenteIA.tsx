import { useState } from 'react'

interface Props {
  resumen: {
    total: number
    pacientes: number
    seguroPrincipal: string
    mesMaximo: string
    diagnosticos: string[]
  }
}

export default function AsistenteIA({ resumen }: Props) {
  const [mensajes, setMensajes] = useState([
    {
      rol: 'bot',
      texto: `Hola Dra. Melgarejo. En 2020 realizó ${resumen.total} cirugías con ${resumen.pacientes} pacientes distintos. Su seguro más frecuente fue ${resumen.seguroPrincipal} y su mes más activo fue ${resumen.mesMaximo}.`
    }
  ])
  const [input, setInput] = useState('')
  const [cargando, setCargando] = useState(false)

  const sugeridas = [
    '¿Cuántos pterigiones operé en 2020?',
    '¿Cuál fue mi técnica más utilizada?',
    '¿Qué seguro usaron más mis pacientes?',
    'Dame un resumen completo del año',
  ]

  const contexto = `
Sos un asistente médico especializado en análisis de datos quirúrgicos.
Estás ayudando a la Dra. Diana Melgarejo, oftalmóloga de Paraguay.
Estos son los datos de sus cirugías del año 2020:
- Total de cirugías: ${resumen.total}
- Pacientes atendidos: ${resumen.pacientes}
- Seguro médico más frecuente: ${resumen.seguroPrincipal}
- Mes más activo: ${resumen.mesMaximo}
- Diagnósticos registrados: ${resumen.diagnosticos.join(', ')}

Respondé de forma concisa y profesional en español.
Si te preguntan algo que no está en los datos, decilo claramente.
  `.trim()

  const enviar = async (texto: string) => {
    if (!texto.trim() || cargando) return

    const nuevosMensajes = [...mensajes, { rol: 'user', texto }]
    setMensajes(nuevosMensajes)
    setInput('')
    setCargando(true)

    try {
      const historialTexto = nuevosMensajes
        .map(m => `${m.rol === 'bot' ? 'Asistente' : 'Doctora'}: ${m.texto}`)
        .join('\n')

      const prompt = `${contexto}\n\nConversación:\n${historialTexto}\n\nAsistente:`

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=AIzaSyBiziVYaNLaxQbs-YBGqCGbZjbluHMlFkE`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.7, maxOutputTokens: 500 }
          })
        }
      )

      const data = await response.json()
      console.log('Respuesta Gemini:', data)
      const respuesta = data.candidates?.[0]?.content?.parts?.[0]?.text ||
        data.error?.message ||
        'No pude obtener una respuesta.'
      setMensajes(prev => [...prev, { rol: 'bot', texto: respuesta }])
    } catch (err) {
      console.error('Error:', err)
      setMensajes(prev => [...prev, { rol: 'bot', texto: 'Hubo un error al conectar con el asistente. Intentá de nuevo.' }])
    }

    setCargando(false)
  }

  return (
    <div style={{ background: '#fff', border: '0.5px solid #e0e0e0', borderRadius: '10px', padding: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '10px', borderBottom: '0.5px solid #e0e0e0', marginBottom: '12px' }}>
        <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: '#E6F1FB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 500, color: '#185FA5' }}>IA</div>
        <div>
          <div style={{ fontSize: '13px', fontWeight: 500 }}>Asistente IA</div>
          <div style={{ fontSize: '11px', color: '#888' }}>Consultá tus datos en lenguaje natural</div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px', maxHeight: '220px', overflowY: 'auto' }}>
        {mensajes.map((m, i) => (
          <div key={i} style={{
            alignSelf: m.rol === 'bot' ? 'flex-start' : 'flex-end',
            maxWidth: '80%',
            background: m.rol === 'bot' ? '#f5f5f5' : '#E6F1FB',
            borderRadius: m.rol === 'bot' ? '0 8px 8px 8px' : '8px 0 8px 8px',
            padding: '9px 12px',
            fontSize: '12px',
            color: m.rol === 'bot' ? '#444' : '#185FA5',
            lineHeight: 1.6,
          }}>
            {m.texto}
          </div>
        ))}
        {cargando && (
          <div style={{ alignSelf: 'flex-start', background: '#f5f5f5', borderRadius: '0 8px 8px 8px', padding: '9px 12px', fontSize: '12px', color: '#888' }}>
            Pensando...
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && enviar(input)}
          placeholder="Escribí tu pregunta sobre tus cirugías..."
          style={{
            flex: 1, fontSize: '12px', padding: '8px 12px',
            border: '0.5px solid #ddd', borderRadius: '6px',
            outline: 'none', color: '#333', background: '#fff'
          }}
        />
        <button
          onClick={() => enviar(input)}
          disabled={cargando}
          style={{
            fontSize: '12px', padding: '8px 16px', background: '#185FA5',
            color: '#fff', border: 'none', borderRadius: '6px',
            cursor: 'pointer', fontWeight: 500,
            opacity: cargando ? 0.6 : 1
          }}
        >
          Enviar
        </button>
      </div>

      <div style={{ borderTop: '0.5px solid #e0e0e0', paddingTop: '10px' }}>
        <div style={{ fontSize: '11px', color: '#888', marginBottom: '8px' }}>Preguntas sugeridas</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {sugeridas.map(q => (
            <button
              key={q}
              onClick={() => enviar(q)}
              style={{
                fontSize: '12px', padding: '6px 12px',
                border: '0.5px solid #ddd', borderRadius: '20px',
                color: '#666', cursor: 'pointer', background: '#fff'
              }}
            >{q}</button>
          ))}
        </div>
      </div>
    </div>
  )
}
