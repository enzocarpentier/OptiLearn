import { useState } from 'react';
import { extractTextFromPdfUrl } from '@/lib/pdfUtils';

interface Section {
  title: string;
  summary: string;
}

interface Question {
  question: string;
  options: string[];
  answer: string;
}

interface QuizPanelProps {
  pdfUrl: string | null;
  deckId: string;
}

const QuizPanel = ({ pdfUrl, deckId }: QuizPanelProps) => {
  const [loading, setLoading] = useState(false);
  const [sections, setSections] = useState<Section[]>([]);
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fonction déclenchée par l'utilisateur pour analyser le document
  const analyzeDocument = async () => {
    if (!pdfUrl) {
      setError('PDF non disponible.');
      return;
    }
    try {
      setLoading(true);
      // 1. Extraire texte du PDF
      const text = await extractTextFromPdfUrl(pdfUrl);
      // 2. Appeler l'API d'analyse
      const res = await fetch('/api/ai/quiz/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ context: text }),
      });
      if (!res.ok) throw new Error('Analyse échouée');
      const data = await res.json();
      setSections(data.sections || []);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Erreur lors de l'analyse");
    } finally {
      setLoading(false);
    }
  };

  const generateQuiz = async (section: Section) => {
    setSelectedSection(section);
    setQuestions(null);
    setLoading(true);
    try {
      const res = await fetch('/api/ai/quiz/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sectionText: section.summary, deckId }),
      });
      if (!res.ok) throw new Error('Génération quiz échouée');
      const data = await res.json();
      setQuestions(data.questions || []);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la génération');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl flex flex-col h-full w-full rounded-xl overflow-hidden shadow-lg border border-slate-200/20 dark:border-slate-800/20">
        <div className="flex-1 flex items-center justify-center text-slate-500 dark:text-slate-400">Chargement...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl flex flex-col h-full w-full rounded-xl overflow-hidden shadow-lg border border-slate-200/20 dark:border-slate-800/20">
        <div className="p-4 text-sm text-red-600 dark:text-red-400">{error}</div>
      </div>
    );
  }

  if (questions) {
    return (
      <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl flex flex-col h-full w-full rounded-xl overflow-hidden shadow-lg border border-slate-200/20 dark:border-slate-800/20">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Quiz généré</h2>
          {questions.map((q, idx) => (
            <div key={idx} className="space-y-2 border-b border-slate-200 dark:border-slate-700 pb-4">
              <p className="font-medium text-slate-700 dark:text-slate-200">{idx + 1}. {q.question}</p>
              <ul className="list-disc pl-4 text-slate-600 dark:text-slate-400">
                {q.options.map((opt, i) => (
                  <li key={i}>{opt}</li>
                ))}
              </ul>
              <p className="text-xs text-emerald-600 dark:text-emerald-400">Réponse: {q.answer}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl flex flex-col h-full w-full rounded-xl overflow-hidden shadow-lg border border-slate-200/20 dark:border-slate-800/20">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Sections détectées</h2>
        {sections.length === 0 ? (
          <div className="space-y-3">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Cliquez sur le bouton ci-dessous pour analyser le document et détecter les principales sections.
            </p>
            <button
              onClick={analyzeDocument}
              className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-lg bg-primary-600 hover:bg-primary-700 text-white"
            >
              Analyser le document
            </button>
          </div>
        ) : (
          sections.map((sec, idx) => (
            <div key={idx} className="border border-slate-200 dark:border-slate-700 rounded-lg p-3">
              <h3 className="font-semibold text-slate-700 dark:text-slate-200">{sec.title}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-2 line-clamp-3">{sec.summary}</p>
              <button
                onClick={() => generateQuiz(sec)}
                className="text-xs font-medium px-2 py-1 bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-300 rounded"
              >
                Générer un quiz
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default QuizPanel;
