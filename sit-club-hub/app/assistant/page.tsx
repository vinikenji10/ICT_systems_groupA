"use client";

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from '@/app/contexts/useTranslation';
import Image from 'next/image';
import DefaultButton from '../components/DefaultButton';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export default function AssistantPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { t, lang } = useTranslation();
  
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: lang === 'ja' 
        ? 'こんにちは！芝浦工業大学のクラブやイベントについて何か質問はありますか？' 
        : 'Hello! Do you have any questions about Shibaura Institute of Technology clubs, facilities, or events?' 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (authLoading) return;
  }, [authLoading]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      // Cloud Function URL - Falls back to production URL if env variable is missing
      const apiUrl = process.env.NEXT_PUBLIC_AGENT_URL || 'https://us-central1-ict-systems-project-a.cloudfunctions.net/ask_agent';
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: userMessage }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch response');
      }

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.answer }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: lang === 'ja' 
          ? '申し訳ありませんが、エラーが発生しました。後でもう一度お試しください。' 
          : 'Sorry, an error occurred while connecting to the assistant. Please try again later.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-slate-500 font-medium animate-pulse">{t('dashboard.loading') || 'Loading...'}</p>
      </div>
    );
  }

  return (
    <div className="relative w-full flex flex-col items-center max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Full bleed fixed background to break out of layout constraints */}
      <div className="fixed inset-0 bg-[#0d4f37] z-0 pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-4xl space-y-8 pb-8">
        
        <div className="bg-white/80 backdrop-blur-xl border border-white/30 rounded-3xl p-8 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">AI Assistant</h1>
            <p className="text-slate-600 font-medium text-lg">
              {lang === 'ja' 
                ? 'SITのクラブ、施設、イベントについて何でも質問してください。' 
                : 'Ask anything about SIT clubs, facilities, and events.'}
            </p>
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-3xl rounded-3xl shadow-2xl border border-white/20 flex flex-col overflow-hidden relative" style={{ height: '60vh', minHeight: '500px', maxHeight: '800px' }}>
          
          {!user && !authLoading ? (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm p-8 text-center">
              <div className="w-24 h-24 mb-6 rounded-full overflow-hidden bg-white flex items-center justify-center border-4 border-[#0d4f37]/20 shadow-lg">
                <Image src="/sit_mascot.png" alt="SIT Mascot" width={96} height={96} className="object-cover" />
              </div>
              <h2 className="text-3xl font-bold text-slate-800 mb-3 tracking-tight">
                {lang === 'ja' ? 'ログインが必要です' : 'Login Required'}
              </h2>
              <p className="text-slate-600 mb-8 max-w-md text-lg">
                {lang === 'ja' 
                  ? 'AIアシスタントを利用するには、SITのアカウントでログインしてください。' 
                  : 'Please log in with your SIT account to chat with the AI Assistant.'}
              </p>
              <DefaultButton href="/login" variant="primary" className="px-8 py-3 rounded-xl text-lg font-semibold shadow-md">
                {lang === 'ja' ? 'ログイン' : 'Sign In'}
              </DefaultButton>
            </div>
          ) : null}

          {/* Messages Area */}
          <div className={`flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-slate-50/50 ${!user ? 'opacity-20 pointer-events-none' : ''}`}>
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} items-end gap-3`}>
                {msg.role === 'assistant' && (
                  <div className="flex-shrink-0 w-10 h-10 rounded-full overflow-hidden bg-white border border-slate-200 shadow-sm flex items-center justify-center">
                    <Image src="/sit_mascot.png" alt="Assistant" width={40} height={40} className="object-cover" />
                  </div>
                )}
                <div className={`max-w-[85%] md:max-w-[75%] p-4 rounded-2xl ${
                  msg.role === 'user' 
                    ? 'bg-[#0f4e3c] text-white rounded-tr-xl rounded-br-sm shadow-md' 
                    : 'bg-white border border-slate-200 text-slate-800 rounded-tl-xl rounded-bl-sm shadow-sm'
                }`}>
                  <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 p-4 rounded-2xl rounded-tl-sm shadow-sm flex items-center space-x-2">
                  <div className="w-2.5 h-2.5 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2.5 h-2.5 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2.5 h-2.5 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white/80 backdrop-blur-md border-t border-slate-200/50">
            <form onSubmit={sendMessage} className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={lang === 'ja' ? 'メッセージを入力...' : 'Type your message...'}
                className="flex-1 px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0f4e3c]/50 focus:border-transparent transition-all shadow-sm"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="bg-[#0f4e3c] hover:bg-[#0a3629] disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-semibold transition-colors flex items-center justify-center min-w-[100px] shadow-sm"
              >
                {lang === 'ja' ? '送信' : 'Send'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
