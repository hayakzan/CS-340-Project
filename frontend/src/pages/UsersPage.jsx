// frontend/src/pages/UsersPage.jsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function UsersPage() {
  const BASE = import.meta.env.VITE_API_BASE_URL;
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    name: '',
    username: '',
    dob: '',
    gender: ''
  });
  const navigate = useNavigate();

  const fetchUsers = () =>
    fetch(`${BASE}/users`)
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
    await fetch(`${BASE}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setForm({ name: '', username: '', dob: '', gender: '' });
    fetchUsers();
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this user and all related data?')) return;
    await fetch(`${BASE}/users/${id}`, { method: 'DELETE' });
    fetchUsers();
  }

  function handleEdit(id) {
    navigate(`/users/${id}/edit`);
  }

  function handleManagePeople(id) {
    navigate(`/users/${id}/people`);
  }

  const handleResetAll = async () => {
    try {
      const res = await fetch(`${BASE}/reset/reset-all`);
      await res.json();
      alert('Reset complete!');
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert('Reset failed');
    }
  };

  return (
    <div style={{ padding: '1em' }}>
      <h2>Select a User</h2>

      <div style={{ marginBottom: '1em' }}>
        <button onClick={handleResetAll} className="button">
          Reset All Data
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
        <select
          name="gender"
          value={form.gender}
          onChange={handleChange}
          required
        >
          <option value="">Select Gender</option>
          <option value="Female">Female</option>
          <option value="Male">Male</option>
          <option value="Other">Other</option>
        </select>
        <button type="submit" className="button" style={{ marginLeft: '0.5em' }}>
          Add User
        </button>
      </form>

      <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
        {users.map(u => (
          <li key={u.user_id} style={{ marginBottom: '0.5em' }}>
            <div style={{ marginBottom: '0.5em' }}>
              <strong>{u.name}</strong> — {u.username}{' '}
              <button onClick={() => handleEdit(u.user_id)} className="button" style={{ marginLeft: '0.5em' }}>
                Edit
              </button>{' '}
              <button onClick={() => handleDelete(u.user_id)} className="button" style={{ marginLeft: '0.5em' }}>
                Delete
              </button>{' '}
              <button onClick={() => handleManagePeople(u.user_id)} className="button" style={{ marginLeft: '0.5em' }}>
                Manage People
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div style={{ marginTop: '2em', textAlign: 'center' }}>
        <button
          className="button"
          style={{
            background: '#27ae60',
            color: '#fff',
            borderRadius: '8px',
            padding: '0.75em 2em',
            fontWeight: 500,
            fontSize: '1em',
            border: 'none',
            marginTop: '1em',
            boxShadow: '0 1px 2px #0002',
            cursor: 'pointer',
          }}
          onClick={async (e) => {
            e.preventDefault();
            // Custom confirm dialog
            const modal = document.createElement('dialog');
            modal.style.padding = '2em';
            modal.style.borderRadius = '12px';
            modal.innerHTML = `
              <div style="font-size:1.2em;margin-bottom:1.2em">Surely you can't be serious.</div>
              <form method="dialog" style="display:flex;gap:1em;justify-content:center">
                <button value="cancel" style="padding:0.5em 1.5em;border-radius:8px;background:#ddd;border:none;font-weight:500;font-size:1em">Cancel</button>
                <button value="go" style="padding:0.5em 1.5em;border-radius:8px;background:#2ecc71;color:#fff;border:none;font-weight:500;font-size:1em">I am serious, and don't call me Shirley</button>
              </form>
            `;
            document.body.appendChild(modal);
            modal.showModal();
            modal.addEventListener('close', () => {
              if (modal.returnValue === 'go') {
                window.location.href = 'http://classwork.engr.oregonstate.edu:4003/';
              }
              document.body.removeChild(modal);
            });
          }}
        >
          I want to go back to Mario
        </button>
      </div>
    </div>
  );
}
