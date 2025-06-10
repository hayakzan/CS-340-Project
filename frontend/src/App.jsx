// src/App.jsx
import { Link } from 'react-router-dom';
import './App.css';

export default function App() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'center',
        gap: '2em',
        padding: '2em',
      }}
    >
      {/* Main panel */}
      <div>
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

      {/* Embedded SMB1 game */}
      <div style={{ minWidth: 510, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <iframe
          src="https://jcw87.github.io/c2-smb1/"
          title="Super Mario Bros Emulator"
          width="500"
          height="480"
          frameBorder="0"
          allowFullScreen
          style={{
            borderRadius: 12,
            boxShadow: '0 2px 8px #0003',
            marginTop: '3em',
            background: '#000',
            border: '2px solid #222'
          }}
        />
        <span style={{ color: '#888', marginTop: 8, fontSize: '0.9em' }}>
          ...or play some Mario, idk (courtesy of https://github.com/jcw87)
        </span>
      </div>
    </div>
  );
}
