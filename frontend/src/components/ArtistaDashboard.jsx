import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PenTool, CheckCircle, Clock, AlertCircle
} from 'lucide-react';
import { apiService } from '../services/api';
import Sidebar from './common/Sidebar';
import TopNavbar from './common/TopNavbar';

export default function ArtistaDashboard() {
  const navigate = useNavigate();
  const [activeContests, setActiveContests] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [stats, setStats] = useState({ total: 0, accepted: 0, pending: 0, revision: 0 });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('available');

  useEffect(() => {
    async function loadData() {
      try {
        const user = apiService.getCurrentUser();
        const contests = await apiService.getActiveContests();
        const subs = await apiService.getSubmissionsByArtist(user?.id);
        
        setActiveContests(contests);
        setSubmissions(subs || []);
        
        if (subs) {
          setStats({
            total: subs.length,
            accepted: subs.filter(s => s.status === 'ACCEPTED').length,
            pending: subs.filter(s => s.status === 'PENDING').length,
            revision: subs.filter(s => s.status === 'REVISION').length
          });
        }
      } catch (error) {
        console.error("Erro ao carregar dados do artista:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const getFilteredContests = () => {
    return activeContests.filter(c => {
      // Find if artist has submitted to this contest
      const sub = submissions.find(s => s.contest?.id === c.id || s.contestId === c.id);
      
      if (activeTab === 'available') {
        return !sub;
      } else if (activeTab === 'in_progress') {
        return sub && (sub.status === 'PENDING' || sub.status === 'REVISION');
      } else if (activeTab === 'completed') {
        return sub && (sub.status === 'ACCEPTED' || sub.status === 'DECLINED');
      }
      return false;
    });
  };

  const filteredContests = getFilteredContests();

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <Sidebar role="artista" activeItem="dashboard" />

      {/* Main Content */}
      <div className="main-content-wrapper">
        <TopNavbar role="artista" />

        <main className="main-content">
          <div className="page-header">
            <div className="page-title-group">
              <h1>Meu Estúdio</h1>
              <p>Bem-vindo ao seu espaço criativo. Visualize os concursos ativos e envie seus designs.</p>
            </div>
            
            <div className="header-actions">
              <button className="btn-primary" onClick={() => navigate('/contest/artista')}>
                <PenTool size={18} /> INICIAR NOVA ARTE
              </button>
            </div>
          </div>

          <div className="stats-row">
            <div className="stat-card">
              <div className="stat-label">TOTAL DE SUBMISSÕES</div>
              <div className="stat-value">{loading ? '...' : stats.total}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label" style={{color: 'var(--status-green)'}}>ACEITAS</div>
              <div className="stat-value">{loading ? '...' : stats.accepted}</div>
              <CheckCircle size={20} style={{position: 'absolute', top: '1.25rem', right: '1.25rem', color: 'var(--status-green)', opacity: 0.2}} />
            </div>
            <div className="stat-card">
              <div className="stat-label" style={{color: 'var(--status-orange)'}}>PENDENTES</div>
              <div className="stat-value">{loading ? '...' : stats.pending}</div>
              <Clock size={20} style={{position: 'absolute', top: '1.25rem', right: '1.25rem', color: 'var(--status-orange)', opacity: 0.2}} />
            </div>
            <div className="stat-card">
              <div className="stat-label" style={{color: 'var(--status-red)'}}>EM REVISÃO</div>
              <div className="stat-value">{loading ? '...' : stats.revision}</div>
              <AlertCircle size={20} style={{position: 'absolute', top: '1.25rem', right: '1.25rem', color: 'var(--status-red)', opacity: 0.2}} />
            </div>
          </div>

          <div className="two-cols">
            <div className="section-panel" style={{padding: '1.5rem'}}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h3 style={{ margin: 0 }}>Desafios</h3>
              </div>

              {/* Segmented Control / Tabs */}
              <div className="tabs-container" style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-light)' }}>
                <button 
                  style={{ background: 'none', border: 'none', borderBottom: activeTab === 'available' ? '2px solid var(--primary-red)' : '2px solid transparent', padding: '0.5rem 1rem', cursor: 'pointer', fontWeight: activeTab === 'available' ? 600 : 400, color: activeTab === 'available' ? 'var(--text-dark)' : 'var(--text-gray)' }}
                  onClick={() => setActiveTab('available')}
                >
                  Disponíveis
                </button>
                <button 
                  style={{ background: 'none', border: 'none', borderBottom: activeTab === 'in_progress' ? '2px solid var(--primary-red)' : '2px solid transparent', padding: '0.5rem 1rem', cursor: 'pointer', fontWeight: activeTab === 'in_progress' ? 600 : 400, color: activeTab === 'in_progress' ? 'var(--text-dark)' : 'var(--text-gray)' }}
                  onClick={() => setActiveTab('in_progress')}
                >
                  Em Andamento
                </button>
                <button 
                  style={{ background: 'none', border: 'none', borderBottom: activeTab === 'completed' ? '2px solid var(--primary-red)' : '2px solid transparent', padding: '0.5rem 1rem', cursor: 'pointer', fontWeight: activeTab === 'completed' ? 600 : 400, color: activeTab === 'completed' ? 'var(--text-dark)' : 'var(--text-gray)' }}
                  onClick={() => setActiveTab('completed')}
                >
                  Concluídos
                </button>
              </div>

              {loading ? (
                <p>Carregando concursos...</p>
              ) : filteredContests.length === 0 ? (
                <p style={{ color: 'var(--text-gray)', textAlign: 'center', padding: '2rem 0' }}>Nenhum concurso encontrado para esta categoria.</p>
              ) : (
                <div className="stats-row">
                  {filteredContests.map(c => (
                    <div key={c.id} className="request-card" style={{margin: 0}}>
                      <div className="request-badge" style={{background: 'rgba(59, 130, 246, 0.1)', color: 'var(--status-blue)'}}>NOVO DESAFIO</div>
                      <div style={{fontWeight: 600, marginBottom: '0.5rem', fontSize: '1.1rem'}}>{c.title}</div>
                      <p style={{fontSize: '0.85rem', color: 'var(--text-gray)', marginBottom: '1rem'}}>
                        Competição ativa! Aceitando submissões de artistas criativos para os novos ativos Pokémon.
                      </p>
                      {activeTab === 'available' ? (
                        <button className="btn-secondary" style={{width: '100%'}} onClick={() => navigate('/contest/artista')}>
                          PARTICIPAR
                        </button>
                      ) : (
                        <button className="btn-secondary" style={{width: '100%', opacity: 0.7}} disabled>
                          {activeTab === 'in_progress' ? 'EM ANÁLISE' : 'FINALIZADO'}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="section-panel" style={{padding: '1.5rem'}}>
              <h3 style={{marginBottom: '1rem'}}>Minhas Submissões</h3>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Concurso</th>
                    <th>Ataques</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="3" style={{textAlign: 'center'}}>Carregando...</td></tr>
                  ) : submissions.length === 0 ? (
                    <tr><td colSpan="3" style={{textAlign: 'center'}}>Nenhuma submissão enviada.</td></tr>
                  ) : (
                    submissions.map(sub => {
                      const statusColors = { ACCEPTED: 'green', PENDING: 'orange', REVISION: 'red', DECLINED: 'red' };
                      const color = statusColors[sub.status] || 'gray';
                      return (
                        <tr key={sub.id}>
                          <td style={{fontWeight: 500}}>{sub.contest?.title || `Concurso #${sub.contest?.id || sub.contestId || 'Desconhecido'}`}</td>
                          <td>{sub.attacks}</td>
                          <td><span className={`status-badge ${color}`}>{sub.status}</span></td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
