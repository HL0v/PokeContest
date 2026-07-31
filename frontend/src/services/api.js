// This file handles all backend communication.
// Currently it returns mock data so the UI remains functional, 
// but it is fully structured to be easily swapped with the real fetch calls (commented below).

// MOCK DATA (to be removed once backend is ready)
const MOCK_POKEMON_TYPES = [
  { id: 1, name: 'Normal', color: '#A8A878', emoji: '⭐' },
  { id: 2, name: 'Fogo', color: '#F08030', emoji: '🔥' },
  { id: 3, name: 'Água', color: '#6890F0', emoji: '💧' },
];
const MOCK_CONTESTS = [
  { id: 1, title: 'Campanha Ethereal', status: 'active', submissions: 5 },
  { id: 2, title: 'Redesign Tier 3', status: 'active', submissions: 3 },
];
const MOCK_SUBMISSIONS = [
  {
    id: 1, contestId: 1, artistName: 'Arthur_V', artistTier: 'Pro Artist',
    avatarColor: 'avatar-yellow', initials: 'AR', pokemonName: 'Lapras', 
    attacks: 'Surf, Ice Beam', comments: 'Design focado em tons gelados.', status: 'pending'
  }
];

const delay = (ms) => new Promise(res => setTimeout(res, ms));

export const apiService = {
  // --- AUTHENTICATION ---
  login: async (username, password, role) => {
    /* REAL BACKEND LOGIC:
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, role })
    });
    if (!res.ok) throw new Error('Falha na autenticação');
    const data = await res.json();
    localStorage.setItem('token', data.token);
    localStorage.setItem('userRole', data.role);
    return data;
    */

    // MOCK DELAY
    await delay(800);
    localStorage.setItem('token', 'mock-jwt-token-123');
    localStorage.setItem('userRole', role);
    return { token: 'mock-jwt-token-123', role, username };
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
  },

  // --- BOSS ENDPOINTS ---
  getBossDashboard: async () => {
    /* REAL BACKEND LOGIC:
    const res = await fetch('/api/boss/dashboard', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    return await res.json();
    */
    await delay(500);
    return {
      totalActivity: 12,
      pendingRequests: 4,
      activeRequests: [
        { id: 1, name: 'Lapras', types: 'Água / Gelo', habitat: 'Ilhas Seafoam', desc: 'Necessário para travessia', status: 'Em Busca', color: 'blue', progress: 60 }
      ]
    };
  },

  createContest: async (contestData) => {
    /* REAL BACKEND LOGIC:
    const res = await fetch('/api/contests', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}` 
      },
      body: JSON.stringify(contestData)
    });
    return await res.json();
    */
    await delay(1000);
    return { success: true, id: Math.floor(Math.random() * 1000) };
  },

  getPokemonTypes: async () => {
    /* REAL BACKEND LOGIC:
    const res = await fetch('/api/pokemon/types');
    return await res.json();
    */
    return MOCK_POKEMON_TYPES;
  },

  // --- ARTIST ENDPOINTS ---
  getActiveContests: async () => {
    /* REAL BACKEND LOGIC:
    const res = await fetch('/api/contests/active', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    return await res.json();
    */
    await delay(500);
    return MOCK_CONTESTS;
  },

  getContestDetails: async (id) => {
    /* REAL BACKEND LOGIC:
    const res = await fetch(`/api/contests/${id}`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    return await res.json();
    */
    await delay(300);
    return {
      name: 'Lapras', types: [MOCK_POKEMON_TYPES[2]], habitat: 'Ilhas Seafoam',
      history: 'Necessário para travessia marítima longa. Prioridade alta.',
      hp: 130, attack: 85, defense: 80, spAtk: 85, spDef: 95, speed: 60
    };
  },

  submitArtwork: async (contestId, attacks, comments, file) => {
    /* REAL BACKEND LOGIC:
    const formData = new FormData();
    formData.append('contestId', contestId);
    formData.append('attacks', attacks);
    formData.append('comments', comments);
    formData.append('file', file);

    const res = await fetch('/api/submissions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
      body: formData // Note: Content-Type is set automatically by the browser for FormData
    });
    return await res.json();
    */
    await delay(1500);
    return { success: true };
  },

  // --- ANALYST ENDPOINTS ---
  getAnalystDashboard: async () => {
    /* REAL BACKEND LOGIC:
    const res = await fetch('/api/analyst/dashboard', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    return await res.json();
    */
    await delay(500);
    return {
      activeContests: 12,
      pendingFromBoss: 5,
      toValidate: 28,
      avgValidationTime: '1.2h',
      submissions: MOCK_SUBMISSIONS
    };
  },

  reviewSubmission: async (submissionId, action, grade, feedbackNote) => {
    /* REAL BACKEND LOGIC (action: 'accept', 'decline', 'revision')
    const res = await fetch(`/api/submissions/${submissionId}/review`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}` 
      },
      body: JSON.stringify({ action, grade, feedbackNote })
    });
    return await res.json();
    */
    await delay(800);
    return { success: true };
  },

  // --- NOTIFICATIONS ---
  getNotifications: async () => {
    /* REAL BACKEND LOGIC:
    const res = await fetch('/api/notifications', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    return await res.json();
    */
    return [
      { id: 1, text: 'Nova requisição do Boss', read: false },
      { id: 2, text: 'Submissão enviada para revisão', read: false }
    ];
  }
};
