import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Search, Edit2, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { apiService } from '../services/api';
import Sidebar from './common/Sidebar';
import TopNavbar from './common/TopNavbar';

export default function BossManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ username: '', password: '', role: 'ARTISTA', tier: '', avatarColor: 'avatar-gray', initials: '' });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await apiService.getUsers();
      setUsers(data);
    } catch (error) {
      toast.error('Erro ao carregar usuários.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiService.createUser(formData);
      toast.success('Usuário criado com sucesso!');
      setIsModalOpen(false);
      loadUsers();
    } catch (error) {
      toast.error('Erro ao criar usuário. Tente outro username.');
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar role="boss" activeItem="management" />

      <div className="main-content-wrapper">
        <TopNavbar role="boss" showLinks={true} activeLink="" />

        <main className="main-content">
          <div className="page-header">
            <div className="page-title-group">
              <h1><Users size={28} className="text-primary-red" /> Gerenciamento de Equipe</h1>
              <p>Adicione novos artistas ou analistas e visualize o desempenho da sua equipe.</p>
            </div>

            <div className="header-actions">
              <button className="btn-new-request" onClick={() => setIsModalOpen(true)}>
                <UserPlus size={18} /> Novo Usuário
              </button>
            </div>
          </div>

          <div className="section-panel">
            <div className="panel-header">
              <div className="panel-title">
                Membros da Equipe ({users.length})
              </div>
              <div className="header-actions">
                <button className="icon-btn"><Search size={18} /></button>
              </div>
            </div>

            <table className="data-table">
              <thead>
                <tr>
                  <th>Usuário</th>
                  <th>Cargo</th>
                  <th>Nível / Tier</th>
                  <th>Criado Em</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="5" style={{textAlign: 'center'}}>Carregando usuários...</td></tr>
                ) : users.map(user => (
                  <tr key={user.id}>
                    <td>
                      <div className="artist-cell">
                        <div className={`artist-avatar ${user.avatarColor || 'avatar-gray'}`}>{user.initials || '??'}</div>
                        <div className="artist-info">
                          <span className="artist-name">{user.username}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`status-badge ${user.role === 'BOSS' ? 'red' : user.role === 'ANALISTA' ? 'purple' : 'blue'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>{user.tier || '-'}</td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button className="icon-btn" onClick={() => toast.info('Em breve')}><Edit2 size={16} /></button>
                      <button className="icon-btn" style={{color: 'var(--status-red)'}} onClick={() => toast.info('Em breve')}><Trash2 size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content section-panel" onClick={e => e.stopPropagation()} style={{ padding: '2rem', maxWidth: '500px', width: '100%' }}>
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><UserPlus size={20} /> Novo Usuário</h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="contest-field">
                <label className="input-label">Username</label>
                <input required type="text" className="input-field contest-input" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} />
              </div>
              <div className="contest-field">
                <label className="input-label">Senha</label>
                <input required type="password" className="input-field contest-input" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
              </div>
              <div className="contest-field">
                <label className="input-label">Cargo</label>
                <select className="input-field contest-input contest-select" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                  <option value="ARTISTA">Artista</option>
                  <option value="ANALISTA">Analista</option>
                  <option value="BOSS">Boss</option>
                </select>
              </div>
              <div className="contest-field">
                <label className="input-label">Iniciais (ex: AR)</label>
                <input required type="text" maxLength="2" className="input-field contest-input" value={formData.initials} onChange={e => setFormData({...formData, initials: e.target.value.toUpperCase()})} />
              </div>
              <div className="contest-field">
                <label className="input-label">Cor do Avatar</label>
                <select className="input-field contest-input contest-select" value={formData.avatarColor} onChange={e => setFormData({...formData, avatarColor: e.target.value})}>
                  <option value="avatar-red">Vermelho</option>
                  <option value="avatar-blue">Azul</option>
                  <option value="avatar-green">Verde</option>
                  <option value="avatar-yellow">Amarelo</option>
                  <option value="avatar-purple">Roxo</option>
                  <option value="avatar-gray">Cinza</option>
                </select>
              </div>
              <div className="contest-field">
                <label className="input-label">Nível / Tier (opcional)</label>
                <input type="text" className="input-field contest-input" value={formData.tier} onChange={e => setFormData({...formData, tier: e.target.value})} />
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Cancelar</button>
                <button type="submit" className="btn-primary">Criar Usuário</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
