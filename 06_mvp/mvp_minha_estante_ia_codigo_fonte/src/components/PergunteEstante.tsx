import { AnimatePresence, motion } from 'motion/react';
import React, { useState } from 'react';
import Markdown from 'react-markdown';
import { Bot, HelpCircle, Loader2, Send, Sparkles, AlertTriangle } from 'lucide-react';

interface PergunteEstanteProps {
  compact?: boolean;
}

export const SAMPLE_QUESTIONS = [
  'Quantos livros de Agatha Christie eu tenho?',
  'Quais livros ainda não li?',
  'Qual foi o ano em que mais li?',
  'Quais livros estou lendo agora?',
  'Quantos registros existem no meu histórico?',
  'Quais livros estão marcados como relendo?',
  'Qual é o gênero literário que eu mais leio?',
  'Quantas páginas eu li em 2026?',
];

export const PergunteEstante: React.FC<PergunteEstanteProps> = ({ compact = false }) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAsk = async (qText?: string) => {
    const textToAsk = qText || question;
    if (!textToAsk.trim()) return;

    setLoading(true);
    setError(null);
    setAnswer(null);

    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: textToAsk }),
      });

      const data = await res.json();
      if (res.ok) {
        setAnswer(data.answer);
      } else {
        setError(data.error || 'Falha ao consultar a base.');
      }
    } catch (err: any) {
      setError('Erro ao conectar com o servidor. Verifique sua conexão.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAsk();
    }
  };

  return (
    <div
      id="pergunte-estante-container"
      className={`bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden ${
        compact ? 'p-4' : 'p-6'
      }`}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold shrink-0">
          <Sparkles className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
            Pergunte à Minha Estante
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-100 text-blue-700 uppercase tracking-wider">
              IA Responde
            </span>
          </h2>
          <p className="text-xs text-slate-400">
            Pergunte em linguagem natural. As respostas utilizam 100% dos dados verificados da estante.
          </p>
        </div>
      </div>

      {/* Suggested pill prompts */}
      <div className="mb-4">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-2.5">
          <HelpCircle className="w-3.5 h-3.5 text-blue-600" /> Exemplo de perguntas rápidas:
        </div>
        <div className="flex flex-wrap gap-2">
          {SAMPLE_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              onClick={() => {
                setQuestion(q);
                handleAsk(q);
              }}
              className="text-xs px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-700 border border-slate-200/80 hover:border-blue-300 transition-all text-left font-medium"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar Input */}
      <div className="relative flex items-center gap-2 mb-3">
        <input
          type="text"
          value={question}
          onChange={e => setQuestion(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ex: Quais livros de Agatha Christie eu tenho no acervo?"
          className="w-full pl-4 pr-32 py-3 text-xs bg-slate-100 border border-transparent focus:border-blue-300 focus:bg-white rounded-2xl text-slate-800 placeholder-slate-400 outline-none transition-all"
        />
        <button
          onClick={() => handleAsk()}
          disabled={loading || !question.trim()}
          className="absolute right-1.5 h-9 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-md shadow-blue-100 disabled:shadow-none"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <span>Consultar IA</span>
              <Send className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </div>

      {/* Answer Output */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-4 bg-blue-50/60 border border-blue-100 rounded-xl flex items-center gap-3 text-xs font-semibold text-blue-700"
          >
            <Loader2 className="w-4 h-4 animate-spin text-blue-600 shrink-0" />
            <span>Analisando os dados da estante para responder...</span>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-3 text-xs text-rose-700"
          >
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}

        {answer && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-4 bg-slate-50 border border-blue-100 rounded-xl"
          >
            <div className="flex items-center gap-2 mb-2 text-xs font-bold text-blue-800 uppercase tracking-wider">
              <Bot className="w-4 h-4 text-blue-600" /> Resposta fundamentada nos dados:
            </div>
            <div className="text-xs text-slate-700 leading-relaxed space-y-2 font-normal
              [&_strong]:font-bold [&_strong]:text-slate-900
              [&_em]:italic [&_em]:text-slate-800
              [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_ul]:my-2
              [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1 [&_ol]:my-2
              [&_li]:text-slate-700
              [&_p]:mb-2 [&_p:last-child]:mb-0
              [&_h1]:text-sm [&_h1]:font-bold [&_h1]:text-slate-900
              [&_h2]:text-xs [&_h2]:font-bold [&_h2]:text-slate-900
              [&_h3]:text-xs [&_h3]:font-bold [&_h3]:text-slate-800
            ">
              <Markdown>{answer}</Markdown>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
