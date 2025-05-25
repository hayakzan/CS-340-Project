// src/pages/PersonFormPage.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function PersonFormPage() {
  const { userId, personId } = useParams();
  const nav = useNavigate();

  const [form, setForm] = useState({
    name:   '',
    phone:  '',
    email:  '',
    dob:    '',
    gender: ''
  });

  useEffect(() => {
    if (!personId) return;
    fetch(`http://classwork.engr.oregonstate.edu:5183/people?people_id=${personId}`)
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
      });
  }, [personId]);

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const url    = personId ? `http://classwork.engr.oregonstate.edu:5183/people/${personId}` : `http://classwork.engr.oregonstate.edu:5183/people`;
    const method = personId ? 'PUT' : 'POST';
    const body   = personId
      ? { name: form.name, phone: form.phone, email: form.email, dob: form.dob, gender: form.gender }
      : { user_id: userId, name: form.name, phone: form.phone, email: form.email, dob: form.dob, gender: form.gender };

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    // After saving, go back to the people list for this user
    nav(`/users/${userId}/people`);
  }

  return (
    <div>
      <h2>
        {personId ? `Edit Person ${personId}` : 'Add New Person'} for User {userId}
      </h2>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 8, maxWidth: 400 }}>
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

        <button type="submit">{personId ? 'Update' : 'Create'}</button>
      </form>
    </div>
  );
}
