// frontend/src/pages/UserFormPage.jsx

import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect }      from 'react';

export default function UserFormPage() {
  // Use VITE_API_BASE_URL 
  const BASE       = import.meta.env.VITE_API_BASE_URL;
  const { userId } = useParams();
  const navigate   = useNavigate();

  const [form, setForm] = useState({
    name:     '',
    username: '',
    dob:      '',
    gender:   ''
  });

  // If editing, load existing data
  useEffect(() => {
    if (!userId) return;

    fetch(`${BASE}/users/${userId}`)
      .then(r => r.json())
      .then(data => {
        setForm({
          name:     data.name,
          username: data.username,
          dob:      data.dob ? data.dob.split('T')[0] : '',
          gender:   data.gender
        });
      })
      .catch(console.error);
  }, [BASE, userId]);

  const handleSubmit = async e => {
    e.preventDefault();

    const method = userId ? 'PUT' : 'POST';
    const url    = userId
      ? `${BASE}/users/${userId}`
      : `${BASE}/users`;

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(form),
    });

    navigate('/users');
  };

  return (
    <div style={{ padding: '1em' }}>
      <h2>{userId ? 'Edit User' : 'Add User'}</h2>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '0.5em' }}>
        <label>
          Name:
          <input
            name="name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            required
          />
        </label>
        <label>
          Username:
          <input
            name="username"
            value={form.username}
            onChange={e => setForm({ ...form, username: e.target.value })}
            required
          />
        </label>
        <label>
          DOB:
          <input
            name="dob"
            type="date"
            value={form.dob}
            onChange={e => setForm({ ...form, dob: e.target.value })}
          />
        </label>
        <label>
          Gender:
          <input
            name="gender"
            value={form.gender}
            onChange={e => setForm({ ...form, gender: e.target.value })}
          />
        </label>
        <button type="submit" className="button">
          {userId ? 'Update' : 'Add'}
        </button>
      </form>
    </div>
  );
}
