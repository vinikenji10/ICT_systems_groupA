"use client";

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslation } from '../contexts/useTranslation';
import DefaultButton from './DefaultButton';

export default function Navbar() {
  const { user, userRole, logout } = useAuth();
  const { lang, toggleLang } = useLanguage();
  const { t } = useTranslation();

  const [hoveredRect, setHoveredRect] = useState({ left: 0, width: 0, opacity: 0 });
  const navRef = useRef<HTMLElement>(null);

  const handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!navRef.current) return;
    const navRect = navRef.current.getBoundingClientRect();
    const targetRect = e.currentTarget.getBoundingClientRect();
    
    setHoveredRect({
      left: targetRect.left - navRect.left,
      width: targetRect.width,
      opacity: 1
    });
  };

  const handleMouseLeave = () => {
    setHoveredRect((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <nav className="w-full bg-white shadow-sm sticky top-0 z-50 border-b border-slate-200">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          <div className="flex items-center">
            <Link href="/" prefetch={false} className="flex items-center gap-3">
              <Image 
                src="/shibaura_logo.png" 
                alt="SIT Logo" 
                width={40}
                height={40}
                className="h-10 w-auto"
              />
              <span className="font-bold text-xl text-slate-800 tracking-tight">{t('nav.clubHub')}</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav 
            ref={navRef}
            className="hidden md:flex items-center relative"
            onMouseLeave={handleMouseLeave}
          >
            <div 
              className="absolute -bottom-1 h-[2px] bg-primary rounded-full transition-all duration-300 ease-out pointer-events-none"
              style={{
                left: hoveredRect.left,
                width: hoveredRect.width,
                opacity: hoveredRect.opacity,
                transform: `scaleX(${hoveredRect.opacity ? 1 : 0.8})`
              }}
            />

            <Link 
              href="/" 
              prefetch={false} 
              onMouseEnter={handleMouseEnter}
              className="text-[#0f4e3c] hover:text-primary font-medium transition-colors px-4 py-2"
            >
              {t('nav.discovery')}
            </Link>
            <Link 
              href="/events" 
              prefetch={false} 
              onMouseEnter={handleMouseEnter}
              className="text-[#0f4e3c] hover:text-primary font-medium transition-colors px-4 py-2"
            >
              {t('nav.events')}
            </Link>
            <Link 
              href="/facilities" 
              prefetch={false} 
              onMouseEnter={handleMouseEnter}
              className="text-[#0f4e3c] hover:text-primary font-medium transition-colors px-4 py-2"
            >
              {t('nav.facilities')}
            </Link>
            {userRole === 'leader' && (
              <Link 
                href="/dashboard" 
                prefetch={false} 
                onMouseEnter={handleMouseEnter}
                className="text-[#0f4e3c] hover:text-primary font-medium transition-colors px-4 py-2"
              >
                {t('nav.leaderPortal')}
              </Link>
            )}
          </nav>

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
                variant="primary"
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
