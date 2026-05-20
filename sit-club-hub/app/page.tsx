"use client";

import { useEffect, useState } from 'react';
import { collection, getDocs, writeBatch, doc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from './firebase/config'; // Ajuste o caminho se a sua pasta firebase estiver em outro lugar
import { useRouter } from 'next/navigation'

// Definindo a interface para o TypeScript
interface Club {
  id: string;
  name_en: string;
  name_ja: string;
  category: string;
  description_en: string;
  description_ja: string;
  tags: string[];
  status: string;
}

export default function Home() {
  const router = useRouter()
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const categories = ['All', 'Engineering', 'Esports', 'Sports', 'Cultural', 'Design'];

  // Função para buscar os dados do Firestore
  const fetchClubs = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'clubs'));
      const clubsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Club[];
      setClubs(clubsData);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  // Executa a busca assim que a página carregar
  useEffect(() => {
    fetchClubs();
  }, []);

  // Função temporária para injetar os dados (Seeding)
const handleSeed = async () => {
  try {
    const batch = writeBatch(db);
    const clubsRef = collection(db, 'clubs');
    const eventsRef = collection(db, 'events');

    const seedClubs = [
      {
        name_en: "SIT Tactical FPS Team",
        name_ja: "SIT戦術的FPSチーム",
        category: "Esports",
        description_en: "Competitive team focused on high-level play in tactical shooters.",
        description_ja: "タクティカルシューターでのハイレベルなプレイに焦点を当てた競技チーム。",
        tags: ["Competitive", "PC Gaming"],
        status: "active",
        leaderIds: [], 
        // Newly added fields based on our final schema:
        logoUrl: "https://placehold.co/150x150/e2e8f0/475569.png?text=FPS+Logo",
        bannerUrl: "https://placehold.co/800x200/e2e8f0/475569.png?text=Tactical+FPS+Banner",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      },
      {
        name_en: "Applied AI & Data Lab",
        name_ja: "応用AI・データラボ",
        category: "Engineering",
        description_en: "Practical data science and development using Python.",
        description_ja: "Pythonを使用した実践的なデータサイエンスと開発。",
        tags: ["Python", "AI"],
        status: "active",
        leaderIds: [],
        // Newly added fields based on our final schema:
        logoUrl: "https://placehold.co/150x150/e2e8f0/475569.png?text=AI+Logo",
        bannerUrl: "https://placehold.co/800x200/e2e8f0/475569.png?text=AI+Lab+Banner",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }
    ];

    const clubIds: string[] = [];

    seedClubs.forEach((club) => {
      const newClubRef = doc(clubsRef);
      clubIds.push(newClubRef.id);
      batch.set(newClubRef, club);
    });

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);

    const seedEvents = [
      {
        clubId: clubIds[0], 
        title_en: "Valorant Strategy Meeting",
        title_ja: "Valorant 戦略会議",
        description_en: "Planning for the upcoming inter-university tournament.",
        description_ja: "次回の大学間トーナメントの計画。",
        location: "Omiya Campus - Room 402",
        startTime: Timestamp.fromDate(tomorrow),
        endTime: Timestamp.fromDate(new Date(tomorrow.getTime() + 2 * 60 * 60 * 1000)),
        isPublic: true,
        // Optional cover image for the event:
        coverUrl: "https://placehold.co/400x200/e2e8f0/475569.png?text=Valorant+Event"
      },
      {
        clubId: clubIds[1], 
        title_en: "LLM Hackathon 2024",
        title_ja: "LLM ハッカソン 2024",
        description_en: "Build your own AI agent in 4 hours.",
        description_ja: "4時間で独自のAIエージェントを構築します。",
        location: "Building 2 - Collaborative Space",
        startTime: Timestamp.fromDate(nextWeek),
        endTime: Timestamp.fromDate(new Date(nextWeek.getTime() + 4 * 60 * 60 * 1000)),
        isPublic: true,
        coverUrl: "https://placehold.co/400x200/e2e8f0/475569.png?text=Hackathon"
      }
    ];

    seedEvents.forEach((event) => {
      const newEventRef = doc(eventsRef);
      batch.set(newEventRef, event);
    });

    await batch.commit();
    alert("Banco de dados populado com a modelagem completa!");
  } catch (error) {
    console.error("Erro ao popular o banco:", error);
    alert("Falha ao injetar dados.");
  }
};

  return (
    <div className="space-y-8">
      {/* Botão Temporário para Injeção de Dados */}
      {clubs.length === 0 && !loading && (
        <div className="bg-amber-100 border border-amber-300 text-amber-900 p-4 rounded-xl flex justify-between items-center">
          <p className="font-medium">O banco de dados parece estar vazio. Deseja popular com os dados de teste?</p>
          <button 
            onClick={handleSeed}
            className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-md font-bold transition-colors"
          >
            Popular Banco de Dados
          </button>
        </div>
      )}

      {/* Cabeçalho e Busca */}
      <section className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Discover Hidden Communities</h1>
          <p className="text-slate-600">Find your passion and join student organizations.</p>
        </div>
        
        <div className="w-1/3">
          <input 
            type="text" 
            placeholder="Search clubs, sports, tags..." 
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>
      </section>

      {/* Estrutura Principal */}
      <div className="flex gap-8 items-start">
        
        {/* Barra Lateral de Categorias */}
        <aside className="w-64 flex-shrink-0 sticky top-24">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
            <h2 className="font-semibold text-slate-800 mb-4 px-2 uppercase tracking-wider text-sm">Categories</h2>
            <ul className="space-y-1">
              {categories.map((category) => (
                <li key={category}>
                  <button className="w-full text-left px-3 py-2 text-slate-600 hover:bg-blue-50 hover:text-blue-700 rounded-md transition-colors font-medium text-sm">
                    {category}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Grid de Organizações Dinâmico */}
        <div className="flex-grow grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full flex justify-center py-10">
              <p className="text-slate-500 font-medium animate-pulse">Carregando clubes...</p>
            </div>
          ) : (
            clubs.map((club) => (
              <div key={club.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-all cursor-pointer flex flex-col">
                <div className="h-40 bg-slate-100 flex items-center justify-center border-b border-slate-100">
                  <span className="text-slate-400 text-sm">Image Placeholder</span>
                </div>
                
                <div className="p-5 flex flex-col flex-grow">
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="text-xs font-semibold bg-blue-100 text-blue-800 px-2.5 py-1 rounded-md">
                      {club.category}
                    </span>
                    {club.tags.slice(0, 2).map((tag, idx) => (
                      <span key={idx} className="text-xs font-semibold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <h3 className="font-bold text-lg text-slate-900 leading-tight mb-1">{club.name_en}</h3>
                  <p className="text-xs text-slate-500 mb-3 font-medium">{club.name_ja}</p>
                  
                  <p className="text-sm text-slate-600 mb-6 line-clamp-3 flex-grow">
                    {club.description_en}
                  </p>
                  
                  <button 
                    onClick={() => router.push(`/clubs/${club.id}`)}
                    className="w-full bg-slate-900 hover:bg-blue-600 text-white py-2.5 rounded-lg text-sm font-semibold transition-colors mt-auto"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}