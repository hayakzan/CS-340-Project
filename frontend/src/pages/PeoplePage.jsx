// frontend/src/pages/PeoplePage.jsx

import { useParams, useNavigate, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function PeoplePage() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const BASE = import.meta.env.VITE_API_BASE_URL;

  const [user, setUser]     = useState(null);
  const [people, setPeople] = useState([]);
  const [form, setForm]     = useState({
    name: '', phone: '', email: '', dob: '', gender: ''
  });

  useEffect(() => {
    // fetch the single user so we can show username
    fetch(`${BASE}/users/${userId}`)
      .then(r => r.json())
      .then(setUser)
      .catch(console.error);

    // fetch that user’s people
    fetch(`${BASE}/people?user_id=${userId}`)
      .then(r => r.json())
      .then(setPeople)
      .catch(console.error);
  }, [BASE, userId]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }

  async function handleAdd(e) {
    e.preventDefault();

    await fetch(`${BASE}/people`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, ...form }),
    });

    setForm({ name: '', phone: '', email: '', dob: '', gender: '' });

    // Refresh the people list
    const r = await fetch(`${BASE}/people?user_id=${userId}`);
    setPeople(await r.json());
  }

  async function handleDelete(pid) {
    if (!window.confirm('Delete this person and all related data?')) return;

    await fetch(`${BASE}/people/${pid}`, { method: 'DELETE' });
    navigate('/users');
  }

  function handleEdit(pid) {
    navigate(`/users/${userId}/people/${pid}/edit`);
  }

  if (!user) return <p>Loading…</p>;

  return (
    <div style={{ padding: '1em' }}>
      {/* Back to Users */}
      <p>
        <Link to="/users">← Back to Users</Link>
      </p>

      <h2>People for {user.username}</h2>

      {/* Add Person Form */}
      <form onSubmit={handleAdd} style={{ marginBottom: '1em' }}>
        <input
          name="name"
          required
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
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
        <input
          name="gender"
          placeholder="Gender"
          value={form.gender}
          onChange={handleChange}
        />
        <button type="submit" className="button">
          Add Person
        </button>
      </form>

      {/* People List */}
      <ul>
        {people.map(p => (
          <li key={p.people_id} style={{ marginBottom: '0.5em' }}>
            <strong>{p.name}</strong> — {p.phone || 'N/A'} | {p.email || 'N/A'}{' '}
            <button onClick={() => handleEdit(p.people_id)} className="button">
              Edit
            </button>{' '}
            <button onClick={() => handleDelete(p.people_id)} className="button">
              Delete
            </button>{' '}
            —{' '}
            <Link to={`/users/${userId}/people/${p.people_id}`}>
              Details
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
