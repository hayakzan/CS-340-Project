// src/pages/NavBar.jsx
import { Link, useLocation } from 'react-router-dom';

export default function NavBar() {
  const { pathname } = useLocation();
  return (
    <nav
      style={{
        width: '100%',
        background: '#3498db',
        padding: '0.75em 2em',
        marginBottom: '2em',
        display: 'flex',
        alignItems: 'center',
        boxShadow: '0 2px 8px #0001',
        borderRadius: '0 0 14px 14px',
        gap: '1em'
      }}
    >
      <Link
        to="/"
        style={{
          color: '#fff',
          textDecoration: 'none',
          fontWeight: 700,
          fontSize: '1.3em',
          letterSpacing: '0.04em',
          marginRight: '2em'
        }}
      >
        Relationship Tracker
      </Link>
      <Link
        to="/users"
        style={{
          color: pathname === "/users" ? '#ffe' : '#fff',
          textDecoration: 'none',
          fontWeight: 500,
          padding: '0.4em 1em',
          borderRadius: '7px',
          transition: 'background 0.2s',
          background: pathname === "/users" ? '#217dbb' : 'transparent'
        }}
      >
        Users
      </Link>
    </nav>
  );
}
