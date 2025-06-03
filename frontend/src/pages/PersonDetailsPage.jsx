// (excerpt from PersonDetailsPage.jsx)

// …inside the component body:

const [relationships, setRelationships] = useState([]);
const [newRel, setNewRel] = useState({
  rel_type: '', status: 'Active', started_at: '', ended_at: '', notes: ''
});
const [editRelId, setEditRelId] = useState(null);
const [editRel, setEditRel] = useState({
  rel_type: '', status: 'Active', started_at: '', ended_at: '', notes: ''
});

// Fetch all relationships for this personId:
const reloadRels = () =>
  fetch(`${BASE}/relationships?person_id=${personId}`)
    .then(r => r.json())
    .then(setRelationships)
    .catch(console.error);

useEffect(() => {
  reloadRels();
}, [personId]);

// — Add new relationship (no notes in display; just on create form) —
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

// — Start editing an existing relationship: populate editRel, show notes input —
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

// — Delete relationship —
async function deleteRel(id) {
  if (!window.confirm('Delete this relationship?')) return;
  await fetch(`${BASE}/relationships/${id}`, { method:'DELETE' });
  reloadRels();
}

// — Render section —
return (
  <section>
    <h3>Relationships</h3>

    {/* — “Add Relationship” form (always visible). This form includes a notes input. — */}
    <form onSubmit={handleAddRel} style={{ marginBottom: '1em', display: 'flex', gap: '0.5em' }}>
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

    {/* — List of existing relationships — */}
    {relationships.length === 0 ? (
      <p style={{ fontStyle: 'italic' }}>No relationships found.</p>
    ) : (
      <ul style={{ paddingLeft: 0, listStyleType: 'none' }}>
        {relationships.map(r => (
          <li key={r.relationship_id} style={{ marginBottom: '0.5em' }}>
            {editRelId === r.relationship_id ? (
              // — EDIT FORM: notes field is shown here —
              <form
                onSubmit={submitEditRel}
                style={{ display: 'flex', gap: '0.5em', flexWrap: 'wrap', alignItems: 'center' }}
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
                <button type="button" onClick={cancelEditRel} className="button">Cancel</button>
              </form>
            ) : (
              // — DISPLAY MODE: notes are rendered as text, not as an input —
              <>
                <span>
                  <strong>Type:</strong> {r.rel_type} &nbsp;|&nbsp;
                  <strong>Status:</strong> {r.status} &nbsp;|&nbsp;
                  <strong>Since:</strong> {r.started_at?.slice(0,10) || 'N/A'} &nbsp;|&nbsp;
                  <em>{r.notes || ''}</em>
                </span>{' '}
                <button onClick={() => startEditRel(r)} className="button">Edit</button>{' '}
                <button onClick={() => deleteRel(r.relationship_id)} className="button">Delete</button>
              </>
            )}
            <hr style={{ margin: '0.5em 0' }} />
          </li>
        ))}
      </ul>
    )}
  </section>
);
