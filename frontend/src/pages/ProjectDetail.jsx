import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api/axios'

const STATUS = ['todo', 'in-progress', 'done']
const PRIORITY = ['low', 'medium', 'high']

export default function ProjectDetail() {
  const { id } = useParams()
  const nav = useNavigate()
  const [project, setProject] = useState(null)
  const [tasks, setTasks] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title:'', description:'', status:'todo', priority:'medium', due_date:'', assigned_to:'' })

  const load = async () => {
    const [proj, tsk] = await Promise.all([
      api.get(`/projects/${id}/`),
      api.get(`/tasks/?projectId=${id}`)
    ])
    setProject(proj.data)
    setTasks(tsk.data)
  }

  useEffect(() => { load() }, [id])

  const createTask = async () => {
    if (!form.title) return alert('Task title is required')
    await api.post('/tasks/', {
      ...form,
      project: parseInt(id),
      assigned_to: form.assigned_to ? parseInt(form.assigned_to) : null,
      due_date: form.due_date || null
    })
    setShowForm(false)
    setForm({ title:'', description:'', status:'todo', priority:'medium', due_date:'', assigned_to:'' })
    load()
  }

  const updateStatus = async (taskId, status) => {
    await api.patch(`/tasks/${taskId}/`, { status })
    load()
  }

  const deleteTask = async (taskId) => {
    if (!window.confirm('Delete this task?')) return
    await api.delete(`/tasks/${taskId}/`)
    load()
  }

  const statusColor = { 'todo':'#6b7280', 'in-progress':'#f59e0b', 'done':'#10b981' }
  const priorityColor = { 'low':'#10b981', 'medium':'#f59e0b', 'high':'#ef4444' }

  if (!project) return <div style={{padding:'2rem'}}>Loading...</div>

  return (
    <div style={{minHeight:'100vh', background:'#f0f4f8', fontFamily:'sans-serif'}}>
      <div style={{padding:'1rem 2rem', background:'#4f46e5', color:'#fff', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <span onClick={() => nav('/projects')} style={{cursor:'pointer'}}>← Projects</span>
        <b>{project.name}</b>
        <button onClick={() => setShowForm(true)} style={{background:'#fff', color:'#4f46e5', border:'none', padding:'8px 16px', borderRadius:'8px', cursor:'pointer', fontWeight:'bold'}}>+ New Task</button>
      </div>

      <div style={{padding:'2rem', maxWidth:'1000px', margin:'0 auto'}}>
        <div style={{background:'#fff', padding:'1rem', borderRadius:'8px', marginBottom:'1rem'}}>
          <b>Team Members: </b>
          {project.members?.length > 0
            ? project.members.map(m => (
              <span key={m.id} style={{background:'#e0e7ff', color:'#4f46e5', padding:'2px 10px', borderRadius:'20px', fontSize:'13px', marginLeft:'6px'}}>{m.username}</span>
            ))
            : <span style={{color:'#6b7280'}}>No members added</span>
          }
        </div>

        {showForm && (
          <div style={{background:'#fff', padding:'1.5rem', borderRadius:'12px', marginBottom:'1.5rem', display:'flex', flexDirection:'column', gap:'10px'}}>
            <h3 style={{margin:0}}>New Task</h3>
            <input style={inp} placeholder="Task title *" value={form.title} onChange={e => setForm({...form, title:e.target.value})} />
            <textarea style={inp} placeholder="Description" value={form.description} onChange={e => setForm({...form, description:e.target.value})} />
            <select style={inp} value={form.status} onChange={e => setForm({...form, status:e.target.value})}>
              {STATUS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select style={inp} value={form.priority} onChange={e => setForm({...form, priority:e.target.value})}>
              {PRIORITY.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <input style={inp} type="date" value={form.due_date} onChange={e => setForm({...form, due_date:e.target.value})} />
            <select style={inp} value={form.assigned_to} onChange={e => setForm({...form, assigned_to:e.target.value})}>
              <option value="">Unassigned</option>
              {project.members?.map(m => <option key={m.id} value={m.id}>{m.username}</option>)}
            </select>
            <div style={{display:'flex', gap:'8px'}}>
              <button onClick={createTask} style={{background:'#4f46e5', color:'#fff', border:'none', padding:'8px 16px', borderRadius:'8px', cursor:'pointer', fontWeight:'bold'}}>Create Task</button>
              <button onClick={() => setShowForm(false)} style={{background:'#e5e7eb', border:'none', padding:'8px 16px', borderRadius:'8px', cursor:'pointer'}}>Cancel</button>
            </div>
          </div>
        )}

        <div style={{display:'flex', flexDirection:'column', gap:'12px'}}>
          {tasks.map(t => (
            <div key={t.id} style={{background:'#fff', padding:'1rem 1.5rem', borderRadius:'10px', display:'flex', justifyContent:'space-between', alignItems:'center', borderLeft:`4px solid ${statusColor[t.status]}`}}>
              <div>
                <b>{t.title}</b>
                {t.description && <p style={{margin:'4px 0 0', color:'#6b7280', fontSize:'13px'}}>{t.description}</p>}
                <div style={{display:'flex', gap:'8px', marginTop:'6px', flexWrap:'wrap', alignItems:'center'}}>
                  <span style={{background:priorityColor[t.priority], color:'#fff', padding:'2px 8px', borderRadius:'20px', fontSize:'11px'}}>{t.priority}</span>
                  <span style={{color:'#6b7280', fontSize:'12px'}}>👤 {t.assignee_name || 'Unassigned'}</span>
                  {t.due_date && (
                    <span style={{color: new Date(t.due_date) < new Date() && t.status !== 'done' ? 'red' : '#6b7280', fontSize:'12px'}}>
                      📅 {new Date(t.due_date).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
              <div style={{display:'flex', gap:'8px', alignItems:'center'}}>
                <select
                  value={t.status}
                  onChange={e => updateStatus(t.id, e.target.value)}
                  style={{padding:'4px 8px', borderRadius:'6px', border:'1px solid #ddd', fontSize:'13px'}}
                >
                  {STATUS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <button onClick={() => deleteTask(t.id)} style={{background:'#ef4444', color:'#fff', border:'none', padding:'4px 10px', borderRadius:'6px', cursor:'pointer'}}>✕</button>
              </div>
            </div>
          ))}
          {tasks.length === 0 && <p style={{color:'#6b7280', textAlign:'center'}}>No tasks yet. Create one above!</p>}
        </div>
      </div>
    </div>
  )
}

const inp = { padding:'10px', borderRadius:'8px', border:'1px solid #ddd', fontSize:'14px', width:'100%', boxSizing:'border-box' }