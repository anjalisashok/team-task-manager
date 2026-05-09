import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'

export default function Signup() {
  const { signup } = useAuth()
  const nav = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'member' })
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    try {
      await signup(form.name, form.email, form.password, form.role)
      nav('/dashboard')
    } catch(err) {
      setError(err.response?.data?.email?.[0] || err.response?.data?.error || 'Error signing up')
    }
  }

  return (
    <div style={styles.page}>
      <form onSubmit={submit} style={styles.card}>
        <h2 style={{textAlign:'center', color:'#4f46e5'}}>🗂️ TaskManager</h2>
        <h3 style={{textAlign:'center'}}>Create Account</h3>
        {error && <p style={styles.error}>{error}</p>}
        <input
          style={styles.input}
          placeholder="Full Name"
          value={form.name}
          onChange={e => setForm({...form, name: e.target.value})}
        />
        <input
          style={styles.input}
          placeholder="Email"
          value={form.email}
          onChange={e => setForm({...form, email: e.target.value})}
        />
        <input
          style={styles.input}
          placeholder="Password (min 6 chars)"
          type="password"
          value={form.password}
          onChange={e => setForm({...form, password: e.target.value})}
        />
        <select
          style={styles.input}
          value={form.role}
          onChange={e => setForm({...form, role: e.target.value})}
        >
          <option value="member">Member</option>
          <option value="admin">Admin</option>
        </select>
        <button style={styles.btn} type="submit">Create Account</button>
        <p style={{textAlign:'center'}}>Have account? <Link to="/login">Login</Link></p>
      </form>
    </div>
  )
}

const styles = {
  page: { display:'flex', justifyContent:'center', alignItems:'center', minHeight:'100vh', background:'#f0f4f8' },
  card: { background:'#fff', padding:'2rem', borderRadius:'12px', width:'340px', boxShadow:'0 4px 20px rgba(0,0,0,0.1)', display:'flex', flexDirection:'column', gap:'12px' },
  input: { padding:'10px', borderRadius:'8px', border:'1px solid #ddd', fontSize:'14px' },
  btn: { padding:'10px', background:'#4f46e5', color:'#fff', border:'none', borderRadius:'8px', cursor:'pointer', fontWeight:'bold', fontSize:'15px' },
  error: { color:'red', fontSize:'13px', textAlign:'center' }
}