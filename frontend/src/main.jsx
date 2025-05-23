// src/main.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import './index.css';
import App               from './App';
import UsersPage         from './pages/UsersPage';
import UserFormPage      from './pages/UserFormPage';
import PeoplePage        from './pages/PeoplePage';
import PersonFormPage    from './pages/PersonFormPage';
import PersonDetailsPage from './pages/PersonDetailsPage';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* landing page at "/" */}
        <Route path="/" element={<App />} />

        {/* users CRUD */}
        <Route path="/users"              element={<UsersPage />} />
        <Route path="/users/new"          element={<UserFormPage />} />
        <Route path="/users/:userId/edit" element={<UserFormPage />} />

        {/* people CRUD */}
        <Route
          path="/users/:userId/people"
          element={<PeoplePage />}
        />
        <Route
          path="/users/:userId/people/new"
          element={<PersonFormPage />}
        />
        <Route
          path="/users/:userId/people/:personId"
          element={<PersonDetailsPage />}
        />
        <Route
          path="/users/:userId/people/:personId/edit"
          element={<PersonFormPage />}
        />

        {/* fallback everywhere else → back to landing */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
