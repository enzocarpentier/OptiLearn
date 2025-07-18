import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, ArrowUp, Cpu, Settings } from 'lucide-react';
import DeckTabs from './DeckTabs';
import { aiMessages, AIMessage as SupabaseAIMessage, supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { extractTextFromPdfUrl } from '@/lib/pdfUtils';
import { useRouter } from 'next/navigation';

// --- Interfaces ---
interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

interface DeckData {
  id: string;
  name: string;
  fileName?: string;
}

interface AIAssistantProps {
  deck: DeckData;
  pdfUrl: string | null;
  activeTab: 'assistant' | 'quiz' | 'resume' | 'flashcard';
  onTabSelect: (id: 'assistant' | 'quiz' | 'resume' | 'flashcard') => void;
}

// --- Helper Functions ---
function getWelcomeMessage(deck: DeckData): string {
  const docName = deck.fileName || deck.name;
  return `J'ai analysé **${docName}**. Comment puis-je vous aider avec ce document ?`;
}

// --- Component ---
const AIAssistant: React.FC<AIAssistantProps> = ({ deck, pdfUrl, activeTab, onTabSelect }) => {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [pdfContext, setPdfContext] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasApiKey, setHasApiKey] = useState<boolean | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Gère l'auto-scroll uniquement si l'utilisateur est déjà en bas
  const [autoScroll, setAutoScroll] = useState(true);

  const handleScroll = () => {
    if (!messagesContainerRef.current) return;
    const container = messagesContainerRef.current;
    const atBottom = container.scrollTop + container.clientHeight >= container.scrollHeight - 120; // marge de 120px
    setAutoScroll(atBottom);
  };

  const scrollToBottom = () => {
    if (autoScroll) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const loadMessages = async () => {
      if (!currentUser || !deck.id) return;
      setIsLoadingHistory(true);
      const welcomeMessage = { 
        id: 'welcome-msg',
        content: getWelcomeMessage(deck),
        sender: 'assistant' as const,
        timestamp: new Date(),
      };
      try {
        const savedMessages = await aiMessages.getMessages(deck.id);
        if (savedMessages && savedMessages.length > 0) {
          const formattedMessages: Message[] = savedMessages.map(msg => ({
            id: msg.id || `msg-${Date.now()}`,
            content: msg.content,
            sender: msg.sender,
            timestamp: new Date(msg.timestamp)
          }));
          setMessages(formattedMessages);
        } else {
          setMessages([welcomeMessage]);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des messages:', error);
        setMessages([welcomeMessage]);
      } finally {
        setIsLoadingHistory(false);
      }
    };
    loadMessages();
  }, [deck.id, currentUser, deck.name, deck.fileName]);

  useEffect(() => {
    const checkApiKey = async () => {
      setIsLoadingHistory(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const accessToken = session?.access_token;
        const response = await fetch('/api/user/api-key', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
          },
        });
        const json = await response.json();
        if (!response.ok) {
          throw new Error(json.error || 'Erreur serveur');
        }
        setHasApiKey(json.hasApiKey);
        if (json.hasApiKey) {
          // Si une clé est présente, on supprime le message d'erreur éventuel
          setError(null);
        } else {
          setError('Clé API Gemini non configurée. Veuillez l\'ajouter dans vos paramètres.');
        }
      } catch (e:any) {
        console.error('Erreur lors de la vérification de la clé API:', e);
        setError('Impossible de vérifier la configuration de votre clé API.');
        setHasApiKey(false);
      } finally {
        setIsLoadingHistory(false);
      }
    };

    checkApiKey();
  }, [currentUser]);

  useEffect(() => {
    const loadPdfContext = async () => {
      if (pdfUrl) {
        try {
          setError(null);
          const text = await extractTextFromPdfUrl(pdfUrl);
          setPdfContext(text);
        } catch (e) {
          console.error(e);
          setError('Impossible de lire le document PDF.');
        }
      }
    };
    loadPdfContext();
  }, [pdfUrl]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, autoScroll]);

  const saveMessage = async (message: Message) => {
    if (!currentUser || !deck.id) return;
    try {
      const supabaseMessage: Omit<SupabaseAIMessage, 'id'> = {
        deck_id: deck.id,
        content: message.content,
        sender: message.sender,
        timestamp: message.timestamp.toISOString(),
        user_id: currentUser.id
      };
      await aiMessages.addMessage(supabaseMessage).catch(err => {
        console.error('Erreur lors de la sauvegarde du message:', err);
      });
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du message:', error);
    }
  };

  const handleSendMessage = async () => {
    if (inputValue.trim() === '' || isLoading || !currentUser) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: inputValue.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    // Active l'auto-scroll pour suivre la réponse de l'IA
    setAutoScroll(true);
    setInputValue('');
    setIsLoading(true);
    setError(null);

    // Sauvegarde immédiate du message utilisateur
    await saveMessage(userMessage);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const accessToken = session?.access_token;

      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify({
          prompt: userMessage.content,
          context: pdfContext,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.error === 'invalid_api_key') {
          setHasApiKey(false);
          setError('Clé API invalide. Veuillez la mettre à jour dans les paramètres.');
          return;
        }
        throw new Error(errorData.error || 'Une erreur est survenue.');
      }

      // Gérer la réponse en streaming
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Impossible de lire la réponse de l\'IA.');
      }

      const assistantMessageId = `assistant-${Date.now()}`;
      let assistantResponse = '';
      setMessages(prev => [
        ...prev,
        {
          id: assistantMessageId,
          content: '', // Commence avec un contenu vide
          sender: 'assistant',
          timestamp: new Date(),
        },
      ]);

      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        assistantResponse += decoder.decode(value, { stream: true });
        
        // Mettre à jour le message de l'assistant en temps réel
        setMessages(prev =>
          prev.map(msg =>
            msg.id === assistantMessageId
              ? { ...msg, content: assistantResponse }
              : msg
          )
        );
      }

      // Sauvegarder le message complet de l'assistant une fois le stream terminé
      const finalAssistantMessage: Message = {
        id: assistantMessageId,
        content: assistantResponse,
        sender: 'assistant',
        timestamp: new Date(),
      };
      await saveMessage(finalAssistantMessage);

    } catch (e: any) {
      setError(e.message || 'Erreur de communication avec l\'assistant.');
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        content: e.message || 'Une erreur est survenue lors de la communication avec l\'assistant.',
        sender: 'assistant',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const isFeatureDisabled = false; // Gardé ici pour une désactivation rapide si besoin

  return (
    <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl flex flex-col h-full w-full min-h-[calc(100vh-10rem)] rounded-xl overflow-hidden shadow-lg border border-slate-200/20 dark:border-slate-800/20 relative">
      {/* Header -- Apple-style professional design */}
      <div className="relative">
        {/* Main header container */}
        <div className="flex items-center justify-center py-4 px-6">
          {/* Centered navigation */}
          <DeckTabs activeTab={activeTab} onTabSelect={onTabSelect} className="" />
        </div>
        
        {/* Elegant transition with gradient and shadow */}
        <div className="relative">
          {/* Main separator line */}
          <div className="border-b border-slate-200/40 dark:border-slate-700/40" />
          {/* Subtle gradient overlay for smooth transition */}
          <div className="absolute inset-x-0 -bottom-2 h-2 bg-gradient-to-b from-slate-50/20 to-transparent dark:from-slate-800/20 pointer-events-none" />
        </div>
      </div>
      
      {/* Overlay pour fonctionnalité désactivée */}
      {isFeatureDisabled && (
        <div className="absolute inset-0 bg-slate-100/50 dark:bg-slate-800/50 backdrop-blur-sm flex items-center justify-center rounded-b-xl z-10">
            <div className="bg-amber-100 text-amber-800 text-sm font-semibold px-4 py-2 rounded-full dark:bg-amber-900/50 dark:text-amber-300">Bientôt disponible</div>
        </div>
      )}

      {/* Affichage d'erreur */}
      {error && (
        <div className="p-4 m-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg">
          <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
        </div>
      )}

      {/* Messages -- Nouveau design */}
      <div
          id="ai-assistant-container"
          ref={messagesContainerRef}
          onScroll={handleScroll}
          className="message-container flex-1 overflow-y-auto p-4 space-y-5"
        >
        {isLoadingHistory ? (
          <div className="h-full flex items-center justify-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-md animate-pulse">
                <Cpu size={24} className="text-white/90" />
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Chargement de la conversation...</p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <div key={msg.id} className={`group flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.sender === 'assistant' && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center shadow-inner">
                    <Sparkles size={18} className="text-slate-500 dark:text-slate-400" />
                  </div>
                )}
                <div 
                  className={`relative px-4 py-2.5 rounded-2xl max-w-lg transition-all duration-300 ${
                    msg.sender === 'user' 
                      ? 'bg-blue-500 text-white rounded-br-lg'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-bl-lg'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap" style={{ wordBreak: 'break-word', lineHeight: '1.4' }}>
                    {msg.content.split(/(\*\*.*\*\*)/).map((part, index) => {
                      if (part.startsWith('**') && part.endsWith('**')) {
                        return <strong key={index} className="font-semibold">{part.slice(2, -2)}</strong>;
                      }
                      return part;
                    })}
                  </p>
                </div>

              </div>
))}
            {isLoading && (
              <div className="flex items-start gap-3 justify-start">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center shadow-inner animate-pulse">
                  <Sparkles size={18} className="text-slate-500 dark:text-slate-400" />
                </div>
                <div className="px-4 py-2.5 rounded-2xl max-w-lg bg-slate-100 dark:bg-slate-800">
                  <div className="flex items-center space-x-1.5">
                    <span className="h-2 w-2 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="h-2 w-2 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="h-2 w-2 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce"></span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input -- Nouveau design */}
      <div className="p-3 border-t border-slate-200/10 dark:border-slate-800/50 bg-white/0">
        {hasApiKey === false && (
          <div className="p-4 text-center bg-amber-50 dark:bg-amber-900/20 rounded-lg">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              Pour utiliser l'assistant IA, veuillez d'abord ajouter votre clé API Google Gemini dans les paramètres.
            </p>
          </div>
        )}

        {hasApiKey === true && (
          <div className="relative flex items-center">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
              placeholder="Posez une question..."
              className="w-full pl-4 pr-12 py-3 text-sm bg-slate-100/50 dark:bg-slate-800/50 border border-transparent rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition-colors duration-200"
              disabled={isLoading || !pdfContext}
            />
            <button 
              onClick={handleSendMessage} 
              disabled={isLoading || !inputValue.trim() || !pdfContext}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2 rounded-full text-white transition-colors duration-200 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 disabled:dark:bg-slate-600 disabled:cursor-not-allowed"
            >
              <ArrowUp size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAssistant;