/**
 * Types for Minha Estante IA
 */

export type CatalogStatus = 'Sim' | 'Não' | 'Lendo' | 'Relendo' | 'Abandonado';

export interface CatalogBook {
  id: string;
  nome: string;
  autor: string; // "Não informado" if empty
  editora: string; // "Não informado" if empty
  isbn: string; // "Não informado" if empty
  anoCompra: string; // "Não informado" if empty
  anoCompraNum: number | null;
  lido: CatalogStatus; // 'Sim' | 'Não' | 'Lendo' | 'Relendo' | 'Abandonado'
}

export interface HistoryRecord {
  id: string;
  nome: string;
  autor: string; // "Não informado" if empty
  dataLeituraRaw: string;
  anoLeitura: number | null; // calculated year or null
  anoLeituraDisplay: string; // e.g. "2021" or "Não informado"
  statusEstante: string; // e.g. "Sumiu", "Doado", "Emprestado", "Estante", "A venda", "Biblioteca"
  detalhe: string;
  formatoPlataforma: string; // e.g. "Audible", "Kindle", "Spotify", "Youtube", "Internet"
  emprestadoDe: string; // e.g. "Plínio", "Larissa", "Amanda"
  origemInstituicao: string; // e.g. "Sesc", "IFG", "UEG", "Irradiação"
}

export interface CatalogMetrics {
  total: number; // expected 325
  lidos: number; // expected 119
  naoLidos: number; // expected 190
  lendo: number; // expected 2
  relendo: number; // expected 1
  abandonados: number; // expected 13
  byEditora: { name: string; count: number }[];
  byAutor: { name: string; count: number }[];
  byAnoCompra: { year: string; count: number }[];
  byStatus: { status: string; count: number; color: string }[];
}

export interface HistoryMetrics {
  total: number; // expected 275
  byAno: { year: number; count: number }[];
  topYear: { years: number[]; maxCount: number };
  byAutor: { name: string; count: number }[];
  byFormato: { name: string; count: number }[];
  byOrigem: { name: string; count: number }[];
  byStatus: { name: string; count: number }[];
}

export type MainTab = 'visao-geral' | 'biblioteca' | 'historico';
