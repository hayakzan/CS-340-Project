// src/pages/PersonDetailsPage.jsx
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState }    from 'react';

export default function PersonDetailsPage() {
  const { personId } = useParams();
  const nav          = useNavigate();

  // page-wide state
  const [person,        setPerson]        = useState({});
  const [relationships, setRelationships] = useState([]);
  const [events,        setEvents]        = useState([]);
  const [tags,          setTags]          = useState([]);

  // single person-tag assignment state
  const [personTag,    setPersonTag]    = useState(null);
  const [newPersonTag, setNewPersonTag] = useState('');

  // new-relationship form
  const [newRel, setNewRel] = useState({
    rel_type:   '',
    status:     'Active',
    started_at: '',
    ended_at:   '',    
    notes:      ''
  });

  // edit-relationship form
  const [editRelId, setEditRelId] = useState(null);
  const [editRel,   setEditRel]   = useState({
    rel_type:   '',
    status:     'Active',
    started_at: '',
    ended_at:   '',
    notes:      ''
  });

  // new-event form
  const [newEvt, setNewEvt] = useState({
    relationship_id: '',
    event_type:      '',
    event_desc:      '',
    event_date:      ''
  });

  // edit-event form
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

  // load everything on mount / personId change
  useEffect(() => {
    fetch(`/people/${personId}`)
      .then(r => r.json())
      .then(setPerson)
      .catch(console.error);

    reloadRels();
    reloadEvts();
  }, [personId]);

  const reloadRels = () =>
    fetch(`/relationships?person_id=${personId}`)
      .then(r => r.json())
      .then(setRelationships)
      .catch(console.error);

  const reloadEvts = () =>
    fetch(`/events?person_id=${personId}`)
      .then(r => r.json())
      .then(setEvents)
      .catch(console.error);


  // —— Person-level Tag CRUD —— 
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
    await fetch('/relationships', {
      method: 'POST',
      headers:{ 'Content-Type':'application/json' },
      body: JSON.stringify({
        person_id:  personId,
        rel_type:   newRel.rel_type,
        status:     newRel.status,
        started_at: newRel.started_at || null,
        ended_at:   newRel.ended_at   || null, 
        notes:      newRel.notes || null
      })
    });
    setNewRel({ rel_type:'', status:'Active', started_at:'', notes:'' });
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
    await fetch(`/relationships/${editRelId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        rel_type:   editRel.rel_type,
        status:     editRel.status,
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
    await fetch(`/relationships/${id}`, { method:'DELETE' });
    reloadRels();
  }

  // —— Events CRUD —— 
  function handleChangeNewEvt(e) {
    setNewEvt(n => ({ ...n, [e.target.name]: e.target.value }));
  }
  async function handleAddEvt(e) {
    e.preventDefault();
    await fetch('/events', {
      method:'POST',
      headers:{ 'Content-Type':'application/json' },
      body: JSON.stringify({
        relationship_id: newEvt.relationship_id,
        event_type:      newEvt.event_type,
        event_desc:      newEvt.event_desc || null,
        event_date:      newEvt.event_date
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
    await fetch(`/events/${editEvtId}`, {
      method:'PUT',
      headers:{ 'Content-Type':'application/json' },
      body: JSON.stringify(editEvt)
    });
    setEditEvtId(null);
    reloadEvts();
  }
  async function deleteEvt(id) {
    if (!window.confirm('Delete this event?')) return;
    await fetch(`/events/${id}`, { method:'DELETE' });
    reloadEvts();
  }


  return (
    <div style={{ padding:16, maxWidth:600, margin:'auto' }}>
      <button onClick={() => nav(-1)}>← Back to People</button>

      {/* — Header & Person-Tag assignment — */}
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
        <form onSubmit={handleAddRel} style={{ display:'flex', gap:8, marginBottom:16 }}>
          <input
            name="rel_type"
            placeholder="Type"
            value={newRel.rel_type}
            onChange={handleChangeNewRel}
            required
          />
          <select name="status" value={newRel.status} onChange={handleChangeNewRel}>
            <option>Active</option>
            <option>Idle</option>
            <option>Inactive</option>
          </select>

          <input
            name="started_at"
            type="date"
            value={newRel.started_at}
            onChange={handleChangeNewRel}
          />
          <input
            name="ended_at"
            type="date"
            value={newRel.ended_at}
            onChange={handleChangeNewRel}
            placeholder="Ended at"
          />
          <input
            name="notes"
            placeholder="Notes"
            value={newRel.notes}
            onChange={handleChangeNewRel}
          />
          <button type="submit">Add</button>
        </form>
        <ul>
          {relationships.length
            ? relationships.map(r => (
                <li key={r.relationship_id} style={{ marginBottom:12 }}>
                  {editRelId === r.relationship_id
                    ? (
                      <form onSubmit={submitEditRel} style={{ display:'flex', gap:8 }}>
                        <input
                          name="rel_type"
                          value={editRel.rel_type}
                          onChange={handleChangeEditRel}
                        />
                        <select
                          name="status"
                          value={editRel.status}
                          onChange={handleChangeEditRel}
                        >
                          <option>Active</option>
                          <option>Idle</option>
                          <option>Inactive</option>
                        </select>
                        <input
                          name="started_at"
                          type="date"
                          value={editRel.started_at}
                          onChange={handleChangeEditRel}
                        />
                        <input
                          name="ended_at"
                          type="date"
                          value={editRel.ended_at}
                          onChange={handleChangeEditRel}
                        />
                        <input
                          name="notes"
                          placeholder="Notes"
                          value={editRel.notes}
                          onChange={handleChangeEditRel}
                        />
                        <button>Save</button>
                        <button type="button" onClick={cancelEditRel}>Cancel</button>
                      </form>
                    ) : (
                      <>
                        <strong>{r.rel_type}</strong> — {r.status}
                        &nbsp;| since {r.started_at?.slice(0,10) || 'N/A'}
                        <button
                          onClick={() => startEditRel(r)}
                          style={{ marginLeft:8 }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteRel(r.relationship_id)}
                          style={{ marginLeft:4 }}
                        >
                          Delete
                        </button>
                      </>
                    )
                  }
                </li>
              ))
            : <li><em>No relationships yet.</em></li>
          }
        </ul>
      </section>

      <hr/>

      {/* — Events — */}
      <section>
        <h3>Events</h3>
        <form onSubmit={handleAddEvt} style={{ display:'flex', gap:8, marginBottom:16 }}>
          <select
            name="relationship_id"
            value={newEvt.relationship_id}
            onChange={handleChangeNewEvt}
            required
          >
            <option value="">— choose rel —</option>
            {relationships.map(r => (
              <option key={r.relationship_id} value={r.relationship_id}>
                {r.rel_type}
              </option>
            ))}
          </select>
          <input
            name="event_type"
            placeholder="Type"
            value={newEvt.event_type}
            onChange={handleChangeNewEvt}
            required
          />
          <input
            name="event_desc"
            placeholder="Description"
            value={newEvt.event_desc}
            onChange={handleChangeNewEvt}
          />
          <input
            name="event_date"
            type="date"
            value={newEvt.event_date}
            onChange={handleChangeNewEvt}
            required
          />
          <button type="submit">Add</button>
        </form>
        <ul>
          {events.length
            ? events.map(ev => (
                <li key={ev.rel_event_id} style={{ marginBottom:12 }}>
                  {editEvtId === ev.rel_event_id
                    ? (
                      <form onSubmit={submitEditEvt} style={{ display:'flex', gap:8 }}>
                        <input
                          name="event_type"
                          value={editEvt.event_type}
                          onChange={handleChangeEditEvt}
                        />
                        <input
                          name="event_desc"
                          value={editEvt.event_desc}
                          onChange={handleChangeEditEvt}
                        />
                        <input
                          name="event_date"
                          type="date"
                          value={editEvt.event_date}
                          onChange={handleChangeEditEvt}
                        />
                        <button>Save</button>
                        <button type="button" onClick={cancelEditEvt}>Cancel</button>
                      </form>
                    ) : (
                      <>
                        <strong>{ev.event_type}</strong> — {ev.event_desc}
                        &nbsp;on {ev.event_date.slice(0,10)}
                        <button
                          onClick={() => startEditEvt(ev)}
                          style={{ marginLeft:8 }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteEvt(ev.rel_event_id)}
                          style={{ marginLeft:4 }}
                        >
                          Delete
                        </button>
                      </>
                    )
                  }
                </li>
              ))
            : <li><em>No events yet.</em></li>
          }
        </ul>
      </section>
    </div>
  );
}
