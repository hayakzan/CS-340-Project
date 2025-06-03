// frontend/src/pages/PersonFormPage.jsx

import { useState, useEffect }    from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function PersonFormPage() {
  // — use the Vite env
  const BASE               = import.meta.env.VITE_API_BASE_URL;
  const { userId, personId } = useParams();
  const navigate           = useNavigate();

  const [form, setForm] = useState({
    name:   '',
    phone:  '',
    email:  '',
    dob:    '',
    gender: ''
  });

  useEffect(() => {
    // If there is no personId, clear out the form (new‑person mode)
    if (!personId) {
      setForm({
        name:   '',
        phone:  '',
        email:  '',
        dob:    '',
        gender: ''
      });
      return;
    }

    // Editing an existing person: fetch via GET /people/:personId
    fetch(`${BASE}/people/${personId}`)
      .then(r => r.json())
      .then(data => {
        // the API should return exactly one object
        // (make sure your backend GET /people/:personId returns an object, not an array)
        setForm({
          name:   data.name,
          phone:  data.phone  || '',
          email:  data.email  || '',
          dob:    data.dob    ? data.dob.slice(0,10) : '',
          gender: data.gender || ''
        });
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

      <form
        onSubmit={handleSubmit}
        style={{ display: 'grid', gap: '0.75em', maxWidth: 400 }}
      >
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
