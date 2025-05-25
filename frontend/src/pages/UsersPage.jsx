import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    name: '',
    username: '',
    dob: '',
    gender: ''
  });
  const navigate = useNavigate();

  const fetchUsers = () =>
    fetch('/users')
      .then(res => res.json())
      .then(setUsers)
      .catch(console.error);

  useEffect(() => {
    fetchUsers();
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleAdd(e) {
    e.preventDefault();
    await fetch('/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setForm({ name: '', username: '', dob: '', gender: '' });
    fetchUsers();
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this user and all related data?')) return;
    await fetch(`/users/${id}`, { method: 'DELETE' });
    fetchUsers();
  }

  function handleEdit(id) {
    navigate(`/users/${id}/edit`);
  }

  // NEW: call reset via fetch() and handle JSON
  async function handleResetAll() {
    if (!window.confirm('Are you sure you want to reset all data?')) return;
    try {
      const res = await fetch('/reset-all');
      const data = await res.json();
      alert(data.message);
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert('An error occurred during reset.');
    }
  }

  // NEW: call delete-sample-player via fetch() and handle JSON
  async function handleDeleteSamplePlayer() {
    if (!window.confirm('Delete the sample player (Alex Ode)?')) return;
    try {
      const res = await fetch('/delete-sample-player');
      const data = await res.json();
      alert(data.message);
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert('An error occurred during delete.');
    }
  }

  return (
    <div>
      <h2>Select a User</h2>
      <div>
        <button className="button" onClick={handleResetAll}>
          Reset All Data
        </button>
        <br />
        <button className="button" onClick={handleDeleteSamplePlayer}>
          Delete Sample Player
        </button>
      </div>

      <form onSubmit={handleAdd} style={{ marginBottom: '1em' }}>
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          required
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
        <button type="submit">Add User</button>
      </form>

      <ul>
        {users.map(u => (
          <li key={u.user_id} style={{ marginBottom: '0.5em' }}>
            <strong>{u.name}</strong> — {u.username} |{' '}
            <Link to={`/users/${u.user_id}/people`}>Manage People</Link>{' '}
            <button onClick={() => handleEdit(u.user_id)}>Edit</button>{' '}
            <button onClick={() => handleDelete(u.user_id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
