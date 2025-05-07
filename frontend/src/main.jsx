import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './index.css';
import App from './App';
import UsersPage from './pages/UsersPage';
import PeoplePage from './pages/PeoplePage';
import PersonDetailsPage from './pages/PersonDetailsPage';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/users/:userId/people" element={<PeoplePage />} />
        <Route path="/people/:personId" element={<PersonDetailsPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);

