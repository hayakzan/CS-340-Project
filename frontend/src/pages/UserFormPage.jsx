// frontend/src/pages/UserFormPage.jsx

import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect }    from 'react'

export default function UserFormPage() {
  const BASE     = import.meta.env.VITE_API_BASE_URL
  const { userId } = useParams()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name:     '',
    username: '',
    dob:      '',
    gender:   ''
  })

  // load existing user when editing
  useEffect(() => {
    if (!userId) return
    fetch(`${BASE}/users/${userId}`)
      .then(r => r.json())
      .then(data => {
        setForm({
          name:     data.name,
          username: data.username,
          dob:      data.dob ? data.dob.split('T')[0] : '',
          gender:   data.gender || ''
        })
      })
      .catch(console.error)
  }, [BASE, userId])

  function handleChange(e) {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const url    = userId ? `${BASE}/users/${userId}` : `${BASE}/users`
    const method = userId ? 'PUT' : 'POST'

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(form)
    })

    navigate('/users')
  }

  return (
    <div
      style={{
        padding:   '1em',
        maxWidth:  400,
        marginLeft:'1em'
      }}
    >
      <button
        onClick={() => navigate('/users')}
        className="button"
        style={{ marginBottom: '1em' }}
      >
        ← Back to Users
      </button>

      <h2 style={{ margin: '0 0 1em 0' }}>
        {userId ? 'Edit User' : 'Add User'}
      </h2>

      <form
        onSubmit={handleSubmit}
        style={{
          display:             'grid',
          gridTemplateColumns: 'max-content 1fr',
          gap:                 '0.5em 1em',
          alignItems:          'center'
        }}
      >
        <label htmlFor="name">Name:</label>
        <input
          id="name"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <label htmlFor="username">Username:</label>
        <input
          id="username"
          name="username"
          value={form.username}
          onChange={handleChange}
          required
        />

        <label htmlFor="dob">DOB:</label>
        <input
          id="dob"
          name="dob"
          type="date"
          value={form.dob}
          onChange={handleChange}
        />

        <label htmlFor="gender">Gender:</label>
        <select
          id="gender"
          name="gender"
          value={form.gender}
          onChange={handleChange}
          required
        >
          <option value="">— Select —</option>
          <option value="Female">Female</option>
          <option value="Male">Male</option>
          <option value="Other">Other</option>
        </select>

        {/* keeps the button in the right column */}
        <div />

        <button
          type="submit"
          className="button"
          style={{ width: '100%' }}
        >
          {userId ? 'Update' : 'Add'}
        </button>
      </form>
    </div>
  )
}
