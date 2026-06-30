"use client";
import React, { useEffect, useState } from 'react';
import Script from 'next/script';
import { useTranslation } from "@/app/contexts/useTranslation";

declare global {
  interface Window {
    mermaid: any;
  }
}

export default function UserJourneyDiagram() {
  const { lang } = useTranslation();
  const [svgContent, setSvgContent] = useState<string>('');
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  const diagramJa = `
flowchart TD
    User([👤 ユーザー / ビジター])
    Home[🏠 ホームページ]
    Discovery[🔍 クラブ検索]
    Events[📅 イベントカレンダー]
    Facilities[🏢 施設]
    Login{SITログイン?}
    Auth["🔑 Google認証<br/>@shibaura-it.ac.jp"]
    Student([🎓 学生 (ログイン済み)])
    Leader([👑 クラブリーダー])
    Assistant[🤖 AIアシスタント]
    Chat["💬 AIに質問<br/>(クラブや施設について)"]
    Portal[⚙️ リーダーポータル]
    ManageClub[📝 プロフィール編集]
    ManageEvents[📆 イベント管理]
    ManageApps[👥 申請管理]

    User -->|アクセス| Home
    Home --> Discovery
    Home --> Events
    Home --> Facilities
    Home --> Assistant_Locked["🔒 AIアシスタント (ロック)"]
    Assistant_Locked -->|ログインをクリック| Auth
    
    Home -->|サインインをクリック| Auth
    Auth --> Login
    Login -->|No| Blocked[🚫 アクセス拒否]
    Login -->|Yes| CheckRole{リーダー?}
    
    CheckRole -->|No| Student
    CheckRole -->|Yes| Leader
    
    Student -.->|フルアクセス| Discovery
    Student -.->|フルアクセス| Events
    Student -.->|フルアクセス| Facilities
    Student -->|アクセス| Assistant
    Assistant --> Chat
    
    Leader -.->|学生の権限を継承| Student
    Leader -->|アクセス| Portal
    Portal --> ManageClub
    Portal --> ManageEvents
    Portal --> ManageApps

    classDef default fill:#f8fafc,stroke:#cbd5e1,stroke-width:1px,color:#334155;
    classDef highlight fill:#dcfce7,stroke:#22c55e,stroke-width:2px,color:#166534;
    classDef ai fill:#dbeafe,stroke:#3b82f6,stroke-width:2px,color:#1e3a8a;
    classDef locked fill:#fee2e2,stroke:#ef4444,stroke-width:2px,color:#991b1b;
    classDef leader fill:#fef3c7,stroke:#f59e0b,stroke-width:2px,color:#92400e;
    
    class Student highlight;
    class Assistant,Chat ai;
    class Assistant_Locked,Blocked locked;
    class Leader,Portal,ManageClub,ManageEvents,ManageApps leader;
  `;

  const diagramEn = `
flowchart TD
    User([👤 User / Visitor])
    Home[🏠 Home Page]
    Discovery[🔍 Discover Clubs]
    Events[📅 Events Calendar]
    Facilities[🏢 Facilities]
    Login{Has SIT Login?}
    Auth["🔑 Google Auth<br/>@shibaura-it.ac.jp"]
    Student([🎓 Logged-in Student])
    Leader([👑 Club Leader])
    Assistant[🤖 AI Assistant]
    Chat["💬 Ask AI Questions<br/>(About clubs, facilities, etc.)"]
    Portal[⚙️ Leader Portal]
    ManageClub[📝 Edit Club Profile]
    ManageEvents[📆 Create/Edit Events]
    ManageApps[👥 Manage Applications]

    User -->|Visits Site| Home
    Home --> Discovery
    Home --> Events
    Home --> Facilities
    Home --> Assistant_Locked["🔒 AI Assistant (Locked)"]
    Assistant_Locked -->|Clicks Login| Auth
    
    Home -->|Clicks Sign In| Auth
    Auth --> Login
    Login -->|No| Blocked[🚫 Access Denied]
    Login -->|Yes| CheckRole{Is Leader?}
    
    CheckRole -->|No| Student
    CheckRole -->|Yes| Leader
    
    Student -.->|Full access to| Discovery
    Student -.->|Full access to| Events
    Student -.->|Full access to| Facilities
    Student -->|Accesses| Assistant
    Assistant --> Chat
    
    Leader -.->|Inherits access from| Student
    Leader -->|Accesses| Portal
    Portal --> ManageClub
    Portal --> ManageEvents
    Portal --> ManageApps

    classDef default fill:#f8fafc,stroke:#cbd5e1,stroke-width:1px,color:#334155;
    classDef highlight fill:#dcfce7,stroke:#22c55e,stroke-width:2px,color:#166534;
    classDef ai fill:#dbeafe,stroke:#3b82f6,stroke-width:2px,color:#1e3a8a;
    classDef locked fill:#fee2e2,stroke:#ef4444,stroke-width:2px,color:#991b1b;
    classDef leader fill:#fef3c7,stroke:#f59e0b,stroke-width:2px,color:#92400e;
    
    class Student highlight;
    class Assistant,Chat ai;
    class Assistant_Locked,Blocked locked;
    class Leader,Portal,ManageClub,ManageEvents,ManageApps leader;
  `;

  useEffect(() => {
    if (!isScriptLoaded || typeof window === 'undefined' || !window.mermaid) return;

    window.mermaid.initialize({ 
      startOnLoad: false, 
      theme: 'default',
      securityLevel: 'loose',
    });

    const renderDiagram = async () => {
      try {
        const diagramText = lang === 'ja' ? diagramJa : diagramEn;
        const { svg } = await window.mermaid.render('mermaid-svg-journey', diagramText);
        setSvgContent(svg);
      } catch (e) {
        console.error("Mermaid parsing failed", e);
      }
    };

    renderDiagram();
  }, [lang, isScriptLoaded]);

  return (
    <div className="w-full flex justify-center py-8 overflow-x-auto relative">
      <Script 
        src="https://cdn.jsdelivr.net/npm/mermaid@10.6.1/dist/mermaid.min.js"
        onReady={() => setIsScriptLoaded(true)}
      />
      {svgContent ? (
        <div 
          className="mermaid-container w-full max-w-5xl flex justify-center bg-white p-8 rounded-3xl shadow-lg border border-slate-200 min-w-[800px]"
          dangerouslySetInnerHTML={{ __html: svgContent }} 
        />
      ) : (
        <div className="flex justify-center items-center h-64 w-full max-w-5xl bg-white p-8 rounded-3xl shadow-lg border border-slate-200">
          <p className="text-slate-500 font-medium animate-pulse">Loading diagram...</p>
        </div>
      )}
    </div>
  );
}
