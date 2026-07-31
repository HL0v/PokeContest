const getToken = () => localStorage.getItem('token');

const authFetch = async (url, options = {}) => {
  const token = getToken();
  const headers = { ...options.headers };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const res = await fetch(url, { ...options, headers });
  if (res.status === 401 || res.status === 403) {
    // Basic auto-logout on unauthorized
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    window.location.href = '/';
  }
  return res;
};

export const apiService = {
  // --- AUTH ---
  login: async (username, password, role) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, role })
    });
    if (!res.ok) throw new Error('Falha na autenticação');
    const data = await res.json();
    localStorage.setItem('currentUser', JSON.stringify(data.user));
    localStorage.setItem('token', data.token);
    return data.user;
  },
  
  logout: () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
  },

  getCurrentUser: () => {
    const data = localStorage.getItem('currentUser');
    return data ? JSON.parse(data) : null;
  },

  // --- BOSS ---
  getBossDashboard: async (bossId) => {
    // Frontend currently expects: { totalActivity, pendingRequests, activeRequests[] }
    // Backend returns stats from GET /api/contests/boss/{bossId}/stats: { totalContests, activeContests, pendingSubmissions, completedContests }
    // And contests from GET /api/contests
    // We need to COMBINE them into the shape the UI expects
    const [statsRes, contestsRes] = await Promise.all([
      authFetch(`/api/contests/boss/${bossId}/stats`),
      authFetch('/api/contests')
    ]);
    const stats = await statsRes.json();
    const contests = await contestsRes.json();
    
    // Transform contests into activeRequests shape that BossDashboard expects:
    // { id, name, types, habitat, desc, status, color, progress }
    const activeRequests = contests
      .filter(c => c.boss && c.boss.id === bossId)
      .map(c => {
        const pr = c.pokemonRequest;
        const types = (c.pokemonTypes || []).map(t => t.name).join(' / ');
        const statusMap = { ACTIVE: { label: 'Em Busca', color: 'blue' }, PENDING: { label: 'Aguardando', color: 'orange' }, COMPLETED: { label: 'Concluído', color: 'green' } };
        const s = statusMap[c.status] || { label: c.status, color: 'blue' };
        return {
          id: c.id,
          name: pr ? pr.name : c.title,
          types,
          habitat: pr ? pr.habitat : '',
          desc: pr ? pr.history : '',
          status: s.label,
          color: s.color,
          progress: c.status === 'COMPLETED' ? 100 : c.status === 'ACTIVE' ? 60 : 20
        };
      });
    
    return {
      totalActivity: stats.totalContests || 0,
      pendingRequests: stats.pendingSubmissions || 0,
      activeRequests
    };
  },

  createContest: async (contestData) => {
    // contestData from BossContestView: { title, pokemonName, types (array of type objects), habitat, history, stats: {hp, attack, defense, spAtk, spDef, speed} }
    // Backend expects: { title, bossId, priority, pokemonTypeIds, pokemonRequest: { name, habitat, history, baseHp, ... } }
    const user = apiService.getCurrentUser();
    const body = {
      title: contestData.title,
      bossId: user?.id,
      priority: 'ROUTINE',
      pokemonTypeIds: contestData.types.map(t => t.id),
      pokemonRequest: {
        name: contestData.pokemonName,
        habitat: contestData.habitat,
        history: contestData.history,
        baseHp: contestData.stats.hp,
        baseAttack: contestData.stats.attack,
        baseDefense: contestData.stats.defense,
        baseSpAtk: contestData.stats.spAtk,
        baseSpDef: contestData.stats.spDef,
        baseSpeed: contestData.stats.speed
      }
    };
    const res = await authFetch('/api/contests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error('Erro ao criar concurso');
    return await res.json();
  },

  getPokemonTypes: async () => {
    const res = await authFetch('/api/pokemon-types');
    return await res.json();
  },

  // --- ARTIST ---
  getActiveContests: async () => {
    const res = await authFetch('/api/contests/active');
    return await res.json();
  },

  getContestDetails: async (id) => {
    const res = await authFetch(`/api/contests/${id}`);
    const contest = await res.json();
    // Transform to the shape ArtistaContestView expects
    const pr = contest.pokemonRequest || {};
    return {
      name: pr.name,
      types: contest.pokemonTypes || [],
      habitat: pr.habitat,
      history: pr.history,
      hp: pr.baseHp, attack: pr.baseAttack, defense: pr.baseDefense,
      spAtk: pr.baseSpAtk, spDef: pr.baseSpDef, speed: pr.baseSpeed
    };
  },

  submitArtwork: async (contestId, attacks, comments, file) => {
    const user = apiService.getCurrentUser();
    const formData = new FormData();
    formData.append('contestId', contestId);
    formData.append('artistId', user?.id);
    formData.append('attacks', attacks);
    formData.append('comments', comments);
    formData.append('file', file);
    const res = await authFetch('/api/submissions', {
      method: 'POST',
      body: formData
    });
    if (!res.ok) throw new Error('Erro ao enviar submissão');
    return await res.json();
  },

  getSubmissionsByArtist: async (artistId) => {
    const res = await authFetch(`/api/submissions/artist/${artistId}`);
    return await res.json();
  },

  // --- ANALYST ---
  getAnalystDashboard: async () => {
    // Fetch analyst stats + pending submissions
    const [statsRes, subsRes, contestsRes] = await Promise.all([
      authFetch('/api/analyst/stats'),
      authFetch('/api/submissions?status=PENDING'),  // We may need to fetch all and filter
      authFetch('/api/contests')
    ]);
    
    // If analyst/stats endpoint exists, use it; otherwise compute from raw data
    let stats;
    if (statsRes.ok) {
      stats = await statsRes.json();
    } else {
      stats = { activeContests: 0, pendingFromBoss: 0, worksToValidate: 0, avgValidationTime: 'N/A' };
    }
    
    const contests = await contestsRes.json();
    
    // Get pending submissions from all contests
    const allSubmissions = [];
    for (const contest of contests) {
      try {
        const subRes = await authFetch(`/api/submissions?contestId=${contest.id}`);
        if (subRes.ok) {
          const subs = await subRes.json();
          allSubmissions.push(...subs.filter(s => s.status === 'PENDING' || s.status === 'REVISION'));
        }
      } catch (e) { /* skip */ }
    }
    
    // Transform submissions to the shape AnalistaDashboard expects:
    // { id, artistName, artistTier, avatarColor, initials, pokemonName, contestId, status }
    const submissions = allSubmissions.map(s => ({
      id: s.id,
      contestId: s.contest?.id,
      artistName: s.artist?.username || 'Unknown',
      artistTier: s.artist?.tier || '',
      avatarColor: s.artist?.avatarColor || 'avatar-purple',
      initials: s.artist?.initials || '??',
      pokemonName: s.contest?.pokemonRequest?.name || s.contest?.title || '',
      imageUrl: s.imageUrl,
      status: s.status
    }));
    
    return {
      activeContests: stats.activeContests || 0,
      pendingFromBoss: stats.pendingFromBoss || 0,
      toValidate: stats.worksToValidate || submissions.length,
      avgValidationTime: stats.avgValidationTime || 'N/A',
      submissions
    };
  },

  getSubmissionsByContest: async (contestId) => {
    const res = await authFetch(`/api/submissions?contestId=${contestId}`);
    return await res.json();
  },

  reviewSubmission: async (submissionId, action, grade, feedbackNote) => {
    // Map frontend action names to backend status enum
    const statusMap = { accept: 'ACCEPTED', decline: 'DECLINED', revision: 'REVISION' };
    const res = await authFetch(`/api/submissions/${submissionId}/review`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: statusMap[action] || action,
        grade: grade ? parseFloat(grade) : null,
        feedbackNote
      })
    });
    if (!res.ok) throw new Error('Erro ao enviar revisão');
    return await res.json();
  },

  // --- NOTIFICATIONS ---
  getNotifications: async (userId) => {
    const res = await authFetch(`/api/notifications/user/${userId}`);
    return await res.json();
  },

  getUnreadCount: async (userId) => {
    const res = await authFetch(`/api/notifications/user/${userId}/unread-count`);
    const data = await res.json();
    return data.count || 0;
  },

  markAsRead: async (id) => {
    await authFetch(`/api/notifications/${id}/read`, { method: 'PUT' });
  },

  markAllAsRead: async (userId) => {
    await authFetch(`/api/notifications/user/${userId}/read-all`, { method: 'PUT' });
  }
};
