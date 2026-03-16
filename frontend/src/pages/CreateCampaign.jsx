import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { createCampaign, getSettings, getDatasetPreview } from '../api/client'

const EXAMPLES = [
  'Promote SuperbFSI xDeposit to IT professionals and engineers who want high-yield fixed deposits with flexible tenures.',
  'Drive xDeposit sign-ups among doctors, pharmacists, and healthcare professionals looking to grow their savings safely.',
  'Encourage government employees and teachers to open an xDeposit account and earn competitive interest rates.',
  'Target business owners and entrepreneurs with the SuperbFSI xDeposit offer — secure, high-interest savings with instant liquidity.',
]

const S = {
  page: { maxWidth: 800, margin: '0 auto', padding: '50px 24px' },
  back: { fontSize: 12, color: '#64748b', marginBottom: 28, display: 'flex', alignItems: 'center', gap: 6, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 },
  backBtn: { background: 'none', border: 'none', padding: 0, color: '#94a3b8', fontSize: 12, cursor: 'pointer', transition: 'color 0.2s' },
  title: { fontSize: 26, fontWeight: 800, color: '#f8fafc', margin: '0 0 10px', textShadow: '0 0 15px rgba(56,189,248,0.3)', letterSpacing: '0.02em' },
  subtitle: { fontSize: 14, color: '#94a3b8', margin: '0 0 32px', lineHeight: 1.6, fontWeight: 500 },

  cohortBox: { background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: 12, padding: '18px 20px', marginBottom: 32, backdropFilter: 'blur(12px)', boxShadow: '0 0 20px rgba(16,185,129,0.1)' },
  cohortText: { fontSize: 13, color: '#34d399', fontWeight: 700, marginBottom: 4, letterSpacing: '0.05em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 8 },
  cohortSub: { fontSize: 13, color: '#6ee7b7' },
  
  csvBox: { background: 'rgba(56, 189, 248, 0.05)', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: 12, padding: '18px 20px', marginBottom: 24, backdropFilter: 'blur(12px)', boxShadow: '0 0 20px rgba(56,189,248,0.1)' },
  csvText: { fontSize: 13, color: '#38bdf8', fontWeight: 700, marginBottom: 4, letterSpacing: '0.05em', textTransform: 'uppercase' },
  csvSub: { fontSize: 13, color: '#7dd3fc' },
  
  csvWarnBox: { background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.4)', borderRadius: 12, padding: '16px 20px', marginBottom: 32 },
  csvWarnText: { fontSize: 13, color: '#fbbf24', lineHeight: 1.5 },
  csvLink: { color: '#fbbf24', cursor: 'pointer', textDecoration: 'underline', background: 'none', border: 'none', padding: 0, fontSize: 13, fontWeight: 700 },

  card: { background: 'rgba(15, 17, 26, 0.4)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: 12, padding: 32, backdropFilter: 'blur(16px)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' },
  label: { display: 'block', fontSize: 13, fontWeight: 600, color: '#cbd5e1', marginBottom: 12, letterSpacing: '0.05em', textTransform: 'uppercase' },
  textarea: { width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '14px 16px', fontSize: 15, color: '#f8fafc', resize: 'vertical', outline: 'none', boxSizing: 'border-box', lineHeight: 1.6, transition: 'all 0.3s', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)' },
  
  charCount: { fontSize: 12, color: '#64748b', marginTop: 10, marginBottom: 28, fontWeight: 500, fontFamily: 'monospace' },
  exLabel: { fontSize: 12, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 },
  
  exBtn: { display: 'block', width: '100%', textAlign: 'left', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 8, padding: '12px 16px', fontSize: 14, color: '#cbd5e1', marginBottom: 8, cursor: 'pointer', transition: 'all 0.2s', lineHeight: 1.5 },
  error: { background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 8, padding: '12px 16px', fontSize: 13, color: '#f87171', marginTop: 20 },
  
  submit: { width: '100%', background: 'linear-gradient(135deg, #0ea5e9, #3b82f6)', color: '#fff', border: 'none', borderRadius: 8, padding: '14px 0', fontSize: 15, fontWeight: 800, marginTop: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer', boxShadow: '0 0 20px rgba(14, 165, 233, 0.4)', transition: 'all 0.3s' },
  submitDisabled: { background: 'rgba(255,255,255,0.1)', boxShadow: 'none', color: '#64748b', cursor: 'not-allowed', border: '1px solid rgba(255,255,255,0.05)' },
  
  pipeline: { marginTop: 36, background: 'rgba(139, 92, 246, 0.05)', border: '1px solid rgba(139, 92, 246, 0.2)', borderRadius: 12, padding: '24px', backdropFilter: 'blur(12px)', boxShadow: '0 0 20px rgba(139, 92, 246, 0.1)' },
  pipelineTitle: { fontSize: 12, fontWeight: 700, color: '#c084fc', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16, textShadow: '0 0 10px rgba(192,132,252,0.3)' },
  pipelineRow: { display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' },
  pipelineStep: { background: 'rgba(192, 132, 252, 0.1)', border: '1px solid rgba(192, 132, 252, 0.3)', borderRadius: 6, padding: '8px 16px', fontSize: 12, fontWeight: 600, color: '#e9d5ff', letterSpacing: '0.05em' },
  pipelineArrow: { color: '#c084fc', fontSize: 16, textShadow: '0 0 8px currentColor' },
}

export default function CreateCampaign() {
  const [objective, setObjective] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [dataSource, setDataSource] = useState('api')
  const [csvInfo, setCsvInfo] = useState(null) // { row_count, columns }
  const navigate = useNavigate()

  useEffect(() => {
    getSettings()
      .then(r => {
        const s = r.data
        setDataSource(s.data_source || 'api')
        if (s.data_source === 'csv' && s.csv_uploaded) {
          getDatasetPreview()
            .then(p => setCsvInfo({ row_count: p.data.row_count, columns: p.data.columns }))
            .catch(() => {})
        }
      })
      .catch(() => {})
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!objective.trim()) return
    setLoading(true)
    setError(null)
    try {
      const res = await createCampaign(objective.trim())
      navigate(`/campaign/${res.data.campaign_id}/preview`)
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Transmission intercept error.')
    } finally {
      setLoading(false)
    }
  }

  const disabled = loading || objective.trim().length < 10

  return (
    <div style={S.page}>
      <div style={S.back}>
        <button style={S.backBtn} onClick={() => navigate('/')} onMouseEnter={e => e.currentTarget.style.color = '#38bdf8'} onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}>ARCHIVES</button>
        <span style={{color: '#475569'}}>/</span>
        <span style={{color: '#e2e8f0'}}>New Protocol Initialize</span>
      </div>

      <h1 style={S.title}>Campaign Deployment</h1>
      <p style={S.subtitle}>
        Define marketing objective vector. The embedded AI hivemind will autonomously formulate, construct, and validate the logic sequence.
      </p>

      {dataSource === 'csv' ? (
        <>
          <div style={S.csvBox}>
            <p style={S.csvText}>
              <span className="animate-pulse-glow" style={{ display: 'inline-block', width: 8, height: 8, background: '#38bdf8', borderRadius: '50%', boxShadow: '0 0 8px #38bdf8' }} />
              LOCAL ARCHIVE DATASET ACTIVE
              {csvInfo ? ` — ${csvInfo.row_count.toLocaleString()} ENTITIES` : ''}
            </p>
            <p style={S.csvSub}>
              {csvInfo
                ? `VECTORS: ${csvInfo.columns.slice(0, 5).join(', ')}${csvInfo.columns.length > 5 ? ', ...' : ''}`
                : 'NO FILE UPLOADED — NAVIGATE TO SETTINGS DIRECTORY.'}
            </p>
          </div>
          <div style={S.csvWarnBox}>
            <p style={S.csvWarnText}>
              Identities must match the active global CampaignX cohort to ensure sync. To recalibrate to live cohort stream, open <button style={S.csvLink} onClick={() => navigate('/settings')}>System Settings</button>.
            </p>
          </div>
        </>
      ) : (
        <div style={S.cohortBox}>
          <p style={S.cohortText}>
            <span className="animate-pulse-glow" style={{ display: 'inline-block', width: 8, height: 8, background: '#34d399', borderRadius: '50%', boxShadow: '0 0 8px #34d399' }} />
            LIVE COHORT: 1,000 NODES SECURED
          </p>
          <p style={S.cohortSub}>Autonomous array will filter optimal engagement vectors at execution runtime.</p>
        </div>
      )}

      <form onSubmit={handleSubmit} style={S.card}>
        <label style={S.label}>
          Objective Directive <span style={{ color: '#38bdf8' }}>*</span>
        </label>
        <textarea
          value={objective}
          onChange={(e) => setObjective(e.target.value)}
          rows={6}
          placeholder="Enter objective. E.g., Deploy SuperbFSI xDeposit vectors to software engineers..."
          style={S.textarea}
          onFocus={e => e.target.style.borderColor = 'rgba(56, 189, 248, 0.5)'}
          onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
        />
        <p style={S.charCount}>{objective.length} bytes / Minimum 10 bytes</p>

        <p style={S.exLabel}>Suggested Vectors</p>
        {EXAMPLES.map((ex, i) => (
          <button key={i} type="button" style={S.exBtn} onClick={() => setObjective(ex)} onMouseEnter={e => {e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(56,189,248,0.3)'}} onMouseLeave={e => {e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'}}>
            {ex}
          </button>
        ))}

        {error && <div style={S.error}>{error}</div>}

        <button
          type="submit"
          disabled={disabled}
          style={{ ...S.submit, ...(disabled ? S.submitDisabled : {}) }}
          onMouseEnter={e => { if(!disabled) e.currentTarget.style.boxShadow = '0 0 30px rgba(14, 165, 233, 0.6)' }}
          onMouseLeave={e => { if(!disabled) e.currentTarget.style.boxShadow = '0 0 20px rgba(14, 165, 233, 0.4)' }}
        >
          {loading ? 'EXECUTING PIPELINE...' : 'INITIALIZE NEURAL SECUENCE'}
        </button>
      </form>

      <div style={S.pipeline}>
        <p style={S.pipelineTitle}>Architecture Routing Protocol</p>
        <div style={S.pipelineRow}>
          {['STRATEGY CORE', 'CONTENT MATRIX', 'COMPLIANCE CHECK', 'SEGMENTATION LOGIC', 'MANUAL OVERRIDE'].map((step, i, arr) => (
            <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={S.pipelineStep}>{step}</span>
              {i < arr.length - 1 && <span style={S.pipelineArrow} className="animate-pulse-glow">→</span>}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
