"use client";
import UserJourneyDiagram from "../components/UserJourneyDiagram";
import AgentArchitectureDiagram from "../components/AgentArchitectureDiagram";
import { useTranslation } from "@/app/contexts/useTranslation";

export default function AboutPage() {
  const { lang } = useTranslation();
  
  return (
    <div className="min-h-screen bg-[#f8fafc] py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#0d4f37] tracking-tight mb-4">
            {lang === 'ja' ? 'プラットフォームについて' : 'About the Platform'}
          </h1>
          <div className="w-16 h-1 bg-[#008482] mx-auto mb-6"></div>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto font-medium leading-relaxed">
            {lang === 'ja' 
              ? 'SIT Club Hubは、芝浦工業大学の学生がクラブ、イベント、施設を簡単に見つけられるようにするプラットフォームです。未ログインのビジターから、AIアシスタントを活用する学生、そしてクラブを管理するリーダーまでのユーザージャーニーを以下の図に示します。' 
              : 'SIT Club Hub is a platform that makes it easy for Shibaura Institute of Technology students to discover clubs, events, and facilities. The diagram below illustrates the user journey from an unauthenticated visitor to an AI-powered student, and finally to a club leader.'}
          </p>
        </div>

        <UserJourneyDiagram />

        {/* Divider */}
        <div className="w-full max-w-4xl mx-auto my-12 border-t border-slate-200"></div>

        <AgentArchitectureDiagram />

      </div>
    </div>
  );
}
