import React from 'react';
import { getCatalogMetrics, getHistoryMetrics, CATALOG_BOOKS } from '../data/booksData';
import { PergunteEstante } from './PergunteEstante';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { BookOpen, CheckCircle2, BookMarked, Bookmark, BookX, RefreshCw, Trophy, ChevronRight } from 'lucide-react';

export const VisaoGeral: React.FC = () => {
  const catMetrics = getCatalogMetrics();
  const histMetrics = getHistoryMetrics();

  const statusPieData = catMetrics.byStatus.map(s => ({
    name: s.status,
    value: s.count,
    color: s.color,
  }));

  const topEditoras = catMetrics.byEditora.slice(0, 7);
  const topAutores = catMetrics.byAutor.slice(0, 7);
  const comprasPorAno = catMetrics.byAnoCompra.filter(a => a.year !== 'Não informado');

  // Sample books for Quick Consultation block
  const sampleBooks = [
    { nome: 'O Assassinato no Expresso do Oriente', autor: 'Agatha Christie', lido: 'LIDO', badge: 'bg-emerald-100 text-emerald-800' },
    { nome: 'Duna', autor: 'Frank Herbert', lido: 'NÃO LIDO', badge: 'bg-blue-100 text-blue-800' },
    { nome: 'Memórias Póstumas de Brás Cubas', autor: 'Machado de Assis', lido: 'LENDO', badge: 'bg-amber-100 text-amber-800' },
    { nome: 'A Revolução dos Bichos', autor: 'George Orwell', lido: 'LIDO', badge: 'bg-emerald-100 text-emerald-800' },
  ];

  return (
    <div className="space-y-8">
      {/* KPI Cards Grid - Sleek 6-column Layout */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
            Indicadores do Acervo Atual
            <span className="text-xs font-normal text-slate-400 capitalize">(325 livros cadastrados)</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {/* Total */}
          <div id="kpi-total" className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] uppercase font-extrabold tracking-tight text-slate-500">Total</span>
              <BookOpen className="w-4 h-4 text-slate-400" />
            </div>
            <div className="text-2xl font-bold text-slate-800">{catMetrics.total}</div>
            <p className="text-[11px] text-slate-400 mt-1">Livros no acervo</p>
          </div>

          {/* Lidos */}
          <div id="kpi-lidos" className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] uppercase font-extrabold tracking-tight text-emerald-600">Lidos</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-bold text-slate-800">{catMetrics.lidos}</div>
            <p className="text-[11px] text-emerald-600 font-medium mt-1">
              {((catMetrics.lidos / catMetrics.total) * 100).toFixed(1)}% do acervo
            </p>
          </div>

          {/* Não Lidos */}
          <div id="kpi-nao-lidos" className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] uppercase font-extrabold tracking-tight text-blue-600">Não Lidos</span>
              <Bookmark className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-slate-800">{catMetrics.naoLidos}</div>
            <p className="text-[11px] text-blue-600 font-medium mt-1">
              {((catMetrics.naoLidos / catMetrics.total) * 100).toFixed(1)}% do acervo
            </p>
          </div>

          {/* Lendo */}
          <div id="kpi-lendo" className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] uppercase font-extrabold tracking-tight text-amber-600">Lendo</span>
              <BookMarked className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl font-bold text-slate-800">{catMetrics.lendo}</div>
            <p className="text-[11px] text-amber-600 font-medium mt-1">Em leitura atual</p>
          </div>

          {/* Relendo */}
          <div id="kpi-relendo" className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] uppercase font-extrabold tracking-tight text-purple-600">Relendo</span>
              <RefreshCw className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-slate-800">{catMetrics.relendo}</div>
            <p className="text-[11px] text-purple-600 font-medium mt-1">Releitura ativa</p>
          </div>

          {/* Abandonados */}
          <div id="kpi-abandonados" className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] uppercase font-extrabold tracking-tight text-rose-600">Abandonados</span>
              <BookX className="w-4 h-4 text-rose-600" />
            </div>
            <div className="text-2xl font-bold text-slate-800">{catMetrics.abandonados}</div>
            <p className="text-[11px] text-rose-600 font-medium mt-1">Interrompidos</p>
          </div>
        </div>
      </div>

      {/* Natural Language Q&A Module */}
      <PergunteEstante />

      {/* Main Charts & Quick Highlights Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Status Distribution Donut Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">
              Distribuição por Status (Acervo)
            </h3>
            <p className="text-xs text-slate-400 mb-6">Proporção de livros no acervo por situação de leitura</p>
          </div>

          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {statusPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: number) => [`${val} livros`, 'Quantidade']}
                  contentStyle={{ borderRadius: '12px', fontSize: '12px', border: '1px solid #e2e8f0' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-100">
            {statusPieData.map((s, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                <span className="text-xs font-medium text-slate-600">
                  {s.name}: <strong className="text-slate-900">{s.value}</strong>
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Compras por Ano (Acervo) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">
              Compras de Livros por Ano
            </h3>
            <p className="text-xs text-slate-400 mb-6">Evolução temporal das aquisições no acervo</p>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comprasPorAno}>
                <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip
                  formatter={(val: number) => [`${val} livros`, 'Comprados']}
                  contentStyle={{ borderRadius: '12px', fontSize: '12px', border: '1px solid #e2e8f0' }}
                />
                <Bar dataKey="count" fill="#2563eb" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-400">
            Maior concentração de compras identificada no histórico recente do acervo.
          </div>
        </div>

        {/* Top Autores */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">
              Principais Autores no Acervo
            </h3>
            <p className="text-xs text-slate-400 mb-6">Autores com maior número de títulos cadastrados</p>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={topAutores} margin={{ left: 30 }}>
                <XAxis type="number" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip
                  formatter={(val: number) => [`${val} livros`, 'No acervo']}
                  contentStyle={{ borderRadius: '12px', fontSize: '12px', border: '1px solid #e2e8f0' }}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Editoras */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">
              Principais Editoras no Acervo
            </h3>
            <p className="text-xs text-slate-400 mb-6">Editoras mais presentes na biblioteca pessoal</p>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={topEditoras} margin={{ left: 30 }}>
                <XAxis type="number" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip
                  formatter={(val: number) => [`${val} livros`, 'Quantidade']}
                  contentStyle={{ borderRadius: '12px', fontSize: '12px', border: '1px solid #e2e8f0' }}
                />
                <Bar dataKey="count" fill="#1d4ed8" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* History Record Highlight Card */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-6 sm:p-8 rounded-2xl shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="text-xs font-bold text-blue-400 uppercase tracking-wider">
            Histórico de Leituras Validado
          </div>
          <h3 className="text-2xl font-bold">275 Registros de Leitura Mapeados</h3>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Recorde histórico compartilhado entre <strong>2021 (35 leituras)</strong> e <strong>2025 (35 leituras)</strong>.
            O ano parcial de <strong>2026</strong> soma até o momento 28 leituras registradas.
          </p>
        </div>
        <div className="bg-white/10 backdrop-blur-md px-5 py-4 rounded-xl border border-white/15 text-center shrink-0">
          <div className="flex items-center justify-center gap-1.5 text-amber-400 mb-1">
            <Trophy className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Top Recorde</span>
          </div>
          <span className="block font-black text-2xl text-white">35 Leituras</span>
          <span className="text-xs text-blue-200">Em 2021 & 2025</span>
        </div>
      </div>
    </div>
  );
};
