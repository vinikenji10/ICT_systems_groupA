"use client";

import { useRouter } from 'next/navigation';
import { useTranslation } from '@/app/contexts/useTranslation';

export default function BackButton() {
  const router = useRouter();
  const { lang } = useTranslation();

  return (
    <div className="flex justify-start">
      <button
        onClick={() => router.push('/facilities')}
        className="text-white/80 hover:text-white flex items-center gap-2 text-sm font-bold transition-colors cursor-pointer"
      >
        ← {lang === 'ja' ? '施設案内一覧に戻る' : 'Back to Directory'}
      </button>
    </div>
  );
}
