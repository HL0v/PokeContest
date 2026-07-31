import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, Settings, Search, LayoutDashboard, ListTodo, PenTool, Users, Plus, 
  RefreshCw, Power, Filter, MessageCircle, Megaphone, ArrowRight
} from 'lucide-react';

export default function AnalistaDashboard() {
  const navigate = useNavigate();

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <TargetIcon />
          </div>
          <div className="sidebar-title-wrapper">
            <span className="sidebar-title" style={{fontFamily: 'Outfit', fontWeight: 700}}>Contest HQ</span>
            <span className="sidebar-subtitle">Advanced Exploration</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <a href="#" className="nav-item active">
            <LayoutDashboard size={20} /> Dashboard
          </a>
          <a href="#" className="nav-item">
            <ListTodo size={20} /> Requests
          </a>
          <a href="#" className="nav-item">
            <PenTool size={20} /> Submissions
          </a>
          <a href="#" className="nav-item">
            <Users size={20} /> Management
          </a>
        </nav>

        <div className="sidebar-bottom">
          <div className="role-switcher">
            <div className="role-switcher-left">
              <BarChartIcon /> Analista
            </div>
            <RefreshCw size={14} />
          </div>

          <button className="logout-link" onClick={() => navigate('/')}>
            <Power size={16} /> Sair
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="main-content-wrapper">
        <header className="top-navbar">
          <div className="navbar-left">
            <div className="navbar-logo-text">Contest Nexus</div>
            <div className="navbar-badge">ANALISTA</div>
          </div>

          <div className="navbar-search">
            <Search className="search-icon" />
            <input type="text" placeholder="Procurar requisições ou artistas..." />
          </div>

          <div className="navbar-right">
            <button className="icon-btn">
              <Bell size={20} />
              <span className="notification-dot"></span>
            </button>
            <button className="icon-btn">
              <Settings size={20} />
            </button>
            <img src="https://i.pravatar.cc/150?u=a042581f4e29026704f" alt="User" className="user-profile" />
          </div>
        </header>

        <main className="main-content">
          <div className="page-header">
            <div className="page-title-group">
              <h1>Painel de Curadoria</h1>
              <p>Gerencie as requisições de novos concursos e valide as submissões dos artistas ativos na plataforma Nexus.</p>
            </div>

            <div className="header-actions">
              <button className="btn-secondary">
                <Filter size={18} /> Filtrar
              </button>
              <button className="btn-new-request" onClick={() => navigate('/contest/analista')}>
                <Plus size={18} /> Novo Concurso
              </button>
            </div>
          </div>

          <div className="stats-row">
            <div className="stat-card">
              <div className="stat-label">CONCURSOS ATIVOS</div>
              <div className="stat-value">12</div>
              <div className="stat-indicator indicator-green">+2</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">PENDENTES DO BOSS</div>
              <div className="stat-value">05</div>
              <div className="stat-indicator indicator-red">URGENTE</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">OBRAS PARA VALIDAR</div>
              <div className="stat-value">28</div>
              <div style={{fontSize: '0.8rem', color: 'var(--text-gray)', marginTop: '0.5rem'}}>84% Meta</div>
              <div className="progress-container"><div className="progress-bar" style={{width: '84%', background: 'var(--status-blue)'}}></div></div>
            </div>
            <div className="stat-card">
              <div className="stat-label">TEMPO MÉDIO VALIDAÇÃO</div>
              <div className="stat-value">1.2h</div>
              <div className="progress-container"><div className="progress-bar" style={{width: '60%', background: 'var(--status-purple)'}}></div></div>
            </div>
          </div>

          <div className="two-cols">
            <div className="section-panel" style={{padding: '1.5rem'}}>
              <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600}}>
                  <Megaphone size={18} style={{color: 'var(--status-red)'}} /> Requisições do Boss
                </div>
                <div style={{fontSize: '0.8rem', color: 'var(--text-gray)'}}>5 itens</div>
              </div>

              <div className="request-card">
                <div className="request-badge critical">CRÍTICO</div>
                <div className="request-title">Campanha Lançamento "Ethereal"</div>
                <div className="request-desc">Necessita 3 variações de arte para o evento de fim de semana. Temática mística e cores neon.</div>
                <button className="btn-new-request" style={{marginTop: '1rem', padding: '0.5rem'}}>PUBLICAR AGORA</button>
                <div className="request-meta">Enviado por: Boss_Nexus • 2h atrás</div>
              </div>

              <div className="request-card">
                <div className="request-badge routine">ROTINA</div>
                <div className="request-title">Redesign de Ativos Tier 3</div>
                <div className="request-desc">Atualização visual para os crachás de participação nível ouro e platina.</div>
                <button className="btn-secondary" style={{width: '100%', marginTop: '1rem', padding: '0.5rem'}} onClick={() => navigate('/contest/analista')}>REVISAR</button>
                <div className="request-meta">Enviado por: Boss_Nexus • Ontem</div>
              </div>

              <a href="#" style={{display: 'block', textAlign: 'center', marginTop: '1rem', fontSize: '0.85rem'}}>Ver histórico de requisições</a>
            </div>

            <div className="section-panel">
              <div className="panel-header" style={{padding: '1.5rem'}}>
                <div className="panel-title">
                  <PenTool size={20} />
                  Submissões de Artistas
                </div>
                <div className="header-actions" style={{fontSize: '0.85rem'}}>
                  <span style={{fontWeight: 600, color: 'var(--primary-red)'}}>TODOS</span>
                  <span style={{color: 'var(--text-gray)'}}>EM ESPERA (28)</span>
                </div>
              </div>

              <table className="data-table">
                <thead>
                  <tr>
                    <th>Artista</th>
                    <th>Concurso</th>
                    <th>Preview</th>
                    <th>Avaliação</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <div className="artist-cell">
                        <div className="artist-avatar avatar-yellow">AR</div>
                        <div className="artist-info">
                          <span className="artist-name">Arthur_V</span>
                          <span className="artist-tier">Pro Artist</span>
                        </div>
                      </div>
                    </td>
                    <td style={{fontWeight: 500}}>Cyberpunk Neon City</td>
                    <td><div className="thumbnail"></div></td>
                    <td><input type="text" className="rating-input" placeholder="Nota" /></td>
                  </tr>
                  <tr>
                    <td>
                      <div className="artist-cell">
                        <div className="artist-avatar avatar-purple">EL</div>
                        <div className="artist-info">
                          <span className="artist-name">Elena_Sky</span>
                          <span className="artist-tier">Rising Star</span>
                        </div>
                      </div>
                    </td>
                    <td style={{fontWeight: 500}}>Minimal Nature Icons</td>
                    <td><div className="thumbnail"></div></td>
                    <td><input type="text" className="rating-input" placeholder="Nota" /></td>
                  </tr>
                  <tr>
                    <td>
                      <div className="artist-cell">
                        <div className="artist-avatar avatar-red">MX</div>
                        <div className="artist-info">
                          <span className="artist-name">Max_Z</span>
                          <span className="artist-tier">Vanguard</span>
                        </div>
                      </div>
                    </td>
                    <td style={{fontWeight: 500}}>3D Abstract Tech</td>
                    <td><div className="thumbnail"></div></td>
                    <td><input type="text" className="rating-input" placeholder="Nota" /></td>
                  </tr>
                </tbody>
              </table>
              <div style={{padding: '1rem 1.5rem', borderTop: '1px solid var(--border-light)', textAlign: 'right'}}>
                <a href="#" style={{fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem'}}>Ver todas as 28 submissões <ArrowRight size={14} /></a>
              </div>
            </div>
          </div>

          <div className="section-panel" style={{padding: '1.5rem'}}>
            <h3 style={{marginBottom: '1.5rem', fontSize: '1.1rem'}}>Status de Concursos Críticos</h3>
            <div className="stats-row" style={{marginBottom: 0}}>
              <div className="request-card" style={{margin: 0}}>
                <div className="request-badge" style={{background: 'rgba(139, 92, 246, 0.1)', color: 'var(--status-purple)'}}>ARTIST TRACK</div>
                <div style={{fontWeight: 600, marginBottom: '0.5rem'}}>Game Asset Pack v2</div>
                <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.25rem'}}>
                  <span>Progresso Total</span>
                  <span style={{fontWeight: 700}}>65%</span>
                </div>
                <div className="progress-container" style={{marginBottom: '0.75rem'}}><div className="progress-bar" style={{width: '65%', background: 'var(--status-purple)'}}></div></div>
                <div style={{fontSize: '0.75rem', color: 'var(--text-gray)'}}>18 de 30 submissões aprovadas pelo Analista.</div>
              </div>

              <div className="request-card" style={{margin: 0}}>
                <div className="request-badge" style={{background: 'rgba(239, 68, 68, 0.1)', color: 'var(--status-red)'}}>BOSS PRIORITY</div>
                <div style={{fontWeight: 600, marginBottom: '0.5rem'}}>Rebranding Nexus</div>
                <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.25rem'}}>
                  <span>Progresso Total</span>
                  <span style={{fontWeight: 700}}>20%</span>
                </div>
                <div className="progress-container" style={{marginBottom: '0.75rem'}}><div className="progress-bar" style={{width: '20%', background: 'var(--status-red)'}}></div></div>
                <div style={{fontSize: '0.75rem', color: 'var(--text-gray)'}}>Aguardando definição de cores primárias do Boss.</div>
              </div>

              <div className="request-card" style={{margin: 0}}>
                <div className="request-badge" style={{background: 'rgba(16, 185, 129, 0.1)', color: 'var(--status-green)'}}>ACTIVE REVIEW</div>
                <div style={{fontWeight: 600, marginBottom: '0.5rem'}}>Community Icons</div>
                <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.25rem'}}>
                  <span>Progresso Total</span>
                  <span style={{fontWeight: 700}}>92%</span>
                </div>
                <div className="progress-container" style={{marginBottom: '0.75rem'}}><div className="progress-bar" style={{width: '92%', background: 'var(--status-green)'}}></div></div>
                <div style={{fontSize: '0.75rem', color: 'var(--text-gray)'}}>Fase final de revisão técnica pelo Analista.</div>
              </div>
            </div>
          </div>
        </main>

        <button className="fab">
          <MessageCircle size={24} />
        </button>
      </div>
    </div>
  );
}

function TargetIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <circle cx="12" cy="12" r="6"></circle>
      <circle cx="12" cy="12" r="2"></circle>
    </svg>
  );
}

function BarChartIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"></line>
      <line x1="12" y1="20" x2="12" y2="4"></line>
      <line x1="6" y1="20" x2="6" y2="14"></line>
    </svg>
  );
}
