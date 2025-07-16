import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Cpu, Copy, Check } from 'lucide-react';
import { aiMessages, AIMessage as SupabaseAIMessage } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

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
}

// --- Helper Functions ---
function getWelcomeMessage(deck: DeckData): string {
  const fileName = deck.fileName?.toLowerCase() || 'votre document';
  if (fileName.includes('football') || fileName.includes('pédagogique')) {
    return `Bonjour ! J'ai analysé "${deck.fileName}". Comment puis-je vous aider aujourd'hui ?`;
  }
  return `J'ai analysé "${deck.fileName || deck.name}". Comment puis-je vous aider avec ce document ?`;
}

// --- Component ---
const AIAssistant: React.FC<AIAssistantProps> = ({ deck }) => {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleCopy = (content: string, messageId: string) => {
    navigator.clipboard.writeText(content).then(() => {
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000); // L'icône redevient normale après 2s
    });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Charger l'historique des messages depuis Supabase
  useEffect(() => {
    const loadMessages = async () => {
      if (!currentUser || !deck.id) return;
      
      setIsLoadingHistory(true);
      
      // Afficher le message de bienvenue par défaut
      const welcomeMessage = { 
        id: 'welcome-msg',
        content: getWelcomeMessage(deck),
        sender: 'assistant' as const,
        timestamp: new Date(),
      };
      
      try {
        // Tenter de récupérer les messages depuis Supabase
        const savedMessages = await aiMessages.getMessages(deck.id);
        
        if (savedMessages && savedMessages.length > 0) {
          // Convertir les messages Supabase en format local
          const formattedMessages: Message[] = savedMessages.map(msg => ({
            id: msg.id || `msg-${Date.now()}`,
            content: msg.content,
            sender: msg.sender,
            timestamp: new Date(msg.timestamp)
          }));
          
          setMessages(formattedMessages);
        } else {
          // Aucun message trouvé, afficher le message de bienvenue
          setMessages([welcomeMessage]);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des messages:', error);
        // En cas d'erreur, afficher au moins le message de bienvenue
        setMessages([welcomeMessage]);
      } finally {
        setIsLoadingHistory(false);
      }
    };
    
    loadMessages();
  }, [deck.id, currentUser, deck.name, deck.fileName]);

  // Scroll vers le bas quand les messages changent
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  

  // Sauvegarder un message dans Supabase
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
      
      // Essayer d'ajouter le message, mais ne pas bloquer l'interface utilisateur en cas d'erreur
      await aiMessages.addMessage(supabaseMessage).catch(err => {
        console.error('Erreur lors de la sauvegarde du message:', err);
        // Continuer l'exécution même en cas d'erreur
      });
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du message:', error);
      // Ne pas propager l'erreur pour éviter de bloquer l'interface utilisateur
    }
  };

  const handleSendMessage = async () => {
    if (inputValue.trim() === '' || isLoading || !currentUser) return;
    
    // Si la fonctionnalité est désactivée, ne rien faire
    if (isFeatureDisabled) {
      setInputValue('');
      return;
    }

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: inputValue.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    
    // Sauvegarder le message de l'utilisateur
    await saveMessage(userMessage);

    // Simuler une réponse de l'assistant après un court délai
    setTimeout(async () => {
      const assistantResponse: Message = {
        id: `assistant-${Date.now()}`,
        content: `C'est une excellente question sur \"${inputValue}\". Voici quelques éléments de réponse basés sur votre document.`,
        sender: 'assistant',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantResponse]);
      setIsLoading(false);

      // Sauvegarder la réponse de l'assistant
      await saveMessage(assistantResponse);
    }, 1500);
  };

  // Variable pour activer/désactiver facilement la fonctionnalité
  const isFeatureDisabled = true;

  return (
    <div className="bg-white flex flex-col h-full w-full min-h-[calc(100vh-10rem)] rounded-xl overflow-hidden shadow-sm border border-gray-200/80 relative">
      {/* Header avec badge "Bientôt disponible" */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center">
          <Sparkles className="text-purple-600 mr-3" size={24} />
          <h2 className="text-lg font-bold text-gray-800">Assistant IA</h2>
        </div>
        {isFeatureDisabled && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 border border-amber-200">
            Bientôt disponible
          </span>
        )}
      </div>
      
      {/* Overlay flou quand la fonctionnalité est désactivée */}
      {isFeatureDisabled && (
        <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-10 flex items-center justify-center">
          <div className="text-center p-6 max-w-md">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center">
              <Cpu size={28} className="text-white" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Fonctionnalité en développement</h3>
            <p className="text-slate-600">L'assistant IA sera bientôt disponible dans une prochaine mise à jour.</p>
          </div>
        </div>
      )}

      {/* Messages - Design amélioré */}
      <div id="ai-assistant-container" className="message-container flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50/50">
        {isLoadingHistory ? (
          <div className="h-full flex items-center justify-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-md animate-pulse">
                <Cpu size={24} className="text-white/90" />
              </div>
              <p className="text-sm text-gray-600">Chargement de la conversation...</p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <div key={msg.id} className={`group flex items-end gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.sender === 'assistant' && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-md">
                    <Cpu size={18} className="text-white/90" />
                  </div>
                )}
                <div 
                  className={`relative px-3 py-2 rounded-xl max-w-lg shadow-sm transition-all duration-300 ${msg.sender === 'user' 
                    ? 'bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-br-md'
                    : 'bg-white text-gray-700 border border-gray-200/80 rounded-bl-md'}`}
                >
                  <p 
                    className="text-xs whitespace-pre-wrap" 
                    style={{ 
                      wordBreak: 'break-word', 
                      lineHeight: '1.3',
                      userSelect: 'none' // Désactive la sélection de texte
                    }}
                  >
                    {msg.content}
                  </p>
                </div>
                {msg.sender === 'assistant' && (
                  <button 
                    onClick={() => handleCopy(msg.content, msg.id)}
                    className="p-1 rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    aria-label="Copier le message"
                  >
                    {copiedMessageId === msg.id ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                  </button>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-end gap-2.5 justify-start">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-md animate-pulse">
                  <Cpu size={18} className="text-white/90" />
                </div>
                <div className="px-3 py-2 rounded-xl max-w-lg shadow-sm bg-white border border-gray-200/80">
                  <div className="flex items-center space-x-1.5">
                    <span className="h-2 w-2 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="h-2 w-2 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="h-2 w-2 bg-gray-300 rounded-full animate-bounce"></span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* --- Input Form --- */}
      <div className="p-4 border-t border-gray-100 bg-white">
        <div className="relative flex items-center">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Posez une question..."
            className="w-full pl-5 pr-16 py-3 bg-gray-100 border-2 border-transparent rounded-full text-xs text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 focus:bg-white transition-all duration-300"
            disabled={isLoading}
          />
          <button 
            onClick={handleSendMessage} 
            disabled={!inputValue.trim() || isLoading}
            className={`absolute right-2.5 flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-full transition-all duration-200 ease-in-out group
              ${
                !inputValue.trim() || isLoading
                  ? 'cursor-not-allowed'
                  : 'hover:bg-gray-100'
              }
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-300`}
            aria-label="Envoyer le message"
          >
            <Send size={16} className={`transition-colors duration-200 ${!inputValue.trim() || isLoading ? 'text-gray-300' : 'text-indigo-500 group-hover:text-indigo-600'}`} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;