interface Props {
  label: string
  value: string | number
  trend?: string
  trendUp?: boolean
}

export default function MetricCard({ label, value, trend, trendUp }: Props) {
  return (
    <div style={{
      background: '#fff',
      border: '0.5px solid #e0e0e0',
      borderRadius: '10px',
      padding: '14px 16px',
    }}>
      <div style={{ fontSize: '11px', color: '#888', marginBottom: '5px' }}>
        {label}
      </div>
      <div style={{ fontSize: '22px', fontWeight: 500, lineHeight: 1 }}>
        {value}
      </div>
      {trend && (
        <div style={{
          fontSize: '11px',
          marginTop: '5px',
          color: trendUp ? '#3B6D11' : '#888',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          {trendUp && (
            <span style={{
              width: '6px', height: '6px',
              background: '#639922',
              borderRadius: '50%',
              display: 'inline-block'
            }} />
          )}
          {trend}
        </div>
      )}
    </div>
  )
}