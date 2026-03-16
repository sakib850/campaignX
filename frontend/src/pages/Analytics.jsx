import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getCampaignAnalytics, sendCampaign, optimizeCampaign } from '../api/client'
import StatusBadge from '../components/StatusBadge'

const S = {
  page: { maxWidth: 1000, margin: '0 auto', padding: '40px 24px' },
  breadcrumb: { fontSize: 12, color: '#64748b', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 6, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 },
  breadBtn: { background: 'none', border: 'none', padding: 0, color: '#94a3b8', fontSize: 12, cursor: 'pointer', transition: 'color 0.2s' },
  titleRow: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 32 },
  title: { fontSize: 26, fontWeight: 800, color: '#f8fafc', margin: 0, textShadow: '0 0 15px rgba(56,189,248,0.3)', letterSpacing: '0.02em' },
  objective: { fontSize: 14, color: '#94a3b8', marginTop: 8, lineHeight: 1.6, letterSpacing: '0.05em' },

  alertGreen: { marginBottom: 20, background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.4)', color: '#34d399', fontSize: 13, borderRadius: 8, padding: '14px 20px', boxShadow: '0 0 15px rgba(16, 185, 129, 0.15)' },
  alertRed: { marginBottom: 20, background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#f87171', fontSize: 13, borderRadius: 8, padding: '14px 20px', boxShadow: '0 0 15px rgba(239, 68, 68, 0.15)' },

  sendPanel: { background: 'rgba(56, 189, 248, 0.05)', border: '1px solid rgba(56, 189, 248, 0.3)', backdropFilter: 'blur(12px)', borderRadius: 12, padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, boxShadow: '0 0 20px rgba(56,189,248,0.1)' },
  sendPanelText: { fontSize: 14, fontWeight: 700, color: '#e0f2fe', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' },
  sendPanelSub: { fontSize: 13, color: '#7dd3fc', marginTop: 6 },
  btnSend: { background: 'linear-gradient(135deg, #0ea5e9, #3b82f6)', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 24px', fontSize: 14, fontWeight: 800, cursor: 'pointer', minWidth: 160, boxShadow: '0 0 20px rgba(14, 165, 233, 0.4)', textTransform: 'uppercase', letterSpacing: '0.1em' },
  btnDisabled: { background: 'rgba(255,255,255,0.05)', color: '#64748b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '12px 24px', fontSize: 14, fontWeight: 700, cursor: 'not-allowed', minWidth: 160, textTransform: 'uppercase', letterSpacing: '0.1em' },

  optPanel: { background: 'rgba(139, 92, 246, 0.05)', border: '1px solid rgba(139, 92, 246, 0.3)', backdropFilter: 'blur(12px)', borderRadius: 12, padding: '20px 24px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 24, boxShadow: '0 0 20px rgba(139,92,246,0.1)' },
  optLeft: { flex: 1 },
  optTitle: { fontSize: 14, fontWeight: 700, color: '#e9d5ff', margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '0.05em' },
  optSub: { fontSize: 13, color: '#d8b4fe', lineHeight: 1.5 },
  btnOpt: { background: 'linear-gradient(135deg, #8b5cf6, #c084fc)', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 24px', fontSize: 13, fontWeight: 800, cursor: 'pointer', minWidth: 180, whiteSpace: 'nowrap', boxShadow: '0 0 20px rgba(139, 92, 246, 0.4)', textTransform: 'uppercase', letterSpacing: '0.1em' },
  optApproverRow: { display: 'flex', gap: 10, alignItems: 'center', marginTop: 12 },
  optApproverInput: { border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.3)', color: '#fff', borderRadius: 6, padding: '8px 12px', fontSize: 13, outline: 'none', width: 220, transition: 'all 0.3s' },

  optResult: { background: 'rgba(15, 17, 26, 0.6)', border: '1px solid rgba(192, 132, 252, 0.3)', borderRadius: 12, marginBottom: 24, boxShadow: '0 8px 32px rgba(192,132,252,0.15)' },
  optResultHead: { padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  optResultTitle: { fontSize: 14, fontWeight: 700, color: '#c084fc', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' },
  optResultBody: { padding: '20px' },
  optResultGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 24px', marginBottom: 16 },
  optReasonBox: { background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 8, padding: '14px 18px', fontSize: 13, color: '#cbd5e1', lineHeight: 1.6, boxShadow: 'inset 0 0 10px rgba(0,0,0,0.5)' },
  optNavBtn: { background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(192, 132, 252, 0.3)', borderRadius: 6, padding: '6px 14px', fontSize: 12, color: '#e9d5ff', cursor: 'pointer', textTransform: 'uppercase', fontWeight: 600 },

  section: { background: 'rgba(15, 17, 26, 0.4)', border: '1px solid rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(12px)', borderRadius: 12, marginBottom: 24, boxShadow: '0 8px 32px rgba(0,0,0,0.3)' },
  sectionHead: { padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.02)' },
  sectionTitle: { fontSize: 13, fontWeight: 700, color: '#94a3b8', margin: 0, textTransform: 'uppercase', letterSpacing: '0.1em' },
  sectionBody: { padding: '24px' },

  statsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 },
  statCard: { borderRadius: 12, padding: '24px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.05)', transition: 'all 0.3s' },
  statValue: { fontSize: 36, fontWeight: 800, lineHeight: 1, margin: 0, textShadow: '0 0 10px currentColor' },
  statLabel: { fontSize: 12, color: '#94a3b8', marginTop: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' },

  scoreRow: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 12 },
  scoreCard: { borderRadius: 12, padding: '24px', textAlign: 'center', background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)', border: '1px solid rgba(139, 92, 246, 0.3)', boxShadow: '0 0 20px rgba(139, 92, 246, 0.15)' },
  scoreValue: { fontSize: 42, fontWeight: 800, color: '#fff', lineHeight: 1, margin: 0, textShadow: '0 0 15px rgba(139, 92, 246, 0.8)' },
  scoreLabel: { fontSize: 11, color: '#e2e8f0', marginTop: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' },

  gaugeRow: { marginBottom: 20 },
  gaugeTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  gaugeLabel: { fontSize: 13, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' },
  gaugeValue: { fontSize: 14, fontWeight: 800, color: '#f8fafc', textShadow: '0 0 5px rgba(255,255,255,0.3)' },
  gaugeTrack: { width: '100%', height: 8, background: 'rgba(255,255,255,0.05)', borderRadius: 4, overflow: 'hidden', boxShadow: 'inset 0 0 5px rgba(0,0,0,0.5)' },
  gaugeFill: { height: '100%', borderRadius: 4, transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)' },

  empty: { textAlign: 'center', padding: '60px 20px' },
  emptyTitle: { fontSize: 15, fontWeight: 700, color: '#64748b', margin: 0, textTransform: 'uppercase', letterSpacing: '0.1em' },
  emptySub: { fontSize: 13, color: '#475569', marginTop: 8 },

  insightGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 },
  insightCard: { background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 10, padding: '16px', transition: 'all 0.3s' },
  insightTitle: { fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 },
  insightValue: { fontSize: 14, color: '#e2e8f0', lineHeight: 1.6, fontWeight: 500 },
  engagementBadge: { fontSize: 11, padding: '3px 12px', borderRadius: 20, fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: 6, marginLeft: 16, textTransform: 'uppercase', letterSpacing: '0.1em' },
  thresholdNote: { fontSize: 13, color: '#cbd5e1', marginBottom: 20, lineHeight: 1.6, paddingBottom: 20, borderBottom: '1px solid rgba(255,255,255,0.05)' },

  summaryGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px 28px' },
  fieldLabel: { fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 },
  fieldValue: { fontSize: 14, color: '#cbd5e1', lineHeight: 1.6, fontWeight: 500 },
  approvalNote: { marginTop: 24, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.05)', fontSize: 12, color: '#64748b', fontFamily: 'monospace' },

  twoCol: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 },
  spinner: { textAlign: 'center', padding: '100px 0', color: '#64748b', fontSize: 14, letterSpacing: '0.1em' },
  errorFull: { textAlign: 'center', padding: '100px 0', color: '#ef4444', fontSize: 14, letterSpacing: '0.1em' },
}

function GaugeBar({ label, value, color }) {
  const pct = Math.min(Math.round(value * 100), 100)
  return (
    <div style={S.gaugeRow}>
      <div style={S.gaugeTop}>
        <span style={S.gaugeLabel}>{label}</span>
        <span style={S.gaugeValue}>{(value * 100).toFixed(1)}%</span>
      </div>
      <div style={S.gaugeTrack}>
        <div style={{ ...S.gaugeFill, width: `${pct}%`, background: color, boxShadow: `0 0 10px ${color}` }} />
      </div>
    </div>
  )
}

function StatCard({ value, label, bg, color, sub, border }) {
  return (
    <div className="hover:shadow-[0_0_20px_currentColor]" style={{...S.statCard, background: bg, borderColor: border, color: border.replace('0.2)', '0.1)')}}>
      <p style={{ ...S.statValue, color }}>{value}</p>
      <p style={S.statLabel}>{label}</p>
      {sub && <p style={{ fontSize: 11, color: '#64748b', marginTop: 6 }}>{sub}</p>}
    </div>
  )
}

function InsightCard({ title, value }) {
  return (
    <div style={S.insightCard} className="hover:border-blue-500/30 hover:shadow-[0_0_15px_rgba(59,130,246,0.1)]">
      <p style={S.insightTitle}>{title}</p>
      <p style={S.insightValue}>{value || '—'}</p>
    </div>
  )
}

function InfoCell({ label, value }) {
  return (
    <div>
      <p style={S.fieldLabel}>{label}</p>
      <p style={S.fieldValue}>{value || '—'}</p>
    </div>
  )
}

export default function Analytics() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState(null)
  const [sendMsg, setSendMsg] = useState(null)

  const [optimizing, setOptimizing] = useState(false)
  const [optApprover, setOptApprover] = useState('')
  const [optResult, setOptResult] = useState(null)
  const [optError, setOptError] = useState(null)

  const fetchAnalytics = () => {
    setLoading(true)
    getCampaignAnalytics(id)
      .then((res) => setData(res.data))
      .catch((err) => setError(err.response?.data?.detail || err.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchAnalytics() }, [id])

  const handleSend = async () => {
    setSending(true)
    setError(null)
    try {
      const res = await sendCampaign(id)
      setSendMsg(res.data.message)
      fetchAnalytics()
    } catch (err) {
      setError(err.response?.data?.detail || err.message)
    } finally {
      setSending(false)
    }
  }

  const handleOptimize = async () => {
    if (!optApprover.trim()) { setOptError('IDENTITY TOKEN REQUIRED FOR OVERRIDE.'); return }
    setOptimizing(true); setOptError(null); setOptResult(null)
    try {
      const res = await optimizeCampaign(id, { approved_by: optApprover })
      setOptResult(res.data)
    } catch (err) {
      setOptError(err.response?.data?.detail || err.message)
    } finally {
      setOptimizing(false)
    }
  }

  if (loading) return <div style={S.spinner} className="animate-pulse-glow">DECRYPTING TELEMETRY STREAM...</div>
  if (error && !data) return <div style={S.errorFull}>SYSTEM ERROR: {error}</div>

  const campaign = data?.campaign || {}
  const perf = data?.performance
  const insights = data?.learning_insights

  return (
    <div style={S.page}>
      <div style={S.breadcrumb}>
        <button style={S.breadBtn} onClick={() => navigate('/')} onMouseEnter={e => e.currentTarget.style.color = '#38bdf8'} onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}>ARCHIVES</button>
        <span style={{color: '#475569'}}>/</span>
        <button style={S.breadBtn} onClick={() => navigate(`/campaign/${id}/preview`)} onMouseEnter={e => e.currentTarget.style.color = '#38bdf8'} onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}>PROTOCOL #{id}</button>
        <span style={{color: '#475569'}}>/</span>
        <span style={{ color: '#e2e8f0' }}>TELEMETRY</span>
      </div>

      <div style={S.titleRow}>
        <div>
          <h1 style={S.title}>Protocol Telemetry Analysis</h1>
          <p style={S.objective}>{campaign.objective}</p>
        </div>
        <StatusBadge status={campaign.status} />
      </div>

      {sendMsg && <div style={S.alertGreen}>{sendMsg}</div>}
      {error && <div style={S.alertRed}>{error}</div>}

      {/* Send Panel */}
      {campaign.status === 'approved' && (
        <div style={S.sendPanel}>
          <div>
            <p style={S.sendPanelText}>AUTHORIZATION SECURED: READY FOR NETWORK DEPLOYMENT</p>
            <p style={S.sendPanelSub}>
              Will execute mapping to {campaign.segmentation_json?.selected_user_count ?? '—'} nodes.
              {campaign.send_time && ` T+${campaign.send_time} IST`}
            </p>
          </div>
          <button onClick={handleSend} disabled={sending} style={sending ? S.btnDisabled : S.btnSend} onMouseEnter={e => { if(!sending) e.currentTarget.style.boxShadow = '0 0 30px rgba(14, 165, 233, 0.6)' }} onMouseLeave={e => { if(!sending) e.currentTarget.style.boxShadow = '0 0 20px rgba(14, 165, 233, 0.4)' }}>
            {sending ? 'EXECUTING...' : 'INITIATE SEND'}
          </button>
        </div>
      )}

      {/* Performance */}
      {perf ? (
        <>
          <div style={{ ...S.section, marginBottom: 24 }}>
            <div style={S.sectionHead}><p style={S.sectionTitle}>Global Yield Network (Raw Core Output)</p></div>
            <div style={{ ...S.sectionBody, padding: '24px' }}>
              <div style={S.scoreRow}>
                <div style={S.scoreCard}>
                  <p style={S.scoreValue}>{(perf.emails_opened || 0) + (perf.emails_clicked || 0)}</p>
                  <p style={S.scoreLabel}>Total Resonance Score</p>
                  <div style={{marginTop: 12, height: 2, background: 'rgba(255,255,255,0.2)', borderRadius: 2}}>
                    <div style={{height: 2, background: '#fff', width: '100%', borderRadius: 2, boxShadow: '0 0 10px #fff'}}></div>
                  </div>
                </div>
                <div style={{ ...S.statCard, background: 'rgba(16, 185, 129, 0.05)', borderColor: 'rgba(16, 185, 129, 0.2)' }} className="hover:shadow-[0_0_20px_rgba(16,185,129,0.15)]">
                  <p style={{ ...S.statValue, color: '#34d399', fontSize: 38 }}>{perf.emails_opened}</p>
                  <p style={S.statLabel}>Target Operations Built (EO=Y)</p>
                  <p style={{ fontSize: 11, color: '#64748b', marginTop: 8, fontWeight: 500 }}>
                    {perf.emails_sent > 0 ? `YIELD: ${((perf.emails_opened / perf.emails_sent) * 100).toFixed(1)}% ENGAGEMENT` : ''}
                  </p>
                </div>
                <div style={{ ...S.statCard, background: 'rgba(168, 85, 247, 0.05)', borderColor: 'rgba(168, 85, 247, 0.2)' }} className="hover:shadow-[0_0_20px_rgba(168,85,247,0.15)]">
                  <p style={{ ...S.statValue, color: '#c084fc', fontSize: 38 }}>{perf.emails_clicked}</p>
                  <p style={S.statLabel}>Action Handshakes (EC=Y)</p>
                  <p style={{ fontSize: 11, color: '#64748b', marginTop: 8, fontWeight: 500 }}>
                    {perf.emails_sent > 0 ? `YIELD: ${((perf.emails_clicked / perf.emails_sent) * 100).toFixed(1)}% ACTION` : ''}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div style={S.twoCol}>
            <div style={{...S.section, marginBottom: 0}}>
              <div style={S.sectionHead}><p style={S.sectionTitle}>Pipeline Volume Mechanics</p></div>
              <div style={{ ...S.sectionBody, padding: '24px' }}>
                <div style={S.statsGrid}>
                  <StatCard value={perf.emails_sent} label="Outbound Volume" bg="rgba(56, 189, 248, 0.05)" color="#38bdf8" border="rgba(56, 189, 248, 0.2)" />
                  <StatCard
                    value={perf.emails_sent > 0 ? `${((perf.emails_clicked / perf.emails_sent) * 100).toFixed(1)}%` : '—'}
                    label="CTR Efficiency"
                    bg="rgba(245, 158, 11, 0.05)"
                    color="#fbbf24"
                    border="rgba(245, 158, 11, 0.2)"
                  />
                </div>
              </div>
            </div>
            <div style={{...S.section, marginBottom: 0}}>
              <div style={S.sectionHead}><p style={S.sectionTitle}>Action Integrity Vectors</p></div>
              <div style={S.sectionBody}>
                <GaugeBar label="Signal Open Rate" value={perf.open_rate || 0} color="#34d399" />
                <br />
                <GaugeBar label="Handshake Click Rate" value={perf.click_rate || 0} color="#38bdf8" />
              </div>
            </div>
          </div>
        </>
      ) : (
        <div style={{ ...S.section, marginBottom: 24 }}>
          <div style={{ ...S.sectionBody, ...S.empty }}>
            <p style={S.emptyTitle}>TELEMETRY STREAMS OFFLINE</p>
            <p style={S.emptySub}>Network operations required before telemetry matrix can engage calculations.</p>
          </div>
        </div>
      )}

      {/* AI Learning Insights */}
      {insights && (
        <div style={{ ...S.section, marginBottom: 24 }}>
          <div style={S.sectionHead}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <p style={S.sectionTitle}>Hivemind Learning Matrix Output</p>
              <span style={{
                ...S.engagementBadge,
                background: insights.engagement_level === 'high' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                color: insights.engagement_level === 'high' ? '#4ade80' : '#f87171',
                border: `1px solid ${insights.engagement_level === 'high' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                boxShadow: `0 0 10px ${insights.engagement_level === 'high' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`
              }}>
                <span className="animate-pulse-glow" style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor', boxShadow: '0 0 6px currentColor' }} />
                {insights.engagement_level === 'high' ? 'HIGH RESONANCE DETECTED' : 'LOW RESONANCE DETECTED'}
              </span>
            </div>
          </div>
          <div style={S.sectionBody}>
            <p style={S.thresholdNote}>{insights.open_rate_vs_threshold}</p>
            <div style={S.insightGrid}>
              <InsightCard title="Tone Recommendation Vector" value={insights.tone_recommendation} />
              <InsightCard title="Persona Logic Mapping" value={insights.persona_recommendation} />
              <InsightCard title="CTA Conversion Matrix" value={insights.click_through_assessment} />
            </div>
          </div>
        </div>
      )}

      {/* Optimization Loop Panel */}
      {campaign.status === 'sent' && (
        <>
          <div style={S.optPanel}>
            <div style={S.optLeft}>
              <p style={S.optTitle}>Autonomous Architecture Generation</p>
              <p style={S.optSub}>
                Neural agents will synthesize logic output, dynamically modify variable states, and generate a hyper-optimized Protocol array.
              </p>
              <div style={S.optApproverRow}>
                <input
                  style={S.optApproverInput}
                  placeholder="Identity Token (Name)"
                  value={optApprover}
                  onChange={e => setOptApprover(e.target.value)}
                  onFocus={e => e.target.style.borderColor = 'rgba(192, 132, 252, 0.6)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                />
              </div>
            </div>
            <button onClick={handleOptimize} disabled={optimizing} style={optimizing ? S.btnDisabled : S.btnOpt} onMouseEnter={e => { if(!optimizing) e.currentTarget.style.boxShadow = '0 0 30px rgba(139, 92, 246, 0.6)' }} onMouseLeave={e => { if(!optimizing) e.currentTarget.style.boxShadow = '0 0 20px rgba(139, 92, 246, 0.4)' }}>
              {optimizing ? 'CONFIGURING NETWORKS...' : 'EXECUTE HYPER-LOOP'}
            </button>
          </div>

          {optError && <div style={S.alertRed}>{optError}</div>}

          {optResult && (
            <div style={S.optResult}>
              <div style={S.optResultHead}>
                <p style={S.optResultTitle}>Synthesis Completed — New Sequence #{optResult.new_campaign_id} deployed</p>
                <button style={S.optNavBtn} onClick={() => navigate(`/campaign/${optResult.new_campaign_id}/analytics`)} onMouseEnter={e => {e.currentTarget.style.background = 'rgba(192, 132, 252, 0.1)'}} onMouseLeave={e => {e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}}>
                  Access Trace
                </button>
              </div>
              <div style={S.optResultBody}>
                <div style={S.optResultGrid}>
                  <InfoCell label="New Subject Vector" value={optResult.email_content?.subject_line} />
                  <InfoCell label="New Logic Tone" value={optResult.strategy?.tone} />
                  <InfoCell label="Recipient Volume" value={`${optResult.segmentation?.selected_user_count} entities`} />
                  <InfoCell label="Lifecycle State" value={optResult.status} />
                </div>
                <p style={{ ...S.fieldLabel, marginBottom: 8, color: '#e9d5ff', marginTop: 8 }}>Synthesis Reasoning Model Log</p>
                <div style={S.optReasonBox}>{optResult.optimization_reasoning}</div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Campaign Summary */}
      <div style={S.section}>
        <div style={S.sectionHead}><p style={S.sectionTitle}>Protocol Architecture Structure</p></div>
        <div style={S.sectionBody}>
          <div style={S.summaryGrid}>
            <InfoCell label="Initialization Goal" value={campaign.strategy_json?.campaign_goal} />
            <InfoCell label="Semantic Tone" value={campaign.strategy_json?.tone} />
            <InfoCell label="Subject Header" value={campaign.email_json?.subject_line} />
            <InfoCell label="Interaction String" value={campaign.email_json?.cta_text} />
          </div>
          {campaign.approved_by && (
            <div style={S.approvalNote}>
              Auth Logic Override By <strong style={{ color: '#e2e8f0' }}>[{campaign.approved_by}]</strong>
              {campaign.approval_timestamp &&
                ` @ T+ ${new Date(campaign.approval_timestamp).toLocaleString('en-IN')}`}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
