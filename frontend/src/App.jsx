import { Link } from 'react-router-dom';

function App() {
  return (
    <>
      <h1>CS340 Relationship Tracker</h1>
      <ul>
        <li><Link to="/users">Start by Selecting a User</Link></li>
      </ul>
    </>
  );
}

export default App;

