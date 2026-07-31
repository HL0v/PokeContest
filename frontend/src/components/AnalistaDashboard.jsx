import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PenTool, Plus, Filter, MessageCircle, Megaphone, ArrowRight
} from 'lucide-react';
import { apiService } from '../services/api';
import Sidebar from './common/Sidebar';
import TopNavbar from './common/TopNavbar';

export default function AnalistaDashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState({ activeContests: 0, pendingFromBoss: 0, toValidate: 0, avgValidationTime: '0h', submissions: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const result = await apiService.getAnalystDashboard();
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
      <Sidebar role="analista" activeItem="dashboard" />

      {/* Main Content */}
      <div className="main-content-wrapper">
        <TopNavbar role="analista" showSearch={true} />

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
            </div>
          </div>

          <div className="stats-row">
            <div className="stat-card">
              <div className="stat-label">CONCURSOS ATIVOS</div>
              <div className="stat-value">{loading ? '...' : data.activeContests}</div>
              <div className="stat-indicator indicator-green">+2</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">PENDENTES DO BOSS</div>
              <div className="stat-value">{loading ? '...' : data.pendingFromBoss}</div>
              <div className="stat-indicator indicator-red">URGENTE</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">OBRAS PARA VALIDAR</div>
              <div className="stat-value">{loading ? '...' : data.toValidate}</div>
              <div style={{fontSize: '0.8rem', color: 'var(--text-gray)', marginTop: '0.5rem'}}>84% Meta</div>
              <div className="progress-container"><div className="progress-bar" style={{width: '84%', background: 'var(--status-blue)'}}></div></div>
            </div>
            <div className="stat-card">
              <div className="stat-label">TEMPO MÉDIO VALIDAÇÃO</div>
              <div className="stat-value">{loading ? '...' : data.avgValidationTime}</div>
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
                  {loading ? (
                    <tr><td colSpan="4" style={{textAlign: 'center'}}>Carregando submissões...</td></tr>
                  ) : data.submissions.length === 0 ? (
                    <tr><td colSpan="4" style={{textAlign: 'center'}}>Nenhuma submissão aguardando revisão.</td></tr>
                  ) : (
                    data.submissions.map((sub) => (
                      <tr key={sub.id}>
                        <td>
                          <div className="artist-cell">
                            <div className={`artist-avatar ${sub.avatarColor || 'avatar-purple'}`}>{sub.initials}</div>
                            <div className="artist-info">
                              <span className="artist-name">{sub.artistName}</span>
                              <span className="artist-tier">{sub.artistTier}</span>
                            </div>
                          </div>
                        </td>
                        <td style={{fontWeight: 500}}>{sub.pokemonName}</td>
                        <td><div className="thumbnail"></div></td>
                        <td><button className="btn-secondary" style={{padding: '0.4rem'}} onClick={() => navigate('/contest/analista')}>AVALIAR</button></td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              <div style={{padding: '1rem 1.5rem', borderTop: '1px solid var(--border-light)', textAlign: 'right'}}>
                <a href="#" style={{fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem'}}>Ver todas as {data.toValidate} submissões <ArrowRight size={14} /></a>
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

