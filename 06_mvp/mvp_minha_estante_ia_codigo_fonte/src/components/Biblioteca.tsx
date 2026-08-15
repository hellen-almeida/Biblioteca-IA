import React, { useMemo, useState } from 'react';
import { CATALOG_BOOKS, getCatalogMetrics } from '../data/booksData';
import { CatalogBook, CatalogStatus } from '../types';
import { Search, Filter, RotateCcw, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';

export const Biblioteca: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAutor, setSelectedAutor] = useState('');
  const [selectedEditora, setSelectedEditora] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('Todos');
  const [selectedAnoCompra, setSelectedAnoCompra] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const metrics = useMemo(() => getCatalogMetrics(), []);

  // Filter options list
  const autoresOptions = useMemo(() => {
    const list = metrics.byAutor.map(a => a.name).filter(Boolean);
    return Array.from(new Set(list)).sort((a: string, b: string) => a.localeCompare(b));
  }, [metrics]);

  const editorasOptions = useMemo(() => {
    const list = metrics.byEditora.map(e => e.name).filter(Boolean);
    return Array.from(new Set(list)).sort((a: string, b: string) => a.localeCompare(b));
  }, [metrics]);

  const anosOptions = useMemo(() => {
    const list = metrics.byAnoCompra.map(a => a.year).filter(Boolean);
    return Array.from(new Set(list)).sort((a: string, b: string) => {
      if (a === 'Não informado') return 1;
      if (b === 'Não informado') return -1;
      return a.localeCompare(b);
    });
  }, [metrics]);

  // Combined reactive filtering
  const filteredBooks = useMemo(() => {
    return CATALOG_BOOKS.filter(book => {
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase().trim();
        const matchesTitle = book.nome.toLowerCase().includes(term);
        const matchesAutor = book.autor.toLowerCase().includes(term);
        if (!matchesTitle && !matchesAutor) return false;
      }

      if (selectedAutor && selectedAutor !== 'Todos') {
        if (book.autor !== selectedAutor) return false;
      }

      if (selectedEditora && selectedEditora !== 'Todos') {
        if (book.editora !== selectedEditora) return false;
      }

      if (selectedStatus && selectedStatus !== 'Todos') {
        if (selectedStatus === 'Lido' && book.lido !== 'Sim') return false;
        if (selectedStatus === 'Não lido' && book.lido !== 'Não') return false;
        if (selectedStatus === 'Lendo' && book.lido !== 'Lendo') return false;
        if (selectedStatus === 'Relendo' && book.lido !== 'Relendo') return false;
        if (selectedStatus === 'Abandonado' && book.lido !== 'Abandonado') return false;
      }

      if (selectedAnoCompra && selectedAnoCompra !== 'Todos') {
        if (book.anoCompra !== selectedAnoCompra) return false;
      }

      return true;
    });
  }, [searchTerm, selectedAutor, selectedEditora, selectedStatus, selectedAnoCompra]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedAutor, selectedEditora, selectedStatus, selectedAnoCompra]);

  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage) || 1;
  const paginatedBooks = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredBooks.slice(start, start + itemsPerPage);
  }, [filteredBooks, currentPage]);

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedAutor('');
    setSelectedEditora('');
    setSelectedStatus('Todos');
    setSelectedAnoCompra('');
  };

  const hasActiveFilters =
    searchTerm || selectedAutor || selectedEditora || selectedStatus !== 'Todos' || selectedAnoCompra;

  const getStatusBadge = (lido: CatalogStatus) => {
    switch (lido) {
      case 'Sim':
        return <span className="px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider bg-emerald-100 text-emerald-800">LIDO</span>;
      case 'Não':
        return <span className="px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider bg-blue-100 text-blue-800">NÃO LIDO</span>;
      case 'Lendo':
        return <span className="px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider bg-amber-100 text-amber-800">LENDO</span>;
      case 'Relendo':
        return <span className="px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider bg-purple-100 text-purple-800">RELENDO</span>;
      case 'Abandonado':
        return <span className="px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider bg-rose-100 text-rose-800">ABANDONADO</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
            Consulta da Biblioteca
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Pesquise e filtre os 325 livros do acervo pessoal com combinação de filtros em tempo real
          </p>
        </div>

        <div className="text-xs bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs font-semibold text-slate-700 shrink-0">
          Exibindo <strong className="text-blue-600">{filteredBooks.length}</strong> de <strong>325</strong> livros
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-600 uppercase tracking-wider">
            <Filter className="w-4 h-4 text-blue-600" /> Filtros do Acervo
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Buscar título ou autor..."
              className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white text-slate-800 placeholder-slate-400 transition-all"
            />
          </div>

          {/* Autor Select */}
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

          {/* Editora Select */}
          <div>
            <select
              value={selectedEditora}
              onChange={e => setSelectedEditora(e.target.value)}
              className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white text-slate-800 transition-all"
            >
              <option value="">Todas as Editoras</option>
              {editorasOptions.map(ed => (
                <option key={ed} value={ed}>
                  {ed}
                </option>
              ))}
            </select>
          </div>

          {/* Status Select */}
          <div>
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white text-slate-800 transition-all"
            >
              <option value="Todos">Todos os Status</option>
              <option value="Lido">Lido (119)</option>
              <option value="Não lido">Não lido (190)</option>
              <option value="Lendo">Lendo (2)</option>
              <option value="Relendo">Relendo (1)</option>
              <option value="Abandonado">Abandonado (13)</option>
            </select>
          </div>

          {/* Ano Compra Select */}
          <div>
            <select
              value={selectedAnoCompra}
              onChange={e => setSelectedAnoCompra(e.target.value)}
              className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white text-slate-800 transition-all"
            >
              <option value="">Todos os Anos de Compra</option>
              {anosOptions.map(ano => (
                <option key={ano} value={ano}>
                  {ano}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Books Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-5 py-3.5">Título</th>
                <th className="px-5 py-3.5">Autor</th>
                <th className="px-5 py-3.5">Editora</th>
                <th className="px-5 py-3.5">Ano de Compra</th>
                <th className="px-5 py-3.5 text-right">Status de Leitura</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedBooks.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-slate-400">
                    Nenhum livro encontrado com os filtros selecionados.
                  </td>
                </tr>
              ) : (
                paginatedBooks.map(book => (
                  <tr key={book.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-3.5 font-bold text-slate-900">
                      <div className="flex items-center gap-2.5">
                        <BookOpen className="w-4 h-4 text-blue-600 shrink-0" />
                        <span>{book.nome}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 italic">
                      {book.autor === 'Não informado' ? (
                        <span className="text-slate-300 not-italic">Não informado</span>
                      ) : (
                        book.autor
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-slate-600">
                      {book.editora === 'Não informado' ? (
                        <span className="text-slate-300 italic">Não informado</span>
                      ) : (
                        book.editora
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 font-medium">
                      {book.anoCompra === 'Não informado' ? (
                        <span className="text-slate-300 italic font-normal">Não informado</span>
                      ) : (
                        book.anoCompra
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      {getStatusBadge(book.lido)}
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
