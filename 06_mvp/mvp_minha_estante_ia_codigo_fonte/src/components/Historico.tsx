import React, { useMemo, useState } from 'react';
import { HISTORY_RECORDS, getHistoryMetrics } from '../data/booksData';
import { HistoryRecord } from '../types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Filter, RotateCcw, History, Trophy, Calendar, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';

export const Historico: React.FC = () => {
  const [selectedAno, setSelectedAno] = useState('');
  const [selectedAutor, setSelectedAutor] = useState('');
  const [selectedFormato, setSelectedFormato] = useState('');
  const [selectedOrigem, setSelectedOrigem] = useState('');
  const [selectedPessoa, setSelectedPessoa] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const metrics = useMemo(() => getHistoryMetrics(), []);

  // Filter options lists
  const anosOptions = useMemo(() => {
    return metrics.byAno.map(a => String(a.year)).sort((a, b) => Number(b) - Number(a));
  }, [metrics]);

  const autoresOptions = useMemo(() => {
    return metrics.byAutor.map(a => a.name).filter(n => n !== 'Não informado').sort();
  }, [metrics]);

  const formatosOptions = useMemo(() => {
    return metrics.byFormato.map(f => f.name).filter(n => n !== 'Não informado').sort();
  }, [metrics]);

  const origensOptions = useMemo(() => {
    return metrics.byOrigem.map(o => o.name).filter(n => n !== 'Não informado').sort();
  }, [metrics]);

  const pessoasOptions = useMemo(() => {
    const set = new Set<string>();
    HISTORY_RECORDS.forEach(r => {
      if (r.emprestadoDe && r.emprestadoDe !== 'Não informado') {
        set.add(r.emprestadoDe);
      }
    });
    return Array.from(set).sort();
  }, []);

  const statusOptions = useMemo(() => {
    return metrics.byStatus.map(s => s.name).filter(n => n !== 'Não informado').sort();
  }, [metrics]);

  // Filtering history
  const filteredHistory = useMemo(() => {
    return HISTORY_RECORDS.filter(rec => {
      if (selectedAno && String(rec.anoLeitura) !== selectedAno) return false;
      if (selectedAutor && rec.autor !== selectedAutor) return false;
      if (selectedFormato && rec.formatoPlataforma !== selectedFormato) return false;
      if (selectedOrigem && rec.origemInstituicao !== selectedOrigem) return false;
      if (selectedPessoa && rec.emprestadoDe !== selectedPessoa) return false;
      if (selectedStatus && rec.statusEstante !== selectedStatus) return false;
      return true;
    });
  }, [selectedAno, selectedAutor, selectedFormato, selectedOrigem, selectedPessoa, selectedStatus]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [selectedAno, selectedAutor, selectedFormato, selectedOrigem, selectedPessoa, selectedStatus]);

  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage) || 1;
  const paginatedHistory = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredHistory.slice(start, start + itemsPerPage);
  }, [filteredHistory, currentPage]);

  const resetFilters = () => {
    setSelectedAno('');
    setSelectedAutor('');
    setSelectedFormato('');
    setSelectedOrigem('');
    setSelectedPessoa('');
    setSelectedStatus('');
  };

  const hasActiveFilters =
    Boolean(selectedAno || selectedAutor || selectedFormato || selectedOrigem || selectedPessoa || selectedStatus);

  const activeFiltersSummary = useMemo(() => {
    const active: string[] = [];
    if (selectedAno) active.push(`Ano: ${selectedAno}`);
    if (selectedAutor) active.push(`Autor: ${selectedAutor}`);
    if (selectedFormato) active.push(`Formato: ${selectedFormato}`);
    if (selectedOrigem) active.push(`Origem: ${selectedOrigem}`);
    if (selectedPessoa) active.push(`Emprestado de: ${selectedPessoa}`);
    if (selectedStatus) active.push(`Status: ${selectedStatus}`);

    if (active.length === 0) {
      return `Todos os registros (${filteredHistory.length} registros no histórico)`;
    }

    const countLabel = filteredHistory.length === 1 ? '1 registro encontrado' : `${filteredHistory.length} registros encontrados`;
    return `${active.join(' • ')} — ${countLabel}`;
  }, [selectedAno, selectedAutor, selectedFormato, selectedOrigem, selectedPessoa, selectedStatus, filteredHistory.length]);

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
            Histórico e Análises
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold uppercase tracking-wider">
              Base Independente
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Registro histórico de leituras concluídas (275 registros mapeados)
          </p>
        </div>

        <div className="text-xs bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs font-semibold text-slate-700 shrink-0">
          Exibindo <strong className="text-blue-600">{filteredHistory.length}</strong> de <strong>{metrics.total}</strong> registros
        </div>
      </div>

      {/* KPI Highlight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <History className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Mapeado</div>
            <div className="text-2xl font-black text-slate-800">{metrics.total}</div>
            <p className="text-[11px] text-slate-400 mt-0.5">Registros históricos mantidos</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">Recorde de Leituras</div>
            <div className="text-xl font-black text-slate-800">2021 & 2025</div>
            <p className="text-[11px] text-amber-600 font-medium mt-0.5">Empate com 35 leituras/ano</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">Ano 2026 (Parcial)</div>
            <div className="text-2xl font-black text-slate-800">28 leituras</div>
            <p className="text-[11px] text-emerald-600 font-medium mt-0.5">Registros em andamento</p>
          </div>
        </div>
      </div>

      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Leituras por Ano Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">
              Leituras por Ano (Histórico)
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Evolução temporal das leituras concluídas (Destaque: 2021 e 2025 com 35 leituras)
            </p>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics.byAno}>
                <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip
                  formatter={(val: number) => [`${val} leituras`, 'Quantidade']}
                  contentStyle={{ borderRadius: '12px', fontSize: '12px', border: '1px solid #e2e8f0' }}
                />
                <Bar dataKey="count" fill="#2563eb" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center text-xs text-slate-400">
            <span>Recorde compartilhado entre 2021 e 2025</span>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-blue-600 rounded-full"></span>
              <span className="text-[11px] font-semibold text-slate-600">Top Anos</span>
            </div>
          </div>
        </div>

        {/* Top Autores no Histórico */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">
              Autores Mais Presentes
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Principais autores com maior número de leituras concluídas no histórico
            </p>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={metrics.byAutor.filter(a => a.name !== 'Não informado').slice(0, 7)}
                margin={{ left: 30 }}
              >
                <XAxis type="number" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip
                  formatter={(val: number) => [`${val} leituras`, 'Total']}
                  contentStyle={{ borderRadius: '12px', fontSize: '12px', border: '1px solid #e2e8f0' }}
                />
                <Bar dataKey="count" fill="#1d4ed8" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Formatos e Plataformas */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">
              Formatos e Plataformas
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Mídia e plataformas de leitura registradas (Audible, Kindle, Spotify, etc.)
            </p>
          </div>

          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={metrics.byFormato.slice(0, 6)}
                margin={{ left: 20 }}
              >
                <XAxis type="number" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis dataKey="name" type="category" width={110} tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip
                  formatter={(val: number) => [`${val} registros`, 'Quantidade']}
                  contentStyle={{ borderRadius: '12px', fontSize: '12px', border: '1px solid #e2e8f0' }}
                />
                <Bar dataKey="count" fill="#0284c7" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Origem e Instituição */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">
              Origens e Instituições
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Bibliotecas e instituições de origem das leituras (Sesc, IFG, Irradiação, etc.)
            </p>
          </div>

          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={metrics.byOrigem.slice(0, 6)}
                margin={{ left: 20 }}
              >
                <XAxis type="number" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis dataKey="name" type="category" width={110} tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip
                  formatter={(val: number) => [`${val} registros`, 'Quantidade']}
                  contentStyle={{ borderRadius: '12px', fontSize: '12px', border: '1px solid #e2e8f0' }}
                />
                <Bar dataKey="count" fill="#0f766e" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* History Filters Toolbar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-600 uppercase tracking-wider">
            <Filter className="w-4 h-4 text-blue-600" /> Filtros do Histórico
          </div>
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Limpar filtros
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          {/* Ano */}
          <div>
            <select
              value={selectedAno}
              onChange={e => setSelectedAno(e.target.value)}
              className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white text-slate-800 transition-all"
            >
              <option value="">Todos os Anos</option>
              {anosOptions.map(ano => (
                <option key={ano} value={ano}>
                  {ano}
                </option>
              ))}
            </select>
          </div>

          {/* Autor */}
          <div>
            <select
              value={selectedAutor}
              onChange={e => setSelectedAutor(e.target.value)}
              className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white text-slate-800 transition-all"
            >
              <option value="">Todos os Autores</option>
              {autoresOptions.map(aut => (
                <option key={aut} value={aut}>
                  {aut}
                </option>
              ))}
            </select>
          </div>

          {/* Formato */}
          <div>
            <select
              value={selectedFormato}
              onChange={e => setSelectedFormato(e.target.value)}
              className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white text-slate-800 transition-all"
            >
              <option value="">Todos os Formatos</option>
              {formatosOptions.map(fmt => (
                <option key={fmt} value={fmt}>
                  {fmt}
                </option>
              ))}
            </select>
          </div>

          {/* Origem */}
          <div>
            <select
              value={selectedOrigem}
              onChange={e => setSelectedOrigem(e.target.value)}
              className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white text-slate-800 transition-all"
            >
              <option value="">Todas as Origens</option>
              {origensOptions.map(orig => (
                <option key={orig} value={orig}>
                  {orig}
                </option>
              ))}
            </select>
          </div>

          {/* Emprestado de */}
          <div>
            <select
              value={selectedPessoa}
              onChange={e => setSelectedPessoa(e.target.value)}
              className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white text-slate-800 transition-all"
            >
              <option value="">Emprestado de...</option>
              {pessoasOptions.map(p => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* Status Estante */}
          <div>
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white text-slate-800 transition-all"
            >
              <option value="">Todos os Status</option>
              {statusOptions.map(st => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Resumo do filtro ativo e acao de limpar */}
      <div className="bg-slate-900 text-white p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold">
          <Filter className="w-4 h-4 text-blue-400 shrink-0" />
          <span>
            Filtro Ativo: <strong className="text-blue-300 font-bold">{activeFiltersSummary}</strong>
          </span>
        </div>
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="self-start sm:self-auto text-xs bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Limpar filtro</span>
          </button>
        )}
      </div>

      {/* History Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-5 py-3.5">Nome / Título</th>
                <th className="px-5 py-3.5">Autor</th>
                <th className="px-5 py-3.5">Ano de Leitura</th>
                <th className="px-5 py-3.5">Status na Estante</th>
                <th className="px-5 py-3.5">Formato / Plataforma</th>
                <th className="px-5 py-3.5">Emprestado De</th>
                <th className="px-5 py-3.5">Origem / Instituição</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedHistory.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-slate-400">
                    Nenhum registro histórico encontrado com os filtros selecionados.
                  </td>
                </tr>
              ) : (
                paginatedHistory.map(rec => (
                  <tr key={rec.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-3.5 font-bold text-slate-900">
                      <div className="flex items-center gap-2.5">
                        <BookOpen className="w-4 h-4 text-blue-600 shrink-0" />
                        <span>{rec.nome}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 italic">
                      {rec.autor === 'Não informado' ? (
                        <span className="text-slate-300 not-italic">Não informado</span>
                      ) : (
                        rec.autor
                      )}
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-slate-800">
                      {rec.anoLeituraDisplay === 'Não informado' ? (
                        <span className="text-slate-300 italic font-normal">Não informado</span>
                      ) : (
                        rec.anoLeituraDisplay
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200/80">
                        {rec.statusEstante}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-600">
                      {rec.formatoPlataforma === 'Não informado' ? (
                        <span className="text-slate-300 italic">Não informado</span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-sky-50 text-sky-800 border border-sky-200/80">
                          {rec.formatoPlataforma}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-slate-600">
                      {rec.emprestadoDe === 'Não informado' ? (
                        <span className="text-slate-300 italic">Não informado</span>
                      ) : (
                        rec.emprestadoDe
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-slate-600">
                      {rec.origemInstituicao === 'Não informado' ? (
                        <span className="text-slate-300 italic">Não informado</span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200/80">
                          {rec.origemInstituicao}
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <div>
              Página <strong className="text-slate-800">{currentPage}</strong> de <strong className="text-slate-800">{totalPages}</strong>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 font-medium flex items-center gap-1 transition-all"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Anterior
              </button>

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 font-medium flex items-center gap-1 transition-all"
              >
                Próxima <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
