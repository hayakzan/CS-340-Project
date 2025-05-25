import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect }      from 'react';

export default function UserFormPage() {
  const { userId }      = useParams();
  const navigate        = useNavigate();
  const [form, setForm] = useState({ name: '', username: '', dob: '', gender: '' });

  // If editing, load existing data
  useEffect(() => {
    if (!userId) return;
    fetch(`http://classwork.engr.oregonstate.edu:5183/users/${userId}`)
      .then(r => r.json())
      .then(data => {
        setForm({
          name:     data.name,
          username: data.username,
          dob:      data.dob ? data.dob.split('T')[0] : '',
          gender:   data.gender,
        });
      });
  }, [userId]);

  const handleSubmit = async e => {
    e.preventDefault();
    const method = userId ? 'PUT' : 'POST';
    const url    = userId ? `http://classwork.engr.oregonstate.edu:5183/users/${userId}` : 'http://classwork.engr.oregonstate.edu:5183/users';

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(form),
    });
    navigate('/users');
  };

  return (
    <div>
      <h2>{userId ? 'Edit User' : 'Add User'}</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
          />
        </label>
        <label>
          Username:
          <input
            value={form.username}
            onChange={e => setForm({ ...form, username: e.target.value })}
          />
        </label>
        <label>
          DOB:
          <input
            type="date"
            value={form.dob}
            onChange={e => setForm({ ...form, dob: e.target.value })}
          />
        </label>
        <label>
          Gender:
          <input
            value={form.gender}
            onChange={e => setForm({ ...form, gender: e.target.value })}
          />
        </label>
        <button type="submit">{userId ? 'Update' : 'Add'}</button>
      </form>
    </div>
  );
}
