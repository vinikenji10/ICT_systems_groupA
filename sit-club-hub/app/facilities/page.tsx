"use client";

import { useState } from 'react';
import { useTranslation } from '@/app/contexts/useTranslation';
import InfoCard from '@/app/components/InfoCard';
import { Facility } from '@/app/types';

export interface Building {
  id: string;
  name_en: string;
  name_ja: string;
  campus: 'toyosu' | 'omiya';
  description_en: string;
  description_ja: string;
  imageUrl?: string;
  floors_en: string;
  floors_ja: string;
  established?: string;
  features: string[];
}

export const DEFAULT_BUILDINGS: Building[] = [
  // Toyosu Campus Buildings
  {
    id: 'toyosu-b1',
    name_en: 'Building 1',
    name_ja: '1号館',
    campus: 'toyosu',
    description_en: 'The central academic building hosting classrooms, lecture halls, administrative offices, and advanced engineering labs. It serves as the primary hub of daily student activity.',
    description_ja: '講義室、大講義室、事務オフィス、および先端エンジニアリング研究所を擁する中心的な校舎です。学生の日常的な活動の主要なハブとなっています。',
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    floors_en: '7 Floors',
    floors_ja: '7階建て',
    established: '2006',
    features: ['Classrooms', 'Lecture Halls', 'Administrative Offices', 'Engineering Labs']
  },
  {
    id: 'toyosu-b2',
    name_en: 'Building 2',
    name_ja: '2号館',
    campus: 'toyosu',
    description_en: 'Opened in 2022, a brand-new hub for innovation, research, and industry-academia collaboration, featuring state-of-the-art co-working spaces and prototyping labs.',
    description_ja: '2022年に開校した、イノベーション、研究、産学連携の新しいハブ校舎です。最先端のコワーキングスペースやプロトタイピングラボを備えています。',
    imageUrl: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=800&q=80',
    floors_en: '6 Floors',
    floors_ja: '6階建て',
    established: '2022',
    features: ['Co-working Space', 'Innovation Lab', 'Research Offices', 'Exhibition Area']
  },
  {
    id: 'toyosu-b3',
    name_en: 'Building 3 (Research Building)',
    name_ja: '3号館（研究棟）',
    campus: 'toyosu',
    description_en: 'Dedicated research facility housing high-tech engineering laboratories, specialized clean rooms, and graduate student offices.',
    description_ja: '高度な工学系研究所、特殊クリーンルーム、および大学院生の居室が配置された、研究専用の校舎です。',
    imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80',
    floors_en: '8 Floors',
    floors_ja: '8階建て',
    established: '2006',
    features: ['Research Labs', 'Clean Rooms', 'Seminar Rooms', 'Graduate Offices']
  },

  // Omiya Campus Buildings
  {
    id: 'omiya-b2',
    name_en: 'Building 2',
    name_ja: '2号館',
    campus: 'omiya',
    description_en: 'Primary lecture building for 1st and 2nd-year undergraduate students, equipped with large lecture halls, standard classrooms, and faculty research rooms.',
    description_ja: '主に1・2年生向けの講義が行われる主要な校舎です。大講義室、標準的な教室、および教員の研究室が配置されています。',
    imageUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80',
    floors_en: '4 Floors',
    floors_ja: '4階建て',
    established: '1966',
    features: ['Lecture Rooms', 'Computer Classrooms', 'Faculty Offices']
  },
  {
    id: 'omiya-b5',
    name_en: 'Building 5 (Student Center)',
    name_ja: '5号館（学生センター）',
    campus: 'omiya',
    description_en: 'Modern welfare building featuring the campus main dining hall, student lounge spaces, convenience stores, and student life support counters.',
    description_ja: 'キャンパスのメイン食堂、学生ラウンジ、購買部、学生生活サポート窓口が集まるモダンな厚生棟です。',
    imageUrl: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80',
    floors_en: '3 Floors',
    floors_ja: '3階建て',
    established: '2002',
    features: ['Dining Hall', 'Student Lounge', 'Support Counter', 'Store']
  },
  {
    id: 'omiya-library',
    name_en: 'Campus Library',
    name_ja: '大宮図書館棟',
    campus: 'omiya',
    description_en: 'A dedicated library building offering a peaceful study environment, extensive academic book collections, group learning rooms, and computerized search terminals.',
    description_ja: '静かな学習環境、豊富な学術書籍、グループ学習室、および検索用PC端末を提供する図書館専用の建物です。',
    imageUrl: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=800&q=80',
    floors_en: '3 Floors',
    floors_ja: '3階建て',
    established: '1998',
    features: ['Reading Rooms', 'Private Study Desks', 'PC Area', 'Archives']
  },
  {
    id: 'omiya-gym',
    name_en: 'Gymnasium',
    name_ja: '体育館',
    campus: 'omiya',
    description_en: 'Multi-purpose sports facility supporting physical education classes, indoor club sports practices, and large-scale university events.',
    description_ja: '体育の講義、インドア系体育会部活の練習、および大学の大規模イベントをサポートする多目的スポーツ施設です。',
    imageUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800&q=80',
    floors_en: '2 Floors',
    floors_ja: '2階建て',
    established: '1970',
    features: ['Main Arena', 'Martial Arts Dojo', 'Training Gym', 'Locker Rooms']
  }
];

export const DEFAULT_FACILITIES: Record<string, Facility[]> = {
  'toyosu-b1': [
    {
      id: 'toyosu-b1-cafeteria',
      name_en: 'Main Cafeteria',
      name_ja: '学生食堂 (1F)',
      description_en: 'Spacious dining hall offering a wide variety of hot meals, noodles, and daily lunch specials.',
      description_ja: '温かい食事、麺類、日替わりランチなど、豊富なメニューを提供する広々とした食堂です。',
      building: 'Building 1',
      floor: '1',
      roomNumber: 'Cafeteria',
      imageUrl: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=600&q=80',
      facilities: ['Wi-Fi', 'AC', 'Card Payment', 'Wheelchair Accessible'],
      hours_en: '11:00 AM - 2:00 PM',
      hours_ja: '11:00 - 14:00',
      tags: [],
    },
    {
      id: 'toyosu-b1-active-space',
      name_en: 'Active Learning Space',
      name_ja: 'アクティブラーニングスペース (2F)',
      description_en: 'Modern collaborative study zone with moveable whiteboards, group tables, and presentation screens.',
      description_ja: '可動式ホワイトボード、グループテーブル、プレゼンテーション用スクリーンを備えた、現代的な協働学習ゾーンです。',
      building: 'Building 1',
      floor: '2',
      roomNumber: '2F Lounge',
      imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80',
      facilities: ['Wi-Fi', 'Whiteboards', 'Projectors', 'Power Outlets'],
      hours_en: '8:50 AM - 8:00 PM',
      hours_ja: '8:50 - 20:00',
      tags: [],
    }
  ],
  'toyosu-b2': [
    {
      id: 'toyosu-b2-innovation',
      name_en: 'Innovation Hub & Prototyping Lab',
      name_ja: 'イノベーションハブ & 試作ラボ (4F)',
      description_en: 'A state-of-the-art space equipped with 3D printers, laser cutters, CNC machines, and electronics workstations for student projects.',
      description_ja: '学生のプロジェクトや開発のために、3Dプリンター、レーザーカッター、CNCマシン、電子工作ワークステーションを備えた最先端のスペースです。',
      building: 'Building 2',
      floor: '4',
      roomNumber: '401',
      imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80',
      facilities: ['3D Printers', 'Laser Cutters', 'CNC Machines', 'Workbenches'],
      hours_en: '9:00 AM - 6:00 PM',
      hours_ja: '9:00 - 18:00',
      tags: [],
    }
  ],
  'toyosu-b3': [
    {
      id: 'toyosu-b3-robotics',
      name_en: 'Advanced Robotics Lab',
      name_ja: '高度ロボティクス研究室 (3F)',
      description_en: 'Specialized lab containing motion-capture cameras, robotic arms, and hardware test fields for student research.',
      description_ja: 'モーションキャプチャカメラ、ロボットアーム、および学生研究用のハードウェア試験場を備えた専門研究室です。',
      building: 'Building 3',
      floor: '3',
      roomNumber: '302',
      imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=600&q=80',
      facilities: ['Robotic Arms', 'Motion Capture', 'Soldering Station', 'Testing Arena'],
      hours_en: '9:00 AM - 8:00 PM',
      hours_ja: '9:00 - 20:00',
      tags: [],
    }
  ],
  'omiya-b2': [
    {
      id: 'omiya-b2-pc-lab',
      name_en: 'High-Spec Computer Classroom',
      name_ja: '高スペック情報教室 (2F)',
      description_en: 'Computer classroom equipped with specialized workstations for programming, engineering simulation, and 3D CAD modeling.',
      description_ja: 'プログラミング、エンジニアリングシミュレーション、3D CADモデリング用の高性能ワークステーションを配置したコンピュータ教室です。',
      building: 'Building 2',
      floor: '2',
      roomNumber: '202-A',
      imageUrl: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=600&q=80',
      facilities: ['Dual Monitors', 'CAD Software', 'Wi-Fi', 'AC'],
      hours_en: '8:50 AM - 6:00 PM',
      hours_ja: '8:50 - 18:00',
      tags: [],
    }
  ],
  'omiya-b5': [
    {
      id: 'omiya-b5-diner',
      name_en: 'Omiya Dining Hall',
      name_ja: '大宮第1学生食堂 (1F)',
      description_en: 'A bright, lively cafeteria offering students a wide selection of Japanese meals, rice bowls, and set menus.',
      description_ja: '学生向けに和食、丼もの、定食などを提供する、明るく活気のある食堂です。',
      building: 'Building 5',
      floor: '1',
      roomNumber: 'Cafeteria',
      imageUrl: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=600&q=80',
      facilities: ['Wi-Fi', 'AC', 'Meal Tickets', 'Spacious Seating'],
      hours_en: '11:00 AM - 2:00 PM',
      hours_ja: '11:00 - 14:00',
      tags: [],
    },
    {
      id: 'omiya-b5-lounge',
      name_en: 'Green Lounge',
      name_ja: 'グリーンラウンジ (2F)',
      description_en: 'A relaxing open space for students to take breaks, study, and socialise with a beautiful view of Omiya campus greenery.',
      description_ja: '大宮キャンパスの豊かな緑を眺めながら、休憩、自習、交流ができるリラックスしたオープンスペースです。',
      building: 'Building 5',
      floor: '2',
      roomNumber: 'Lounge',
      imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80',
      facilities: ['Wi-Fi', 'Vending Machines', 'Sofa Seating', 'Study Counters'],
      hours_en: '8:30 AM - 7:00 PM',
      hours_ja: '8:30 - 19:00',
      tags: [],
    }
  ],
  'omiya-library': [
    {
      id: 'omiya-lib-reading',
      name_en: 'Main Reading Room',
      name_ja: '大閲覧室 (2F)',
      description_en: 'A quiet reading room with individual desks, reference library shelves, and desktop search computers.',
      description_ja: '個別デスク、参考図書棚、検索用デスクトップPCを備えた静かな読書室です。',
      building: 'Library',
      floor: '2',
      roomNumber: 'Reading Hall',
      imageUrl: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=600&q=80',
      facilities: ['Quiet Zone', 'Wi-Fi', 'Desktop PCs', 'Power Outlets'],
      hours_en: '9:00 AM - 8:00 PM',
      hours_ja: '9:00 - 20:00',
      tags: [],
    }
  ],
  'omiya-gym': [
    {
      id: 'omiya-gym-arena',
      name_en: 'Main Arena',
      name_ja: 'メインアリーナ (1F)',
      description_en: 'Full-size basketball and volleyball courts, fully equipped with audio systems and spectator space for games.',
      description_ja: 'バスケットボールやバレーボールができるフルサイズのコートで、音響システムや観客用スペースも完備しています。',
      building: 'Gymnasium',
      floor: '1',
      roomNumber: 'Arena',
      imageUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=600&q=80',
      facilities: ['Basketball Nets', 'Volleyball Nets', 'Showers', 'Changing Rooms'],
      hours_en: '9:00 AM - 9:00 PM',
      hours_ja: '9:00 - 21:00',
      tags: [],
    }
  ]
};

export default function FacilitiesPage() {
  const { t, lang } = useTranslation();
  const [activeCampus, setActiveCampus] = useState<'toyosu' | 'omiya'>('omiya');

  const filteredBuildings = DEFAULT_BUILDINGS.filter(b => b.campus === activeCampus);

  return (
    <div className="min-h-screen bg-[#0d4f37] p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <section className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
          <h1 className="text-3xl font-bold text-dark mb-2">{t('facilities.title')}</h1>
          <p className="text-slate-600">{t('facilities.subtitle')}</p>
        </section>

        {/* Campus Switcher Control */}
        <div className="flex justify-center max-w-xs mx-auto">
          <div className="flex p-1 bg-white rounded-2xl relative w-full border border-slate-200 shadow-lg shrink-0">
            {/* Sliding Pill Selector */}
            <div
              className="absolute top-1 bottom-1 rounded-xl bg-[#0d4f37] shadow-md transition-all duration-300 ease-out"
              style={{
                left: activeCampus === 'toyosu' ? '4px' : 'calc(50% + 2px)',
                width: 'calc(50% - 6px)',
              }}
            />
            <button
              onClick={() => setActiveCampus('toyosu')}
              className={`flex-grow py-2.5 text-center text-xs font-black relative z-10 transition-colors duration-300 rounded-xl cursor-pointer ${
                activeCampus === 'toyosu'
                  ? 'text-white'
                  : 'text-slate-900 hover:text-[#0d4f37]'
              }`}
            >
              {t('facilities.toyosuCampus')}
            </button>
            <button
              onClick={() => setActiveCampus('omiya')}
              className={`flex-grow py-2.5 text-center text-xs font-black relative z-10 transition-colors duration-300 rounded-xl cursor-pointer ${
                activeCampus === 'omiya'
                  ? 'text-white'
                  : 'text-slate-900 hover:text-[#0d4f37]'
              }`}
            >
              {t('facilities.omiyaCampus')}
            </button>
          </div>
        </div>

        {/* Buildings Directory in Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBuildings.map((building) => (
            <InfoCard
              key={building.id}
              imageUrl={building.imageUrl}
              imageAlt={lang === 'ja' ? building.name_ja : building.name_en}
              tags={building.features}
              categoryName={activeCampus === 'toyosu' ? t('facilities.toyosuCampus') : t('facilities.omiyaCampus')}
              titleEn={building.name_en}
              titleJa={building.name_ja}
              descriptionEn={building.description_en}
              descriptionJa={building.description_ja}
              details={[
                { label: t('facilities.floors'), value: lang === 'ja' ? building.floors_ja : building.floors_en },
                { label: t('facilities.establishedYear'), value: building.established || '-' }
              ]}
              buttonHref={`/facilities/${building.id}`}
              buttonText={lang === 'ja' ? '詳細を見る' : 'View Details'}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
