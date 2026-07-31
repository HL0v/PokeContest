import React from 'react';
import { Settings, Search, Bell } from 'lucide-react';
import NotificationDropdown from '../NotificationDropdown';

export default function TopNavbar({ role, showSearch = false, showLinks = false, activeLink = '' }) {
  const getBadgeStyle = () => {
    if (role === 'boss') return { background: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B' };
    if (role === 'analista') return { background: 'rgba(139, 92, 246, 0.1)', color: 'var(--status-purple)' };
    return { background: 'rgba(16, 185, 129, 0.1)', color: 'var(--status-green)' };
  };

  const getProfileId = () => {
    if (role === 'boss') return 'd';
    if (role === 'analista') return 'f';
    return 'g';
  };

  const roleName = role === 'boss' ? 'Boss' : role === 'analista' ? 'Analista' : 'Artista';

  return (
    <header className="top-navbar">
      <div className="navbar-left">
        <div className="navbar-logo-text">Contest Nexus</div>
        {showLinks ? (
          <div className="navbar-links">
            <a href="#" className={`nav-link ${activeLink === 'dashboard' ? 'active' : ''}`}>Dashboard</a>
            <a href="#" className={`nav-link ${activeLink === 'requests' ? 'active' : ''}`}>Requests</a>
          </div>
        ) : (
          <div className="navbar-badge" style={getBadgeStyle()}>
            {roleName.toUpperCase()}
          </div>
        )}
      </div>

      {showSearch && (
        <div className="navbar-search">
          <Search className="search-icon" />
          <input type="text" placeholder="Procurar requisições ou artistas..." />
        </div>
      )}

      <div className="navbar-right">
        {/* We assume NotificationDropdown is available, though ContestPage used a hardcoded Bell for some reason. We'll use NotificationDropdown consistently if possible, or fallback. */}
        <NotificationDropdown />
        <button className="icon-btn">
          <Settings size={20} />
        </button>
        <img src={`https://i.pravatar.cc/150?u=a042581f4e29026704${getProfileId()}`} alt="User" className="user-profile" />
      </div>
    </header>
  );
}
