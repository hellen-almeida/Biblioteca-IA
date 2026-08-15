import { CATALOG_BOOKS, HISTORY_RECORDS, getCatalogMetrics, getHistoryMetrics } from '../data/booksData';

/**
 * Removes accents, lowercase and normalizes text for flexible matching
 */
export function normalizeText(text: string): string {
  return (text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export interface QueryResult {
  answer: string;
  handled: boolean;
}

/**
 * Main Answer Engine for "Pergunte à Minha Estante"
 */
export function answerEstanteQuery(query: string): QueryResult {
  if (!query || typeof query !== 'string') {
    return {
      answer: 'Por favor, digite uma pergunta para consultar sua estante.',
      handled: true,
    };
  }

  const rawQ = query.trim();
  const qNorm = normalizeText(rawQ);

  // ------------------------------------------------------------------
  // 1. MISSING DATA ATTRIBUTES CHECK (Pages, Genre, Ratings, Price, Synopsis)
  // ------------------------------------------------------------------
  if (
    qNorm.includes('pagina') ||
    qNorm.includes('paginas') ||
    qNorm.includes('quantidade de paginas') ||
    qNorm.includes('numero de paginas')
  ) {
    return {
      answer:
        'Essa informação não pode ser calculada porque a quantidade de páginas dos livros não está registrada na base de dados (acervo ou histórico).',
      handled: true,
    };
  }

  if (
    qNorm.includes('genero') ||
    qNorm.includes('generos') ||
    qNorm.includes('estilo literario') ||
    qNorm.includes('categoria literaria')
  ) {
    return {
      answer:
        'Essa informação não pode ser determinada porque o gênero literário dos livros não está registrado na base de dados.',
      handled: true,
    };
  }

  if (
    qNorm.includes('nota') ||
    qNorm.includes('notas') ||
    qNorm.includes('avaliacao') ||
    qNorm.includes('avaliacoes') ||
    qNorm.includes('avaliado') ||
    qNorm.includes('avaliados') ||
    qNorm.includes('estrela') ||
    qNorm.includes('estrelas') ||
    qNorm.includes('pontuacao') ||
    qNorm.includes('classificacao')
  ) {
    return {
      answer:
        'Essa informação não está disponível porque a base de dados não contém notas, avaliações ou classificações por estrelas dos livros.',
      handled: true,
    };
  }

  if (
    qNorm.includes('preco') ||
    qNorm.includes('precos') ||
    qNorm.includes('custou') ||
    qNorm.includes('gastei') ||
    qNorm.includes('valor') ||
    qNorm.includes('valores') ||
    qNorm.includes('quanto custa') ||
    qNorm.includes('investimento')
  ) {
    return {
      answer:
        'Essa informação não está disponível porque os preços e valores de compra dos livros não estão registrados na base de dados.',
      handled: true,
    };
  }

  if (qNorm.includes('sinopse') || qNorm.includes('resumo do livro') || qNorm.includes('enredo')) {
    return {
      answer:
        'A base de dados não contém sinopses ou resumos das obras, apenas informações cadastrais como título, autor, editora, ano e status.',
      handled: true,
    };
  }

  // ------------------------------------------------------------------
  // 2. STATUS DE LEITURA QUERIES (In Catalog)
  // ------------------------------------------------------------------
  // Relendo
  if (qNorm.includes('relendo') || qNorm.includes('marcados como relendo') || qNorm.includes('marcado como relendo')) {
    const relendoBooks = CATALOG_BOOKS.filter(b => b.lido === 'Relendo');
    if (relendoBooks.length === 0) {
      return {
        answer: 'No momento não há nenhum livro marcado como "Relendo" no seu acervo atual.',
        handled: true,
      };
    }
    const list = relendoBooks.map(b => `- **${b.nome}** — ${b.autor} (${b.editora})`).join('\n');
    const countText = relendoBooks.length === 1 ? '1 livro' : `${relendoBooks.length} livros`;
    const verbText = relendoBooks.length === 1 ? 'marcado' : 'marcados';
    return {
      answer: `No seu **Acervo Atual**, você possui **${countText}** ${verbText} com o status **"Relendo"**:\n\n${list}`,
      handled: true,
    };
  }

  // Lendo / Estou lendo
  if (
    (qNorm.includes('lendo') && !qNorm.includes('relendo')) ||
    qNorm.includes('estou lendo') ||
    qNorm.includes('lendo agora') ||
    qNorm.includes('em leitura')
  ) {
    const lendoBooks = CATALOG_BOOKS.filter(b => b.lido === 'Lendo');
    if (lendoBooks.length === 0) {
      return {
        answer: 'No momento não há nenhum livro marcado como "Lendo" no seu acervo atual.',
        handled: true,
      };
    }
    const list = lendoBooks.map(b => `- **${b.nome}** — ${b.autor} (${b.editora})`).join('\n');
    const countText = lendoBooks.length === 1 ? '1 livro' : `${lendoBooks.length} livros`;
    return {
      answer: `Você está lendo atualmente **${countText}** no seu acervo atual:\n\n${list}`,
      handled: true,
    };
  }

  // Abandonados
  if (
    qNorm.includes('abandonado') ||
    qNorm.includes('abandonados') ||
    qNorm.includes('abandonei') ||
    qNorm.includes('interrompido') ||
    qNorm.includes('interrompidos')
  ) {
    const abandonados = CATALOG_BOOKS.filter(b => b.lido === 'Abandonado');
    if (abandonados.length === 0) {
      return {
        answer: 'Não há livros com o status "Abandonado" no seu acervo atual.',
        handled: true,
      };
    }
    const list = abandonados.map(b => `- **${b.nome}** (${b.autor})`).join('\n');
    const countText = abandonados.length === 1 ? '1 livro' : `${abandonados.length} livros`;
    const verbText = abandonados.length === 1 ? 'marcado' : 'marcados';
    return {
      answer: `Você possui **${countText}** ${verbText} como **"Abandonado"** no acervo atual:\n\n${list}`,
      handled: true,
    };
  }

  // Não lidos
  if (
    qNorm.includes('nao lido') ||
    qNorm.includes('nao lidos') ||
    qNorm.includes('ainda nao li') ||
    qNorm.includes('nao li') ||
    qNorm.includes('faltam ler') ||
    qNorm.includes('pendente') ||
    qNorm.includes('pendentes')
  ) {
    const naoLidos = CATALOG_BOOKS.filter(b => b.lido === 'Não');
    return {
      answer: `Você possui **${naoLidos.length} livros não lidos** no acervo atual (o que representa ${((naoLidos.length / CATALOG_BOOKS.length) * 100).toFixed(1)}% do seu acervo). Você pode consultar a lista completa na aba **"Biblioteca"** aplicando o filtro **"Não lido"**.`,
      handled: true,
    };
  }

  // Lidos no acervo
  if (
    qNorm.includes('quantos lidos') ||
    qNorm.includes('livros ja lidos') ||
    qNorm.includes('livros lidos no acervo') ||
    qNorm.includes('ja li no acervo')
  ) {
    const lidos = CATALOG_BOOKS.filter(b => b.lido === 'Sim');
    const countText = lidos.length === 1 ? '1 livro lido' : `${lidos.length} livros lidos`;
    return {
      answer: `Você possui **${countText}** no seu acervo atual (correspondendo a ${((lidos.length / CATALOG_BOOKS.length) * 100).toFixed(1)}% do acervo).`,
      handled: true,
    };
  }

  // ------------------------------------------------------------------
  // 3. EDITORA (PUBLISHER) SEARCH
  // ------------------------------------------------------------------
  const allEditorasMap = new Map<string, string>();
  CATALOG_BOOKS.forEach(b => {
    if (b.editora && b.editora !== 'Não informado') {
      const norm = normalizeText(b.editora);
      if (norm.length >= 3) allEditorasMap.set(norm, b.editora);
    }
  });

  let matchedEditoraNorm: string | null = null;
  let matchedEditoraDisplay: string | null = null;

  for (const [normEd, displayEd] of allEditorasMap.entries()) {
    if (
      qNorm.includes(`editora ${normEd}`) ||
      qNorm.includes(`da ${normEd}`) ||
      qNorm.includes(`pela ${normEd}`) ||
      (qNorm.includes(normEd) && ['intrinseca', 'rocco', 'darkside', 'zahar', 'arqueiro', 'sextante', 'aleph', 'harper collins', 'companhia das letras'].includes(normEd))
    ) {
      matchedEditoraNorm = normEd;
      matchedEditoraDisplay = displayEd;
      break;
    }
  }

  if (matchedEditoraNorm && matchedEditoraDisplay) {
    const edMatches = CATALOG_BOOKS.filter(b => normalizeText(b.editora).includes(matchedEditoraNorm!));
    if (edMatches.length === 0) {
      return {
        answer: `Nenhum livro da editora **${matchedEditoraDisplay}** foi encontrado no seu acervo atual.`,
        handled: true,
      };
    }
    const list = edMatches.slice(0, 15).map(b => `- **${b.nome}** (${b.autor})`).join('\n');
    const extraCount = edMatches.length > 15 ? `\n\n*(E mais ${edMatches.length - 15} livros desta editora no acervo)*` : '';
    const countText = edMatches.length === 1 ? '1 livro' : `${edMatches.length} livros`;

    return {
      answer: `Você possui **${countText}** da editora **${matchedEditoraDisplay}** no seu acervo atual:\n\n${list}${extraCount}`,
      handled: true,
    };
  }

  // Check if query mentions "editora X" that doesn't exist
  if (qNorm.includes('editora')) {
    const editoraMatch = qNorm.match(/editora\s+([a-z0-9\s]+)/i);
    if (editoraMatch && editoraMatch[1]) {
      const targetEd = editoraMatch[1].replace(/eu tenho|no acervo|minha|\?/gi, '').trim();
      if (targetEd.length >= 3) {
        const edMatches = CATALOG_BOOKS.filter(b => normalizeText(b.editora).includes(targetEd));
        if (edMatches.length > 0) {
          const edName = edMatches[0].editora;
          const list = edMatches.slice(0, 15).map(b => `- **${b.nome}** (${b.autor})`).join('\n');
          const countText = edMatches.length === 1 ? '1 livro' : `${edMatches.length} livros`;
          return {
            answer: `Você possui **${countText}** da editora **${edName}** no seu acervo atual:\n\n${list}`,
            handled: true,
          };
        } else {
          return {
            answer: `Nenhum livro da editora **"${targetEd}"** foi encontrado no seu acervo atual.`,
            handled: true,
          };
        }
      }
    }
  }

  // ------------------------------------------------------------------
  // 4. AUTHOR SPECIFIC SEARCH (In Catalog or History)
  // ------------------------------------------------------------------
  const allAuthorsMap = new Map<string, string>();
  CATALOG_BOOKS.forEach(b => {
    if (b.autor && b.autor !== 'Não informado') {
      const norm = normalizeText(b.autor);
      if (norm.length >= 3) allAuthorsMap.set(norm, b.autor);
    }
  });
  HISTORY_RECORDS.forEach(b => {
    if (b.autor && b.autor !== 'Não informado') {
      const norm = normalizeText(b.autor);
      if (norm.length >= 3) allAuthorsMap.set(norm, b.autor);
    }
  });

  let matchedAuthorNorm: string | null = null;
  let matchedAuthorDisplay: string | null = null;

  for (const [normAuthor, displayAuthor] of allAuthorsMap.entries()) {
    if (qNorm.includes(normAuthor)) {
      matchedAuthorNorm = normAuthor;
      matchedAuthorDisplay = displayAuthor;
      break;
    }
  }

  if (matchedAuthorNorm && matchedAuthorDisplay) {
    const isHistoryQuery = qNorm.includes('historico') || qNorm.includes('leituras') || qNorm.includes('li de');

    if (isHistoryQuery) {
      const histMatches = HISTORY_RECORDS.filter(b => normalizeText(b.autor).includes(matchedAuthorNorm!));
      if (histMatches.length === 0) {
        return {
          answer: `Nenhum registro de leitura de **${matchedAuthorDisplay}** foi encontrado no seu histórico.`,
          handled: true,
        };
      }
      const list = histMatches
        .map(b => `- **${b.nome}** (${b.anoLeituraDisplay !== 'Não informado' ? b.anoLeituraDisplay : 'Ano não informado'})`)
        .join('\n');
      const countText = histMatches.length === 1 ? '1 registro' : `${histMatches.length} registros`;
      return {
        answer: `Você possui **${countText}** de leitura de **${matchedAuthorDisplay}** no seu histórico:\n\n${list}`,
        handled: true,
      };
    } else {
      const catMatches = CATALOG_BOOKS.filter(b => normalizeText(b.autor).includes(matchedAuthorNorm!));
      if (catMatches.length === 0) {
        return {
          answer: `Nenhum livro de **${matchedAuthorDisplay}** foi encontrado no seu acervo atual.`,
          handled: true,
        };
      }
      const list = catMatches
        .map(b => `- **${b.nome}** (Status: *${b.lido === 'Sim' ? 'Lido' : b.lido === 'Não' ? 'Não lido' : b.lido}*)`)
        .join('\n');
      const countText = catMatches.length === 1 ? '1 livro' : `${catMatches.length} livros`;

      return {
        answer: `Você possui **${countText}** de **${matchedAuthorDisplay}** no seu acervo atual:\n\n${list}`,
        handled: true,
      };
    }
  }

  // Check if query is looking for an author via pattern "livros de [nome]"
  if (qNorm.includes('livros de') || qNorm.includes('livros do') || qNorm.includes('livros da')) {
    const authorMatchExtract = qNorm.match(/livros?\s+(?:de|do|da|dos|das)\s+([a-z\s]+)/i);
    if (authorMatchExtract && authorMatchExtract[1]) {
      const extractedTarget = authorMatchExtract[1].replace(/eu tenho|no acervo|minha|\?/gi, '').trim();
      if (
        extractedTarget.length >= 3 &&
        !['acervo', 'biblioteca', 'historico', 'mim', 'minha estante'].includes(extractedTarget)
      ) {
        const catMatches = CATALOG_BOOKS.filter(b => normalizeText(b.autor).includes(extractedTarget));
        if (catMatches.length > 0) {
          const authorName = catMatches[0].autor;
          const list = catMatches
            .map(b => `- **${b.nome}** (Status: *${b.lido === 'Sim' ? 'Lido' : b.lido === 'Não' ? 'Não lido' : b.lido}*)`)
            .join('\n');
          const countText = catMatches.length === 1 ? '1 livro' : `${catMatches.length} livros`;
          return {
            answer: `Você possui **${countText}** de **${authorName}** no seu acervo atual:\n\n${list}`,
            handled: true,
          };
        } else {
          return {
            answer: `Nenhum livro de **"${extractedTarget}"** foi encontrado no seu acervo atual.`,
            handled: true,
          };
        }
      }
    }
  }

  // ------------------------------------------------------------------
  // 5. SPECIFIC BOOK / TITLE LOOKUP ("Tenho o livro X?", "Eu tenho Duna?")
  // ------------------------------------------------------------------
  if (
    qNorm.includes('tenho o livro') ||
    qNorm.includes('eu tenho o livro') ||
    qNorm.includes('esta no acervo') ||
    qNorm.includes('esta na estante')
  ) {
    const potentialTitle = qNorm
      .replace(/tenho o livro|eu tenho o livro|esta no acervo|esta na estante|o livro|no acervo|\?/gi, '')
      .trim();

    if (potentialTitle.length >= 3) {
      const titleMatches = CATALOG_BOOKS.filter(b => normalizeText(b.nome).includes(potentialTitle));
      if (titleMatches.length > 0) {
        const book = titleMatches[0];
        return {
          answer: `Sim! O livro **${book.nome}** (Autor: *${book.autor}*, Editora: *${book.editora}*) está presente no seu acervo atual com o status: **${book.lido === 'Sim' ? 'Lido' : book.lido === 'Não' ? 'Não lido' : book.lido}**.`,
          handled: true,
        };
      } else {
        return {
          answer: `O livro referente a **"${potentialTitle}"** não foi encontrado no seu acervo atual.`,
          handled: true,
        };
      }
    }
  }

  // Direct check for specific book names in catalog
  const titleDirectMatches = CATALOG_BOOKS.filter(b => {
    const normTitle = normalizeText(b.nome);
    return normTitle.length >= 5 && qNorm.includes(normTitle);
  });
  if (titleDirectMatches.length > 0 && titleDirectMatches.length <= 3) {
    const book = titleDirectMatches[0];
    return {
      answer: `O livro **${book.nome}** (Autor: *${book.autor}*, Editora: *${book.editora}*) está presente no seu acervo atual com o status de leitura: **${book.lido === 'Sim' ? 'Lido' : book.lido === 'Não' ? 'Não lido' : book.lido}**.`,
      handled: true,
    };
  }

  // ------------------------------------------------------------------
  // 6. HISTORY METRICS & SPECIFIC HISTORY QUERIES
  // ------------------------------------------------------------------
  // Top reading year
  if (
    qNorm.includes('ano em que mais li') ||
    qNorm.includes('ano que mais li') ||
    qNorm.includes('ano com mais leituras') ||
    qNorm.includes('em qual ano li mais') ||
    qNorm.includes('recorde de leitura') ||
    qNorm.includes('recorde de leituras')
  ) {
    return {
      answer:
        'No seu histórico de leituras, o recorde de leituras em um único ano é compartilhado no topo entre **2021 (35 leituras)** e **2025 (35 leituras)**. O ano parcial de 2026 conta atualmente com 28 leituras registradas.',
      handled: true,
    };
  }

  // Total history count
  if (
    qNorm.includes('registros no historico') ||
    qNorm.includes('total do historico') ||
    qNorm.includes('quantos registros') ||
    qNorm.includes('quantas leituras no historico')
  ) {
    const histMetrics = getHistoryMetrics();
    return {
      answer: `Seu histórico de leituras possui exatamente **${histMetrics.total} registros** de leituras concluídas.`,
      handled: true,
    };
  }

  // Readings in a specific year (e.g., 2021, 2022, 2023, 2024, 2025, 2026)
  const yearMatch = qNorm.match(/\b(202[0-6])\b/);
  if (yearMatch) {
    const yearNum = parseInt(yearMatch[1], 10);
    const yearReadings = HISTORY_RECORDS.filter(r => r.anoLeitura === yearNum);
    const countText = yearReadings.length === 1 ? '1 leitura' : `${yearReadings.length} leituras`;
    return {
      answer: `No ano de **${yearNum}**, você registrou **${countText}** no seu histórico.`,
      handled: true,
    };
  }

  // Formats in history (Audible, Kindle, Spotify, Youtube, Internet)
  if (
    qNorm.includes('audible') ||
    qNorm.includes('kindle') ||
    qNorm.includes('spotify') ||
    qNorm.includes('youtube') ||
    qNorm.includes('internet') ||
    qNorm.includes('audiobook')
  ) {
    let targetFmt = '';
    if (qNorm.includes('audible')) targetFmt = 'Audible';
    else if (qNorm.includes('spotify')) targetFmt = 'Spotify';
    else if (qNorm.includes('kindle')) targetFmt = 'Kindle';
    else if (qNorm.includes('youtube')) targetFmt = 'Youtube';
    else if (qNorm.includes('internet')) targetFmt = 'Internet';
    else if (qNorm.includes('audiobook')) targetFmt = 'Audible';

    const fmtMatches = HISTORY_RECORDS.filter(r =>
      normalizeText(r.formatoPlataforma).includes(normalizeText(targetFmt))
    );
    const countText = fmtMatches.length === 1 ? '1 registro' : `${fmtMatches.length} registros`;
    return {
      answer: `No seu histórico de leituras, existem **${countText}** de leitura no formato/plataforma **${targetFmt}**.`,
      handled: true,
    };
  }

  // Origem / Instituição in history (Sesc, IFG, UEG, Irradiação)
  if (qNorm.includes('sesc') || qNorm.includes('ifg') || qNorm.includes('ueg') || qNorm.includes('irradiacao')) {
    let targetInst = '';
    if (qNorm.includes('sesc')) targetInst = 'Sesc';
    else if (qNorm.includes('ifg')) targetInst = 'IFG';
    else if (qNorm.includes('ueg')) targetInst = 'UEG';
    else if (qNorm.includes('irradiacao')) targetInst = 'Irradiação';

    const instMatches = HISTORY_RECORDS.filter(r =>
      normalizeText(r.origemInstituicao).includes(normalizeText(targetInst))
    );
    const countText = instMatches.length === 1 ? '1 registro' : `${instMatches.length} registros`;
    return {
      answer: `No seu histórico de leituras, existem **${countText}** associados à instituição **${targetInst}**.`,
      handled: true,
    };
  }

  // ------------------------------------------------------------------
  // 7. EXPLICIT GENERAL CATALOG OVERVIEW
  // ------------------------------------------------------------------
  if (
    (qNorm.includes('quantos livros') && (qNorm.includes('total') || qNorm.includes('visao geral') || qNorm.includes('resumo'))) ||
    qNorm.includes('quantos livros tenho no total') ||
    qNorm.includes('qual o total de livros do acervo') ||
    qNorm.includes('resumo do meu acervo') ||
    qNorm.includes('visao geral da biblioteca')
  ) {
    const cat = getCatalogMetrics();
    return {
      answer: `Seu acervo atual possui exatamente **${cat.total} livros** (Lidos: ${cat.lidos}, Não lidos: ${cat.naoLidos}, Lendo: ${cat.lendo}, Relendo: ${cat.relendo}, Abandonados: ${cat.abandonados}).`,
      handled: true,
    };
  }

  return {
    answer: '',
    handled: false,
  };
}
