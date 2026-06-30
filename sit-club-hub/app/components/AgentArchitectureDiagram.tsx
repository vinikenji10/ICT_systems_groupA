"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { useTranslation } from "@/app/contexts/useTranslation";

export default function AgentArchitectureDiagram() {
  const { lang } = useTranslation();

  return (
    <div className="w-full max-w-5xl mx-auto py-16 px-4 font-sans relative flex flex-col items-center">
      
      <div className="text-center mb-16">
        <h2 className="text-3xl font-extrabold text-[#0d4f37] tracking-tight mb-2">
          {lang === 'ja' ? 'RAG AIエージェントのアーキテクチャ' : 'RAG AI Agent Architecture'}
        </h2>
        <div className="w-12 h-1 bg-[#008482] mx-auto mb-4"></div>
        <p className="text-sm text-slate-600 max-w-2xl mx-auto">
          {lang === 'ja' 
            ? '最新のLangGraph、ChromaDB、Google Geminiを活用した堅牢なAIシステム構成' 
            : 'Robust AI system architecture powered by LangGraph, ChromaDB, and Google Gemini'}
        </p>
      </div>

      <div className="relative w-full flex flex-col items-center">
        
        {/* User Node */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col items-center z-20"
        >
          <div className="bg-slate-800 text-white border-2 border-slate-700 rounded-2xl py-3 px-8 shadow-lg flex items-center gap-3">
            <span className="text-2xl">👤</span>
            <span className="font-bold text-lg">{lang === 'ja' ? 'ユーザー' : 'User'}</span>
          </div>
        </motion.div>

        {/* Down Arrow */}
        <div className="w-1 h-12 bg-slate-300 relative my-1 z-0">
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 border-r-2 border-b-2 border-slate-300 rotate-45"></div>
        </div>

        {/* Firebase Node */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="flex flex-col items-center z-20"
        >
          <div className="bg-[#f57c00] text-white border-4 border-orange-200 rounded-2xl py-4 px-8 shadow-xl flex items-center gap-4">
            <span className="text-4xl">🔥</span>
            <div>
              <h3 className="font-extrabold text-lg">Firebase Cloud Functions</h3>
              <p className="text-orange-100 text-xs font-medium uppercase tracking-wider">{lang === 'ja' ? 'バックエンド API' : 'Backend API'}</p>
            </div>
          </div>
        </motion.div>

        {/* Down Arrow */}
        <div className="w-1 h-16 bg-slate-300 relative my-1 z-0">
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 border-r-2 border-b-2 border-slate-300 rotate-45"></div>
        </div>

        {/* The Core Agent Block */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="w-full max-w-4xl bg-white border border-slate-200 rounded-3xl p-8 md:p-12 shadow-2xl relative z-10 flex flex-col items-center"
        >
          <div className="absolute -top-4 left-8 bg-blue-100 text-blue-800 text-xs font-bold px-4 py-2 rounded-full border border-blue-200 shadow-sm uppercase tracking-wide">
            {lang === 'ja' ? 'AIエンジン (Python)' : 'AI Engine (Python)'}
          </div>

          {/* Orchestrator */}
          <div className="flex flex-col items-center mb-16 relative">
            <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-6 shadow-md w-80 flex flex-col items-center relative z-20 hover:border-blue-300 transition-colors">
              <div className="w-20 h-20 mb-3 relative flex items-center justify-center bg-white rounded-full p-2 border border-slate-100 shadow-sm">
                <Image src="/langchain_logo.svg" alt="LangChain" width={56} height={56} className="object-contain" />
              </div>
              <h3 className="font-extrabold text-slate-800 text-2xl mb-1">LangChain</h3>
              <p className="text-slate-500 text-sm font-medium text-center">
                {lang === 'ja' ? 'エージェントオーケストレーション' : 'Agent Orchestration & Logic'}
              </p>
            </div>
            
            {/* Down Connector */}
            <div className="w-1 h-12 bg-slate-200 absolute -bottom-12 z-0"></div>
          </div>

          {/* Horizontal Split for Chroma and Gemini */}
          <div className="flex flex-col md:flex-row w-full justify-center items-center gap-8 md:gap-32 relative">
            
            {/* Desktop Connectors */}
            <div className="hidden md:block absolute top-[-3rem] left-1/4 w-[50%] h-[3rem] border-l-[3px] border-r-[3px] border-t-[3px] border-slate-200 rounded-t-2xl z-0"></div>
            {/* Arrows pointing down to DB and LLM */}
            <div className="hidden md:block absolute top-0 left-1/4 -translate-x-[1.5px] w-3 h-3 border-r-[3px] border-b-[3px] border-slate-200 rotate-45 z-0"></div>
            <div className="hidden md:block absolute top-0 right-1/4 translate-x-[1.5px] w-3 h-3 border-r-[3px] border-b-[3px] border-slate-200 rotate-45 z-0"></div>

            {/* Left: ChromaDB */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="flex flex-col items-center bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-6 shadow-md w-full md:w-72 relative z-20 hover:shadow-lg hover:border-emerald-400 transition-all"
            >
              <div className="w-20 h-20 mb-4 bg-white rounded-2xl flex items-center justify-center p-3 shadow-sm border border-emerald-100">
                <Image src="/chroma_logo.png" alt="ChromaDB" width={64} height={64} className="object-contain" />
              </div>
              <h4 className="font-bold text-emerald-900 text-xl mb-1">ChromaDB</h4>
              <p className="text-emerald-700 text-sm font-medium text-center">
                {lang === 'ja' ? 'ベクトルデータベース' : 'Vector Database'}<br/>
                <span className="text-xs opacity-75">(Knowledge Retrieval)</span>
              </p>
            </motion.div>

            {/* Right: Gemini */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="flex flex-col items-center bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 shadow-md w-full md:w-72 relative z-20 hover:shadow-lg hover:border-blue-400 transition-all"
            >
              <div className="w-20 h-20 mb-4 bg-white rounded-2xl flex items-center justify-center p-3 shadow-sm border border-blue-100">
                <Image src="/gemini_logo.svg" alt="Google Gemini" width={64} height={64} className="object-contain" />
              </div>
              <h4 className="font-bold text-blue-900 text-xl mb-1">Google Gemini</h4>
              <p className="text-blue-700 text-sm font-medium text-center">
                {lang === 'ja' ? '大規模言語モデル (LLM)' : 'Large Language Model'}<br/>
                <span className="text-xs opacity-75">(Response Generation)</span>
              </p>
            </motion.div>

          </div>
        </motion.div>

      </div>
    </div>
  );
}
