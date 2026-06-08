"use client";

import { useTranslation } from '@/app/contexts/useTranslation';
import { Building } from '../../page';

interface BuildingHoursProps {
  building: Building;
  schedule: {
    weekdays: string;
    hours: string;
  };
}

export default function BuildingHours({ building, schedule }: BuildingHoursProps) {
  const { lang } = useTranslation();

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 md:p-8 flex flex-col justify-between">
      <div className="space-y-6">
        <h3 className="text-lg font-extrabold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <span>🕒</span> {lang === 'ja' ? '開館時間・利用可能日' : 'Available Hours & Weekdays'}
        </h3>
        
        <div className="space-y-4">
          {/* Weekdays */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {lang === 'ja' ? '利用可能日' : 'Available Days'}
            </h4>
            <p className="text-slate-700 font-bold mt-1 text-base">
              {schedule.weekdays}
            </p>
          </div>

          {/* Hours */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {lang === 'ja' ? '利用可能時間' : 'Available Hours'}
            </h4>
            <p className="text-slate-700 font-bold mt-1 text-base">
              {schedule.hours}
            </p>
          </div>

          {/* Building Scale */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {lang === 'ja' ? '建物規模' : 'Building Scale'}
            </h4>
            <p className="text-slate-700 font-bold mt-1 text-sm">
              {lang === 'ja' ? building.floors_ja : building.floors_en}
            </p>
          </div>
        </div>
      </div>

      {/* Note about holiday access */}
      <div className="mt-8 pt-4 border-t border-slate-100 text-xs text-slate-400 leading-relaxed">
        ⚠️ {lang === 'ja' ? '長期休暇期間や大学行事等により、開館時間が変更になる場合があります。' : 'Hours may change during university holidays or special events.'}
      </div>
    </div>
  );
}
