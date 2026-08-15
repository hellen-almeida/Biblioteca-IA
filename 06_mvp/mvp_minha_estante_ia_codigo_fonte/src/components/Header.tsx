import React from 'react';
import { MainTab } from '../types';
import { LayoutDashboard, Library, History, User } from 'lucide-react';

interface HeaderProps {
  activeTab: MainTab;
  setActiveTab: (tab: MainTab) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const getTabTitle = () => {
    switch (activeTab) {
      case 'visao-geral':
        return 'Painel de Controle — Visão Geral';
      case 'biblioteca':
        return 'Consulta da Biblioteca (Acervo)';
      case 'historico':
        return 'Histórico de Leituras e Análises';
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-20 shrink-0">
      {/* Title & Screen indicator */}
      <div className="flex items-center gap-3">
        <h2 className="text-base sm:text-lg font-bold text-slate-800 tracking-tight">
          {getTabTitle()}
        </h2>
      </div>

      {/* Mobile Nav pills */}
      <div className="flex md:hidden items-center gap-1 bg-slate-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('visao-geral')}
          className={`p-1.5 rounded-md text-xs font-semibold ${
            activeTab === 'visao-geral' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-500'
          }`}
          title="Visão Geral"
        >
          <LayoutDashboard className="w-4 h-4" />
        </button>
        <button
          onClick={() => setActiveTab('biblioteca')}
          className={`p-1.5 rounded-md text-xs font-semibold ${
            activeTab === 'biblioteca' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-500'
          }`}
          title="Biblioteca"
        >
          <Library className="w-4 h-4" />
        </button>
        <button
          onClick={() => setActiveTab('historico')}
          className={`p-1.5 rounded-md text-xs font-semibold ${
            activeTab === 'historico' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-500'
          }`}
          title="Histórico"
        >
          <History className="w-4 h-4" />
        </button>
      </div>

      {/* User profile right section */}
      <div className="hidden sm:flex items-center gap-3">
        <div className="text-right">
          <p className="text-xs font-bold text-slate-800">Usuário Principal</p>
          <p className="text-[10px] text-slate-400 font-medium">Biblioteca Pessoal</p>
        </div>
        <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center border border-blue-200 shadow-2xs">
          UP
        </div>
      </div>
    </header>
  );
};
