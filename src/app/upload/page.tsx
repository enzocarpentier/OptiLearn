'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';

interface UploadedFile {
  file: File;
  id: string;
  status: 'uploading' | 'analyzing' | 'ready' | 'error';
  progress: number;
  questions?: Array<{
    id: string;
    question: string;
    options: string[];
    correctAnswer: number;
  }>;
}

export default function UploadPage() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      status: 'uploading' as const,
      progress: 0
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);

    // Simulate upload and analysis process
    newFiles.forEach(uploadedFile => {
      simulateUploadAndAnalysis(uploadedFile.id);
    });
  }, []);

  const simulateUploadAndAnalysis = async (fileId: string) => {
    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 100));
      setUploadedFiles(prev => 
        prev.map(f => 
          f.id === fileId 
            ? { ...f, progress: i, status: i === 100 ? 'analyzing' : 'uploading' }
            : f
        )
      );
    }

    // Simulate analysis
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Generate sample questions
    const sampleQuestions = [
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
      }
    ];

    setUploadedFiles(prev => 
      prev.map(f => 
        f.id === fileId 
          ? { ...f, status: 'ready', questions: sampleQuestions }
          : f
      )
    );
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: true
  });

  const generateMoreQuestions = async (fileId: string) => {
    setIsGenerating(true);
    
    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const additionalQuestions = [
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

    setUploadedFiles(prev => 
      prev.map(f => 
        f.id === fileId 
          ? { ...f, questions: [...(f.questions || []), ...additionalQuestions] }
          : f
      )
    );
    
    setIsGenerating(false);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-black">
      {/* Header */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto border-b border-gray-200/50 dark:border-gray-700/50">
        <Link href="/dashboard" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          OptiLearn
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
            ← Retour au dashboard
          </Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-4">
            Upload tes documents
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Glisse tes fichiers PDF ici et laisse l'IA créer des questions personnalisées pour tes révisions.
          </p>
        </div>

        {/* Drop Zone */}
        <div className="mb-12">
          <div
            {...getRootProps()}
            className={`relative p-12 border-2 border-dashed rounded-3xl transition-all duration-300 cursor-pointer ${
              isDragActive 
                ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20 scale-105' 
                : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 hover:bg-gray-50/50 dark:hover:bg-gray-800/50'
            }`}
          >
            <input {...getInputProps()} />
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              
              {isDragActive ? (
                <p className="text-2xl font-semibold text-blue-600 mb-2">
                  Dépose tes fichiers ici !
                </p>
              ) : (
                <>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                    Glisse tes fichiers PDF ici
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    ou clique pour sélectionner des fichiers
                  </p>
                  <div className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Sélectionner des fichiers
                  </div>
                </>
              )}
              
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                Formats supportés : PDF uniquement • Taille max : 10MB par fichier
              </p>
            </div>
          </div>
        </div>

        {/* Uploaded Files */}
        {uploadedFiles.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Fichiers uploadés ({uploadedFiles.length})
            </h2>
            
            <div className="grid gap-6">
              {uploadedFiles.map((uploadedFile) => (
                <div key={uploadedFile.id} className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {uploadedFile.file.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {(uploadedFile.file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      {uploadedFile.status === 'uploading' && (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                          <span className="text-sm text-blue-600">Upload... {uploadedFile.progress}%</span>
                        </div>
                      )}
                      {uploadedFile.status === 'analyzing' && (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                          <span className="text-sm text-purple-600">Analyse IA en cours...</span>
                        </div>
                      )}
                      {uploadedFile.status === 'ready' && (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                          <span className="text-sm text-green-600">Prêt</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {uploadedFile.status === 'uploading' && (
                    <div className="mb-4">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${uploadedFile.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Questions Generated */}
                  {uploadedFile.status === 'ready' && uploadedFile.questions && (
                    <div className="mt-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                          Questions générées ({uploadedFile.questions.length})
                        </h4>
                        <div className="flex gap-2">
                          <button
                            onClick={() => generateMoreQuestions(uploadedFile.id)}
                            disabled={isGenerating}
                            className="px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50 text-sm"
                          >
                            {isGenerating ? 'Génération...' : '+ Générer plus'}
                          </button>
                          <Link 
                            href={`/quiz/${uploadedFile.id}`}
                            className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm"
                          >
                            Commencer le quiz
                          </Link>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        {uploadedFile.questions.slice(0, 3).map((question, index) => (
                          <div key={question.id} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                            <p className="font-medium text-gray-900 dark:text-white mb-2">
                              {index + 1}. {question.question}
                            </p>
                            <div className="grid grid-cols-2 gap-2">
                              {question.options.map((option, optIndex) => (
                                <div 
                                  key={optIndex}
                                  className={`p-2 rounded-lg text-sm ${
                                    optIndex === question.correctAnswer 
                                      ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200' 
                                      : 'bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                                  }`}
                                >
                                  {String.fromCharCode(65 + optIndex)}. {option}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                        
                        {uploadedFile.questions.length > 3 && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                            + {uploadedFile.questions.length - 3} autres questions disponibles
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {uploadedFiles.length === 0 && (
          <div className="text-center mt-16">
            <div className="inline-block p-8 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-3xl border border-gray-200/50 dark:border-gray-700/50">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Aucun fichier uploadé
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Commencez par uploader un PDF pour générer vos premiers quiz !
              </p>
            </div>
          </div>
        )}
      </main>
      </div>
    </ProtectedRoute>
  );
} 