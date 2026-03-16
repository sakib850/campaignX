import { useNavigate, useLocation } from 'react-router-dom'

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <nav style={{ 
      background: 'rgba(10, 15, 30, 0.65)', 
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      boxShadow: '0 4px 30px rgba(0, 0, 0, 0.5)'
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button
          onClick={() => navigate('/')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, padding: 0 }}
        >
          <div style={{ 
            width: 36, height: 36, 
            background: 'linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%)', 
            borderRadius: 8, 
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 16px rgba(14, 165, 233, 0.5)'
          }}>
            <span style={{ color: '#fff', fontWeight: 800, fontSize: 16, letterSpacing: '1px' }}>M</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <span style={{ fontWeight: 800, fontSize: 16, color: '#f8fafc', letterSpacing: '0.5px' }}>MailPilot</span>
            <span style={{ fontSize: 10, color: '#38bdf8', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase' }}>AI Core <span style={{color: '#94a3b8'}}>· XPECTO 2026</span></span>
          </div>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.03)', padding: '4px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <NavLink label="Dashboard" path="/" current={location.pathname === '/'} onClick={() => navigate('/')} />
          <NavLink label="Coverage" path="/coverage" current={location.pathname === '/coverage'} onClick={() => navigate('/coverage')} />
          <NavLink label="New Campaign" path="/create" current={location.pathname === '/create'} onClick={() => navigate('/create')} />
          <NavLink label="Settings" path="/settings" current={location.pathname === '/settings'} onClick={() => navigate('/settings')} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span className="animate-pulse-glow" style={{ width: 8, height: 8, background: '#22d3ee', borderRadius: '50%', display: 'inline-block', boxShadow: '0 0 8px #22d3ee' }} />
            <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500, letterSpacing: '0.05em' }}>LLaMA 3.3 · GROQ</span>
          </div>
          <div style={{
            background: 'rgba(139, 92, 246, 0.1)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            boxShadow: '0 0 12px rgba(139, 92, 246, 0.2)',
            borderRadius: 6,
            padding: '5px 12px',
            fontSize: 12,
            fontWeight: 700,
            color: '#c084fc',
            letterSpacing: '0.05em',
            display: 'flex', alignItems: 'center', gap: 6
          }}>
            <span style={{color: '#e9d5ff'}}>EO+EC</span> 989
          </div>
        </div>
      </div>
    </nav>
  )
}

function NavLink({ label, path, current, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: current ? 'rgba(56, 189, 248, 0.1)' : 'transparent',
        border: 'none',
        cursor: 'pointer',
        padding: '6px 14px',
        borderRadius: 6,
        fontSize: 13,
        fontWeight: current ? 600 : 500,
        color: current ? '#38bdf8' : '#94a3b8',
        boxShadow: current ? 'inset 0 0 10px rgba(56, 189, 248, 0.1)' : 'none',
        transition: 'all 0.2s',
      }}
      onMouseEnter={(e) => {
        if (!current) e.currentTarget.style.color = '#e2e8f0';
      }}
      onMouseLeave={(e) => {
        if (!current) e.currentTarget.style.color = '#94a3b8';
      }}
    >
      {label}
    </button>
  )
}
