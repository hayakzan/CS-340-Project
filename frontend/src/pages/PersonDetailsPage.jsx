// frontend/src/pages/PersonDetailsPage.jsx

import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState }    from 'react';

export default function PersonDetailsPage() {
  const BASE           = process.env.REACT_APP_API_BASE_URL;
  const { personId }   = useParams();
  const navigate       = useNavigate();

  // page‑wide state
  const [person,        setPerson]        = useState({});
  const [relationships, setRelationships] = useState([]);
  const [events,        setEvents]        = useState([]);

  // single person‑tag assignment state
  const [personTag,    setPersonTag]    = useState(null);
  const [newPersonTag, setNewPersonTag] = useState('');

  // new‑relationship form
  const [newRel, setNewRel] = useState({
    rel_type:   '',
    status:     'Active',
    started_at: '',
    ended_at:   '',
    notes:      ''
  });

  // edit‑relationship form
  const [editRelId, setEditRelId] = useState(null);
  const [editRel,   setEditRel]   = useState({
    rel_type:   '',
    status:     'Active',
    started_at: '',
    ended_at:   '',
    notes:      ''
  });

  // new‑event form
  const [newEvt, setNewEvt] = useState({
    relationship_id: '',
    event_type:      '',
    event_desc:      '',
    event_date:      ''
  });

  // edit‑event form
  const [editEvtId, setEditEvtId] = useState(null);
  const [editEvt,   setEditEvt]   = useState({
    event_type: '',
    event_desc: '',
    event_date: ''
  });

  // static “master” list of tags
  const TAG_OPTIONS = [
    { tag_id: 1, label: 'Casual'     },
    { tag_id: 2, label: 'Close'      },
    { tag_id: 3, label: 'Peripheral' }
  ];

  // fetch functions
  const reloadRels = () =>
    fetch(`${BASE}/relationships?person_id=${personId}`)
      .then(r => r.json())
      .then(setRelationships)
      .catch(console.error);

  const reloadEvts = () =>
    fetch(`${BASE}/events?person_id=${personId}`)
      .then(r => r.json())
      .then(setEvents)
      .catch(console.error);

  // load everything on mount / personId change
  useEffect(() => {
    fetch(`${BASE}/people/${personId}`)
      .then(r => r.json())
      .then(setPerson)
      .catch(console.error);

    reloadRels();
    reloadEvts();
  }, [BASE, personId]);

  // —— Person‑tag assignment —— 
  function handleChangePersonTag(e) {
    setNewPersonTag(e.target.value);
  }
  function handleAssignPersonTag(e) {
    e.preventDefault();
    const tag = TAG_OPTIONS.find(t => t.tag_id === Number(newPersonTag));
    if (tag) {
      setPersonTag(tag.label);
      setNewPersonTag('');
    }
  }

  // —— Relationships CRUD —— 
  function handleChangeNewRel(e) {
    setNewRel(n => ({ ...n, [e.target.name]: e.target.value }));
  }
  async function handleAddRel(e) {
    e.preventDefault();
    await fetch(`${BASE}/relationships`, {
      method: 'POST',
      headers:{ 'Content-Type':'application/json' },
      body: JSON.stringify({
        person_id:  personId,
        ...newRel,
        started_at: newRel.started_at || null,
        ended_at:   newRel.ended_at   || null,
        notes:      newRel.notes      || null
      })
    });
    setNewRel({ rel_type:'', status:'Active', started_at:'', ended_at:'', notes:'' });
    reloadRels();
  }
  function startEditRel(r) {
    setEditRelId(r.relationship_id);
    setEditRel({
      rel_type:   r.rel_type,
      status:     r.status,
      started_at: r.started_at?.slice(0,10) || '',
      ended_at:   r.ended_at?.slice(0,10)   || '',
      notes:      r.notes || ''
    });
  }
  function cancelEditRel() {
    setEditRelId(null);
  }
  function handleChangeEditRel(e) {
    setEditRel(r => ({ ...r, [e.target.name]: e.target.value }));
  }
  async function submitEditRel(e) {
    e.preventDefault();
    await fetch(`${BASE}/relationships/${editRelId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...editRel,
        started_at: editRel.started_at || null,
        ended_at:   editRel.ended_at   || null,
        notes:      editRel.notes      || null
      })
    });
    setEditRelId(null);
    reloadRels();
  }
  async function deleteRel(id) {
    if (!window.confirm('Delete this relationship?')) return;
    await fetch(`${BASE}/relationships/${id}`, { method:'DELETE' });
    reloadRels();
  }

  // —— Events CRUD —— 
  function handleChangeNewEvt(e) {
    setNewEvt(n => ({ ...n, [e.target.name]: e.target.value }));
  }
  async function handleAddEvt(e) {
    e.preventDefault();
    await fetch(`${BASE}/events`, {
      method:'POST',
      headers:{ 'Content-Type':'application/json' },
      body: JSON.stringify({
        ...newEvt,
        event_desc: newEvt.event_desc || null
      })
    });
    setNewEvt({ relationship_id:'', event_type:'', event_desc:'', event_date:'' });
    reloadEvts();
  }
  function startEditEvt(ev) {
    setEditEvtId(ev.rel_event_id);
    setEditEvt({
      event_type: ev.event_type,
      event_desc: ev.event_desc,
      event_date: ev.event_date.slice(0,10)
    });
  }
  function cancelEditEvt() {
    setEditEvtId(null);
  }
  function handleChangeEditEvt(e) {
    setEditEvt(ev => ({ ...ev, [e.target.name]: e.target.value }));
  }
  async function submitEditEvt(e) {
    e.preventDefault();
    await fetch(`${BASE}/events/${editEvtId}`, {
      method:'PUT',
      headers:{ 'Content-Type':'application/json' },
      body: JSON.stringify(editEvt)
    });
    setEditEvtId(null);
    reloadEvts();
  }
  async function deleteEvt(id) {
    if (!window.confirm('Delete this event?')) return;
    await fetch(`${BASE}/events/${id}`, { method:'DELETE' });
    reloadEvts();
  }

  return (
    <div style={{ padding: 16, maxWidth: 600, margin: 'auto' }}>
      <button onClick={() => navigate(-1)}>← Back to People</button>

      {/* — Header & Person‑Tag assignment — */}
      <div style={{
        display:'flex',
        alignItems:'center',
        justifyContent:'space-between',
        margin:'16px 0'
      }}>
        <h2 style={{ margin:0 }}>
          Details for {person.name}
          {personTag && (
            <span style={{
              marginLeft:12,
              padding:'2px 8px',
              background:'#eee',
              borderRadius:4,
              fontSize:'0.9em'
            }}>
              {personTag}
            </span>
          )}
        </h2>
        <form onSubmit={handleAssignPersonTag} style={{ display:'flex', gap:8 }}>
          <select
            value={newPersonTag}
            onChange={handleChangePersonTag}
            required
          >
            <option value="">— choose tag —</option>
            {TAG_OPTIONS.map(t => (
              <option key={t.tag_id} value={t.tag_id}>
                {t.label}
              </option>
            ))}
          </select>
          <button type="submit">Assign Tag</button>
        </form>
      </div>

      {/* — Core Info — */}
      <p><strong>Phone:</strong> {person.phone || 'N/A'}</p>
      <p><strong>Email:</strong> {person.email || 'N/A'}</p>
      <p><strong>DOB:</strong>   {person.dob?.slice(0,10) || 'N/A'}</p>
      <p><strong>Gender:</strong>{person.gender || 'N/A'}</p>
      <hr/>

      {/* — Relationships — */}
      <section>
        <h3>Relationships</h3>
        {/* ... relationships form & list as above ... */}
      </section>

      <hr/>

      {/* — Events — */}
      <section>
        <h3>Events</h3>
        {/* ... events form & list as above ... */}
      </section>
    </div>
  );
}
