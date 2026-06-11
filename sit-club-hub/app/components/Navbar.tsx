"use client";

import Link from 'next/link';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslation } from '../contexts/useTranslation';
import DefaultButton from './DefaultButton';

export default function Navbar() {
  const { user, userRole, logout } = useAuth();
  const { lang, toggleLang } = useLanguage();
  const { t } = useTranslation();

  return (
    <nav className="w-full bg-white shadow-sm sticky top-0 z-50 border-b border-slate-200">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-3">
              <img 
                src="https://firebasestorage.googleapis.com/v0/b/ict-systems-project-a.firebasestorage.app/o/Assets%2Fshibaura_logo.png?alt=media&token=0710c303-5f80-4d8a-87b9-ed45dc3d70e9" 
                alt="SIT Logo" 
                className="h-10 w-auto"
              />
              <span className="font-bold text-xl text-slate-800 tracking-tight">{t('nav.clubHub')}</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-8 items-center">
            <Link href="/" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">
              {t('nav.discovery')}
            </Link>
            <Link href="/events" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">
              {t('nav.events')}
            </Link>
            <Link href="/facilities" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">
              {t('nav.facilities')}
            </Link>
            <Link href="/schedule" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">
              {t('nav.planner')}
            </Link>
            {userRole === 'leader' && (
              <Link href="/dashboard" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">
                {t('nav.leaderPortal')}
              </Link>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <DefaultButton
              onClick={toggleLang}
              variant="outline"
              className="text-sm font-medium border px-3 py-1.5 rounded-md"
            >
              {lang === 'en' ? '日本語' : 'EN'}
            </DefaultButton>
            
            {user ? (
              <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold text-slate-900">{user.displayName}</p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider">{userRole}</p>
                </div>
                <DefaultButton 
                  onClick={logout}
                  variant="light"
                  className="px-4 py-2 rounded-md text-sm font-medium"
                >
                  {t('nav.signOut')}
                </DefaultButton>
              </div>
            ) : (
              <DefaultButton 
                href="/login"
                variant="blue"
                className="px-4 py-2 rounded-md text-sm font-medium"
              >
                {t('nav.signIn')}
              </DefaultButton>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}
