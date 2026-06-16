"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { useTranslation } from "@/app/contexts/useTranslation";

export default function SystemDiagram() {
  const { t } = useTranslation();

  return (
    <section className="w-full py-16 px-4 bg-[#f8fafc] border-y border-slate-200 overflow-hidden font-sans">
      <div className="max-w-6xl mx-auto flex flex-col items-center">
        
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#0d4f37] tracking-tight mb-4">{t('diagram.title')}</h2>
          <div className="w-16 h-1 bg-[#008482] mx-auto mb-4"></div>
          <p className="text-base text-slate-600 max-w-2xl mx-auto font-medium">{t('diagram.subtitle')}</p>
        </div>

        {/* DIAGRAM WRAPPER */}
        <div className="relative w-full max-w-5xl flex flex-col items-center">
          
          {/* TOP ROW: USERS */}
          <div className="flex flex-col md:flex-row w-full justify-around items-center md:items-end gap-6 md:gap-0 relative z-10 mb-8 md:mb-12">
            {/* Student Node */}
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col items-center bg-white border-t-4 border-[#008482] rounded-xl p-4 shadow-xl w-56 relative z-20"
            >
              <div className="text-4xl mb-2">👤</div>
              <h3 className="font-extrabold text-[#0d4f37] text-lg text-center leading-tight">{t('diagram.student')}</h3>
              <p className="text-xs text-slate-500 font-medium mt-1 text-center">{t('diagram.studentDesc')}</p>
            </motion.div>

            {/* Leader Node */}
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col items-center bg-white border-t-4 border-[#0d4f37] rounded-xl p-4 shadow-xl w-56 relative z-20"
            >
              <div className="text-4xl mb-2">👑</div>
              <h3 className="font-extrabold text-[#0d4f37] text-lg text-center leading-tight">{t('diagram.leader')}</h3>
              <p className="text-xs text-slate-500 font-medium mt-1 text-center">{t('diagram.leaderDesc')}</p>
            </motion.div>

            {/* Top Connectors (Desktop) */}
            <div className="hidden md:block absolute -bottom-6 left-[25%] right-[25%] h-[2px] bg-slate-300 z-0"></div>
            <div className="hidden md:block absolute -bottom-6 left-[25%] w-0.5 h-6 bg-slate-300 z-0 -ml-[1px]"></div>
            <div className="hidden md:block absolute -bottom-6 right-[25%] w-0.5 h-6 bg-slate-300 z-0 -mr-[1px]"></div>
            <div className="hidden md:block absolute -bottom-12 left-1/2 w-0.5 h-6 bg-slate-300 z-0 -ml-[1px]"></div>
          </div>

          {/* MIDDLE ROW: HUB */}
          <div className="relative w-full flex flex-col items-center z-20">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-[#0d4f37] rounded-3xl p-6 shadow-2xl flex flex-col items-center border-4 border-white ring-4 ring-[#0d4f37]/10 relative z-30"
            >
              <div className="w-24 h-24 bg-white rounded-full shadow-inner mb-4 flex items-center justify-center relative overflow-hidden">
                <Image src="/sit_mascot.png" alt="SIT Mascot" fill className="object-contain p-2" />
              </div>
              <h3 className="font-extrabold text-white text-2xl tracking-widest uppercase">{t('diagram.hub')}</h3>
              <p className="text-emerald-200 text-xs font-bold tracking-[0.2em] mt-1 uppercase">{t('diagram.hubDesc')}</p>
            </motion.div>

            {/* Bottom Connectors (Desktop) */}
            <div className="hidden md:block absolute top-full left-1/2 w-0.5 h-8 bg-slate-300 z-0 -ml-[1px]"></div>
            <div className="hidden md:block absolute top-[calc(100%+2rem)] left-[16.66%] right-[16.66%] h-[2px] bg-slate-300 z-0"></div>
            <div className="hidden md:block absolute top-[calc(100%+2rem)] left-[16.66%] w-0.5 h-8 bg-slate-300 z-0 -ml-[1px]"></div>
            <div className="hidden md:block absolute top-[calc(100%+2rem)] right-[16.66%] w-0.5 h-8 bg-slate-300 z-0 -mr-[1px]"></div>
            <div className="hidden md:block absolute top-[calc(100%+2rem)] left-1/2 w-0.5 h-8 bg-slate-300 z-0 -ml-[1px]"></div>
          </div>

          {/* BOTTOM ROW: FEATURES & BENEFITS */}
          <div className="flex flex-col md:flex-row w-full mt-8 md:mt-16 relative z-10 gap-8 md:gap-0">
            
            {/* Discover Column */}
            <div className="flex flex-col items-center flex-1 w-full px-2">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-[#7bb93e] text-white px-4 py-3 rounded-lg shadow-md font-bold text-sm text-center w-full max-w-[220px] border-2 border-white ring-2 ring-[#7bb93e]/30 z-20"
              >
                {t('diagram.discover')}
              </motion.div>
              
              <div className="w-0.5 h-6 bg-slate-300"></div>

              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="bg-white border border-slate-200 px-4 py-3 rounded-lg shadow-sm text-center w-full max-w-[220px] relative z-20"
              >
                <div className="text-[10px] font-bold text-[#008482] uppercase tracking-widest mb-1">{t('diagram.studentBenefit')}</div>
                <p className="text-xs text-slate-700 font-medium leading-snug whitespace-pre-line">{t('diagram.discoverStudent')}</p>
              </motion.div>

              <div className="w-0.5 h-6 bg-transparent border-l-2 border-dashed border-slate-300"></div>

              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="bg-[#f8fafc] border border-slate-300 border-dashed px-4 py-3 rounded-lg text-center w-full max-w-[220px] relative z-20"
              >
                <div className="text-[10px] font-bold text-[#0d4f37] uppercase tracking-widest mb-1">{t('diagram.leaderBenefit')}</div>
                <p className="text-xs text-slate-700 font-medium leading-snug whitespace-pre-line">{t('diagram.discoverLeader')}</p>
              </motion.div>
            </div>

            {/* Engage Column */}
            <div className="flex flex-col items-center flex-1 w-full px-2">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="bg-[#7bb93e] text-white px-4 py-3 rounded-lg shadow-md font-bold text-sm text-center w-full max-w-[220px] border-2 border-white ring-2 ring-[#7bb93e]/30 z-20"
              >
                {t('diagram.engage')}
              </motion.div>
              
              <div className="w-0.5 h-6 bg-slate-300"></div>

              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="bg-white border border-slate-200 px-4 py-3 rounded-lg shadow-sm text-center w-full max-w-[220px] relative z-20"
              >
                <div className="text-[10px] font-bold text-[#008482] uppercase tracking-widest mb-1">{t('diagram.studentBenefit')}</div>
                <p className="text-xs text-slate-700 font-medium leading-snug whitespace-pre-line">{t('diagram.engageStudent')}</p>
              </motion.div>

              <div className="w-0.5 h-6 bg-transparent border-l-2 border-dashed border-slate-300"></div>

              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="bg-[#f8fafc] border border-slate-300 border-dashed px-4 py-3 rounded-lg text-center w-full max-w-[220px] relative z-20"
              >
                <div className="text-[10px] font-bold text-[#0d4f37] uppercase tracking-widest mb-1">{t('diagram.leaderBenefit')}</div>
                <p className="text-xs text-slate-700 font-medium leading-snug whitespace-pre-line">{t('diagram.engageLeader')}</p>
              </motion.div>
            </div>

            {/* Occupy Column */}
            <div className="flex flex-col items-center flex-1 w-full px-2">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="bg-[#7bb93e] text-white px-4 py-3 rounded-lg shadow-md font-bold text-sm text-center w-full max-w-[220px] border-2 border-white ring-2 ring-[#7bb93e]/30 z-20"
              >
                {t('diagram.occupy')}
              </motion.div>
              
              <div className="w-0.5 h-6 bg-slate-300"></div>

              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="bg-white border border-slate-200 px-4 py-3 rounded-lg shadow-sm text-center w-full max-w-[220px] relative z-20"
              >
                <div className="text-[10px] font-bold text-[#008482] uppercase tracking-widest mb-1">{t('diagram.studentBenefit')}</div>
                <p className="text-xs text-slate-700 font-medium leading-snug whitespace-pre-line">{t('diagram.occupyStudent')}</p>
              </motion.div>

              {/* No Leader Benefit for Occupy */}
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
