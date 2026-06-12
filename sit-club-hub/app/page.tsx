"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "@/app/contexts/useTranslation";

export default function LandingPage() {
  const { t } = useTranslation();

  return (
    <div className="w-full flex flex-col">
      
      {/* HERO SECTION */}
      <section className="relative w-full h-[60vh] min-h-[500px] flex flex-col items-center justify-center text-center px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/campus_bg.jpg')] bg-cover bg-center z-0" />
        <div className="absolute inset-0 bg-black/40 z-0" /> {/* Clean dark overlay for text readability */}
        
        <div className="relative z-10 mt-16">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-6 max-w-4xl drop-shadow-xl">
            {t('home.heroTitle')}
          </h1>
          <p className="text-xl md:text-2xl text-slate-100 font-medium max-w-2xl mx-auto leading-relaxed drop-shadow-lg">
            {t('home.heroSubtitle')}
          </p>
        </div>
      </section>

      {/* ABOUT THE PROJECT SECTION (Solid Background) */}
      <section className="w-full py-24 px-6 bg-white text-slate-900 border-b border-slate-200">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-4 mb-10 justify-center">
            <svg className="w-10 h-10 text-[#0d4f37]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">About the Hub</h2>
          </div>
          
          <p className="text-xl md:text-2xl leading-relaxed text-center mb-16 max-w-4xl mx-auto text-slate-600 font-medium">
            The SIT Club Hub is a centralized platform designed to democratize access to extracurricular life at the Shibaura Institute of Technology. By bringing together verified data into a single, intuitive hub, we empower students to discover hidden communities, engage in vibrant events, and seamlessly utilize campus facilities.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-10">
            <div className="text-center">
              <div className="text-xl md:text-2xl font-extrabold text-[#0d4f37] mb-2">Centralized</div>
              <div className="text-sm text-slate-500 uppercase tracking-widest font-bold">Platform</div>
            </div>
            <div className="text-center">
              <div className="text-xl md:text-2xl font-extrabold text-[#0d4f37] mb-2">Bilingual</div>
              <div className="text-sm text-slate-500 uppercase tracking-widest font-bold">Native Support</div>
            </div>
            <div className="text-center">
              <div className="text-xl md:text-2xl font-extrabold text-[#0d4f37] mb-2">Verified</div>
              <div className="text-sm text-slate-500 uppercase tracking-widest font-bold">Information</div>
            </div>
            <div className="text-center">
              <div className="text-xl md:text-2xl font-extrabold text-[#0d4f37] mb-2">Secure</div>
              <div className="text-sm text-slate-500 uppercase tracking-widest font-bold">Community</div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED SERVICES: ENGAGE & OCCUPY (Dark Background) */}
      <section id="explore" className="w-full flex flex-col items-center py-[var(--spacing-xxl)] px-[var(--spacing-l)] bg-[var(--background-dark)]">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Featured Services</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">Engage in campus life and occupy the spaces that SIT offers.</p>
        </div>
        <div className="card-grid">
          {/* CLUBS CARD */}
          <Link href="/clubs" className="card group">
            <div 
              className="card__background" 
              style={{backgroundImage: "url('/club_bg.png')"}}
            ></div>
            <div className="card__content">
              <p className="card__category">Discover</p>
              <h3 className="card__heading mb-2">{t('home.clubsTitle')}</h3>
              <p className="text-white/90 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-md translate-y-4 group-hover:translate-y-0 transform">
                {t('home.clubsDesc')}
              </p>
            </div>
          </Link>

          {/* EVENTS CARD */}
          <Link href="/events" className="card group">
            <div 
              className="card__background" 
              style={{backgroundImage: "url('/event_bg.jpg')"}}
            ></div>
            <div className="card__content">
              <p className="card__category">Engage</p>
              <h3 className="card__heading mb-2">{t('home.eventsTitle')}</h3>
              <p className="text-white/90 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-md translate-y-4 group-hover:translate-y-0 transform">
                {t('home.eventsDesc')}
              </p>
            </div>
          </Link>

          {/* FACILITIES CARD */}
          <Link href="/facilities" className="card group">
            <div 
              className="card__background" 
              style={{backgroundImage: "url('/facility_bg.png')"}}
            ></div>
            <div className="card__content">
              <p className="card__category">Occupy</p>
              <h3 className="card__heading mb-2">{t('home.facilitiesTitle')}</h3>
              <p className="text-white/90 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-md translate-y-4 group-hover:translate-y-0 transform">
                {t('home.facilitiesDesc')}
              </p>
            </div>
          </Link>
        </div>
      </section>

      {/* PLATFORM BENEFITS (Solid Green Background) */}
      <section className="w-full py-24 px-6 bg-[#0d4f37] text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-4">{t('home.valuesTitle')}</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            
            <div className="flex flex-col items-center text-center">
              <div className="p-4 bg-white/10 rounded-full mb-6">
                <svg className="w-8 h-8 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"></path></svg>
              </div>
              <h4 className="text-2xl font-bold mb-4">{t('home.valueVisibility')}</h4>
              <p className="text-emerald-100/90 text-lg leading-relaxed">{t('home.valueVisibilityDesc')}</p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="p-4 bg-white/10 rounded-full mb-6">
                <svg className="w-8 h-8 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"></path></svg>
              </div>
              <h4 className="text-2xl font-bold mb-4">{t('home.valueBilingual')}</h4>
              <p className="text-emerald-100/90 text-lg leading-relaxed">{t('home.valueBilingualDesc')}</p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="p-4 bg-white/10 rounded-full mb-6">
                <svg className="w-8 h-8 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>
              </div>
              <h4 className="text-2xl font-bold mb-4">{t('home.valueReviews')}</h4>
              <p className="text-emerald-100/90 text-lg leading-relaxed">{t('home.valueReviewsDesc')}</p>
            </div>

          </div>
        </div>
      </section>

      {/* BOTTOM CTA (Solid Background) */}
      <section className="w-full text-center py-24 bg-slate-50 border-t border-slate-200">
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-10 max-w-3xl mx-auto px-4">
          {t('home.readyTitle')}
        </h2>
        <Link 
          href="/login"
          className="inline-block px-12 py-5 bg-[#0d4f37] text-white rounded-xl font-bold text-xl hover:bg-[#0a3d2a] hover:-translate-y-1 transition-all shadow-xl shadow-emerald-900/20"
        >
          {t('home.getStarted')}
        </Link>
      </section>

    </div>
  );
}
