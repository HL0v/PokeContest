import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, Star, BarChart2, Palette, User, Lock, ArrowRight, Shield, Globe, Headphones } from 'lucide-react';
import toast from 'react-hot-toast';
import { apiService } from '../services/api';

export default function Login() {
  const [role, setRole] = useState('BOSS');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await apiService.login(username, password, role);
      if (user.role === 'BOSS') { toast.success('Bem-vindo, Boss!'); navigate('/boss'); }
      else if (user.role === 'ANALISTA') { toast.success('Bem-vindo, Analista!'); navigate('/analista'); }
      else if (user.role === 'ARTISTA') { toast.success('Bem-vindo, Artista!'); navigate('/artista'); }
    } catch (error) {
      toast.error("Falha no login: credenciais inválidas.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">
            <Target size={32} />
          </div>
          <h1 className="navbar-logo-text" style={{fontSize: '1.25rem', marginBottom: '1.5rem'}}>Contest Nexus</h1>
          <h2 className="login-title">Acessar Terminal</h2>
          <p className="login-subtitle">Selecione seu cargo para iniciar a jornada.</p>
        </div>

        <form className="login-form" onSubmit={handleLogin}>
          <div className="role-selector">
            <button 
              type="button" 
              className={`role-btn ${role === 'BOSS' ? 'active' : ''}`}
              onClick={() => setRole('BOSS')}
            >
              <Star size={16} /> BOSS
            </button>
            <button 
              type="button" 
              className={`role-btn ${role === 'ANALISTA' ? 'active' : ''}`}
              onClick={() => setRole('ANALISTA')}
            >
              <BarChart2 size={16} /> ANALISTA
            </button>
            <button 
              type="button" 
              className={`role-btn ${role === 'ARTISTA' ? 'active' : ''}`}
              onClick={() => setRole('ARTISTA')}
            >
              <Palette size={16} /> ARTISTA
            </button>
          </div>

          <div className="input-group">
            <div className="input-header">
              <label className="input-label">Identificação</label>
            </div>
            <div className="input-wrapper">
              <User size={18} className="input-icon" />
              <input type="text" className="input-field" placeholder="Nome de usuário ou ID" value={username} onChange={e => setUsername(e.target.value)} required />
            </div>
          </div>

          <div className="input-group">
            <div className="input-header">
              <label className="input-label">Chave de Acesso</label>
              <a href="#" className="input-link">Esqueceu?</a>
            </div>
            <div className="input-wrapper">
              <Lock size={18} className="input-icon" />
              <input type="password" className="input-field" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
          </div>

          <label className="login-options">
            <input type="checkbox" /> Lembrar neste dispositivo
          </label>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'AUTENTICANDO...' : <>AUTENTICAR NO SISTEMA <ArrowRight size={18} /></>}
          </button>

          <div className="login-footer-links">
            Não possui credenciais? <a href="#">SOLICITAR REGISTRO</a>
          </div>
        </form>

        <div className="card-status-bar">
          <div className="status-left">
            <Shield size={14} /> Encriptação Ativa
          </div>
          <div>v2.4.0-nexus</div>
        </div>
      </div>

      <div className="global-footer">
        <div className="footer-item">
          <Globe size={16} /> Português (BR)
        </div>
        <div className="footer-item">
          <Headphones size={16} /> Suporte Central
        </div>
      </div>
    </div>
  );
}
