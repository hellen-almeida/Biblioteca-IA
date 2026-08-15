import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { CATALOG_BOOKS, HISTORY_RECORDS, getCatalogMetrics, getHistoryMetrics } from './src/data/booksData';
import { answerEstanteQuery } from './src/services/askEngine';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', catalogCount: CATALOG_BOOKS.length, historyCount: HISTORY_RECORDS.length });
});

// API endpoint for natural language query: "Pergunte à Minha Estante"
app.post('/api/ask', async (req, res) => {
  try {
    const { question } = req.body;
    if (!question || typeof question !== 'string') {
      return res.status(400).json({ error: 'Pergunta é obrigatória' });
    }

    // 1. Check deterministic answer engine first
    const localResult = answerEstanteQuery(question);
    if (localResult.handled && localResult.answer) {
      return res.json({ answer: localResult.answer, source: 'dataset-rules' });
    }

    // 2. Fall back to Gemini AI for complex / natural language queries
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.json({
        answer: 'Não foi possível encontrar essa informação na sua estante. Tente perguntar sobre um autor, título, editora, status de leitura ou ano de leitura.',
        source: 'local-fallback',
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const catMetrics = getCatalogMetrics();
    const histMetrics = getHistoryMetrics();

    // Prepare compact JSON arrays for full dataset context
    const catalogMin = CATALOG_BOOKS.map(b => ({
      nome: b.nome,
      autor: b.autor,
      editora: b.editora,
      anoCompra: b.anoCompra,
      status: b.lido,
    }));

    const historyMin = HISTORY_RECORDS.map(b => ({
      nome: b.nome,
      autor: b.autor,
      ano: b.anoLeituraDisplay,
      statusEstante: b.statusEstante,
      formato: b.formatoPlataforma,
      origem: b.origemInstituicao,
    }));

    const systemPrompt = `
Você é o assistente virtual do aplicativo "Minha Estante IA", especializado em responder dúvidas da usuária sobre sua biblioteca pessoal e histórico de leituras.

DIRETRIZES E REGRAS ABSOLUTAS:
1. NUNCA retorne o total geral do acervo (325 livros) como resposta para perguntas sobre um autor, editora, título, status específico, ano ou filtro!
2. Se a pergunta for sobre um dado que NÃO EXISTE na base (como gênero literário, número de páginas, avaliação por estrelas, preço ou sinopse):
   - Responda claramente que a informação não está registrada na base.
   - Exemplos:
     - "Essa informação não pode ser calculada porque a quantidade de páginas não está registrada na base."
     - "Essa informação não pode ser determinada porque o gênero literário não está registrado na base."
     - "A base de dados não contém notas ou avaliações dos livros."
     - "Preços e valores de compra não estão registrados na base."
3. Se a pergunta for sobre um autor, editora ou título que NÃO FOI ENCONTRADO no acervo/histórico, diga expressamente que nenhum registro foi encontrado para essa busca. NUNCA invente dados.
4. Mantenha estritamente SEPARADOS o Acervo Atual (325 livros) e o Histórico de Leituras (275 registros). Não misture os dois universos.
5. Se perguntarem "Quantos livros de [Autor] eu tenho?", informe a quantidade exata presente no Acervo e liste os títulos correspondentes.
6. NUNCA utilize construções robóticas como "livro(s)" ou "do(a) autor(a)". Utilize a gramática natural do português com flexão correta de singular e plural (ex: "Você possui 7 livros de Agatha Christie" ou "1 livro de Agatha Christie").
7. Responda em português fluente, cordial, claro e formatado em Markdown com negritos e marcadores.

DADOS COMPLETOS DO ACERVO ATUAL (325 LIVROS):
${JSON.stringify(catalogMin)}

DADOS COMPLETOS DO HISTÓRICO DE LEITURAS (275 REGISTROS):
${JSON.stringify(historyMin)}
`;

    const userPrompt = `Pergunta da usuária: "${question}"`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.1,
      },
    });

    const answer = response.text || 'Não foi possível encontrar essa informação na sua estante. Tente perguntar sobre um autor, título, editora, status de leitura ou ano de leitura.';
    return res.json({ answer, source: 'gemini-3.6-flash' });
  } catch (err: any) {
    console.error('Error in /api/ask:', err);
    return res.json({
      answer: 'Não foi possível encontrar essa informação específica na sua estante. Tente perguntar sobre um autor, título, editora, status de leitura ou métricas do histórico.',
      source: 'local-fallback',
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Minha Estante IA server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
