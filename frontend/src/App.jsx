import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './components/Login';
import BossDashboard from './components/BossDashboard';
import AnalistaDashboard from './components/AnalistaDashboard';
import ArtistaDashboard from './components/ArtistaDashboard';
import ContestPage from './components/ContestPage';
import ProtectedRoute from './components/ProtectedRoute';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/boss" element={<ProtectedRoute allowedRole="BOSS" element={<BossDashboard />} />} />
        <Route path="/analista" element={<ProtectedRoute allowedRole="ANALISTA" element={<AnalistaDashboard />} />} />
        <Route path="/artista" element={<ProtectedRoute allowedRole="ARTISTA" element={<ArtistaDashboard />} />} />
        <Route path="/contest/:role" element={<ProtectedRoute element={<ContestPage />} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
