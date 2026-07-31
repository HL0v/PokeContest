import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import BossDashboard from './components/BossDashboard';
import AnalistaDashboard from './components/AnalistaDashboard';
import ContestPage from './components/ContestPage';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/boss" element={<BossDashboard />} />
        <Route path="/analista" element={<AnalistaDashboard />} />
        <Route path="/contest/:role" element={<ContestPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
