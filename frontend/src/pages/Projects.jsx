import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

export default function Projects() {
  const { user } = useAuth()
  const nav = useNavigate()
  const [projects, setProjects] = useState([])
  const [users, setUsers] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', description: '', member_ids: [] })

  const load = () => {
    api.get('/projects/').then(r => setProjects(r.data))
    api.get('/users/').then(r => setUsers(r.data))
  }

  useEffect(() => { load() }, [])

  const create = async () => {
    if (!form.name) return alert('Project name is required')
    await api.post('/projects/', form)
    setShowForm(false)
    setForm({ name: '', description: '', member_ids: [] })
    load()
  }

  const remove = async (id) => {
    if (!window.confirm('Delete this project?')) return
    await api.delete(`/projects/${id}/`)
    setProjects(prev => prev.filter(p => p.id !== id))
  }

  return (
    <div style={styles.page}>
      <div style={styles.nav}>
        <span onClick={() => nav('/dashboard')} style={{cursor:'pointer'}}>← Dashboard</span>
        <b>Projects</b>
        <button onClick={() => setShowForm(true)} style={styles.btn}>+ New Project</button>
      </div>
      <div style={styles.content}>
        {showForm && (
          <div style={styles.modal}>
            <h3>New Project</h3>
            <input
              style={styles.input}
              placeholder="Project Name *"
              value={form.name}
              onChange={e => setForm({...form, name: e.target.value})}
            />
            <textarea
              style={styles.input}
              placeholder="Description (optional)"
              value={form.description}
              onChange={e => setForm({...form, description: e.target.value})}
            />
            <label style={{fontSize:'13px', color:'#6b7280'}}>Add Members (Ctrl+Click to select multiple)</label>
            <select
              multiple
              style={{...styles.input, height:'120px'}}
              onChange={e => setForm({...form, member_ids: Array.from(e.target.selectedOptions, o => parseInt(o.value))})}
            >
              {users.filter(u => u.id !== user?.id).map(u => (
                <option key={u.id} value={u.id}>{u.username} — {u.role}</option>
              ))}
            </select>
            <div style={{display:'flex', gap:'8px'}}>
              <button onClick={create} style={styles.btn}>Create</button>
              <button onClick={() => setShowForm(false)} style={styles.cancelBtn}>Cancel</button>
            </div>
          </div>
        )}
        <div style={styles.grid}>
          {projects.map(p => (
            <div key={p.id} style={styles.card}>
              <h3 style={{margin:'0 0 8px'}}>{p.name}</h3>
              <p style={{color:'#6b7280', fontSize:'14px', margin:'0 0 8px'}}>{p.description || 'No description'}</p>
              <p style={{color:'#4f46e5', fontSize:'13px', margin:'0 0 12px'}}>📋 {p.task_count} tasks</p>
              <div style={{display:'flex', gap:'8px'}}>
                <button onClick={() => nav(`/projects/${p.id}`)} style={styles.btn}>Open</button>
                {(p.owner_id === user?.id || user?.role === 'admin') &&
                  <button onClick={() => remove(p.id)} style={styles.dangerBtn}>Delete</button>}
              </div>
            </div>
          ))}
          {projects.length === 0 && <p style={{color:'#6b7280'}}>No projects yet. Create one!</p>}
        </div>
      </div>
    </div>
  )
}

const styles = {
  page: { minHeight:'100vh', background:'#f0f4f8', fontFamily:'sans-serif' },
  nav: { background:'#4f46e5', color:'#fff', padding:'1rem 2rem', display:'flex', justifyContent:'space-between', alignItems:'center' },
  content: { padding:'2rem', maxWidth:'1000px', margin:'0 auto' },
  grid: { display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:'16px' },
  card: { background:'#fff', padding:'1.5rem', borderRadius:'12px', boxShadow:'0 2px 8px rgba(0,0,0,0.06)' },
  modal: { background:'#fff', padding:'1.5rem', borderRadius:'12px', marginBottom:'1.5rem', boxShadow:'0 4px 20px rgba(0,0,0,0.1)', display:'flex', flexDirection:'column', gap:'10px' },
  input: { padding:'10px', borderRadius:'8px', border:'1px solid #ddd', fontSize:'14px', width:'100%', boxSizing:'border-box' },
  btn: { background:'#4f46e5', color:'#fff', border:'none', padding:'8px 16px', borderRadius:'8px', cursor:'pointer', fontWeight:'bold' },
  cancelBtn: { background:'#e5e7eb', color:'#374151', border:'none', padding:'8px 16px', borderRadius:'8px', cursor:'pointer' },
  dangerBtn: { background:'#ef4444', color:'#fff', border:'none', padding:'8px 16px', borderRadius:'8px', cursor:'pointer' }
}