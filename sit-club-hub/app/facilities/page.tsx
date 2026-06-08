"use client";

import { useState, useEffect } from 'react';
import { useTranslation } from '@/app/contexts/useTranslation';
import InfoCard from '@/app/components/InfoCard';
import { Facility } from '@/app/types';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/app/firebase/config';

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
  weekdays_en?: string;
  weekdays_ja?: string;
  hours_en?: string;
  hours_ja?: string;
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
    imageUrl: 'https://www.shibaura-it.ac.jp/albums/123/abm00021163.png',
    floors_en: '7 Floors',
    floors_ja: '7階建て',
    established: '2006',
    features: ['Classrooms', 'Lecture Halls', 'Administrative Offices', 'Engineering Labs']
  },
  {
    id: 'toyosu-b2',
    name_en: 'Building 2 (Headquarters Building)',
    name_ja: '2号館（本部棟）',
    campus: 'toyosu',
    description_en: 'Opened in 2022, a brand-new hub for innovation, research, and industry-academia collaboration, featuring state-of-the-art co-working spaces and prototyping labs. The first floor hosts a restaurant and cafe designed by Ban Shigeru.',
    description_ja: '2022年に開校した、イノベーション、研究、産学連携の新しいハブ校舎です。最先端のコワーキングスペースやプロトタイピングラボを備え、1階には建築家・坂茂氏設計のレストランやカフェがあります。',
    imageUrl: 'https://www.shibaura-it.ac.jp/albums/123/abm00022178.png',
    floors_en: '6 Floors',
    floors_ja: '6階建て',
    established: '2022',
    features: ['Co-working Space', 'Research Offices', 'Ban Shigeru Restaurant', 'Exhibition Area']
  },
  {
    id: 'toyosu-b3',
    name_en: 'Building 3 (Research Building)',
    name_ja: '3号館（研究棟）',
    campus: 'toyosu',
    description_en: 'Dedicated research facility housing high-tech engineering laboratories, specialized clean rooms, and graduate student offices. The rooftop features Shibaura Kids Park.',
    description_ja: '高度な工学系研究所、特殊クリーンルーム、および大学院生の居室が配置された、研究専用の校舎です。屋上エリアには「シバウラキッズパーク」が整備されています。',
    imageUrl: 'https://www.shibaura-it.ac.jp/albums/123/abm00021276.jpg',
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
    description_en: 'Building 2 houses standard classrooms from the 1st to the 4th floors. The first floor hosts the Academic affairs and Student Affairs office, and the Global Learning Commons (GLC).',
    description_ja: '1階に学事・学生課、GLC（グローバル・ラーニング・コモンズ）があり、1階から4階の各フロアには多様な教室が配置されています。',
    imageUrl: 'https://www.shibaura-it.ac.jp/assets/2_5.jpg',
    floors_en: '4 Floors',
    floors_ja: '4階建て',
    established: '1966',
    features: ['Classrooms', 'GLC', 'Academic Affairs Office']
  },
  {
    id: 'omiya-b5',
    name_en: 'Building 5',
    name_ja: '5号館',
    campus: 'omiya',
    description_en: 'Building 5 contains standard classrooms, computer rooms (PC Labs), the Career Support office, and various research laboratories and experiment rooms for the College of Systems Engineering and Science.',
    description_ja: '教室やPCルーム、キャリアサポート課のほか、システム理工学部の各研究室や実験室などが配置されています。',
    imageUrl: 'https://www.shibaura-it.ac.jp/assets/5_2.jpg',
    floors_en: '3 Floors',
    floors_ja: '3階建て',
    established: '2002',
    features: ['Classrooms', 'PC Rooms', 'Career Support', 'Labs']
  },
  {
    id: 'omiya-emergence',
    name_en: 'Emergence Hub',
    name_ja: '創発棟',
    campus: 'omiya',
    description_en: 'Completed in December 2025 as a hub of "Emergence" where students and researchers from various fields gather, interact, and collaborate. The middle to high floors (4F-6F) house "Lab Street", consolidating research and educational laboratories.',
    description_ja: '多様な分野 of 学生や研究者が集い、交流し、協働することで新たなアイデアやイノベーションを生み出す「創発（Emergence）」の場として、2025年12月に完成しました。中高層部（4〜6F）の「ラボストリート」には研究室・実験室を集約しています。',
    imageUrl: 'https://www.shibaura-it.ac.jp/assets/emergence_hub.jpg',
    floors_en: '6 Floors',
    floors_ja: '6階建て',
    established: '2025',
    features: ['Co-working Hub', 'Lab Street', 'Research Labs', 'Collaboration Space']
  },
  {
    id: 'omiya-library',
    name_en: 'Campus Library',
    name_ja: '大宮図書館棟',
    campus: 'omiya',
    description_en: 'A dedicated library building offering a peaceful study environment, extensive academic book collections, group learning rooms, and computerized search terminals.',
    description_ja: '静かな学習環境、豊富な学術書籍、グループ学習室、および検索用PC端末を提供する図書館専用の建物です。',
    imageUrl: 'https://www.shibaura-it.ac.jp/assets/omiya_20240621.jpg',
    floors_en: '3 Floors',
    floors_ja: '3階建て',
    established: '1998',
    features: ['Reading Rooms', 'Study Desks', 'PC Area', 'Archives']
  },
  {
    id: 'omiya-gym',
    name_en: 'Gymnasium',
    name_ja: '体育館',
    campus: 'omiya',
    description_en: 'Multi-purpose sports facility supporting physical education classes, indoor club sports practices, and large-scale university events.',
    description_ja: '体育の講義、インドア系体育会部活の練習、および大学の大規模イベントをサポートする多目的スポーツ施設です。',
    imageUrl: 'https://www.shibaura-it.ac.jp/assets/sogo.jpg',
    floors_en: '2 Floors',
    floors_ja: '2階建て',
    established: '1970',
    features: ['Main Arena', 'Martial Arts Dojo', 'Training Gym', 'Locker Rooms']
  },
  {
    id: 'omiya-global-dorm',
    name_en: 'Global Dormitory',
    name_ja: '国際学生寮',
    campus: 'omiya',
    description_en: 'A residence hall where international and Japanese students live together, promoting cross-cultural understanding and active exchange.',
    description_ja: '留学生と日本人学生が共に暮らし、異文化理解や活発な交流を深めている学生寮です。',
    imageUrl: 'https://www.shibaura-it.ac.jp/assets/global_dormitory.jpg_wide.jpg',
    floors_en: '5 Floors',
    floors_ja: '5階建て',
    established: '2013',
    features: ['Shared Kitchen', 'Lounge', 'Resident Advisers', 'Global Exchange']
  },
  {
    id: 'omiya-hakua-dorm',
    name_en: 'Hakua Dormitory',
    name_ja: '白亜寮',
    campus: 'omiya',
    description_en: 'A dedicated student dormitory designed to help students focus on both academics and rigorous training, supporting the university\'s goal to qualify for the Hakone Ekiden.',
    description_ja: '箱根駅伝本戦出場という目標に向け、学生が勉学と陸上練習の両面に専念できる環境を提供する専用の学生寮です。',
    imageUrl: 'https://www.shibaura-it.ac.jp/assets/hakua.jpg',
    floors_en: '3 Floors',
    floors_ja: '3階建て',
    established: '2021',
    features: ['Athletics Dorm', 'Training Facilities', 'Shared Bath & Dining']
  }
];

export const DEFAULT_FACILITIES: Record<string, Facility[]> = {
  'toyosu-b1': [
    {
      id: 'toyosu-b1-classroom',
      name_en: 'Classrooms (1F-5F)',
      name_ja: '教室 (1F-5F)',
      description_en: 'Classrooms fully equipped with AV systems that allow for remote lectures and online classes with other campuses.',
      description_ja: '他キャンパスとの遠隔講義やオンライン授業が可能なAV設備を完備した教室です。',
      building: 'Building 1',
      floor: '1-5',
      roomNumber: 'Classrooms',
      imageUrl: 'https://www.shibaura-it.ac.jp/albums/123/abm00021278.jpg',
      facilities: ['Wi-Fi', 'AC', 'AV System', 'Projector'],
      hours_en: '8:50 AM - 8:00 PM',
      hours_ja: '8:50 - 20:00',
      tags: [],
    },
    {
      id: 'toyosu-b1-large-hall',
      name_en: 'Large Lecture Hall (6F)',
      name_ja: '大講義室 (6F)',
      description_en: 'A large lecture hall accommodating up to 520 people. Fully equipped with theatre-grade audio-visual systems.',
      description_ja: '収容人数520名。劇場並みの音響設備を完備しています。',
      building: 'Building 1',
      floor: '6',
      roomNumber: '601',
      imageUrl: 'https://www.shibaura-it.ac.jp/albums/123/abm00000200.jpg',
      facilities: ['Wi-Fi', 'Theater Audio', 'Projector', '520 Seats'],
      hours_en: '8:50 AM - 8:00 PM',
      hours_ja: '8:50 - 20:00',
      tags: [],
    },
    {
      id: 'toyosu-b1-sky-cafeteria',
      name_en: 'Sky Cafeteria (6F)',
      name_ja: 'Sky Cafeteria (6F)',
      description_en: 'Operated by the University COOP, this cafeteria offers a rich variety of standard, seasonal, and event menus, as well as buffet options.',
      description_ja: '大学生協が運営しているカフェテリア。定番メニューから季節メニューやイベントメニューも充実しており、ビュッフェも楽しめます。',
      building: 'Building 1',
      floor: '6',
      roomNumber: 'Cafeteria',
      imageUrl: 'https://www.shibaura-it.ac.jp/assets/cafe.jpg',
      facilities: ['Wi-Fi', 'Buffet', 'Indoor Seating', 'COOP Food'],
      hours_en: '11:00 AM - 2:00 PM',
      hours_ja: '11:00 - 14:00',
      tags: [],
    },
    {
      id: 'toyosu-b1-coop-store',
      name_en: 'Coop Store (1F)',
      name_ja: '生協購買書籍部 (1F)',
      description_en: 'COOP store providing textbooks, stationery, model materials, travel ticket booking, and daily food items.',
      description_ja: '教科書や文房具、建築模型教材から旅行チケット購入、おにぎり・お弁当などの販売まで対応しています。',
      building: 'Building 1',
      floor: '1',
      roomNumber: 'COOP Store',
      imageUrl: 'https://www.shibaura-it.ac.jp/assets/001_2.jpg',
      facilities: ['Wi-Fi', 'Stationery', 'Textbooks', 'Snacks'],
      hours_en: '10:00 AM - 6:00 PM',
      hours_ja: '10:00 - 18:00',
      tags: [],
    }
  ],
  'toyosu-b2': [
    {
      id: 'toyosu-b2-sicilia',
      name_en: 'Ginza Sicilia Toyosu (1F)',
      name_ja: '銀座シシリア 豊洲店 (1F)',
      description_en: 'An established western restaurant designed by world-renowned architect Ban Shigeru, utilizing recycled paper tube pillars. Famous for square pizzas and Neapolitan spaghetti.',
      description_ja: '世界的建築家・坂茂氏設計による、再生紙の紙管を主体素材として使った老舗洋食店。伝統の四角いピザやナポリタンが名物です。',
      building: 'Building 2',
      floor: '1',
      roomNumber: 'Restaurant',
      imageUrl: 'https://www.shibaura-it.ac.jp/albums/4905/abm00024409.jpg',
      facilities: ['Ban Shigeru Design', 'Italian Dining', 'Outdoor Terrace', 'Public Welcome'],
      hours_en: '11:00 AM - 9:00 PM',
      hours_ja: '11:00 - 21:00',
      tags: [],
    },
    {
      id: 'toyosu-b2-segafredo',
      name_en: 'SIT Global Caffe (1F)',
      name_ja: 'SIT Global Caffe (1F)',
      description_en: 'Unique cafe utilizing white beech molded plywood design by Ban Shigeru. Serves authentic espresso, paninis, and Italian beer to promote international exchange.',
      description_ja: '白ブナ材の成型合板を使った坂茂氏設計のカフェ。本場イタリアのエスプレッソやパニーニ、イタリアンビール等を提供しています。',
      building: 'Building 2',
      floor: '1',
      roomNumber: 'Cafe',
      imageUrl: 'https://www.shibaura-it.ac.jp/albums/4905/abm00024408.jpg',
      facilities: ['Wi-Fi', 'Italian Espresso', 'Paninis & Sweets', 'Alumni Friendly'],
      hours_en: '8:00 AM - 8:00 PM',
      hours_ja: '8:00 - 20:00',
      tags: [],
    },
    {
      id: 'toyosu-b2-theater',
      name_en: 'Adegawa Theater (1F)',
      name_ja: '阿出川シアター (1F)',
      description_en: 'Equipped with a 240-inch LED vision. Used for broadcasting international news, presentations, and interactive learning.',
      description_ja: '240インチの大型LEDビジョンを設置。海外ニュースの投影やプレゼンテーション、情報発信等に活用されています。',
      building: 'Building 2',
      floor: '1',
      roomNumber: 'Theater',
      imageUrl: 'https://www.shibaura-it.ac.jp/albums/123/abm00022176.png',
      facilities: ['240-inch LED Vision', 'Presentation System', 'AV Controls'],
      hours_en: '9:00 AM - 6:00 PM',
      hours_ja: '9:00 - 18:00',
      tags: [],
    },
    {
      id: 'toyosu-b2-alumni',
      name_en: 'Shiro Arimoto Alumni Plaza (1F)',
      name_ja: '有元史郎記念校友会館交流プラザ (1F)',
      description_en: 'An interactive salon for alumni, student advisory sessions, public lectures, and local community events.',
      description_ja: '卒業生と在学生の交流拠点であり、地域連携のための公開講座やイベントも開催される多目的スペースです。',
      building: 'Building 2',
      floor: '1',
      roomNumber: 'Alumni Plaza',
      imageUrl: 'https://www.shibaura-it.ac.jp/albums/123/abm00022151.png',
      facilities: ['Discussion Space', 'Alumni Lounge', 'Exhibition Area'],
      hours_en: '10:00 AM - 5:00 PM',
      hours_ja: '10:00 - 17:00',
      tags: [],
    }
  ],
  'toyosu-b3': [
    {
      id: 'toyosu-b3-techno-plaza',
      name_en: 'Technology Plaza (1F)',
      name_ja: 'テクノプラザ (1F)',
      description_en: 'Advanced common lab providing diverse measurement, analysis, and processing equipment to support cutting-edge engineering research.',
      description_ja: '最先端の測定・分析機器から汎用的な工作機械まで、多種多様な共用装置を研究室や教職員向けに提供しています。',
      building: 'Building 3',
      floor: '1',
      roomNumber: 'Techno Plaza',
      imageUrl: 'https://www.shibaura-it.ac.jp/albums/123/abm00021276.jpg',
      facilities: ['Analytical Instruments', 'CAD Workstations', 'Machining Tools'],
      hours_en: '9:00 AM - 5:00 PM',
      hours_ja: '9:00 - 17:00',
      tags: [],
    },
    {
      id: 'toyosu-b3-kids-park',
      name_en: 'Shibaura Kids Park (Top Stage)',
      name_ja: 'シバウラキッズパーク (Top Stage)',
      description_en: 'A soft artificial grass playground of about 1,400㎡ on the research building\'s top stage, featuring design-award-winning play structures safe for children.',
      description_ja: '研究棟トップステージ上の人工芝の遊び場。グッドデザイン賞やキッズデザイン賞を受賞した安全で洗練された遊具が並びます。',
      building: 'Building 3',
      floor: 'R',
      roomNumber: 'Top Stage',
      imageUrl: 'https://www.shibaura-it.ac.jp/albums/123/abm00022177.png',
      facilities: ['Soft Artificial Grass', 'Design Award Playgrounds', 'Stroller Parking', 'Himalayan Cedar Benches'],
      hours_en: '10:00 AM - 5:00 PM',
      hours_ja: '10:00 - 17:00',
      tags: [],
    },
    {
      id: 'toyosu-b3-flower-garden',
      name_en: 'Flower Garden (Grand Stairs)',
      name_ja: 'フラワーガーデン (Grand Stairs)',
      description_en: 'Flower garden arranged along the research building\'s grand stairs, with seasonal flowers replanted four times a year.',
      description_ja: '大階段に整備された、四季折々の花を楽しめるフラワーガーデンです。年4回の植え替えが行われています。',
      building: 'Building 3',
      floor: '1',
      roomNumber: 'Grand Stairs',
      imageUrl: 'https://www.shibaura-it.ac.jp/assets/20230729_flower_garden.png',
      facilities: ['Seasonal Flowers', 'Scenic Stairs', 'Outdoor Seating'],
      hours_en: 'Open 24 Hours',
      hours_ja: '24時間開放',
      tags: [],
    }
  ],
  'omiya-b2': [
    {
      id: 'omiya-b2-glc',
      name_en: 'Global Learning Commons (1F)',
      name_ja: 'グローバル・ラーニング・コモンズ (1F)',
      description_en: 'Language exchange hub with native staff hosting English speaking sessions and global interaction events.',
      description_ja: 'ネイティブスタッフが常駐し、英会話レッスンや国際交流イベントが行われるスペースです。',
      building: 'Building 2',
      floor: '1',
      roomNumber: 'GLC',
      imageUrl: 'https://www.shibaura-it.ac.jp/assets/2_5.jpg',
      facilities: ['Wi-Fi', 'AC', 'English Materials', 'Interactive Area'],
      hours_en: '9:00 AM - 5:00 PM',
      hours_ja: '9:00 - 17:00',
      tags: [],
    },
    {
      id: 'omiya-b2-pc-lab',
      name_en: 'High-Spec Computer Classroom (2F)',
      name_ja: '高スペック情報教室 (2F)',
      description_en: 'Computer lab equipped with high-performance workstations for programming, engineering simulation, and 3D CAD design.',
      description_ja: 'プログラミング、エンジニアリングシミュレーション、3D CAD用の高性能ワークステーションを配置したコンピュータ教室です。',
      building: 'Building 2',
      floor: '2',
      roomNumber: '202-A',
      imageUrl: 'https://www.shibaura-it.ac.jp/assets/2_5.jpg',
      facilities: ['Dual Monitors', 'CAD Software', 'Wi-Fi', 'AC'],
      hours_en: '8:50 AM - 6:00 PM',
      hours_ja: '8:50 - 18:00',
      tags: [],
    }
  ],
  'omiya-b5': [
    {
      id: 'omiya-b5-diner',
      name_en: 'Coop Cafeteria (1F)',
      name_ja: '生協食堂 (1F)',
      description_en: 'Student dining hall serving breakfast, lunch, and dinner, featuring daily set meals, hot-plates, and dessert options.',
      description_ja: '朝・昼・夜の3食を提供する生協食堂。朝の日替定食、夜の鉄板やスイーツなどの看板メニューが充実しています。',
      building: 'Building 5',
      floor: '1',
      roomNumber: 'Cafeteria',
      imageUrl: 'https://www.shibaura-it.ac.jp/assets/cafeteria.jpg',
      facilities: ['Wi-Fi', 'AC', 'Meal Tickets', 'Spacious Seating'],
      hours_en: '11:00 AM - 2:00 PM (Lunch)',
      hours_ja: '11:00 - 14:00（昼食）',
      tags: [],
    },
    {
      id: 'omiya-b5-store',
      name_en: 'Coop Store (1F)',
      name_ja: '生協購買書籍部 (1F)',
      description_en: 'COOP shop carrying textbooks, reference materials, stationery, bento boxes, snacks, and supporting PC repairs.',
      description_ja: '教科書や教材からおにぎり・弁当まで対応。パソコンの修理受付や運転免許の申し込みも可能です。',
      building: 'Building 5',
      floor: '1',
      roomNumber: 'COOP Store',
      imageUrl: 'https://www.shibaura-it.ac.jp/assets/002_2.jpg',
      facilities: ['Wi-Fi', 'Stationery', 'Bento & Snacks', 'PC Repairs'],
      hours_en: '10:00 AM - 5:00 PM',
      hours_ja: '10:00 - 17:00',
      tags: [],
    },
    {
      id: 'omiya-b5-bakery',
      name_en: 'Coop Bakery (1F)',
      name_ja: '生協ベーカリー (1F)',
      description_en: 'Bakery offering fresh bread baked in-store daily, perfect for lunch or snack breaks.',
      description_ja: '毎日お店で焼き上げている焼き立てパンは、お昼にもおやつにもぴったりです。',
      building: 'Building 5',
      floor: '1',
      roomNumber: 'Bakery',
      imageUrl: 'https://www.shibaura-it.ac.jp/assets/SB.jpg',
      facilities: ['Freshly Baked Bread', 'Pastries', 'Takeout'],
      hours_en: '11:00 AM - 3:00 PM',
      hours_ja: '11:00 - 15:00',
      tags: [],
    },
    {
      id: 'omiya-b5-lounge',
      name_en: 'Green Lounge (2F)',
      name_ja: 'グリーンラウンジ (2F)',
      description_en: 'Relaxing open study space for students, looking out to Omiya Campus\'s rich greenery.',
      description_ja: '大宮キャンパスの豊かな緑を眺めながら、休憩、自習、交流ができるリラックスしたオープンスペースです。',
      building: 'Building 5',
      floor: '2',
      roomNumber: 'Lounge',
      imageUrl: 'https://www.shibaura-it.ac.jp/assets/5_2.jpg',
      facilities: ['Wi-Fi', 'Vending Machines', 'Sofa Seating', 'Study Desks'],
      hours_en: '8:30 AM - 7:00 PM',
      hours_ja: '8:30 - 19:00',
      tags: [],
    }
  ],
  'omiya-emergence': [
    {
      id: 'omiya-emergence-coworking',
      name_en: 'Emergence Co-working Space (1F-3F)',
      name_ja: '創発コワーキングスペース (1F-3F)',
      description_en: 'A collaborative space designed to foster interaction, teamwork, and innovation among students and researchers of various departments.',
      description_ja: '多様な分野の学生や研究者が集い、交流し、協働するためのコワーキングスペースです。',
      building: 'Emergence Hub',
      floor: '1-3',
      roomNumber: 'Co-working Zone',
      imageUrl: 'https://www.shibaura-it.ac.jp/assets/emergence_hub.jpg',
      facilities: ['Wi-Fi', 'Collaborative Tables', 'Projector Screens', 'Comfortable Seating'],
      hours_en: '9:00 AM - 8:00 PM',
      hours_ja: '9:00 - 20:00',
      tags: [],
    },
    {
      id: 'omiya-emergence-labstreet',
      name_en: 'Lab Street (4F-6F)',
      name_ja: 'ラボストリート (4F-6F)',
      description_en: 'Consolidated space for advanced research and educational laboratories, featuring transparent glass-walled partitions.',
      description_ja: 'ガラス張りの部屋が並び、研究・教育をさらに深めるための研究室・実験室を集約したエリアです。',
      building: 'Emergence Hub',
      floor: '4-6',
      roomNumber: 'Lab Street',
      imageUrl: 'https://www.shibaura-it.ac.jp/assets/251222_012.jpg',
      facilities: ['Research Laboratories', 'Glass Walls', 'Experimental Setup'],
      hours_en: '9:00 AM - 8:00 PM',
      hours_ja: '9:00 - 20:00',
      tags: [],
    }
  ],
  'omiya-library': [
    {
      id: 'omiya-lib-reading',
      name_en: 'Main Reading Room (2F)',
      name_ja: '大閲覧室 (2F)',
      description_en: 'Spacious, quiet reading area with individual study desks and academic archives.',
      description_ja: '個別学習デスクや各種参考書・学術書が並ぶ、静かに集中できる大閲覧室です。',
      building: 'Campus Library',
      floor: '2',
      roomNumber: 'Reading Hall',
      imageUrl: 'https://www.shibaura-it.ac.jp/assets/omiya_20240621.jpg',
      facilities: ['Quiet Study Zone', 'Individual Desks', 'Wi-Fi', 'Book Search Terminals'],
      hours_en: '9:00 AM - 8:00 PM',
      hours_ja: '9:00 - 20:00',
      tags: [],
    }
  ],
  'omiya-gym': [
    {
      id: 'omiya-gym-arena',
      name_en: 'Main Arena (1F)',
      name_ja: 'メインアリーナ (1F)',
      description_en: 'Large multi-purpose indoor arena hosting basketball, volleyball, badminton practices, and university ceremonies.',
      description_ja: 'バスケットボールやバレーボールができるフルサイズのコートで、体育の授業やインドア部活の練習に利用されます。',
      building: 'Gymnasium',
      floor: '1',
      roomNumber: 'Main Arena',
      imageUrl: 'https://www.shibaura-it.ac.jp/assets/sogo.jpg',
      facilities: ['Basketball Hoops', 'Volleyball Nets', 'Changing Rooms', 'Showers'],
      hours_en: '9:00 AM - 9:00 PM',
      hours_ja: '9:00 - 21:00',
      tags: [],
    }
  ],
  'omiya-global-dorm': [
    {
      id: 'omiya-global-dorm-lounge',
      name_en: 'Interaction Lounge (1F)',
      name_ja: '交流ラウンジ (1F)',
      description_en: 'Shared social lounge for international and domestic dormitory residents to foster language and cultural exchange.',
      description_ja: '寮生である日本人学生と留学生が共に集い、言語や文化の交流を深めるための共用ラウンジです。',
      building: 'Global Dormitory',
      floor: '1',
      roomNumber: 'Lounge',
      imageUrl: 'https://www.shibaura-it.ac.jp/assets/global_dormitory.jpg_wide.jpg',
      facilities: ['Wi-Fi', 'AC', 'Shared Kitchen', 'Lounge Seating'],
      hours_en: '6:00 AM - 11:00 PM',
      hours_ja: '6:00 - 23:00',
      tags: [],
    }
  ],
  'omiya-hakua-dorm': [
    {
      id: 'omiya-hakua-dorm-gym',
      name_en: 'Training Room (1F)',
      name_ja: 'トレーニングルーム (1F)',
      description_en: 'Specialized training facility inside Hakua Dorm to support track students aiming for the Hakone Ekiden.',
      description_ja: '箱根駅伝本戦出場を目指す陸上競技部員が、日々の体力作りに専念できる専用のトレーニング機器を備えた部屋です。',
      building: 'Hakua Dormitory',
      floor: '1',
      roomNumber: 'Training Gym',
      imageUrl: 'https://www.shibaura-it.ac.jp/assets/hakua.jpg',
      facilities: ['Treadmills', 'Free Weights', 'Training Machines'],
      hours_en: '6:00 AM - 10:00 PM',
      hours_ja: '6:00 - 22:00',
      tags: [],
    }
  ]
};

export default function FacilitiesPage() {
  const { t, lang } = useTranslation();
  const [activeCampus, setActiveCampus] = useState<'toyosu' | 'omiya'>('omiya');
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBuildings = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'buildings'));
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Building[];
        setBuildings(data.length > 0 ? data : DEFAULT_BUILDINGS);
      } catch (error) {
        console.error("Error fetching buildings:", error);
        setBuildings(DEFAULT_BUILDINGS);
      } finally {
        setLoading(false);
      }
    };
    fetchBuildings();
  }, []);

  const filteredBuildings = buildings.filter(b => b.campus === activeCampus);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d4f37] flex items-center justify-center text-white text-lg">
        {t('facilities.loading')}
      </div>
    );
  }

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
              titleEn={building.name_en}
              titleJa={building.name_ja}
              buttonHref={`/facilities/${building.id}`}
              buttonText={lang === 'ja' ? '詳細を見る' : 'View Details'}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
