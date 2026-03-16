import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { listCampaignsWithStats } from '../api/client'
import StatusBadge from '../components/StatusBadge'

const S = {
  page: { maxWidth: 1200, margin: '0 auto', padding: '40px 24px' },
  header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 36 },
  title: { fontSize: 28, fontWeight: 800, color: '#f8fafc', margin: 0, letterSpacing: '0.02em', textShadow: '0 0 20px rgba(56,189,248,0.3)' },
  subtitle: { fontSize: 14, color: '#94a3b8', marginTop: 8, letterSpacing: '0.02em' },

  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 16, marginBottom: 36 },
  statBox: { 
    background: 'rgba(15, 17, 26, 0.4)', 
    border: '1px solid rgba(255, 255, 255, 0.05)', 
    backdropFilter: 'blur(12px)',
    borderRadius: 12, 
    padding: '20px 16px', 
    textAlign: 'center',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
  },
  statNum: { fontSize: 26, fontWeight: 800, margin: 0, textShadow: '0 0 12px currentColor' },
  statLabel: { fontSize: 11, color: '#94a3b8', marginTop: 8, lineHeight: 1.4, textTransform: 'uppercase', letterSpacing: '0.05em' },

  scoreBox: {
    background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)',
    border: '1px solid rgba(139, 92, 246, 0.3)',
    backdropFilter: 'blur(16px)',
    borderRadius: 12,
    padding: '20px 16px',
    textAlign: 'center',
    gridColumn: 'span 2',
    boxShadow: '0 0 20px rgba(139, 92, 246, 0.15), inset 0 0 20px rgba(14, 165, 233, 0.05)'
  },
  scoreNum: { fontSize: 36, fontWeight: 800, color: '#fff', margin: 0, textShadow: '0 0 16px rgba(139, 92, 246, 0.8)' },
  scoreLabel: { fontSize: 12, color: '#cbd5e1', marginTop: 6, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 },

  tableWrap: { background: 'rgba(15, 17, 26, 0.4)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: 12, overflow: 'hidden', backdropFilter: 'blur(12px)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { padding: '16px 20px', fontSize: 11, fontWeight: 700, color: '#94a3b8', textAlign: 'left', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.05)', textTransform: 'uppercase', letterSpacing: '0.1em' },
  td: { padding: '16px 20px', fontSize: 14, color: '#cbd5e1', borderBottom: '1px solid rgba(255,255,255,0.02)', verticalAlign: 'middle' },
  trHover: { cursor: 'pointer', transition: 'background 0.2s ease' },
  
  btn: { 
    background: 'linear-gradient(135deg, #0ea5e9, #3b82f6)', 
    color: '#fff', 
    border: 'none', 
    borderRadius: 8, 
    padding: '10px 20px', 
    fontSize: 14, 
    fontWeight: 700, 
    cursor: 'pointer',
    boxShadow: '0 0 15px rgba(14, 165, 233, 0.4)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    transition: 'all 0.3s'
  },
  btnSm: { background: 'rgba(255,255,255,0.05)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, padding: '6px 12px', fontSize: 12, fontWeight: 600, marginLeft: 6, cursor: 'pointer', transition: 'all 0.2s', textTransform: 'uppercase', letterSpacing: '0.05em' },
  btnSmPrimary: { background: 'linear-gradient(135deg, #0ea5e9, #3b82f6)', color: '#fff', border: 'none', borderRadius: 6, padding: '7px 12px', fontSize: 12, fontWeight: 600, marginLeft: 6, cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 0 10px rgba(14, 165, 233, 0.4)', textTransform: 'uppercase', letterSpacing: '0.05em' },
  
  empty: { textAlign: 'center', padding: '80px 24px', color: '#64748b' },

  pill: (color, bg, border) => ({
    display: 'inline-block',
    background: bg,
    color: color,
    border: `1px solid ${border}`,
    boxShadow: `0 0 10px ${bg}`,
    borderRadius: 6,
    padding: '4px 10px',
    fontSize: 13,
    fontWeight: 700,
  }),
}

export default function Dashboard() {
  const [campaigns, setCampaigns] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    listCampaignsWithStats()
      .then((res) => setCampaigns(res.data))
      .finally(() => setLoading(false))
  }, [])

  const counts = {
    total: campaigns.length,
    draft: campaigns.filter(c => c.status === 'draft').length,
    approved: campaigns.filter(c => c.status === 'approved').length,
    sent: campaigns.filter(c => c.status === 'sent').length,
  }

  const totalOpened = campaigns.reduce((s, c) => s + (c.perf?.emails_opened ?? 0), 0)
  const totalClicked = campaigns.reduce((s, c) => s + (c.perf?.emails_clicked ?? 0), 0)
  const totalScore = totalOpened + totalClicked

  return (
    <div style={S.page}>
      <div style={S.header}>
        <div>
          <h1 style={S.title}>Campaign Dashboard</h1>
          <p style={S.subtitle}>Autonomous precision targeting matrix — FrostHack XPECTO 2026</p>
        </div>
        <button style={S.btn} onClick={() => navigate('/create')} onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 25px rgba(14, 165, 233, 0.6)'} onMouseLeave={e => e.currentTarget.style.boxShadow = '0 0 15px rgba(14, 165, 233, 0.4)'}>
          Initialize Campaign
        </button>
      </div>

      {/* Stat cards */}
      <div style={S.statsRow}>
        <div style={S.scoreBox}>
          <p style={S.scoreNum}>{totalScore.toLocaleString()}</p>
          <p style={S.scoreLabel}>Global Engagement Score</p>
        </div>

        <div style={S.statBox} className="hover:border-green-500/50 hover:shadow-[0_0_20px_rgba(34,197,94,0.2)]">
          <p style={{ ...S.statNum, color: '#4ade80' }}>{totalOpened}</p>
          <p style={S.statLabel}>Total Opens (EO=Y)</p>
        </div>
        <div style={S.statBox} className="hover:border-purple-500/50 hover:shadow-[0_0_20px_rgba(168,85,247,0.2)]">
          <p style={{ ...S.statNum, color: '#c084fc' }}>{totalClicked}</p>
          <p style={S.statLabel}>Total Clicks (EC=Y)</p>
        </div>
        <div style={S.statBox} className="hover:border-slate-500/50 hover:shadow-[0_0_20px_rgba(100,116,139,0.2)]">
          <p style={{ ...S.statNum, color: '#f8fafc' }}>{counts.total}</p>
          <p style={S.statLabel}>Active Protocols</p>
        </div>
        <div style={S.statBox} className="hover:border-blue-500/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.2)]">
          <p style={{ ...S.statNum, color: '#38bdf8' }}>{counts.sent}</p>
          <p style={S.statLabel}>Executed</p>
        </div>
        <div style={S.statBox} className="hover:border-emerald-500/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]">
          <p style={{ ...S.statNum, color: '#34d399' }}>1,000</p>
          <p style={S.statLabel}>Cohort Coverage</p>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>
          <div className="animate-pulse-glow" style={{ fontSize: 16, letterSpacing: '0.1em' }}>INITIALIZING DATA MATRIX...</div>
        </div>
      ) : campaigns.length === 0 ? (
        <div style={{ ...S.tableWrap, ...S.empty }}>
          <p style={{ fontSize: 18, fontWeight: 700, marginBottom: 12, color: '#94a3b8' }}>No Operations Found</p>
          <p style={{ fontSize: 14, marginBottom: 24, color: '#64748b' }}>Deploy your first autonomous AI campaign pipeline.</p>
          <button style={S.btn} onClick={() => navigate('/create')}>Initialize Campaign</button>
        </div>
      ) : (
        <div style={S.tableWrap}>
          <table style={S.table}>
            <thead>
              <tr>
                <th style={S.th}>ID</th>
                <th style={S.th}>Objective Protocol</th>
                <th style={S.th}>Subject Vector</th>
                <th style={S.th}>Status</th>
                <th style={{ ...S.th, textAlign: 'center' }}>Opens</th>
                <th style={{ ...S.th, textAlign: 'center' }}>Clicks</th>
                <th style={{ ...S.th, textAlign: 'center' }}>Yield</th>
                <th style={S.th}>Timestamp</th>
                <th style={S.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((c) => {
                const opens = c.perf?.emails_opened ?? null
                const clicks = c.perf?.emails_clicked ?? null
                const score = opens !== null && clicks !== null ? opens + clicks : null
                return (
                  <tr
                    key={c.id}
                    style={S.trHover}
                    onClick={() => navigate(`/campaign/${c.id}/preview`)}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ ...S.td, color: '#64748b', fontWeight: 600, width: 40, fontFamily: 'monospace' }}>#{c.id}</td>
                    <td style={{ ...S.td, maxWidth: 220 }}>
                      <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 500 }}>
                        {c.objective}
                      </span>
                    </td>
                    <td style={{ ...S.td, maxWidth: 160, color: '#94a3b8' }}>
                      <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 13 }}>
                        {c.email_json?.subject_line || '—'}
                      </span>
                    </td>
                    <td style={S.td}><StatusBadge status={c.status} /></td>
                    <td style={{ ...S.td, textAlign: 'center' }}>
                      {opens !== null
                        ? <span style={S.pill('#4ade80', 'rgba(34, 197, 94, 0.1)', 'rgba(34, 197, 94, 0.2)')}>{opens}</span>
                        : <span style={{ color: '#475569' }}>—</span>}
                    </td>
                    <td style={{ ...S.td, textAlign: 'center' }}>
                      {clicks !== null
                        ? <span style={S.pill('#c084fc', 'rgba(168, 85, 247, 0.1)', 'rgba(168, 85, 247, 0.2)')}>{clicks}</span>
                        : <span style={{ color: '#475569' }}>—</span>}
                    </td>
                    <td style={{ ...S.td, textAlign: 'center' }}>
                      {score !== null
                        ? <span style={{ fontWeight: 800, color: '#38bdf8', textShadow: '0 0 10px rgba(56,189,248,0.5)' }}>{score}</span>
                        : <span style={{ color: '#475569' }}>—</span>}
                    </td>
                    <td style={{ ...S.td, whiteSpace: 'nowrap', color: '#64748b', fontSize: 13, fontFamily: 'monospace' }}>
                      {c.created_at ? new Date(c.created_at).toLocaleDateString('en-IN') : '—'}
                    </td>
                    <td style={S.td} onClick={e => e.stopPropagation()}>
                      <button style={S.btnSm} onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'} onClick={() => navigate(`/campaign/${c.id}/preview`)}>Access</button>
                      {c.status === 'draft' && (
                        <button style={S.btnSmPrimary} onClick={() => navigate(`/campaign/${c.id}/approve`)}>Authorize</button>
                      )}
                      {(c.status === 'approved' || c.status === 'sent') && (
                        <button style={S.btnSm} onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'} onClick={() => navigate(`/campaign/${c.id}/analytics`)}>Telemetry</button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
