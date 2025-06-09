// frontend/src/pages/PersonDetailsPage.jsx
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState }    from 'react';

export default function PersonDetailsPage() {
  const BASE         = import.meta.env.VITE_API_BASE_URL;
  const { personId } = useParams();
  const navigate     = useNavigate();

  const [person, setPerson]             = useState({});
  const [relationships, setRels]       = useState([]);
  const [events, setEvts]              = useState([]);
  const [relTags, setRelTags]          = useState([]);
  const [newPersonTag, setNewPersonTag]= useState('');

  const TAG_OPTIONS = [
    { tag_id: 1, label: 'Casual' },
    { tag_id: 2, label: 'Close' },
    { tag_id: 3, label: 'Peripheral' }
  ];

  // helpers to load data
  const reloadRels = () =>
    fetch(`${BASE}/relationships?person_id=${personId}`)
      .then(r => r.json())
      .then(setRels);

  const reloadEvts = () =>
    fetch(`${BASE}/events?person_id=${personId}`)
      .then(r => r.json())
      .then(setEvts);

  const reloadTags = () =>
    fetch(`${BASE}/relationship-tags?person_id=${personId}`)
      .then(r => r.json())
      .then(setRelTags);

  useEffect(() => {
    fetch(`${BASE}/people/${personId}`)
      .then(r => r.json())
      .then(setPerson);
    reloadRels();
    reloadEvts();
    reloadTags();
  }, [BASE, personId]);

  // assign a tag persistently
  const handleAssignPersonTag = async e => {
    e.preventDefault();
    const tagId = Number(newPersonTag);
    if (!tagId) return;
    // choose a relationship to tag (e.g. the first one for demo)
    const relId = relationships[0]?.relationship_id;
    if (!relId) return alert('No relationship selected');
    await fetch(`${BASE}/relationship-tags`, {
      method: 'POST',
      headers:{ 'Content-Type':'application/json' },
      body: JSON.stringify({ relationship_id: relId, tag_id: tagId })
    });
    setNewPersonTag('');
    reloadTags();
  };

  // … render …

  return (
    <div style={{ padding:16, maxWidth:600, margin:'auto' }}>
      <button onClick={() => navigate(-1)}>← Back to People</button>
      <h2>Details for {person.name}</h2>
      {/* core info */}
      <p><strong>Phone:</strong> {person.phone || 'N/A'}</p>
      <p><strong>Email:</strong> {person.email || 'N/A'}</p>
      <p><strong>DOB:</strong> {person.dob?.slice(0,10) || 'N/A'}</p>
      <p><strong>Gender:</strong> {person.gender || 'N/A'}</p>
      <hr/>

      {/* tag assignment */}
      <div style={{ display:'flex', gap:8, marginBottom:16 }}>
        <select
          value={newPersonTag}
          onChange={e => setNewPersonTag(e.target.value)}
        >
          <option value="">— choose tag —</option>
          {TAG_OPTIONS.map(t => (
            <option key={t.tag_id} value={t.tag_id}>
              {t.label}
            </option>
          ))}
        </select>
        <button onClick={handleAssignPersonTag}>Assign Tag</button>
      </div>

      {/* existing tags */}
      <p>Assigned tags:</p>
      <ul>
        {relTags.map(rt => (
          <li key={`${rt.relationship_id}-${rt.tag_id}`}>{rt.label}</li>
        ))}
      </ul>

      <hr/>
      {/* … then your relationships and events sections … */}
    </div>
  );
}
