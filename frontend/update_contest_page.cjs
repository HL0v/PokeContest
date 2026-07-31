const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/components/ContestPage.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Imports and Mock Data
content = content.replace(
  "import { apiService } from '../services/api';",
  "import { apiService } from '../services/api';\nimport NotificationDropdown from './NotificationDropdown';"
);

// Remove mock data (from "// ─── Mock Data ───" down to "// ─── Shared Internal Components ───")
content = content.replace(/\/\/ ─── Mock Data ───[\s\S]*?\/\/ ─── Shared Internal Components ───/, '// ─── Shared Internal Components ───');

// 2. TopNavbar Bell
content = content.replace(
  /<button className="icon-btn">\s*<Bell size={20} \/>\s*<span className="notification-dot"><\/span>\s*<\/button>/,
  '<NotificationDropdown />'
);

// 3. BossContestView
content = content.replace(
  '  const [submitting, setSubmitting] = useState(false);',
  `  const [submitting, setSubmitting] = useState(false);
  const [pokemonTypes, setPokemonTypes] = useState([]);
  const [myRequests, setMyRequests] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const types = await apiService.getPokemonTypes();
        setPokemonTypes(types);
        
        const user = apiService.getCurrentUser();
        if (user) {
          const dash = await apiService.getBossDashboard(user.id);
          setMyRequests(dash.activeRequests.slice(0, 3));
        }
      } catch (e) {}
    }
    load();
  }, []);`
);

content = content.replace(/POKEMON_TYPES/g, 'pokemonTypes');

content = content.replace(
  /{\[\s*{\s*name:\s*'Lapras'[\s\S]*?}\s*\]\.map/g,
  '{myRequests.map'
);
content = content.replace(
  /<span className="mini-request-type">{p\.type}<\/span>/g,
  '<span className="mini-request-type">{p.types}</span>'
);

// 4. ArtistaContestView
content = content.replace(
  "  const fileInputRef = useRef(null);\n\n  // Check for a revision note (mock: submission id=3 is in revision)\n  const revisionSubmission = MOCK_SUBMISSIONS.find(s => s.status === 'revision');",
  `  const fileInputRef = useRef(null);
  
  const [activeContests, setActiveContests] = useState([]);
  const [contestDetails, setContestDetails] = useState(null);
  const [revisionSubmission, setRevisionSubmission] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const user = apiService.getCurrentUser();
        const [contests, subs] = await Promise.all([
          apiService.getActiveContests(),
          apiService.getSubmissionsByArtist(user?.id)
        ]);
        setActiveContests(contests);
        if (subs) {
          setRevisionSubmission(subs.find(s => s.status === 'REVISION'));
        }
      } catch(e) {}
    }
    loadData();
  }, []);

  useEffect(() => {
    if (selectedContest) {
      apiService.getContestDetails(selectedContest).then(setContestDetails).catch(()=>setContestDetails(null));
    } else {
      setContestDetails(null);
    }
  }, [selectedContest]);`
);

content = content.replace(/MOCK_CONTESTS/g, 'activeContests');

// In ArtistaContestView: rendering contest details
// Replace occurrences of MOCK_BOSS_POKEMON with contestDetails and add a null check wrapper
content = content.replace(
  /{selectedContest && \(\s*<form onSubmit={handleSubmit}>/,
  `{selectedContest && contestDetails && (
        <form onSubmit={handleSubmit}>`
);

content = content.replace(/MOCK_BOSS_POKEMON/g, 'contestDetails');

// 5. AnalistaContestView
content = content.replace(
  "  const filteredSubmissions = MOCK_SUBMISSIONS.filter(s => s.contestId === selectedContest);\n  const submission = MOCK_SUBMISSIONS.find(s => s.id === selectedSubmission);",
  `  const [contests, setContests] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [stats, setStats] = useState({ activeContests: 0, pendingFromBoss: 0, toValidate: 0 });

  useEffect(() => {
    async function load() {
      try {
        const res = await apiService.getAnalystDashboard();
        const active = await apiService.getActiveContests();
        setContests(active);
        setStats({
          activeContests: res.activeContests,
          pendingFromBoss: res.pendingFromBoss,
          toValidate: res.toValidate
        });
      } catch(e) {}
    }
    load();
  }, []);

  useEffect(() => {
    if (selectedContest) {
      apiService.getSubmissionsByContest(selectedContest).then(setSubmissions).catch(()=>setSubmissions([]));
    } else {
      setSubmissions([]);
    }
  }, [selectedContest]);

  const filteredSubmissions = submissions;
  const submission = submissions.find(s => s.id === selectedSubmission);`
);

content = content.replace(
  /\{MOCK_CONTESTS\.map/g,
  '{contests.map'
);

content = content.replace(
  /<div className="mini-stat-value">12<\/div>/,
  '<div className="mini-stat-value">{stats.activeContests}</div>'
);
content = content.replace(
  /<div className="mini-stat-value" style={{ color: 'var\(--status-orange\)' }}>05<\/div>/,
  `<div className="mini-stat-value" style={{ color: 'var(--status-orange)' }}>{stats.pendingFromBoss}</div>`
);
content = content.replace(
  /<div className="mini-stat-value" style={{ color: 'var\(--status-green\)' }}>28<\/div>/,
  `<div className="mini-stat-value" style={{ color: 'var(--status-green)' }}>{stats.toValidate}</div>`
);


fs.writeFileSync(filePath, content);
console.log('Update complete');
