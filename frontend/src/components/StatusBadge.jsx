export default function StatusBadge({ status }) {
  const map = {
    draft:    { label: 'Draft',    bg: 'rgba(234, 179, 8, 0.15)', color: '#facc15', border: 'rgba(234, 179, 8, 0.3)' },
    approved: { label: 'Approved', bg: 'rgba(34, 197, 94, 0.15)', color: '#4ade80', border: 'rgba(34, 197, 94, 0.3)' },
    rejected: { label: 'Rejected', bg: 'rgba(239, 68, 68, 0.15)', color: '#f87171', border: 'rgba(239, 68, 68, 0.3)' },
    sent:     { label: 'Sent',     bg: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', border: 'rgba(56, 189, 248, 0.3)' },
  }
  const s = map[status] || { label: status, bg: 'rgba(148, 163, 184, 0.15)', color: '#cbd5e1', border: 'rgba(148, 163, 184, 0.3)' }
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      background: s.bg,
      color: s.color,
      border: `1px solid ${s.border}`,
      boxShadow: `0 0 10px ${s.bg}`,
      fontSize: 12,
      fontWeight: 600,
      padding: '3px 12px',
      borderRadius: 20,
      letterSpacing: '0.05em',
      textTransform: 'uppercase'
    }}>
      <span className="animate-pulse-glow" style={{ width: 6, height: 6, borderRadius: '50%', background: s.color, boxShadow: `0 0 6px ${s.color}` }} />
      {s.label}
    </span>
  )
}
