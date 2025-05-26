// frontend/src/pages/PersonFormPage.jsx

import { useState, useEffect }    from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function PersonFormPage() {
  const BASE               = process.env.REACT_APP_API_BASE_URL;
  const { userId, personId } = useParams();
  const navigate           = useNavigate();

  const [form, setForm] = useState({
    name:   '',
    phone:  '',
    email:  '',
    dob:    '',
    gender: ''
  });

  // Load existing person if editing
  useEffect(() => {
    if (!personId) return;

    fetch(`${BASE}/people?people_id=${personId}`)
      .then(r => r.json())
      .then(rows => {
        if (rows.length) {
          const p = rows[0];
          setForm({
            name:   p.name,
            phone:  p.phone  || '',
            email:  p.email  || '',
            dob:    p.dob    ? p.dob.split('T')[0] : '',
            gender: p.gender || ''
          });
        }
      })
      .catch(console.error);
  }, [BASE, personId]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const url    = personId
      ? `${BASE}/people/${personId}`
      : `${BASE}/people`;
    const method = personId ? 'PUT' : 'POST';
    const body   = personId
      ? { ...form }
      : { user_id: userId, ...form };

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(body),
    });

    navigate(`/users/${userId}/people`);
  }

  return (
    <div style={{ padding: '1em' }}>
      <h2>
        {personId
          ? `Edit Person #${personId}`
          : `Add New Person for User ${userId}`}
      </h2>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '0.75em', maxWidth: 400 }}>
        <label>
          Name
          <input
            name="name"
            required
            value={form.name}
            onChange={handleChange}
          />
        </label>

        <label>
          Phone
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
          />
        </label>

        <label>
          Email
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
          />
        </label>

        <label>
          DOB
          <input
            name="dob"
            type="date"
            value={form.dob}
            onChange={handleChange}
          />
        </label>

        <label>
          Gender
          <input
            name="gender"
            value={form.gender}
            onChange={handleChange}
          />
        </label>

        <button type="submit" className="button">
          {personId ? 'Update' : 'Create'}
        </button>
      </form>
    </div>
  );
}
