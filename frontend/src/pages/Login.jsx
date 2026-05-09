import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'

export default function Login() {
  const { login } = useAuth()
  const nav = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    try {
      await login(form.email, form.password)
      nav('/dashboard')
    } catch {
      setError('Invalid credentials')
    }
  }

  return (
    <div style={styles.page}>
      <form onSubmit={submit} style={styles.card}>
        <h2 style={{textAlign:'center', color:'#4f46e5'}}>🗂️ TaskManager</h2>
        <h3 style={{textAlign:'center'}}>Login</h3>
        {error && <p style={styles.error}>{error}</p>}
        <input
          style={styles.input}
          placeholder="Email"
          value={form.email}
          onChange={e => setForm({...form, email: e.target.value})}
        />
        <input
          style={styles.input}
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={e => setForm({...form, password: e.target.value})}
        />
        <button style={styles.btn} type="submit">Login</button>
        <p style={{textAlign:'center'}}>No account? <Link to="/signup">Sign up</Link></p>
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