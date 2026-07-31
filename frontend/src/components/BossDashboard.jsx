import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, ListTodo, Rocket, MoreHorizontal, Filter
} from 'lucide-react';
import { apiService } from '../services/api';
import Sidebar from './common/Sidebar';
import TopNavbar from './common/TopNavbar';

export default function BossDashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState({ totalActivity: 0, pendingRequests: 0, activeRequests: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const user = apiService.getCurrentUser();
        const result = await apiService.getBossDashboard(user?.id);
        setData(result);
      } catch (error) {
        console.error("Erro ao carregar dashboard:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <Sidebar role="boss" activeItem="requests" />

      {/* Main Content */}
      <div className="main-content-wrapper">
        <TopNavbar role="boss" showLinks={true} activeLink="requests" />

        <main className="main-content">
          <div className="page-header">
            <div className="page-title-group">
              <h1>Painel do Chefe</h1>
              <p>Gerencie suas expedições e solicitações de Pokémon. Acompanhe o progresso das suas equipes em tempo real.</p>
            </div>

            <div className="stat-card-highlight">
              <Rocket className="bg-icon" />
              <div className="stat-label">ATIVIDADE TOTAL</div>
              <div className="stat-value">{loading ? '...' : data.totalActivity}</div>
              <div className="stat-sub">{loading ? 'Carregando...' : `${data.pendingRequests} Pedidos Pendentes`}</div>
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
                {loading ? (
                  <tr><td colSpan="6" style={{textAlign: 'center'}}>Carregando requisições...</td></tr>
                ) : data.activeRequests.length === 0 ? (
                  <tr><td colSpan="6" style={{textAlign: 'center'}}>Nenhuma requisição ativa.</td></tr>
                ) : (
                  data.activeRequests.map((req) => (
                    <tr key={req.id}>
                      <td>
                        <div className="pokemon-cell">
                          <div className="pokemon-icon" style={{background: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6'}}>🐾</div>
                          <div className="pokemon-info">
                            <span className="pokemon-name">{req.name}</span>
                            <span className="pokemon-type">{req.types}</span>
                          </div>
                        </div>
                      </td>
                      <td>{req.habitat}</td>
                      <td style={{color: 'var(--text-gray)', fontSize: '0.9rem'}}>{req.desc}</td>
                      <td><span className={`status-badge ${req.color}`}>{req.status}</span></td>
                      <td>
                        <div className="progress-container">
                          <div className="progress-bar" style={{width: `${req.progress}%`, background: `var(--status-${req.color})`}}></div>
                        </div>
                      </td>
                      <td><button className="icon-btn"><MoreHorizontal size={18} /></button></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}
