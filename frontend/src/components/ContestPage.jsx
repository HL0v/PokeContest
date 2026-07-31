import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams, Navigate } from 'react-router-dom';
import {
  ListTodo, Palette, Upload, X, ChevronDown, Check, XCircle, RotateCcw, 
  Send, FileImage, Swords, MessageSquare, Award, Zap, Shield, Heart, Eye, 
  ArrowLeft, Sparkles, AlertTriangle, BarChart2
} from 'lucide-react';
import toast from 'react-hot-toast';
import { apiService } from '../services/api';
import Sidebar from './common/Sidebar';
import TopNavbar from './common/TopNavbar';



// ─── BOSS VIEW ───────────────────────────────────────────────────────────────

function BossContestView({ navigate }) {
  const [title, setTitle] = useState('');
  const [pokemonName, setPokemonName] = useState('');
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [habitat, setHabitat] = useState('');
  const [history, setHistory] = useState('');
  const [typeDropdownOpen, setTypeDropdownOpen] = useState(false);
  const [stats, setStats] = useState({ hp: 50, attack: 50, defense: 50, spAtk: 50, spDef: 50, speed: 50 });

  const [submitting, setSubmitting] = useState(false);
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
  }, []);

  const toggleType = (type) => {
    setSelectedTypes(prev =>
      prev.find(t => t.id === type.id)
        ? prev.filter(t => t.id !== type.id)
        : prev.length < 2 ? [...prev, type] : prev
    );
  };

  const handleStatChange = (stat, value) => {
    setStats(prev => ({ ...prev, [stat]: Math.max(1, Math.min(255, parseInt(value) || 0)) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await apiService.createContest({ title, pokemonName, types: selectedTypes, habitat, history, stats });
      toast.success('Concurso criado com sucesso!');
      navigate('/boss');
    } catch (error) {
      toast.error('Erro ao criar concurso.');
    } finally {
      setSubmitting(false);
    }
  };

  const primaryColor = selectedTypes.length > 0 ? selectedTypes[0].color : '#A8A878';
  const secondaryColor = selectedTypes.length > 1 ? selectedTypes[1].color : primaryColor;

  return (
    <>
      <div className="page-header">
        <div className="page-title-group">
          <button className="btn-back" onClick={() => navigate('/boss')}>
            <ArrowLeft size={18} /> Voltar ao Painel
          </button>
          <h1><Sparkles size={28} className="text-primary-red" /> Criar Novo Concurso</h1>
          <p>Preencha os dados do Pokémon e publique o concurso para os artistas.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="contest-grid">
          {/* Left Column – Form Fields */}
          <div className="contest-form-col">
            <div className="section-panel" style={{ padding: '1.5rem' }}>
              <h3 className="contest-section-title"><Award size={18} /> Dados do Concurso</h3>

              <div className="contest-field">
                <label className="input-label">Título do Concurso</label>
                <input
                  type="text" className="input-field contest-input"
                  placeholder="Ex: Campanha Lançamento Ethereal"
                  value={title} onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="contest-field">
                <label className="input-label">Nome do Pokémon</label>
                <input
                  type="text" className="input-field contest-input"
                  placeholder="Ex: Lapras"
                  value={pokemonName} onChange={(e) => setPokemonName(e.target.value)}
                />
              </div>

              <div className="contest-field">
                <label className="input-label">Tipo do Pokémon <span className="field-hint">(máx. 2)</span></label>
                <div className="type-selector-wrapper">
                  <button
                    type="button" className="type-selector-trigger"
                    onClick={() => setTypeDropdownOpen(!typeDropdownOpen)}
                  >
                    {selectedTypes.length === 0 ? (
                      <span className="placeholder-text">Selecionar tipo(s)...</span>
                    ) : (
                      <div className="selected-types-row">
                        {selectedTypes.map(t => (
                          <span key={t.id} className="type-chip" style={{ background: t.color + '22', color: t.color, borderColor: t.color + '44' }}>
                            {t.emoji} {t.name}
                            <X size={12} onClick={(e) => { e.stopPropagation(); toggleType(t); }} />
                          </span>
                        ))}
                      </div>
                    )}
                    <ChevronDown size={18} className={`chevron ${typeDropdownOpen ? 'open' : ''}`} />
                  </button>

                  {typeDropdownOpen && (
                    <div className="type-dropdown">
                      {pokemonTypes.map(type => {
                        const isSelected = selectedTypes.find(t => t.id === type.id);
                        return (
                          <button
                            type="button" key={type.id}
                            className={`type-dropdown-item ${isSelected ? 'selected' : ''}`}
                            onClick={() => toggleType(type)}
                          >
                            <span className="type-dot" style={{ background: type.color }}></span>
                            {type.emoji} {type.name}
                            {isSelected && <Check size={14} />}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              <div className="contest-field">
                <label className="input-label">Habitat</label>
                <input
                  type="text" className="input-field contest-input"
                  placeholder="Ex: Ilhas Seafoam"
                  value={habitat} onChange={(e) => setHabitat(e.target.value)}
                />
              </div>

              <div className="contest-field">
                <label className="input-label">História do Pokémon</label>
                <textarea
                  className="input-field contest-input contest-textarea"
                  placeholder="Descreva o contexto, a história e a importância deste Pokémon para o concurso..."
                  rows={5}
                  value={history} onChange={(e) => setHistory(e.target.value)}
                />
              </div>
            </div>

            {/* Attributes / Stats */}
            <div className="section-panel" style={{ padding: '1.5rem' }}>
              <h3 className="contest-section-title"><Zap size={18} /> Atributos Base</h3>
              <div className="stats-grid">
                {[
                  { key: 'hp', label: 'HP', icon: <Heart size={14} />, color: '#EF4444' },
                  { key: 'attack', label: 'Ataque', icon: <Swords size={14} />, color: '#F59E0B' },
                  { key: 'defense', label: 'Defesa', icon: <Shield size={14} />, color: '#3B82F6' },
                  { key: 'spAtk', label: 'Atq. Esp.', icon: <Sparkles size={14} />, color: '#8B5CF6' },
                  { key: 'spDef', label: 'Def. Esp.', icon: <Eye size={14} />, color: '#10B981' },
                  { key: 'speed', label: 'Velocidade', icon: <Zap size={14} />, color: '#EC4899' },
                ].map(s => (
                  <div key={s.key} className="stat-input-row">
                    <div className="stat-input-label" style={{ color: s.color }}>{s.icon} {s.label}</div>
                    <input
                      type="number" className="stat-number-input"
                      min={1} max={255}
                      value={stats[s.key]}
                      onChange={(e) => handleStatChange(s.key, e.target.value)}
                    />
                    <div className="stat-bar-container">
                      <div className="stat-bar-fill" style={{ width: `${(stats[s.key] / 255) * 100}%`, background: s.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column – Pokémon Card Preview */}
          <div className="contest-preview-col">
            <div className="pokemon-card-preview" style={{
              '--card-primary': primaryColor,
              '--card-secondary': secondaryColor,
            }}>
              <div className="poke-card-header">
                <span className="poke-card-name">{pokemonName || 'Pokémon'}</span>
                <span className="poke-card-hp">
                  <Heart size={14} /> {stats.hp}
                </span>
              </div>

              <div className="poke-card-image-area">
                <div className="poke-card-placeholder">
                  {selectedTypes.length > 0 ? (
                    <span className="poke-card-emoji">{selectedTypes[0].emoji}</span>
                  ) : '?'}
                </div>
              </div>

              <div className="poke-card-types">
                {selectedTypes.map(t => (
                  <span key={t.id} className="poke-card-type-badge" style={{ background: t.color }}>
                    {t.emoji} {t.name}
                  </span>
                ))}
                {selectedTypes.length === 0 && (
                  <span className="poke-card-type-badge" style={{ background: '#A8A878' }}>Tipo</span>
                )}
              </div>

              <div className="poke-card-stats">
                {[
                  { key: 'attack', label: 'ATK', color: '#F59E0B' },
                  { key: 'defense', label: 'DEF', color: '#3B82F6' },
                  { key: 'spAtk', label: 'SP.A', color: '#8B5CF6' },
                  { key: 'spDef', label: 'SP.D', color: '#10B981' },
                  { key: 'speed', label: 'SPD', color: '#EC4899' },
                ].map(s => (
                  <div key={s.key} className="poke-card-stat">
                    <div className="poke-card-stat-val" style={{ color: s.color }}>{stats[s.key]}</div>
                    <div className="poke-card-stat-label">{s.label}</div>
                  </div>
                ))}
              </div>

              {habitat && (
                <div className="poke-card-habitat">
                  🌍 {habitat}
                </div>
              )}

              {history && (
                <div className="poke-card-history">
                  <p>{history.length > 120 ? history.slice(0, 120) + '...' : history}</p>
                </div>
              )}
            </div>

            <div className="preview-label">
              <Eye size={14} /> Pré-visualização do Card
            </div>

            {/* Partial Boss Dashboard Summary */}
            <div className="section-panel" style={{ padding: '1.25rem' }}>
              <h4 className="contest-section-title" style={{ fontSize: '0.95rem' }}>
                <ListTodo size={16} className="text-primary-red" /> Seus Pedidos Ativos
              </h4>
              <div className="mini-request-list">
                {[
                  { name: 'Lapras', type: 'Água / Gelo', status: 'Em Busca', color: 'blue', progress: 60 },
                  { name: 'Arcanine', type: 'Fogo', status: 'Aguardando', color: 'orange', progress: 20 },
                ].map((p, i) => (
                  <div key={i} className="mini-request-item">
                    <div className="mini-request-info">
                      <span className="mini-request-name">{p.name}</span>
                      <span className="mini-request-type">{p.types}</span>
                    </div>
                    <span className={`status-badge ${p.color}`}>{p.status}</span>
                  </div>
                ))}
              </div>
            </div>

            <button type="submit" className="btn-primary contest-submit-btn" disabled={submitting}>
              <Sparkles size={18} /> {submitting ? 'PUBLICANDO...' : 'PUBLICAR CONCURSO'}
            </button>
          </div>
        </div>
      </form>
    </>
  );
}

// ─── ARTIST VIEW ─────────────────────────────────────────────────────────────

function ArtistaContestView({ navigate }) {
  const [selectedContest, setSelectedContest] = useState(null);
  const [attacks, setAttacks] = useState('');
  const [comments, setComments] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef(null);
  
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
  }, [selectedContest]);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) validateAndSetFile(file);
  };

  const validateAndSetFile = (file) => {
    const validTypes = ['image/jpeg', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      toast.error('Apenas arquivos .jpg ou .jpeg são aceitos.');
      return;
    }
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) validateAndSetFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedContest || !selectedFile) return toast.error('Selecione um concurso e uma imagem.');
    setSubmitting(true);
    try {
      await apiService.submitArtwork(selectedContest, attacks, comments, selectedFile);
      toast.success('Submissão enviada com sucesso!');
      navigate('/artista');
    } catch (error) {
      toast.error('Erro ao enviar.');
    } finally {
      setSubmitting(false);
    }
  };

  const contest = selectedContest ? activeContests.find(c => c.id === selectedContest) : null;

  return (
    <>
      <div className="page-header">
        <div className="page-title-group">
          <h1><Palette size={28} className="text-primary-red" /> Submissão de Arte</h1>
          <p>Visualize os atributos definidos pelo Boss, adicione os ataques, envie seu design e deixe seus comentários.</p>
        </div>
      </div>

      {/* Revision Banner */}
      {revisionSubmission && (
        <div className="revision-banner">
          <div className="revision-banner-icon"><RotateCcw size={20} /></div>
          <div className="revision-banner-content">
            <strong>Revisão Solicitada</strong>
            <p>{revisionSubmission.revisionNote}</p>
          </div>
        </div>
      )}

      {/* Contest Selector */}
      <div className="section-panel" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
        <label className="input-label" style={{ marginBottom: '0.5rem', display: 'block' }}>Selecionar Concurso</label>
        <select
          className="input-field contest-input contest-select"
          value={selectedContest || ''}
          onChange={(e) => setSelectedContest(parseInt(e.target.value) || null)}
        >
          <option value="">-- Escolha um concurso --</option>
          {activeContests.filter(c => c.status === 'active').map(c => (
            <option key={c.id} value={c.id}>{c.title}</option>
          ))}
        </select>
      </div>

      {selectedContest && contestDetails && (
        <form onSubmit={handleSubmit}>
          <div className="contest-grid">
            {/* Left – Boss Attributes (read-only) */}
            <div className="contest-form-col">
              <div className="section-panel" style={{ padding: '1.5rem' }}>
                <h3 className="contest-section-title"><Eye size={18} /> Atributos do Pokémon <span className="field-hint">(definidos pelo Boss)</span></h3>

                <div className="readonly-field">
                  <span className="readonly-label">Nome</span>
                  <span className="readonly-value">{contestDetails.name}</span>
                </div>
                <div className="readonly-field">
                  <span className="readonly-label">Tipo(s)</span>
                  <div className="readonly-value">
                    {contestDetails.types.map(t => (
                      <span key={t.id} className="type-chip" style={{ background: t.color + '22', color: t.color, borderColor: t.color + '44' }}>
                        {t.emoji} {t.name}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="readonly-field">
                  <span className="readonly-label">Habitat</span>
                  <span className="readonly-value">{contestDetails.habitat}</span>
                </div>
                <div className="readonly-field">
                  <span className="readonly-label">História</span>
                  <span className="readonly-value">{contestDetails.history}</span>
                </div>

                <div className="readonly-stats-row">
                  {[
                    { label: 'HP', value: contestDetails.hp, color: '#EF4444' },
                    { label: 'ATK', value: contestDetails.attack, color: '#F59E0B' },
                    { label: 'DEF', value: contestDetails.defense, color: '#3B82F6' },
                    { label: 'SP.A', value: contestDetails.spAtk, color: '#8B5CF6' },
                    { label: 'SP.D', value: contestDetails.spDef, color: '#10B981' },
                    { label: 'SPD', value: contestDetails.speed, color: '#EC4899' },
                  ].map(s => (
                    <div key={s.label} className="readonly-stat-chip" style={{ borderColor: s.color + '44' }}>
                      <span style={{ color: s.color, fontWeight: 700 }}>{s.value}</span>
                      <span className="readonly-stat-label">{s.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Attacks */}
              <div className="section-panel" style={{ padding: '1.5rem' }}>
                <h3 className="contest-section-title"><Swords size={18} /> Ataques</h3>
                <textarea
                  className="input-field contest-input contest-textarea"
                  placeholder="Descreva os ataques do Pokémon (ex: Surf — Ataque de água com poder 90, precisão 100%...)"
                  rows={4}
                  value={attacks} onChange={(e) => setAttacks(e.target.value)}
                />
              </div>

              {/* Comments */}
              <div className="section-panel" style={{ padding: '1.5rem' }}>
                <h3 className="contest-section-title"><MessageSquare size={18} /> Comentários</h3>
                <textarea
                  className="input-field contest-input contest-textarea"
                  placeholder="Adicione informações adicionais sobre o Pokémon, inspirações, referências..."
                  rows={3}
                  value={comments} onChange={(e) => setComments(e.target.value)}
                />
              </div>
            </div>

            {/* Right – File Upload + Preview */}
            <div className="contest-preview-col">
              <div className="section-panel" style={{ padding: '1.5rem' }}>
                <h3 className="contest-section-title"><FileImage size={18} /> Design do Pokémon</h3>
                <p className="field-hint" style={{ marginBottom: '1rem' }}>Apenas arquivos .jpg ou .jpeg são aceitos.</p>

                <div
                  className={`file-drop-zone ${dragOver ? 'drag-over' : ''} ${previewUrl ? 'has-file' : ''}`}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef} type="file"
                    accept=".jpg,.jpeg,image/jpeg"
                    style={{ display: 'none' }}
                    onChange={handleFileSelect}
                  />

                  {previewUrl ? (
                    <div className="file-preview">
                      <img src={previewUrl} alt="Preview" />
                      <button
                        type="button" className="file-remove-btn"
                        onClick={(e) => { e.stopPropagation(); setSelectedFile(null); setPreviewUrl(null); }}
                      >
                        <X size={16} />
                      </button>
                      <div className="file-name">{selectedFile?.name}</div>
                    </div>
                  ) : (
                    <div className="file-drop-placeholder">
                      <Upload size={40} />
                      <span>Arraste seu design aqui</span>
                      <span className="file-drop-hint">ou clique para selecionar</span>
                    </div>
                  )}
                </div>
              </div>

              <button type="submit" className="btn-primary contest-submit-btn" disabled={submitting}>
                <Send size={18} /> {submitting ? 'ENVIANDO...' : 'ENVIAR SUBMISSÃO'}
              </button>
            </div>
          </div>
        </form>
      )}
    </>
  );
}

// ─── ANALYST VIEW ────────────────────────────────────────────────────────────

function AnalistaContestView({ navigate }) {
  const [selectedContest, setSelectedContest] = useState(null);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [grade, setGrade] = useState('');
  const [feedbackNote, setFeedbackNote] = useState('');
  const [actionMode, setActionMode] = useState(null); // 'decline' | 'revision' | null
  const [actionSuccess, setActionSuccess] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [contests, setContests] = useState([]);
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
  const submission = submissions.find(s => s.id === selectedSubmission);

  const handleAction = async (action) => {
    if (action === 'decline' && !feedbackNote.trim()) { toast.error('A nota de feedback é obrigatória.'); return; }
    if (action === 'revision' && !feedbackNote.trim()) { toast.error('A nota de revisão é obrigatória.'); return; }
    
    setSubmitting(true);
    try {
      await apiService.reviewSubmission(submission.id, action, grade, feedbackNote);
      if (action === 'accept') {
        setActionSuccess(`Submissão de ${submission.artistName} foi ACEITA.`);
      } else if (action === 'decline') {
        setActionSuccess(`Submissão de ${submission.artistName} foi RECUSADA.`);
      } else if (action === 'revision') {
        setActionSuccess(`Submissão de ${submission.artistName} foi enviada para REVISÃO.`);
      }
      setTimeout(() => {
        setActionSuccess(null);
        setSelectedSubmission(null);
      }, 4000);
    } catch (error) {
      toast.error('Erro ao enviar revisão.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="page-header">
        <div className="page-title-group">
          <button className="btn-back" onClick={() => navigate('/analista')}>
            <ArrowLeft size={18} /> Voltar ao Painel
          </button>
          <h1><BarChart2 size={28} className="text-primary-red" /> Avaliar Submissões</h1>
          <p>Selecione o concurso e o Pokémon submetido pelos artistas para análise e validação.</p>
        </div>
      </div>

      {/* Success Toast */}
      {actionSuccess && (
        <div className="action-toast">
          <Check size={18} /> {actionSuccess}
        </div>
      )}

      {/* Selectors Row */}
      <div className="analyst-selectors">
        <div className="section-panel" style={{ padding: '1.25rem', flex: 1 }}>
          <label className="input-label" style={{ marginBottom: '0.5rem', display: 'block' }}>Concurso</label>
          <select
            className="input-field contest-input contest-select"
            value={selectedContest || ''}
            onChange={(e) => { setSelectedContest(parseInt(e.target.value) || null); setSelectedSubmission(null); setActionMode(null); }}
          >
            <option value="">-- Selecionar Concurso --</option>
            {activeContests.map(c => (
              <option key={c.id} value={c.id}>{c.title} ({c.submissions} submissões)</option>
            ))}
          </select>
        </div>

        {selectedContest && (
          <div className="section-panel" style={{ padding: '1.25rem', flex: 1 }}>
            <label className="input-label" style={{ marginBottom: '0.5rem', display: 'block' }}>Submissão do Artista</label>
            <select
              className="input-field contest-input contest-select"
              value={selectedSubmission || ''}
              onChange={(e) => { setSelectedSubmission(parseInt(e.target.value) || null); setActionMode(null); }}
            >
              <option value="">-- Selecionar Submissão --</option>
              {filteredSubmissions.map(s => (
                <option key={s.id} value={s.id}>{s.artistName} — {s.pokemonName}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Submission Detail */}
      {submission && (
        <div className="contest-grid" style={{ marginTop: '1.5rem' }}>
          {/* Left – Submission Details */}
          <div className="contest-form-col">
            <div className="section-panel" style={{ padding: '1.5rem' }}>
              <div className="submission-artist-header">
                <div className={`artist-avatar ${submission.avatarColor}`} style={{ width: 48, height: 48, fontSize: '1rem' }}>
                  {submission.initials}
                </div>
                <div>
                  <div className="artist-name" style={{ fontSize: '1.1rem' }}>{submission.artistName}</div>
                  <div className="artist-tier">{submission.artistTier}</div>
                </div>
                <span className={`status-badge ${submission.status === 'pending' ? 'orange' : submission.status === 'revision' ? 'blue' : 'green'}`}>
                  {submission.status === 'pending' ? 'Pendente' : submission.status === 'revision' ? 'Em Revisão' : 'Aprovado'}
                </span>
              </div>

              <div className="readonly-field">
                <span className="readonly-label">Pokémon</span>
                <span className="readonly-value">{submission.pokemonName}</span>
              </div>
              <div className="readonly-field">
                <span className="readonly-label">Ataques</span>
                <span className="readonly-value">{submission.attacks}</span>
              </div>
              <div className="readonly-field">
                <span className="readonly-label">Comentários do Artista</span>
                <span className="readonly-value">{submission.comments}</span>
              </div>

              {/* Image Preview */}
              <div className="submission-image-preview">
                <div className="thumbnail" style={{ width: '100%', height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', color: 'var(--text-gray)' }}>
                  <FileImage size={32} style={{ opacity: 0.3 }} />
                </div>
              </div>
            </div>
          </div>

          {/* Right – Grading & Actions */}
          <div className="contest-preview-col">
            <div className="section-panel" style={{ padding: '1.5rem' }}>
              <h3 className="contest-section-title"><Award size={18} /> Avaliação</h3>

              <div className="contest-field">
                <label className="input-label">Nota</label>
                <input
                  type="text" className="input-field contest-input grade-input"
                  placeholder="Ex: 9.5"
                  value={grade} onChange={(e) => setGrade(e.target.value)}
                />
              </div>

              <div className="analyst-action-buttons">
                <button
                  type="button" className="action-btn action-accept"
                  onClick={() => handleAction('accept')}
                >
                  <Check size={18} /> Aceitar
                </button>
                <button
                  type="button"
                  className={`action-btn action-decline ${actionMode === 'decline' ? 'active' : ''}`}
                  onClick={() => setActionMode(actionMode === 'decline' ? null : 'decline')}
                >
                  <XCircle size={18} /> Recusar
                </button>
                <button
                  type="button"
                  className={`action-btn action-revision ${actionMode === 'revision' ? 'active' : ''}`}
                  onClick={() => setActionMode(actionMode === 'revision' ? null : 'revision')}
                >
                  <RotateCcw size={18} /> Enviar para Revisão
                </button>
              </div>

              {/* Feedback textarea (shown for decline or revision) */}
              {actionMode && (
                <div className="feedback-area" style={{ animation: 'slideUp 0.3s ease-out' }}>
                  <label className="input-label">
                    {actionMode === 'decline' ? (
                      <><AlertTriangle size={14} style={{ color: 'var(--status-red)' }} /> Nota de Feedback (obrigatória)</>
                    ) : (
                      <><RotateCcw size={14} style={{ color: 'var(--status-blue)' }} /> Nota de Revisão (obrigatória)</>
                    )}
                  </label>
                  <textarea
                    className="input-field contest-input contest-textarea"
                    placeholder={
                      actionMode === 'decline'
                        ? 'Explique o motivo da recusa para que o artista receba uma notificação detalhada...'
                        : 'Descreva as alterações necessárias para que o artista possa revisar e reenviar...'
                    }
                    rows={4}
                    value={feedbackNote} onChange={(e) => setFeedbackNote(e.target.value)}
                  />
                  <button
                    type="button" className={`btn-primary ${actionMode === 'decline' ? 'btn-danger' : 'btn-info'}`}
                    onClick={() => handleAction(actionMode)}
                  >
                    <Send size={16} />
                    {actionMode === 'decline' ? 'CONFIRMAR RECUSA E NOTIFICAR ARTISTA' : 'ENVIAR PARA REVISÃO'}
                  </button>
                </div>
              )}
            </div>

            {/* Analyst Dashboard Summary */}
            <div className="section-panel" style={{ padding: '1.25rem' }}>
              <h4 className="contest-section-title" style={{ fontSize: '0.95rem' }}>
                <BarChart2 size={16} className="text-primary-red" /> Resumo da Curadoria
              </h4>
              <div className="mini-stats-row">
                <div className="mini-stat">
                  <div className="mini-stat-value">{stats.activeContests}</div>
                  <div className="mini-stat-label">Concursos</div>
                </div>
                <div className="mini-stat">
                  <div className="mini-stat-value" style={{ color: 'var(--status-orange)' }}>{stats.pendingFromBoss}</div>
                  <div className="mini-stat-label">Pendentes</div>
                </div>
                <div className="mini-stat">
                  <div className="mini-stat-value" style={{ color: 'var(--status-green)' }}>{stats.toValidate}</div>
                  <div className="mini-stat-label">Validadas</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ─── MAIN PAGE COMPONENT ─────────────────────────────────────────────────────

export default function ContestPage() {
  const { role } = useParams();
  const navigate = useNavigate();

  if (!['boss', 'artista', 'analista'].includes(role)) {
    return <Navigate to="/" replace />;
  }

  const renderContent = () => {
    switch (role) {
      case 'boss': return <BossContestView navigate={navigate} />;
      case 'artista': return <ArtistaContestView navigate={navigate} />;
      case 'analista': return <AnalistaContestView navigate={navigate} />;
      default: return null;
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar role={role} activeItem={role === 'artista' ? 'criar_submissao' : 'concurso'} />
      <div className="main-content-wrapper">
        <TopNavbar role={role} />
        <main className="main-content">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
