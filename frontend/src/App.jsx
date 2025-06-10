// src/App.jsx
import { Link } from 'react-router-dom';
import './App.css';

export default function App() {
  return (
    <div style={{ padding: '2em' }}>
      <h1 style={{ fontSize: '3em', fontWeight: 700 }}>
        CS340 Relationship Tracker
      </h1>
      <div
        style={{
          marginTop: '2em',
          maxWidth: 600,
          background: '#fff',
          padding: '1.5em 2em',
          borderRadius: '14px',
          boxShadow: '0 2px 8px #0001',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Link
          to="/users"
          style={{
            display: 'inline-block',
            fontWeight: 500,
            fontSize: '1.25em',
            color: '#fff',
            background: '#3498db',
            border: 'none',
            borderRadius: '8px',
            padding: '0.75em 2em',
            textDecoration: 'none',
            boxShadow: '0 1px 2px #0002',
            transition: 'background 0.15s',
            margin: '1em 0',
          }}
          onMouseOver={e => (e.target.style.background = '#217dbb')}
          onMouseOut={e => (e.target.style.background = '#3498db')}
        >
          Welcome! Start by creating or selecting a user
        </Link>
      </div>
    </div>
  );
}
