import React from 'react';
import { MainTab } from '../types';
import { BookOpen, LayoutDashboard, Library, History, ShieldCheck } from 'lucide-react';

interface SidebarProps {
  activeTab: MainTab;
  setActiveTab: (tab: MainTab) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 h-full">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-100 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs shrink-0">
          <BookOpen className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
            Minha Estante
            <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 font-bold uppercase">
              IA
            </span>
          </h1>
          <p className="text-[11px] text-slate-400 font-medium">Biblioteca Pessoal</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-1.5">
        <button
          onClick={() => setActiveTab('visao-geral')}
          className={`w-full px-4 py-2.5 rounded-xl font-medium text-xs flex items-center gap-3 transition-all ${
            activeTab === 'visao-geral'
              ? 'bg-blue-50 text-blue-700 shadow-2xs font-semibold'
              : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <LayoutDashboard className="w-4 h-4 text-blue-600 shrink-0" />
          <span>Visão Geral</span>
        </button>

        <button
          onClick={() => setActiveTab('biblioteca')}
          className={`w-full px-4 py-2.5 rounded-xl font-medium text-xs flex items-center gap-3 transition-all ${
            activeTab === 'biblioteca'
              ? 'bg-blue-50 text-blue-700 shadow-2xs font-semibold'
              : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <Library className="w-4 h-4 text-blue-600 shrink-0" />
          <span>Biblioteca</span>
        </button>

        <button
          onClick={() => setActiveTab('historico')}
          className={`w-full px-4 py-2.5 rounded-xl font-medium text-xs flex items-center gap-3 transition-all ${
            activeTab === 'historico'
              ? 'bg-blue-50 text-blue-700 shadow-2xs font-semibold'
              : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <History className="w-4 h-4 text-blue-600 shrink-0" />
          <span>Histórico e Análises</span>
        </button>
      </nav>

      {/* Bottom Validated History Card */}
      <div className="p-4 border-t border-slate-100">
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-4 rounded-xl shadow-md shadow-blue-100/50 space-y-1">
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider opacity-85">
            <span>Histórico Validado</span>
            <ShieldCheck className="w-3.5 h-3.5 text-blue-200" />
          </div>
          <p className="text-2xl font-black tracking-tight">275 registros</p>
          <p className="text-[10px] text-blue-100 font-medium pt-1 border-t border-blue-500/40">
            Acervo atual: 325 livros
          </p>
        </div>
      </div>
    </aside>
  );
};
