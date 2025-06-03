// frontend/src/pages/PersonDetailsPage.jsx

import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState }    from 'react';

export default function PersonDetailsPage() {
  const BASE         = import.meta.env.VITE_API_BASE_URL;
  const { personId } = useParams();
  const navigate     = useNavigate();

  // State variables
  const [person,        setPerson]        = useState({});
  const [relationships, setRelationships] = useState([]);
  const [events,        setEvents]        = useState([]);

  const [personTag,    setPersonTag]    = useState(null);
  const [newPersonTag, setNewPersonTag] = useState('');

  const [newRel, setNewRel] = useState({
    rel_type:   '',
    status:     'Active',
    started_at: '',
    ended_at:   '',
    notes:      ''
  });
  const [editRelId, setEditRelId] = useState(null);
  const [editRel,   setEditRel]   = useState({
    rel_type:   '',
    status:     'Active',
    started_at: '',
    ended_at:   '',
    notes:      ''
  });

  const [newEvt, setNewEvt] = useState({
    relationship_id: '',
    event_type:      '',
    event_desc:      '',
    event_date:      ''
  });
  const [editEvtId, setEditEvtId] = useState(null);
  const [editEvt,   setEditEvt]   = useState({
    event_type: '',
    event_desc: '',
    event_date: ''
  });

  const TAG_OPTIONS = [
    { tag_id: 1, label: 'Casual'     },
    { tag_id: 2, label: 'Close'      },
    { tag_id: 3, label: 'Peripheral' }
  ];

  // Fetch all relationships for this person
  const reloadRels = () =>
    fetch(`${BASE}/relationships?person_id=${personId}`)
      .then(r => r.json())
      .then(setRelationships)
      .catch(console.error);

  // Fetch all events for this person
  const reloadEvts = () =>
    fetch(`${BASE}/events?person_id=${personId}`)
      .then(r => r.json())
      .then(setEvents)
      .catch(console.error);

  // Initial data load
  useEffect(() => {
    fetch(`${BASE}/people/${personId}`)
      .then(r => r.json())
      .then(setPerson)
      .catch(console.error);

    reloadRels();
    reloadEvts();
  }, [BASE, personId]);

  // — Tag assignment —
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

  // — Relationships: add —
  function handleChangeNewRel(e) {
    setNewRel(r => ({ ...r, [e.target.name]: e.target.value }));
  }
  async function handleAddRel(e) {
    e.preventDefault();
    await fetch(`${BASE}/relationships`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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

  // — Relationships: edit —
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

  // — Relationships: delete —
  async function deleteRel(id) {
    if (!window.confirm('Delete this relationship?')) return;
    await fetch(`${BASE}/relationships/${id}`, { method:'DELETE' });
    reloadRels();
  }

  // — Events: add —
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

  // — Events: edit —
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

  // — Events: delete —
  async function deleteEvt(id) {
    if (!window.confirm('Delete this event?')) return;
    await fetch(`${BASE}/events/${id}`, { method:'DELETE' });
    reloadEvts();
  }

  // — Render starts here —
  return (
    <div style={{ padding: 16, maxWidth: 600, margin: 'auto' }}>
      <button onClick={() => navigate(-1)}>← Back to People</button>

      {/* Person details + tag assignment */}
      <div
        style={{
          display:       'flex',
          alignItems:    'center',
          justifyContent:'space-between',
          margin:        '16px 0'
        }}
      >
        <h2 style={{ margin: 0 }}>
          Details for {person.name}
          {personTag && (
            <span
              style={{
                marginLeft:   12,
                padding:      '2px 8px',
                background:   '#eee',
                borderRadius: 4,
                fontSize:     '0.9em'
              }}
            >
              {personTag}
            </span>
          )}
        </h2>

        <form
          onSubmit={handleAssignPersonTag}
          style={{ display: 'flex', gap: 8 }}
        >
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
          <button type="submit" className="button">Assign Tag</button>
        </form>
      </div>

      <p><strong>Phone:</strong> {person.phone || 'N/A'}</p>
      <p><strong>Email:</strong> {person.email || 'N/A'}</p>
      <p><strong>DOB:</strong>   {person.dob?.slice(0,10) || 'N/A'}</p>
      <p><strong>Gender:</strong> {person.gender || 'N/A'}</p>
      <hr/>

      {/* — Relationships section — */}
      <section style={{ marginBottom: '2em' }}>
        <h3>Relationships</h3>

        {/* Add Relationship form */}
        <form
          onSubmit={handleAddRel}
          style={{ marginBottom: '1em', display: 'flex', gap: '0.5em' }}
        >
          <input
            name="rel_type"
            placeholder="Type (e.g. Friend)"
            value={newRel.rel_type}
            onChange={handleChangeNewRel}
            required
          />
          <input
            name="status"
            placeholder="Status"
            value={newRel.status}
            onChange={handleChangeNewRel}
            required
          />
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
          />
          <input
            name="notes"
            placeholder="Notes"
            value={newRel.notes}
            onChange={handleChangeNewRel}
          />
          <button type="submit" className="button">Add</button>
        </form>

        {relationships.length === 0 ? (
          <p style={{ fontStyle: 'italic' }}>No relationships found.</p>
        ) : (
          <ul style={{ paddingLeft: 0, listStyleType: 'none' }}>
            {relationships.map(r => (
              <li key={r.relationship_id} style={{ marginBottom: '0.5em' }}>
                {editRelId === r.relationship_id ? (
                  // — Edit form for this relationship (includes notes field) —
                  <form
                    onSubmit={submitEditRel}
                    style={{
                      display:    'flex',
                      flexWrap:   'wrap',
                      gap:        '0.5em',
                      alignItems: 'center'
                    }}
                  >
                    <input
                      name="rel_type"
                      value={editRel.rel_type}
                      onChange={handleChangeEditRel}
                    />
                    <input
                      name="status"
                      value={editRel.status}
                      onChange={handleChangeEditRel}
                    />
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
                    <button type="submit" className="button">Save</button>
                    <button
                      type="button"
                      onClick={cancelEditRel}
                      className="button"
                    >
                      Cancel
                    </button>
                  </form>
                ) : (
                  // — Display mode (no notes input, only text) —
                  <>
                    <span>
                      <strong>Type:</strong> {r.rel_type} &nbsp;|&nbsp;
                      <strong>Status:</strong> {r.status} &nbsp;|&nbsp;
                      <strong>Since:</strong> {r.started_at?.slice(0,10) || 'N/A'} &nbsp;|&nbsp;
                      <em>{r.notes || ''}</em>
                    </span>{' '}
                    <button
                      onClick={() => startEditRel(r)}
                      className="button"
                    >
                      Edit
                    </button>{' '}
                    <button
                      onClick={() => deleteRel(r.relationship_id)}
                      className="button"
                    >
                      Delete
                    </button>
                  </>
                )}
                <hr style={{ margin: '0.5em 0' }} />
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* — Events section — */}
      <section>
        <h3>Events</h3>

        {/* Add Event form */}
        <form
          onSubmit={handleAddEvt}
          style={{ marginBottom: '1em', display: 'flex', gap: '0.5em' }}
        >
          <select
            name="relationship_id"
            value={newEvt.relationship_id}
            onChange={handleChangeNewEvt}
            required
          >
            <option value="">— Select relationship —</option>
            {relationships.map(r => (
              <option key={r.relationship_id} value={r.relationship_id}>
                {r.rel_type} ({r.relationship_id})
              </option>
            ))}
          </select>
          <input
            name="event_type"
            placeholder="Event Type"
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
          <button type="submit" className="button">Add</button>
        </form>

        {events.length === 0 ? (
          <p style={{ fontStyle: 'italic' }}>No events found.</p>
        ) : (
          <ul style={{ paddingLeft: 0, listStyleType: 'none' }}>
            {events.map(ev => (
              <li key={ev.rel_event_id} style={{ marginBottom: '0.5em' }}>
                {editEvtId === ev.rel_event_id ? (
                  // — Edit form for event (no notes here, but you can extend) —
                  <form
                    onSubmit={submitEditEvt}
                    style={{
                      display:    'flex',
                      flexWrap:   'wrap',
                      gap:        '0.5em',
                      alignItems: 'center'
                    }}
                  >
                    <select
                      name="relationship_id"
                      value={ev.relationship_id}
                      onChange={handleChangeNewEvt}
                      required
                    >
                      <option value="">— Select relationship —</option>
                      {relationships.map(r => (
                        <option
                          key={r.relationship_id}
                          value={r.relationship_id}
                        >
                          {r.rel_type} ({r.relationship_id})
                        </option>
                      ))}
                    </select>
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
                    <button type="submit" className="button">Save</button>
                    <button
                      type="button"
                      onClick={cancelEditEvt}
                      className="button"
                    >
                      Cancel
                    </button>
                  </form>
                ) : (
                  // — Display mode —
                  <>
                    <span>
                      <strong>Event Type:</strong> {ev.event_type} &nbsp;|&nbsp;
                      <strong>Date:</strong> {ev.event_date?.slice(0,10)} &nbsp;|&nbsp;
                      <em>{ev.event_desc || ''}</em>
                    </span>{' '}
                    <button
                      onClick={() => startEditEvt(ev)}
                      className="button"
                    >
                      Edit
                    </button>{' '}
                    <button
                      onClick={() => deleteEvt(ev.rel_event_id)}
                      className="button"
                    >
                      Delete
                    </button>
                  </>
                )}
                <hr style={{ margin: '0.5em 0' }} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
