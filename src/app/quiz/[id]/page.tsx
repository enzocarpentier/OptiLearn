'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface QuizResult {
  questionId: string;
  selectedAnswer: number;
  isCorrect: boolean;
  timeTaken: number;
}

export default function QuizPage() {
  const params = useParams();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [results, setResults] = useState<QuizResult[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [quizStarted, setQuizStarted] = useState(false);

  useEffect(() => {
    // Simulate loading questions for the specific file
    const sampleQuestions: Question[] = [
      {
        id: '1',
        question: 'Quel est le concept principal abordé dans ce document ?',
        options: [
          'Théorie des graphes',
          'Algorithmes de tri',
          'Bases de données',
          'Intelligence artificielle'
        ],
        correctAnswer: 0
      },
      {
        id: '2',
        question: 'Quelle méthodologie est recommandée pour résoudre ce type de problème ?',
        options: [
          'Approche récursive',
          'Programmation dynamique', 
          'Algorithme glouton',
          'Force brute'
        ],
        correctAnswer: 1
      },
      {
        id: '3',
        question: 'Quelle est la complexité temporelle de l\'algorithme présenté ?',
        options: [
          'O(n)',
          'O(n log n)',
          'O(n²)',
          'O(2^n)'
        ],
        correctAnswer: 1
      },
      {
        id: '4',
        question: 'Quel avantage présente cette approche par rapport aux méthodes traditionnelles ?',
        options: [
          'Meilleure performance',
          'Simplicité d\'implémentation',
          'Moins de mémoire requise',
          'Toutes les réponses ci-dessus'
        ],
        correctAnswer: 3
      },
      {
        id: '5',
        question: 'Dans quel contexte cette technique est-elle particulièrement utile ?',
        options: [
          'Systèmes distribués',
          'Applications mobiles',
          'Big Data',
          'Systèmes embarqués'
        ],
        correctAnswer: 2
      }
    ];
    
    setQuestions(sampleQuestions);
  }, [params.id]);

  const startQuiz = () => {
    setQuizStarted(true);
    setStartTime(Date.now());
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === null) return;

    const currentQuestion = questions[currentQuestionIndex];
    const timeTaken = Date.now() - startTime;
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

    const newResult: QuizResult = {
      questionId: currentQuestion.id,
      selectedAnswer,
      isCorrect,
      timeTaken
    };

    setResults(prev => [...prev, newResult]);
    setShowResult(true);

    // Show result for 2 seconds then move to next question
    setTimeout(() => {
      setShowResult(false);
      setSelectedAnswer(null);
      
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setStartTime(Date.now());
      } else {
        setIsFinished(true);
      }
    }, 2000);
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setResults([]);
    setShowResult(false);
    setIsFinished(false);
    setQuizStarted(false);
    setStartTime(Date.now());
  };

  const currentQuestion = questions[currentQuestionIndex];
  const score = results.filter(r => r.isCorrect).length;
  const progress = ((currentQuestionIndex + (showResult ? 1 : 0)) / questions.length) * 100;

  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-black flex items-center justify-center px-4">
        <div className="max-w-2xl w-full">
          {/* Header */}
          <div className="text-center mb-12">
            <Link href="/upload" className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              OptiLearn
            </Link>
          </div>

          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl p-8 border border-gray-200/50 dark:border-gray-700/50 text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl mx-auto mb-6 flex items-center justify-center">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Prêt pour le quiz ?
            </h1>
            
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              {questions.length} questions t'attendent. Prends ton temps et réfléchis bien à chaque réponse !
            </p>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-2xl">
                <div className="text-2xl font-bold text-blue-600 mb-1">{questions.length}</div>
                <div className="text-sm text-blue-600">Questions</div>
              </div>
              <div className="p-4 bg-purple-50 dark:bg-purple-900/30 rounded-2xl">
                <div className="text-2xl font-bold text-purple-600 mb-1">~{questions.length * 2}</div>
                <div className="text-sm text-purple-600">Minutes</div>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-900/30 rounded-2xl">
                <div className="text-2xl font-bold text-green-600 mb-1">QCM</div>
                <div className="text-sm text-green-600">Format</div>
              </div>
            </div>

            <button
              onClick={startQuiz}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-105 text-lg font-semibold shadow-lg"
            >
              Commencer le quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isFinished) {
    const percentage = Math.round((score / questions.length) * 100);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-black flex items-center justify-center px-4">
        <div className="max-w-2xl w-full">
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl p-8 border border-gray-200/50 dark:border-gray-700/50 text-center">
            <div className={`w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center ${
              percentage >= 80 ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
              percentage >= 60 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
              'bg-gradient-to-r from-red-500 to-pink-500'
            }`}>
              {percentage >= 80 ? (
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : percentage >= 60 ? (
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Quiz terminé !
            </h1>
            
            <div className="text-6xl font-bold mb-4">
              <span className={`bg-gradient-to-r bg-clip-text text-transparent ${
                percentage >= 80 ? 'from-green-500 to-emerald-500' :
                percentage >= 60 ? 'from-yellow-500 to-orange-500' :
                'from-red-500 to-pink-500'
              }`}>
                {percentage}%
              </span>
            </div>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              {score} bonnes réponses sur {questions.length} questions
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl">
                <div className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Temps moyen</div>
                <div className="text-2xl font-bold text-blue-600">
                  {Math.round(results.reduce((acc, r) => acc + r.timeTaken, 0) / results.length / 1000)}s
                </div>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl">
                <div className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Précision</div>
                <div className="text-2xl font-bold text-purple-600">{percentage}%</div>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={restartQuiz}
                className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Recommencer
              </button>
              <Link
                href="/upload"
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-colors"
              >
                Nouveau quiz
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-black">
      {/* Header */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-4xl mx-auto">
        <Link href="/upload" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          OptiLearn
        </Link>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Question {currentQuestionIndex + 1} sur {questions.length}
          </div>
        </div>
      </nav>

      {/* Progress Bar */}
      <div className="max-w-4xl mx-auto px-6 mb-8">
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all duration-500" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-6">
        {currentQuestion && !showResult && (
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl p-8 border border-gray-200/50 dark:border-gray-700/50">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
              {currentQuestion.question}
            </h2>
            
            <div className="grid gap-4 mb-8">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`p-4 text-left rounded-2xl border transition-all duration-200 ${
                    selectedAnswer === index
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                      : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                      selectedAnswer === index
                        ? 'border-blue-500 bg-blue-500 text-white'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}>
                      {selectedAnswer === index ? (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <span className="text-sm font-medium">{String.fromCharCode(65 + index)}</span>
                      )}
                    </div>
                    <span className="text-lg">{option}</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Score actuel: {score}/{currentQuestionIndex}
              </div>
              
              <button
                onClick={handleNextQuestion}
                disabled={selectedAnswer === null}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {currentQuestionIndex === questions.length - 1 ? 'Terminer' : 'Suivant'}
              </button>
            </div>
          </div>
        )}

        {showResult && (
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl p-8 border border-gray-200/50 dark:border-gray-700/50 text-center">
            <div className={`w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center ${
              results[results.length - 1]?.isCorrect 
                ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                : 'bg-gradient-to-r from-red-500 to-pink-500'
            }`}>
              {results[results.length - 1]?.isCorrect ? (
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </div>
            
            <h3 className={`text-2xl font-bold mb-2 ${
              results[results.length - 1]?.isCorrect ? 'text-green-600' : 'text-red-600'
            }`}>
              {results[results.length - 1]?.isCorrect ? 'Correct !' : 'Incorrect'}
            </h3>
            
            {!results[results.length - 1]?.isCorrect && (
              <p className="text-gray-600 dark:text-gray-300">
                La bonne réponse était : <span className="font-semibold">
                  {String.fromCharCode(65 + currentQuestion.correctAnswer)}. {currentQuestion.options[currentQuestion.correctAnswer]}
                </span>
              </p>
            )}
          </div>
        )}
      </main>
    </div>
  );
} 