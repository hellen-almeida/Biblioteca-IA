import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { VisaoGeral } from './components/VisaoGeral';
import { Biblioteca } from './components/Biblioteca';
import { Historico } from './components/Historico';
import { MainTab } from './types';
import { BookOpen, ShieldCheck } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<MainTab>('visao-geral');

  return (
    <div className="flex h-screen w-full bg-slate-50 text-slate-800 font-sans overflow-hidden antialiased">
      {/* Sidebar for Desktop */}
      <div className="hidden md:flex shrink-0">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto">
        {/* Top Header */}
        <Header activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Dynamic View Section */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto space-y-8">
          {activeTab === 'visao-geral' && <VisaoGeral />}
          {activeTab === 'biblioteca' && <Biblioteca />}
          {activeTab === 'historico' && <Historico />}

          {/* Footer inside scroll area */}
          <footer className="pt-8 pb-4 border-t border-slate-200 text-xs text-slate-500 mt-12">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-600" />
                <span className="font-semibold text-slate-700">Minha Estante IA</span>
                <span>— Sistema de Análise da Biblioteca Pessoal</span>
              </div>

              <div className="flex items-center gap-2 text-slate-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Dados autênticos e preservados (Acervo: 325 | Histórico: 275)</span>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
