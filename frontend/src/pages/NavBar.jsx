// src/pages/NavBar.jsx
import { Link, useLocation } from 'react-router-dom';

export default function NavBar() {
  const { pathname } = useLocation();
  const navLinks = [
    { name: 'Home', to: '/' },
    { name: 'Users', to: '/users' },
    { name: 'People', to: '/people' },
    { name: 'People Details', to: '/people/1' } // Example, could be dynamic
  ];

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
        gap: '1.5em',
      }}
    >
      {navLinks.map(link => (
        <Link
          key={link.name}
          to={link.to}
          style={{
            color: pathname === link.to ? '#ffe' : '#fff',
            textDecoration: 'none',
            fontWeight: link.name === 'Home' ? 700 : 500,
            fontSize: link.name === 'Home' ? '1.2em' : '1em',
            padding: '0.4em 1em',
            borderRadius: '7px',
            background: pathname === link.to ? '#217dbb' : 'transparent',
            transition: 'background 0.2s',
          }}
        >
          {link.name}
        </Link>
      ))}
    </nav>
  );
}
