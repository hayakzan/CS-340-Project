import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function UsersPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch('http://classwork.engr.oregonstate.edu:5180/users')
      .then(res => res.json())
      .then(setUsers);
  }, []);

  return (
    <>
      <h2>Select a User</h2>
      <ul>
        {users.map(user => (
          <li key={user.user_id}>
            {user.name} — <Link to={`/users/${user.user_id}/people`}>Manage People</Link>
          </li>
        ))}
      </ul>
    </>
  );
}

