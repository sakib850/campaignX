import { useState, useEffect } from 'react'
import { getCoverageStats, getUncoveredIds, listCampaignsWithStats } from '../api/client'

const S = {
  page: { maxWidth: 1200, margin: '0 auto', padding: '40px 24px' },
  header: { marginBottom: 36 },
  title: { fontSize: 28, fontWeight: 800, color: '#f8fafc', margin: 0, textShadow: '0 0 20px rgba(34,211,238,0.3)', letterSpacing: '0.02em' },
  subtitle: { fontSize: 14, color: '#94a3b8', marginTop: 8, letterSpacing: '0.05em', textTransform: 'uppercase' },
  
  statsRow: { display: 'flex', gap: 16, marginBottom: 36, flexWrap: 'wrap' },
  statCard: { 
    flex: '1 1 180px', 
    background: 'rgba(15, 17, 26, 0.4)', 
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255, 255, 255, 0.05)', 
    borderRadius: 12, 
    padding: '24px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
    transition: 'all 0.3s ease'
  },
  statLabel: { fontSize: 12, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' },
  statValue: { fontSize: 36, fontWeight: 800, color: '#f8fafc', marginTop: 8, textShadow: '0 0 15px currentColor' },
  statSub: { fontSize: 12, color: '#64748b', marginTop: 6 },

  scoreCard: {
    flex: '1 1 180px',
    borderRadius: 12,
    padding: '24px',
    background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)',
    border: '1px solid rgba(139, 92, 246, 0.3)',
    backdropFilter: 'blur(16px)',
    boxShadow: '0 0 20px rgba(139, 92, 246, 0.15)'
  },
  scoreLabel: { fontSize: 12, color: '#cbd5e1', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' },
  scoreValue: { fontSize: 36, fontWeight: 800, color: '#fff', marginTop: 8, textShadow: '0 0 15px rgba(139, 92, 246, 0.8)' },
  scoreSub: { fontSize: 12, color: '#94a3b8', marginTop: 6 },

  progressWrap: { background: 'rgba(15, 17, 26, 0.4)', border: '1px solid rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(12px)', borderRadius: 12, padding: '24px 28px', marginBottom: 36, boxShadow: '0 8px 32px rgba(0,0,0,0.3)' },
  progressLabel: { display: 'flex', justifyContent: 'space-between', marginBottom: 16, fontSize: 13, color: '#cbd5e1', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' },
  progressBar: { height: 12, background: 'rgba(255,255,255,0.05)', borderRadius: 6, overflow: 'hidden', boxShadow: 'inset 0 0 10px rgba(0,0,0,0.5)' },
  progressFill: (pct) => ({
    height: '100%',
    width: `${pct}%`,
    background: pct === 100 ? 'linear-gradient(90deg, #10b981, #34d399)' : pct > 50 ? 'linear-gradient(90deg, #0ea5e9, #3b82f6)' : 'linear-gradient(90deg, #f59e0b, #fbbf24)',
    borderRadius: 6,
    transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: pct === 100 ? '0 0 20px rgba(16,185,129,0.5)' : pct > 50 ? '0 0 20px rgba(14,165,233,0.5)' : '0 0 20px rgba(245,158,11,0.5)'
  }),

  section: { background: 'rgba(15, 17, 26, 0.4)', border: '1px solid rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(12px)', borderRadius: 12, padding: '24px 28px', marginBottom: 24, boxShadow: '0 8px 32px rgba(0,0,0,0.3)' },
  sectionTitle: { fontSize: 16, fontWeight: 700, color: '#f8fafc', marginBottom: 20, letterSpacing: '0.05em', textTransform: 'uppercase' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: 13 },
  th: { textAlign: 'left', padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)', color: '#94a3b8', fontWeight: 700, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em' },
  td: { padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.02)', color: '#cbd5e1' },
  
  badge: (n) => ({
    display: 'inline-block',
    background: n > 0 ? 'rgba(56, 189, 248, 0.1)' : 'rgba(34, 197, 94, 0.1)',
    color: n > 0 ? '#38bdf8' : '#4ade80',
    border: `1px solid ${n > 0 ? 'rgba(56, 189, 248, 0.2)' : 'rgba(34, 197, 94, 0.2)'}`,
    boxShadow: `0 0 10px ${n > 0 ? 'rgba(56, 189, 248, 0.15)' : 'rgba(34, 197, 94, 0.15)'}`,
    borderRadius: 6,
    padding: '4px 10px',
    fontSize: 13,
    fontWeight: 700,
  }),
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
  uncoveredBox: { maxHeight: 240, overflowY: 'auto', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 8, padding: 16, fontSize: 13, color: '#94a3b8', lineHeight: 1.8, fontFamily: 'monospace', textShadow: '0 0 5px rgba(255,255,255,0.1)' },
  refreshBtn: { padding: '8px 18px', background: 'linear-gradient(135deg, #0ea5e9, #3b82f6)', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', boxShadow: '0 0 15px rgba(14, 165, 233, 0.4)' },
  error: { background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171', padding: '12px 16px', borderRadius: 8, fontSize: 13, marginBottom: 24 },
  empty: { color: '#64748b', fontSize: 14, fontStyle: 'italic', padding: '40px 0', textAlign: 'center' },
}

export default function Coverage() {
  const [stats, setStats] = useState(null)
  const [uncovered, setUncovered] = useState(null)
  const [campaigns, setCampaigns] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const [sRes, uRes, cRes] = await Promise.all([
        getCoverageStats(),
        getUncoveredIds(),
        listCampaignsWithStats(),
      ])
      setStats(sRes.data)
      setUncovered(uRes.data)
      setCampaigns(cRes.data)
    } catch (e) {
      setError(e?.response?.data?.detail || e.message || 'Transmission failed')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const pct = stats ? Math.round((stats.covered_count / (stats.total_cohort_size || 1)) * 100) : 0

  const sentCampaigns = campaigns.filter(c => c.status === 'sent')

  const totalSent = sentCampaigns.reduce((s, c) => s + (c.perf?.emails_sent ?? 0), 0)
  const totalOpened = sentCampaigns.reduce((s, c) => s + (c.perf?.emails_opened ?? 0), 0)
  const totalClicked = sentCampaigns.reduce((s, c) => s + (c.perf?.emails_clicked ?? 0), 0)
  
  const openRate = totalSent > 0 ? totalOpened / totalSent : 0
  const clickRate = totalSent > 0 ? totalClicked / totalSent : 0
  const combinedScore = (openRate * 0.3) + (clickRate * 0.7)

  return (
    <div style={S.page}>
      <div style={S.header}>
        <h1 style={S.title}>Cohort Network Coverage</h1>
        <p style={S.subtitle}>Global customer targeting telemetry & execution metrics</p>
      </div>

      {error && <div style={S.error}>{error}</div>}

      {loading ? (
        <div style={S.empty} className="animate-pulse-glow">ESTABLISHING CONNECTION WITH COHORT DATABANKS...</div>
      ) : stats ? (
        <>
          <div style={S.statsRow}>
            <div style={S.statCard} className="hover:border-slate-500/50 hover:shadow-[0_0_20px_rgba(100,116,139,0.2)]">
              <div style={S.statLabel}>Total Node Cohort</div>
              <div style={S.statValue}>{stats.total_cohort_size.toLocaleString()}</div>
              <div style={S.statSub}>entities in vector space</div>
            </div>
            <div style={S.statCard} className="hover:border-emerald-500/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]">
              <div style={S.statLabel}>Secured Targets</div>
              <div style={{ ...S.statValue, color: '#34d399' }}>{stats.covered_count.toLocaleString()}</div>
              <div style={S.statSub}>contacted at least once</div>
            </div>
            <div style={S.statCard} className="hover:border-amber-500/50 hover:shadow-[0_0_20px_rgba(245,158,11,0.2)]">
              <div style={S.statLabel}>Isolated Targets</div>
              <div style={{ ...S.statValue, color: stats.uncovered_count > 0 ? '#fbbf24' : '#34d399' }}>
                {stats.uncovered_count.toLocaleString()}
              </div>
              <div style={S.statSub}>pending engagement vector</div>
            </div>
            <div style={{ ...S.statCard, background: 'rgba(14, 165, 233, 0.05)', border: '1px solid rgba(14, 165, 233, 0.2)' }} className="hover:border-blue-500/50 hover:shadow-[0_0_20px_rgba(56,189,248,0.3)]">
              <div style={{ ...S.statLabel, color: '#7dd3fc' }}>Entity Engagement (EO=Y)</div>
              <div style={{ ...S.statValue, color: '#38bdf8' }}>{totalOpened}</div>
              <div style={S.statSub}>registered open events</div>
            </div>
            <div style={{ ...S.statCard, background: 'rgba(139, 92, 246, 0.05)', border: '1px solid rgba(139, 92, 246, 0.2)' }} className="hover:border-purple-500/50 hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]">
              <div style={{ ...S.statLabel, color: '#d8b4fe' }}>Action Conversions (EC=Y)</div>
              <div style={{ ...S.statValue, color: '#c084fc' }}>{totalClicked}</div>
              <div style={S.statSub}>registered click events</div>
            </div>
            <div style={S.scoreCard}>
              <div style={S.scoreLabel}>Hackathon Metric Output</div>
              <div style={S.scoreValue}>{(totalOpened + totalClicked).toLocaleString()}</div>
              <div style={S.scoreSub}>EO + EC total index</div>
              
              <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>EO Engagement Rate (30%)</span>
                  <span style={{ color: '#38bdf8', fontWeight: 700, textShadow: '0 0 10px rgba(56, 189, 248, 0.5)' }}>→ {(openRate * 100).toFixed(1)}%</span>
                </div>
                <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>EC Conversion Rate (70%)</span>
                  <span style={{ color: '#c084fc', fontWeight: 700, textShadow: '0 0 10px rgba(192, 132, 252, 0.5)' }}>→ {(clickRate * 100).toFixed(1)}%</span>
                </div>
                <div style={{ fontSize: 12, color: '#94a3b8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Combined Engagement Score</span>
                  <span style={{ color: '#f8fafc', fontWeight: 700, textShadow: '0 0 10px rgba(255, 255, 255, 0.3)' }}>→ {(combinedScore * 100).toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </div>

          <div style={S.progressWrap}>
            <div style={S.progressLabel}>
              <span>System Coverage Density: {pct}%</span>
              <span style={{color: '#94a3b8'}}>{stats.covered_count} / {stats.total_cohort_size} Nodes</span>
            </div>
            <div style={S.progressBar}>
              <div style={S.progressFill(pct)} />
            </div>
          </div>

          <div style={S.section}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div style={S.sectionTitle}>Campaign Telemetry Stream</div>
              <button style={S.refreshBtn} onClick={load} onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 25px rgba(14, 165, 233, 0.6)'} onMouseLeave={e => e.currentTarget.style.boxShadow = '0 0 15px rgba(14, 165, 233, 0.4)'}>
                Refresh Stream
              </button>
            </div>
            {sentCampaigns.length > 0 ? (
              <table style={S.table}>
                <thead>
                  <tr>
                    <th style={S.th}>Sector</th>
                    <th style={S.th}>Protocol Name</th>
                    <th style={{ ...S.th, textAlign: 'center' }}>Targets</th>
                    <th style={{ ...S.th, textAlign: 'center' }}>Opens (EO=Y)</th>
                    <th style={{ ...S.th, textAlign: 'center' }}>Clicks (EC=Y)</th>
                    <th style={{ ...S.th, textAlign: 'center' }}>EO+EC</th>
                    <th style={{ ...S.th, textAlign: 'right' }}>Open Rate</th>
                    <th style={{ ...S.th, textAlign: 'right' }}>Click Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {sentCampaigns.map((c) => {
                    const perf = c.perf
                    const score = perf ? perf.emails_opened + perf.emails_clicked : null
                    return (
                      <tr key={c.id} style={{ transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        <td style={{ ...S.td, fontFamily: 'monospace', fontSize: 13, color: '#64748b' }}>#{c.id}</td>
                        <td style={{ ...S.td, maxWidth: 300 }}>
                          <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 500 }}>
                            {c.objective}
                          </span>
                        </td>
                        <td style={{ ...S.td, textAlign: 'center' }}>
                          {perf
                            ? <span style={S.badge(0)}>{perf.emails_sent.toLocaleString()}</span>
                            : <span style={{ color: '#475569' }}>—</span>}
                        </td>
                        <td style={{ ...S.td, textAlign: 'center' }}>
                          {perf
                            ? <span style={S.pill('#4ade80', 'rgba(34, 197, 94, 0.1)', 'rgba(34, 197, 94, 0.2)')}>{perf.emails_opened}</span>
                            : <span style={{ color: '#475569' }}>—</span>}
                        </td>
                        <td style={{ ...S.td, textAlign: 'center' }}>
                          {perf
                            ? <span style={S.pill('#c084fc', 'rgba(168, 85, 247, 0.1)', 'rgba(168, 85, 247, 0.2)')}>{perf.emails_clicked}</span>
                            : <span style={{ color: '#475569' }}>—</span>}
                        </td>
                        <td style={{ ...S.td, textAlign: 'center' }}>
                          {score !== null
                            ? <span style={{ fontWeight: 800, color: '#38bdf8', textShadow: '0 0 10px rgba(56,189,248,0.5)', fontSize: 14 }}>{score}</span>
                            : <span style={{ color: '#475569' }}>—</span>}
                        </td>
                        <td style={{ ...S.td, textAlign: 'right', color: '#94a3b8', fontFamily: 'monospace' }}>
                          {perf ? `${(perf.open_rate * 100).toFixed(1)}%` : '—'}
                        </td>
                        <td style={{ ...S.td, textAlign: 'right', color: '#94a3b8', fontFamily: 'monospace' }}>
                          {perf ? `${(perf.click_rate * 100).toFixed(1)}%` : '—'}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            ) : (
              <div style={S.empty}>NO EXECUTED PROTOCOLS DETECTED IN ARCHIVES.</div>
            )}
          </div>

          {uncovered && uncovered.length > 0 && (
            <div style={{...S.section, border: '1px solid rgba(245, 158, 11, 0.2)', boxShadow: '0 8px 32px rgba(245,158,11,0.05)'}}>
              <div style={{...S.sectionTitle, color: '#fbbf24', textShadow: '0 0 10px rgba(245,158,11,0.3)'}}>Pending Target Sectors ({uncovered.length})</div>
              <div style={S.uncoveredBox}>
                {uncovered.join(', ')}
              </div>
            </div>
          )}
        </>
      ) : null}
    </div>
  )
}
