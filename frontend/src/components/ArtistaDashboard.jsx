import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, Settings, Search, LayoutDashboard, PenTool, Power, RefreshCw, Palette, Image as ImageIcon 
} from 'lucide-react';
import { apiService } from '../services/api';

export default function ArtistaDashboard() {
  const navigate = useNavigate();
  const [activeContests, setActiveContests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const contests = await apiService.getActiveContests();
        setActiveContests(contests);
      } catch (error) {
        console.error("Erro ao carregar dados do artista:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

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
            <span className="sidebar-subtitle">Estúdio de Arte</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <a href="#" className="nav-item active">
            <LayoutDashboard size={20} /> Dashboard
          </a>
          <a href="#" className="nav-item" onClick={(e) => { e.preventDefault(); navigate('/contest/artista'); }}>
            <PenTool size={20} /> Criar Submissão
          </a>
          <a href="#" className="nav-item">
            <ImageIcon size={20} /> Meu Portfólio
          </a>
        </nav>

        <div className="sidebar-bottom">
          <div className="role-switcher">
            <div className="role-switcher-left">
              <Palette size={14} /> Artista
            </div>
            <RefreshCw size={14} />
          </div>

          <button className="logout-link" onClick={() => {
            apiService.logout();
            navigate('/');
          }}>
            <Power size={16} /> Sair
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="main-content-wrapper">
        <header className="top-navbar">
          <div className="navbar-left">
            <div className="navbar-logo-text">Contest Nexus</div>
            <div className="navbar-badge" style={{background: 'rgba(16, 185, 129, 0.1)', color: 'var(--status-green)'}}>ARTISTA</div>
          </div>
          
          <div className="navbar-right">
            <button className="icon-btn">
              <Bell size={20} />
              <span className="notification-dot"></span>
            </button>
            <button className="icon-btn">
              <Settings size={20} />
            </button>
            <img src="https://i.pravatar.cc/150?u=a042581f4e29026704g" alt="User" className="user-profile" />
          </div>
        </header>

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

          <div className="section-panel" style={{padding: '1.5rem'}}>
            <h3 style={{marginBottom: '1rem'}}>Concursos Abertos</h3>
            {loading ? (
              <p>Carregando concursos...</p>
            ) : (
              <div className="stats-row">
                {activeContests.map(c => (
                  <div key={c.id} className="request-card" style={{margin: 0}}>
                    <div className="request-badge" style={{background: 'rgba(59, 130, 246, 0.1)', color: 'var(--status-blue)'}}>NOVO DESAFIO</div>
                    <div style={{fontWeight: 600, marginBottom: '0.5rem', fontSize: '1.1rem'}}>{c.title}</div>
                    <p style={{fontSize: '0.85rem', color: 'var(--text-gray)', marginBottom: '1rem'}}>
                      Competição ativa! Aceitando submissões de artistas criativos para os novos ativos Pokémon.
                    </p>
                    <button className="btn-secondary" style={{width: '100%'}} onClick={() => navigate('/contest/artista')}>
                      PARTICIPAR
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
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
