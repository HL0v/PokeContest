import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, ListTodo, PenTool, Users, Image as ImageIcon,
  Plus, RefreshCw, Power, Star, BarChart2, Palette
} from 'lucide-react';
import { apiService } from '../../services/api';

function TargetIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <circle cx="12" cy="12" r="6"></circle>
      <circle cx="12" cy="12" r="2"></circle>
    </svg>
  );
}

function RoleIcon({ role }) {
  if (role === 'boss') return <Star size={14} fill="currentColor" />;
  if (role === 'analista') return <BarChart2 size={14} />;
  return <Palette size={14} />;
}

export default function Sidebar({ role, activeItem }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    apiService.logout();
    navigate('/');
  };

  const title = "Contest HQ";
  const subtitle = role === 'artista' ? "Estúdio de Arte" : "Advanced Exploration";
  const roleName = role === 'boss' ? 'Boss' : role === 'analista' ? 'Analista' : 'Artista';

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <TargetIcon />
        </div>
        <div className="sidebar-title-wrapper">
          <span className="sidebar-title" style={{fontFamily: 'Outfit', fontWeight: 700}}>{title}</span>
          <span className="sidebar-subtitle">{subtitle}</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {role === 'artista' ? (
          <>
            <a href="#" className={`nav-item ${activeItem === 'dashboard' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); navigate('/artista'); }}>
              <LayoutDashboard size={20} /> Dashboard
            </a>
            <a href="#" className={`nav-item ${activeItem === 'criar_submissao' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); navigate('/contest/artista'); }}>
              <PenTool size={20} /> Criar Submissão
            </a>
            <a href="#" className={`nav-item ${activeItem === 'portfolio' ? 'active' : ''}`}>
              <ImageIcon size={20} /> Meu Portfólio
            </a>
          </>
        ) : (
          <>
            <a href="#" className={`nav-item ${activeItem === 'dashboard' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); navigate(role === 'boss' ? '/boss' : '/analista'); }}>
              <LayoutDashboard size={20} /> Dashboard
            </a>
            <a href="#" className={`nav-item ${activeItem === 'requests' ? 'active' : ''}`}>
              <ListTodo size={20} /> Requests
            </a>
            <a href="#" className={`nav-item ${activeItem === 'concurso' || activeItem === 'submissions' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); navigate(`/contest/${role}`); }}>
              <PenTool size={20} /> {activeItem === 'concurso' ? 'Concurso' : 'Submissions'}
            </a>
            <a href="#" className={`nav-item ${activeItem === 'management' ? 'active' : ''}`}>
              <Users size={20} /> Management
            </a>
          </>
        )}
      </nav>

      <div className="sidebar-bottom">
        {role === 'boss' && (
          <button className="btn-new-request" onClick={() => navigate('/contest/boss')}>
            <Plus size={18} /> Novo Pedido
          </button>
        )}
        
        <div className="role-switcher">
          <div className="role-switcher-left">
            <RoleIcon role={role} /> {roleName}
          </div>
          <RefreshCw size={14} />
        </div>

        <button className="logout-link" onClick={handleLogout}>
          <Power size={16} /> Sair
        </button>
      </div>
    </aside>
  );
}
