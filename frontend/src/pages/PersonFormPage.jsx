// frontend/src/pages/PersonFormPage.jsx

import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect }    from 'react'

export default function PersonFormPage() {
  const BASE               = import.meta.env.VITE_API_BASE_URL
  const { userId, personId } = useParams()
  const navigate           = useNavigate()

  const [form, setForm] = useState({
    name:   '',
    phone:  '',
    email:  '',
    dob:    '',
    gender: ''
  })

  // load when editing
  useEffect(() => {
    if (!personId) return
    fetch(`${BASE}/people/${personId}`)
      .then(r => r.json())
      .then(data => {
        setForm({
          name:   data.name,
          phone:  data.phone  || '',
          email:  data.email  || '',
          dob:    data.dob    ? data.dob.split('T')[0] : '',
          gender: data.gender || ''
        })
      })
      .catch(console.error)
  }, [BASE, personId])

  function handleChange(e) {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const url    = personId
      ? `${BASE}/people/${personId}`
      : `${BASE}/people`
    const method = personId ? 'PUT' : 'POST'
    const body   = personId
      ? form
      : { user_id: userId, ...form }

    await fetch(url, {
      method,
      headers:{ 'Content-Type':'application/json' },
      body: JSON.stringify(body)
    })
    navigate(`/users/${userId}/people`)
  }

  return (
    <div style={{ padding:'1em', maxWidth:400, marginLeft:'1em' }}>
      <button
        onClick={() => navigate(-1)}
        className="button"
        style={{ marginBottom:'1em' }}
      >
        ← Back to People
      </button>

      <h2 style={{ margin:'0 0 1em 0' }}>
        {personId ? `Edit Person #${personId}` : `Add New Person for User ${userId}`}
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
        <label htmlFor="name">Name</label>
        <input
          id="name"
          name="name"
          required
          value={form.name}
          onChange={handleChange}
        />

        <label htmlFor="phone">Phone</label>
        <input
          id="phone"
          name="phone"
          value={form.phone}
          onChange={handleChange}
        />

        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
        />

        <label htmlFor="dob">DOB</label>
        <input
          id="dob"
          name="dob"
          type="date"
          value={form.dob}
          onChange={handleChange}
        />

        <label htmlFor="gender">Gender</label>
        <select
          id="gender"
          name="gender"
          required
          value={form.gender}
          onChange={handleChange}
        >
          <option value="">— Select —</option>
          <option value="F">Female</option>
          <option value="M">Male</option>
          <option value="Other">Other</option>
        </select>

        {/* placeholder to push button into right column */}
        <div/>

        <button
          type="submit"
          className="button"
          style={{ width:'100%' }}
        >
          {personId ? 'Update' : 'Create'}
        </button>
      </form>
    </div>
  )
}
