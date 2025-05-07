import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function PeoplePage() {
  const { userId } = useParams();
  const [people, setPeople] = useState([]);

  useEffect(() => {
    fetch(`http://classwork.engr.oregonstate.edu:5180/people?user_id=${userId}`)
      .then(res => res.json())
      .then(setPeople);
  }, [userId]);

  return (
    <div>
      <h2>People for User {userId}</h2>
      <ul>
        {people.map(p => (
          <li key={p.people_id}>
            {p.name} — <Link to={`/people/${p.people_id}`}>Details</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
