import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, Settings, Search, LayoutDashboard, ListTodo, PenTool, Users, Plus, 
  RefreshCw, Power, Rocket, MoreHorizontal, Filter, MessageCircle
} from 'lucide-react';

export default function BossDashboard() {
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
          <a href="#" className="nav-item">
            <LayoutDashboard size={20} /> Dashboard
          </a>
          <a href="#" className="nav-item active">
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
          <button className="btn-new-request" onClick={() => navigate('/contest/boss')}>
            <Plus size={18} /> Novo Pedido
          </button>
          
          <div className="role-switcher">
            <div className="role-switcher-left">
              <StarIcon /> Boss
            </div>
            <RefreshCw size={14} />
          </div>

          <button className="logout-link" onClick={() => navigate('/')}>
            <Power size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="main-content-wrapper">
        <header className="top-navbar">
          <div className="navbar-left">
            <div className="navbar-logo-text">Contest Nexus</div>
            <div className="navbar-links">
              <a href="#" className="nav-link">Dashboard</a>
              <a href="#" className="nav-link active">Requests</a>
            </div>
          </div>

          <div className="navbar-right">
            <button className="icon-btn">
              <Bell size={20} />
              <span className="notification-dot"></span>
            </button>
            <button className="icon-btn">
              <Settings size={20} />
            </button>
            <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="User" className="user-profile" />
          </div>
        </header>

        <main className="main-content">
          <div className="page-header">
            <div className="page-title-group">
              <h1>Painel do Chefe</h1>
              <p>Gerencie suas expedições e solicitações de Pokémon. Acompanhe o progresso das suas equipes em tempo real.</p>
            </div>

            <div className="stat-card-highlight">
              <Rocket className="bg-icon" />
              <div className="stat-label">ATIVIDADE TOTAL</div>
              <div className="stat-value">12</div>
              <div className="stat-sub">4 Pedidos Pendentes</div>
            </div>
          </div>

          <div className="section-panel">
            <div className="panel-header">
              <div className="panel-title">
                <ListTodo size={20} className="text-primary-red" />
                Meus Pedidos Ativos
              </div>
              <div className="header-actions">
                <button className="icon-btn"><Search size={18} /></button>
                <button className="icon-btn"><Filter size={18} /></button>
              </div>
            </div>

            <table className="data-table">
              <thead>
                <tr>
                  <th>Pokémon / Tipo</th>
                  <th>Habitat</th>
                  <th>Descrição Detalhada</th>
                  <th>Status</th>
                  <th>Progresso</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <div className="pokemon-cell">
                      <div className="pokemon-icon" style={{background: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6'}}>💧</div>
                      <div className="pokemon-info">
                        <span className="pokemon-name">Lapras</span>
                        <span className="pokemon-type">Água / Gelo</span>
                      </div>
                    </div>
                  </td>
                  <td>Ilhas Seafoam</td>
                  <td style={{color: 'var(--text-gray)', fontSize: '0.9rem'}}>Necessário para travessia marítima longa. Prioridade alta.</td>
                  <td><span className="status-badge blue">Em Busca</span></td>
                  <td>
                    <div className="progress-container">
                      <div className="progress-bar" style={{width: '60%', background: 'var(--status-blue)'}}></div>
                    </div>
                  </td>
                  <td><button className="icon-btn"><MoreHorizontal size={18} /></button></td>
                </tr>
                <tr>
                  <td>
                    <div className="pokemon-cell">
                      <div className="pokemon-icon" style={{background: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B'}}>🔥</div>
                      <div className="pokemon-info">
                        <span className="pokemon-name">Arcanine</span>
                        <span className="pokemon-type">Fogo</span>
                      </div>
                    </div>
                  </td>
                  <td>Cinnabar Island</td>
                  <td style={{color: 'var(--text-gray)', fontSize: '0.9rem'}}>Forte para proteção e patrulha da base.</td>
                  <td><span className="status-badge orange">Aguardando</span></td>
                  <td>
                    <div className="progress-container">
                      <div className="progress-bar" style={{width: '20%', background: 'var(--status-orange)'}}></div>
                    </div>
                  </td>
                  <td><button className="icon-btn"><MoreHorizontal size={18} /></button></td>
                </tr>
                <tr>
                  <td>
                    <div className="pokemon-cell">
                      <div className="pokemon-icon" style={{background: 'rgba(139, 92, 246, 0.1)', color: '#8B5CF6'}}>🧠</div>
                      <div className="pokemon-info">
                        <span className="pokemon-name">Alakazam</span>
                        <span className="pokemon-type">Psíquico</span>
                      </div>
                    </div>
                  </td>
                  <td>Caverna de Cerulean</td>
                  <td style={{color: 'var(--text-gray)', fontSize: '0.9rem'}}>Comunicação telepática entre times.</td>
                  <td><span className="status-badge green">Concluído</span></td>
                  <td>
                    <div className="progress-container">
                      <div className="progress-bar" style={{width: '100%', background: 'var(--status-green)'}}></div>
                    </div>
                  </td>
                  <td><button className="icon-btn"><MoreHorizontal size={18} /></button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}

// Simple internal components for icons if they are not in lucide-react or need specific styling
function TargetIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <circle cx="12" cy="12" r="6"></circle>
      <circle cx="12" cy="12" r="2"></circle>
    </svg>
  );
}

function StarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
    </svg>
  );
}
