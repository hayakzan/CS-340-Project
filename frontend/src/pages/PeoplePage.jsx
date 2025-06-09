// frontend/src/pages/PeoplePage.jsx

import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

export default function PeoplePage() {
  const { userId } = useParams()
  const navigate = useNavigate()
  const BASE = import.meta.env.VITE_API_BASE_URL

  const [user, setUser] = useState(null)
  const [people, setPeople] = useState([])
  const [form, setForm] = useState({
    name: '', phone: '', email: '', dob: '', gender: ''
  })

  async function loadAll() {
    try {
      const [uRes, pRes] = await Promise.all([
        fetch(`${BASE}/users/${userId}`),
        fetch(`${BASE}/people?user_id=${userId}`)
      ])
      setUser(await uRes.json())
      setPeople(await pRes.json())
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    loadAll()
  }, [BASE, userId])

  function handleChange(e) {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }

  async function handleAdd(e) {
    e.preventDefault()
    await fetch(`${BASE}/people`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, ...form }),
    })
    setForm({ name: '', phone: '', email: '', dob: '', gender: '' })
    loadAll()
  }

  async function handleDelete(pid) {
    if (!window.confirm('Delete this person and all related data?')) return
    await fetch(`${BASE}/people/${pid}`, { method: 'DELETE' })
    navigate('/users')
  }

  function handleEdit(pid) {
    navigate(`/users/${userId}/people/${pid}/edit`)
  }

  function handleDetails(pid) {
    navigate(`/users/${userId}/people/${pid}`)
  }

  async function handleResetAll() {
    try {
      await fetch(`${BASE}/reset/reset-all`)
      alert('Reset complete!')
      loadAll()
    } catch (err) {
      console.error(err)
      alert('Reset failed')
    }
  }

  if (!user) return <p>Loading…</p>

  return (
    <div style={{ padding: '1em' }}>
      <div style={{ 
        marginBottom: '1em', 
        display: 'flex', 
        width: '100%',
        gap: '24em'  
      }}>
        <button onClick={() => navigate('/users')} className="button">
          ← Back to Users
        </button>
        <button onClick={handleResetAll} className="button">
          Reset All Data
        </button>
      </div>

      <h2>People for {user.username}</h2>

      {/* Add person form */}
      <form
        onSubmit={handleAdd}
        style={{ marginBottom: '1em', display: 'flex', gap: '0.5em' }}
      >
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />
        <input
          name="dob"
          type="date"
          value={form.dob}
          onChange={handleChange}
        />
        <select
          name="gender"
          value={form.gender}
          onChange={handleChange}
          required
        >
          <option value="">— Gender —</option>
          <option value="Female">Female</option>
          <option value="Male">Male</option>
          <option value="Other">Other</option>
        </select>
        <button type="submit" className="button">
          Add Person
        </button>
      </form>

      {/* People list */}
      <ul style={{ paddingLeft: 0, listStyle: 'none' }}>
        {people.map(p => (
          <li key={p.people_id} style={{ marginBottom: '0.5em' }}>
            <strong>{p.name}</strong> — {p.phone || 'N/A'} | {p.email || 'N/A'}{' '}
            <button
              onClick={() => handleEdit(p.people_id)}
              className="button"
            >
              Edit
            </button>{' '}
            <button
              onClick={() => handleDelete(p.people_id)}
              className="button"
            >
              Delete
            </button>{' '}
            <button
              onClick={() => handleDetails(p.people_id)}
              className="button"
            >
              Details
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
