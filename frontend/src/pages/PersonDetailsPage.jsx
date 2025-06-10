// frontend/src/pages/PersonDetailsPage.jsx

import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState }    from 'react'

export default function PersonDetailsPage() {
  const BASE         = import.meta.env.VITE_API_BASE_URL
  const { personId } = useParams()
  const navigate     = useNavigate()

  const [person,        setPerson]        = useState({})
  const [relationships, setRelationships] = useState([])
  const [events,        setEvents]        = useState([])
  const [assignedTags,  setAssignedTags]  = useState([])
  const [newPersonTag,  setNewPersonTag]  = useState('')

  const TAG_OPTIONS = [
    { tag_id: 1, label: 'Casual'     },
    { tag_id: 2, label: 'Close'      },
    { tag_id: 3, label: 'Peripheral' }
  ]

  const reloadRels = () => fetch(`${BASE}/relationships?person_id=${personId}`).then(r => r.json()).then(setRelationships).catch(console.error)
  const reloadEvts = () => fetch(`${BASE}/events?person_id=${personId}`).then(r => r.json()).then(setEvents).catch(console.error)
  const reloadTags = () => fetch(`${BASE}/relationship-tags?person_id=${personId}`).then(r => r.json()).then(setAssignedTags).catch(console.error)

  useEffect(() => {
    fetch(`${BASE}/people/${personId}`).then(r => r.json()).then(setPerson).catch(console.error)
    reloadRels()
    reloadEvts()
    reloadTags()
  }, [BASE, personId])

  async function handleAssignPersonTag(e) {
    e.preventDefault()
    const relId  = relationships[0]?.relationship_id
    const newTag = Number(newPersonTag)
    if (!relId || !newTag) return

    if (assignedTags.length) {
      await fetch(`${BASE}/relationship-tags`, {
        method:  'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ relationship_id: relId, tag_id: assignedTags[0].tag_id })
      })
    }

    await fetch(`${BASE}/relationship-tags`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ relationship_id: relId, tag_id: newTag })
    })

    setNewPersonTag('')
    reloadTags()
  }

  const [newRel,    setNewRel]    = useState({ rel_type: '', status: 'Active', started_at: '', ended_at: '', notes: '' })
  const [editRelId, setEditRelId] = useState(null)
  const [editRel,   setEditRel]   = useState({ rel_type: '', status: 'Active', started_at: '', ended_at: '', notes: '' })

  function handleChangeNewRel(e)  { setNewRel(r => ({ ...r, [e.target.name]: e.target.value })) }
  function handleChangeEditRel(e) { setEditRel(r => ({ ...r, [e.target.name]: e.target.value })) }

  async function handleAddRel(e) {
    e.preventDefault()
    await fetch(`${BASE}/relationships`, {
      method:'POST',
      headers:{ 'Content-Type':'application/json' },
      body: JSON.stringify({ person_id: personId, ...newRel, started_at: newRel.started_at || null, ended_at: newRel.ended_at || null, notes: newRel.notes || null })
    })
    setNewRel({ rel_type:'', status:'Active', started_at:'', ended_at:'', notes:'' })
    reloadRels()
  }

  function startEditRel(r) {
    setEditRelId(r.relationship_id)
    setEditRel({ rel_type: r.rel_type, status: r.status, started_at: r.started_at?.slice(0,10) || '', ended_at: r.ended_at?.slice(0,10) || '', notes: r.notes || '' })
  }
  function cancelEditRel() { setEditRelId(null) }

  async function submitEditRel(e) {
    e.preventDefault()
    await fetch(`${BASE}/relationships/${editRelId}`, {
      method:'PUT',
      headers:{ 'Content-Type':'application/json' },
      body: JSON.stringify({ ...editRel, started_at: editRel.started_at || null, ended_at: editRel.ended_at || null, notes: editRel.notes || null })
    })
    setEditRelId(null)
    reloadRels()
  }

  async function deleteRel(id) {
    if (!window.confirm('Delete this relationship?')) return
    await fetch(`${BASE}/relationships/${id}`, { method:'DELETE' })
    reloadRels()
  }

  const [newEvt,    setNewEvt]    = useState({ relationship_id: '', event_type: '', event_desc: '', event_date: '' })
  const [editEvtId, setEditEvtId] = useState(null)
  const [editEvt,   setEditEvt]   = useState({ event_type: '', event_desc: '', event_date: '' })

  function handleChangeNewEvt(e)   { setNewEvt(n => ({ ...n, [e.target.name]: e.target.value })) }
  function handleChangeEditEvt(e)  { setEditEvt(ev => ({ ...ev, [e.target.name]: e.target.value })) }

  async function handleAddEvt(e) {
    e.preventDefault()
    await fetch(`${BASE}/events`, {
      method:'POST',
      headers:{ 'Content-Type':'application/json' },
      body: JSON.stringify({ ...newEvt, event_desc: newEvt.event_desc || null })
    })
    setNewEvt({ relationship_id:'', event_type:'', event_desc:'', event_date:'' })
    reloadEvts()
  }

  function startEditEvt(ev) {
    setEditEvtId(ev.rel_event_id)
    setEditEvt({ event_type: ev.event_type, event_desc: ev.event_desc, event_date: ev.event_date.slice(0,10) })
  }
  function cancelEditEvt() { setEditEvtId(null) }

  async function submitEditEvt(e) {
    e.preventDefault()
    await fetch(`${BASE}/events/${editEvtId}`, {
      method:'PUT',
      headers:{ 'Content-Type':'application/json' },
      body: JSON.stringify(editEvt)
    })
    setEditEvtId(null)
    reloadEvts()
  }

  async function deleteEvt(id) {
    if (!window.confirm('Delete this event?')) return
    await fetch(`${BASE}/events/${id}`, { method:'DELETE' })
    reloadEvts()
  }

  return (
    <div style={{ padding:16, maxWidth:1200, margin:'0 auto' }}>
      <div style={{ marginBottom:'1em', display:'flex', alignItems:'center' }}>
        <button style={{ whiteSpace: 'nowrap' }} onClick={() => navigate(-1)} className="button">
          ← Back to People
        </button>
        <div style={{ width: '24em' }}></div>
        <button
          style={{ whiteSpace: 'nowrap' }}
          className="button"
          onClick={async () => {
            await fetch(`${BASE}/reset/reset-all`)
            fetch(`${BASE}/people/${personId}`).then(r => r.json()).then(setPerson)
            reloadRels(); reloadEvts(); reloadTags()
          }}
        >
          Reset All Data
        </button>
      </div>

      <div style={{ margin:'16px 0' }}>
        <h2 style={{ display:'inline-block', marginRight:12 }}>
          Details for {person.name}
        </h2>
        {assignedTags.map(rt => {
          const t = TAG_OPTIONS.find(t => t.tag_id === rt.tag_id)
          return t && (
            <span
              key={t.tag_id}
              style={{ margin:'0 8px', padding:'2px 8px', background:'#eee', borderRadius:4 }}
            >
              {t.label}
            </span>
          )
        })}
        <form onSubmit={handleAssignPersonTag} style={{ display:'inline-flex', gap:8 }}>
          <select value={newPersonTag} onChange={e => setNewPersonTag(e.target.value)} required>
            <option value="">— choose tag —</option>
            {TAG_OPTIONS.map(t => (
              <option key={t.tag_id} value={t.tag_id}>{t.label}</option>
            ))}
          </select>
          <button type="submit" className="button">Assign Tag</button>
        </form>
      </div>

      <p><strong>Phone:</strong> {person.phone  || 'N/A'}</p>
      <p><strong>Email:</strong> {person.email  || 'N/A'}</p>
      <p><strong>DOB:</strong>   {person.dob?.slice(0,10) || 'N/A'}</p>
      <p><strong>Gender:</strong>{person.gender || 'N/A'}</p>
      <hr/>

      {/* Relationships */}
      <section style={{ marginBottom:'2em' }}>
        <h3>Relationships</h3>
        <div style={{
          background: '#fff',
          borderRadius: '12px',
          boxShadow: '0 1px 8px #0001',
          padding: '1.5em',
          marginBottom: '1.5em',
          maxWidth: '1000px',
          width: '100%',
        }}>
          <form
            onSubmit={handleAddRel}
            style={{ margin:'8px 0', display:'flex', gap:'1em', alignItems:'flex-end', flexWrap:'nowrap' }}
          >
            <input
              name="rel_type"
              placeholder="Type (e.g. Friend)"
              value={newRel.rel_type}
              onChange={handleChangeNewRel}
              required
              style={{ flex: 1, minWidth: 0 }}
            />
            <select
              name="status"
              value={newRel.status}
              onChange={handleChangeNewRel}
              required
              style={{ flex: 1, minWidth: 0 }}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Idle">Idle</option>
            </select>
            <div style={{ display:'flex', flexDirection:'column', fontSize:'0.8em', flex: 1, minWidth: 0 }}>
              <span>Start</span>
              <input
                name="started_at"
                type="date"
                value={newRel.started_at}
                onChange={handleChangeNewRel}
                style={{ flex: 1, minWidth: 0 }}
              />
            </div>
            <div style={{ display:'flex', flexDirection:'column', fontSize:'0.8em', flex: 1, minWidth: 0 }}>
              <span>End</span>
              <input
                name="ended_at"
                type="date"
                value={newRel.ended_at}
                onChange={handleChangeNewRel}
                style={{ flex: 1, minWidth: 0 }}
              />
            </div>
            <input
              name="notes"
              placeholder="Notes"
              value={newRel.notes}
              onChange={handleChangeNewRel}
              style={{ flex: 2, minWidth: 0 }}
            />
            <button type="submit" className="button">Add</button>
          </form>

          {relationships.length === 0
            ? <p style={{ fontStyle:'italic' }}>No relationships found.</p>
            : (
              <ul style={{ paddingLeft:0, listStyle:'none' }}>
                {relationships.map(r => (
                  <li key={r.relationship_id} style={{ marginBottom:'0.5em' }}>
                    {editRelId === r.relationship_id ? (
                      <form
                        onSubmit={submitEditRel}
                        style={{ display:'flex', flexWrap:'wrap', gap:'0.5em', alignItems:'flex-end' }}
                      >
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
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                          <option value="Idle">Idle</option>
                        </select>
                        <div style={{ display:'flex', flexDirection:'column', fontSize:'0.8em' }}>
                          <span>Start</span>
                          <input
                            name="started_at"
                            type="date"
                            value={editRel.started_at}
                            onChange={handleChangeEditRel}
                          />
                        </div>
                        <div style={{ display:'flex', flexDirection:'column', fontSize:'0.8em' }}>
                          <span>End</span>
                          <input
                            name="ended_at"
                            type="date"
                            value={editRel.ended_at}
                            onChange={handleChangeEditRel}
                          />
                        </div>
                        <input
                          name="notes"
                          placeholder="Notes"
                          value={editRel.notes}
                          onChange={handleChangeEditRel}
                        />
                        <button type="submit" className="button">Save</button>
                        <button type="button" onClick={cancelEditRel} className="button">Cancel</button>
                      </form>
                    ) : (
                      <>
                        <span style={{ whiteSpace: 'nowrap', display: 'block', overflowX: 'auto' }}>
                          <strong>Type:</strong> {r.rel_type} &nbsp;|&nbsp;
                          <strong>Status:</strong> {r.status} &nbsp;|&nbsp;
                          <strong>Since:</strong> {r.started_at?.slice(0,10)||'N/A'} &nbsp;|&nbsp;
                          <em>{r.notes||''}</em>
                        </span>{' '}
                        <button onClick={()=>startEditRel(r)} className="button">Edit</button>{' '}
                        <button onClick={()=>deleteRel(r.relationship_id)} className="button">Delete</button>
                      </>
                    )}
                    <hr style={{ margin:'0.5em 0' }}/>
                  </li>
                ))}
              </ul>
            )}
        </div>
      </section>

      {/* Events */}
      <section>
        <h3>Events</h3>
        <div style={{
          background: '#fff',
          borderRadius: '12px',
          boxShadow: '0 1px 8px #0001',
          padding: '1.5em',
          marginBottom: '1.5em',
          maxWidth: '1000px',
          width: '100%',
        }}>
          <form
            onSubmit={handleAddEvt}
            style={{ margin:'8px 0', display:'flex', gap:'1em', alignItems:'center', flexWrap:'nowrap' }}
          >
            <select
              name="relationship_id"
              value={newEvt.relationship_id}
              onChange={handleChangeNewEvt}
              required
              style={{ flex: 1, minWidth: 0 }}
            >
              <option value="">— Select relationship —</option>
              {relationships.map(r => (
                <option key={r.relationship_id} value={r.relationship_id}>
                  {r.rel_type}
                </option>
              ))}
            </select>
            <input
              name="event_type"
              placeholder="Event Type"
              value={newEvt.event_type}
              onChange={handleChangeNewEvt}
              required
              style={{ flex: 1, minWidth: 0 }}
            />
            <input
              name="event_desc"
              placeholder="Description"
              value={newEvt.event_desc}
              onChange={handleChangeNewEvt}
              style={{ flex: 2, minWidth: 0 }}
            />
            <input
              name="event_date"
              type="date"
              value={newEvt.event_date}
              onChange={handleChangeNewEvt}
              required
              style={{ flex: 1, minWidth: 0 }}
            />
            <button type="submit" className="button">Add</button>
          </form>

          {events.length === 0 ? (
            <p style={{ fontStyle:'italic' }}>No events found.</p>
          ) : (
            <ul style={{ paddingLeft:0, listStyle:'none' }}>
              {events.map(ev => {
                const rel = relationships.find(r => r.relationship_id === ev.relationship_id)
                return (
                  <li key={ev.rel_event_id} style={{ marginBottom:'0.5em' }}>
                    {editEvtId === ev.rel_event_id ? (
                      <form
                        onSubmit={submitEditEvt}
                        style={{ display:'flex', gap:'0.5em', alignItems:'center' }}
                      >
                        <select
                          name="relationship_id"
                          value={ev.relationship_id}
                          onChange={handleChangeNewEvt}
                          required
                        >
                          <option value="">— Select relationship —</option>
                          {relationships.map(r => (
                            <option key={r.relationship_id} value={r.relationship_id}>
                              {r.rel_type}
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
                        <button type="button" onClick={cancelEditEvt} className="button">Cancel</button>
                      </form>
                    ) : (
                      <>
                        <span style={{ whiteSpace: 'nowrap', display: 'block', overflowX: 'auto' }}>
                          <strong>Relationship:</strong> {rel?.rel_type || 'N/A'} &nbsp;|&nbsp;
                          <strong>Event Type:</strong> {ev.event_type} &nbsp;|&nbsp;
                          <strong>Date:</strong> {ev.event_date?.slice(0,10)} &nbsp;|&nbsp;
                          <em>{ev.event_desc||''}</em>
                        </span>{' '}
                        <button onClick={()=>startEditEvt(ev)} className="button">Edit</button>{' '}
                        <button onClick={()=>deleteEvt(ev.rel_event_id)} className="button">Delete</button>
                      </>
                    )}
                    <hr style={{ margin:'0.5em 0' }}/>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </section>
    </div>
  )
}
