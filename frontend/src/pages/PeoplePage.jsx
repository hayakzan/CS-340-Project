// frontend/src/pages/PeoplePage.jsx
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function PeoplePage() {
  const { userId } = useParams();
  const navigate    = useNavigate();

  const [user, setUser]     = useState(null);
  const [people, setPeople] = useState([]);
  const [form, setForm]     = useState({
    name: '', phone: '', email: '', dob: '', gender: ''
  });

  useEffect(() => {
    // fetch the single user so we can show username
    fetch(`/users/${userId}`)
      .then(r => r.json())
      .then(setUser)
      .catch(console.error);

    // fetch that user’s people
    fetch(`/people?user_id=${userId}`)
      .then(r => r.json())
      .then(setPeople)
      .catch(console.error);
  }, [userId]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }

  async function handleAdd(e) {
    e.preventDefault();
    await fetch('/people', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, ...form }),
    });
    setForm({ name: '', phone: '', email: '', dob: '', gender: '' });
    const r = await fetch(`/people?user_id=${userId}`);
    setPeople(await r.json());
  }

  async function handleDelete(pid) {
    // prompt for confirmation
    if (
      !window.confirm(
        'Delete this person and all related data?'
      )
    ) return;

    await fetch(`/people/${pid}`, { method: 'DELETE' });
    // once deleted, return to the users list
    navigate('/users');
  }

  function handleEdit(pid) {
    navigate(`/users/${userId}/people/${pid}/edit`);
  }

  if (!user) return <p>Loading…</p>;

  return (
    <div>
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
        <button type="submit">Add Person</button>
      </form>

      {/* People List */}
      <ul>
        {people.map(p => (
          <li key={p.people_id} style={{ marginBottom: '0.5em' }}>
            <strong>{p.name}</strong> — {p.phone || 'N/A'} | {p.email || 'N/A'}{' '}
            <button onClick={() => handleEdit(p.people_id)}>Edit</button>{' '}
            <button onClick={() => handleDelete(p.people_id)}>Delete</button>{' '}
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
