import { CatalogBook, CatalogMetrics, HistoryMetrics, HistoryRecord } from '../types';
import { ACERVO_RAW_CSV, HISTORICO_RAW_CSV } from './rawDatasets';

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

export function excelSerialToYear(val: string | number): number | null {
  if (val === undefined || val === null || val === '') return null;
  const num = typeof val === 'number' ? val : Number(val);
  if (!isNaN(num) && num > 10000 && num < 100000) {
    // Excel date serial number (epoch 1899-12-30)
    const date = new Date((num - 25569) * 86400 * 1000);
    return date.getUTCFullYear();
  }
  const str = String(val).trim();
  if (/^\d{4}$/.test(str)) {
    return parseInt(str, 10);
  }
  return null;
}

/**
 * Parses Acervo raw CSV string into CatalogBook array
 */
function loadCatalog(): CatalogBook[] {
  const lines = ACERVO_RAW_CSV.split('\n').map(l => l.trim()).filter(Boolean);
  if (lines.length === 0) return [];
  // Skip header line
  const rows = lines.slice(1);
  return rows.map((line, idx) => {
    const cols = parseCSVLine(line);
    const nome = cols[0] || 'Não informado';
    const autor = cols[1] || 'Não informado';
    const editora = cols[2] || 'Não informado';
    const isbn = cols[3] || 'Não informado';
    const anoCompraStr = cols[4] || '';
    const lidoStr = (cols[5] || 'Não') as CatalogBook['lido'];

    const anoCompraNum = anoCompraStr ? parseInt(anoCompraStr, 10) : null;
    const anoCompra = anoCompraStr || 'Não informado';

    return {
      id: `cat-${idx + 1}`,
      nome,
      autor,
      editora,
      isbn,
      anoCompra,
      anoCompraNum: isNaN(anoCompraNum!) ? null : anoCompraNum,
      lido: lidoStr,
    };
  });
}

/**
 * Parses Histórico raw CSV string into HistoryRecord array
 */
function loadHistory(): HistoryRecord[] {
  const lines = HISTORICO_RAW_CSV.split('\n').map(l => l.trim()).filter(Boolean);
  if (lines.length === 0) return [];
  const rows = lines.slice(1);
  return rows.map((line, idx) => {
    const cols = parseCSVLine(line);
    const nome = cols[0] || 'Não informado';
    const autor = cols[1] || 'Não informado';
    const dataLeituraRaw = cols[2] || '';
    const statusEstante = cols[3] || 'Não informado';
    const detalhe = cols[4] || 'Não informado';
    const formatoPlataforma = cols[5] || 'Não informado';
    const emprestadoDe = cols[6] || 'Não informado';
    const origemInstituicao = cols[7] || 'Não informado';

    const anoLeitura = excelSerialToYear(dataLeituraRaw);
    const anoLeituraDisplay = anoLeitura ? String(anoLeitura) : 'Não informado';

    return {
      id: `hist-${idx + 1}`,
      nome,
      autor,
      dataLeituraRaw,
      anoLeitura,
      anoLeituraDisplay,
      statusEstante,
      detalhe,
      formatoPlataforma,
      emprestadoDe,
      origemInstituicao,
    };
  });
}

export const CATALOG_BOOKS: CatalogBook[] = loadCatalog();
export const HISTORY_RECORDS: HistoryRecord[] = loadHistory();

/**
 * Compute catalog metrics
 */
export function getCatalogMetrics(): CatalogMetrics {
  const total = CATALOG_BOOKS.length;
  let lidos = 0;
  let naoLidos = 0;
  let lendo = 0;
  let relendo = 0;
  let abandonados = 0;

  const editoraCount: Record<string, number> = {};
  const autorCount: Record<string, number> = {};
  const anoCompraCount: Record<string, number> = {};

  CATALOG_BOOKS.forEach(book => {
    // Status count
    switch (book.lido) {
      case 'Sim':
        lidos++;
        break;
      case 'Não':
        naoLidos++;
        break;
      case 'Lendo':
        lendo++;
        break;
      case 'Relendo':
        relendo++;
        break;
      case 'Abandonado':
        abandonados++;
        break;
    }

    // Editora
    const ed = book.editora || 'Não informado';
    editoraCount[ed] = (editoraCount[ed] || 0) + 1;

    // Autor
    const aut = book.autor || 'Não informado';
    autorCount[aut] = (autorCount[aut] || 0) + 1;

    // Ano Compra
    const ano = book.anoCompra || 'Não informado';
    anoCompraCount[ano] = (anoCompraCount[ano] || 0) + 1;
  });

  const byEditora = Object.entries(editoraCount)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  const byAutor = Object.entries(autorCount)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  const byAnoCompra = Object.entries(anoCompraCount)
    .map(([year, count]) => ({ year, count }))
    .sort((a, b) => {
      if (a.year === 'Não informado') return 1;
      if (b.year === 'Não informado') return -1;
      return a.year.localeCompare(b.year);
    });

  const byStatus = [
    { status: 'Lidos', count: lidos, color: '#2563eb' },
    { status: 'Não lidos', count: naoLidos, color: '#94a3b8' },
    { status: 'Lendo', count: lendo, color: '#059669' },
    { status: 'Relendo', count: relendo, color: '#d97706' },
    { status: 'Abandonados', count: abandonados, color: '#dc2626' },
  ];

  return {
    total,
    lidos,
    naoLidos,
    lendo,
    relendo,
    abandonados,
    byEditora,
    byAutor,
    byAnoCompra,
    byStatus,
  };
}

/**
 * Compute history metrics
 */
export function getHistoryMetrics(): HistoryMetrics {
  const total = HISTORY_RECORDS.length;
  const yearCount: Record<number, number> = {};
  const autorCount: Record<string, number> = {};
  const formatoCount: Record<string, number> = {};
  const origemCount: Record<string, number> = {};
  const statusCount: Record<string, number> = {};

  HISTORY_RECORDS.forEach(rec => {
    if (rec.anoLeitura) {
      yearCount[rec.anoLeitura] = (yearCount[rec.anoLeitura] || 0) + 1;
    }

    const aut = rec.autor || 'Não informado';
    autorCount[aut] = (autorCount[aut] || 0) + 1;

    const fmt = rec.formatoPlataforma || 'Não informado';
    formatoCount[fmt] = (formatoCount[fmt] || 0) + 1;

    const orig = rec.origemInstituicao || 'Não informado';
    origemCount[orig] = (origemCount[orig] || 0) + 1;

    const st = rec.statusEstante || 'Não informado';
    statusCount[st] = (statusCount[st] || 0) + 1;
  });

  const byAno = Object.entries(yearCount)
    .map(([year, count]) => ({ year: parseInt(year, 10), count }))
    .sort((a, b) => a.year - b.year);

  let maxCount = 0;
  byAno.forEach(item => {
    if (item.count > maxCount) maxCount = item.count;
  });

  const topYears = byAno.filter(item => item.count === maxCount).map(i => i.year);

  const byAutor = Object.entries(autorCount)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  const byFormato = Object.entries(formatoCount)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  const byOrigem = Object.entries(origemCount)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  const byStatus = Object.entries(statusCount)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  return {
    total,
    byAno,
    topYear: { years: topYears, maxCount },
    byAutor,
    byFormato,
    byOrigem,
    byStatus,
  };
}
