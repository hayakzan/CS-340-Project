import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function PersonDetailsPage() {
  const { personId } = useParams();
  const [relationships, setRelationships] = useState([]);
  const [events, setEvents] = useState([]);
  const [tags, setTags] = useState([]);

  useEffect(() => {
    fetch(`http://classwork.engr.oregonstate.edu:5180/relationships?person_id=${personId}`)
      .then(res => res.json()).then(setRelationships);

    fetch(`http://classwork.engr.oregonstate.edu:5180/events?person_id=${personId}`)
      .then(res => res.json()).then(setEvents);

    fetch(`http://classwork.engr.oregonstate.edu:5180/relationship-tags?person_id=${personId}`)
      .then(res => res.json()).then(setTags);
  }, [personId]);

  return (
    <div>
      <h2>Details for Person {personId}</h2>

      <h3>Relationships</h3>
      <ul>
        {relationships.map(r => (
          <li key={r.relationship_id}>{r.type} — {r.status}</li>
        ))}
      </ul>

      <h3>Events</h3>
      <ul>
        {events.map(e => (
          <li key={e.event_id}>{e.title} on {e.occurred_at}</li>
        ))}
      </ul>

      <h3>Tags</h3>
      <ul>
        {tags.map(t => (
          <li key={`${t.relationship_id}-${t.tag_id}`}>Tag {t.tag_id} for Relationship {t.relationship_id}</li>
        ))}
      </ul>
    </div>
  );
}
