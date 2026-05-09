import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

export default function Dashboard() {
  const { user, logout } = useAuth()
  const nav = useNavigate()
  const [data, setData] = useState(null)

  useEffect(() => {
    api.get('/tasks/dashboard/').then(r => setData(r.data)).catch(console.error)
  }, [])

  const statusColor = { 'todo':'#6b7280', 'in-progress':'#f59e0b', 'done':'#10b981' }

  return (
    <div style={styles.page}>
      <nav style={styles.nav}>
        <b style={{fontSize:'18px'}}>🗂️ TaskManager</b>
        <div style={{display:'flex', gap:'16px', alignItems:'center'}}>
          <span onClick={() => nav('/projects')} style={styles.link}>Projects</span>
          <span style={styles.role}>{user?.role}</span>
          <button onClick={() => { logout(); nav('/login') }} style={styles.logoutBtn}>Logout</button>
        </div>
      </nav>
      <div style={styles.content}>
        <h2>Welcome, {user?.username} 👋</h2>
        {data ? (
          <>
            <div style={styles.statsRow}>
              <div style={styles.stat}>
                <h3 style={{margin:0, fontSize:'32px', color:'#4f46e5'}}>{data.total}</h3>
                <p style={{margin:0, color:'#6b7280'}}>Total Tasks</p>
              </div>
              {data.byStatus.map(s => (
                <div key={s.status} style={{...styles.stat, borderTop:`4px solid ${statusColor[s.status] || '#4f46e5'}`}}>
                  <h3 style={{margin:0, fontSize:'32px'}}>{s.count}</h3>
                  <p style={{margin:0, color:'#6b7280', textTransform:'capitalize'}}>{s.status}</p>
                </div>
              ))}
            </div>
            <h3 style={{marginTop:'2rem'}}>⚠️ Overdue Tasks ({data.overdue.length})</h3>
            {data.overdue.length === 0
              ? <p style={{color:'#6b7280'}}>No overdue tasks 🎉</p>
              : data.overdue.map(t => (
                <div key={t.id} style={styles.overdueCard}>
                  <b>{t.title}</b>
                  <span style={{color:'red'}}>Due: {new Date(t.due_date).toLocaleDateString()}</span>
                  <span style={{color:'#6b7280'}}>{t.project_name}</span>
                </div>
              ))
            }
          </>
        ) : <p>Loading dashboard...</p>}
      </div>
    </div>
  )
}

const styles = {
  page: { minHeight:'100vh', background:'#f0f4f8', fontFamily:'sans-serif' },
  nav: { background:'#4f46e5', color:'#fff', padding:'1rem 2rem', display:'flex', justifyContent:'space-between', alignItems:'center' },
  link: { cursor:'pointer', color:'#c7d2fe' },
  role: { background:'rgba(255,255,255,0.2)', padding:'2px 10px', borderRadius:'20px', fontSize:'12px', textTransform:'capitalize' },
  logoutBtn: { background:'transparent', border:'1px solid #fff', color:'#fff', padding:'4px 12px', borderRadius:'6px', cursor:'pointer' },
  content: { padding:'2rem', maxWidth:'900px', margin:'0 auto' },
  statsRow: { display:'flex', gap:'16px', flexWrap:'wrap', marginTop:'1rem' },
  stat: { background:'#fff', padding:'1.5rem', borderRadius:'12px', minWidth:'140px', textAlign:'center', boxShadow:'0 2px 8px rgba(0,0,0,0.06)', borderTop:'4px solid #4f46e5' },
  overdueCard: { background:'#fff', padding:'1rem', borderRadius:'8px', marginBottom:'8px', display:'flex', justifyContent:'space-between', alignItems:'center', border:'1px solid #fecaca' }
}