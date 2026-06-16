"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "@/app/contexts/useTranslation";
import { motion } from "framer-motion";
import SystemDiagram from "./components/SystemDiagram";

export default function LandingPage() {
  const { t } = useTranslation();

  return (
    <div className="w-full flex flex-col">
      
      {/* HERO SECTION */}
      <section className="relative w-full min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center text-center px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/campus_bg.png')] bg-cover bg-center z-0" />
        <div className="absolute inset-0 bg-black/40 z-0" /> {/* Clean dark overlay for text readability */}
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="relative z-10 mt-16"
        >
          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-6 max-w-4xl drop-shadow-xl">
            {t('home.heroTitle')}
          </h1>
          <p className="text-xl md:text-2xl text-slate-100 font-medium max-w-2xl mx-auto leading-relaxed drop-shadow-lg">
            {t('home.heroSubtitle')}
          </p>
        </motion.div>
        
        {/* WAVES ANIMATION */}
        <svg className="waves absolute bottom-0 left-0 w-full z-10" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 24 150 28" preserveAspectRatio="none" shapeRendering="auto">
          <defs>
            <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
          </defs>
          <g className="parallax">
            <use xlinkHref="#gentle-wave" x="48" y="0" fill="rgba(255,255,255,0.7)" />
            <use xlinkHref="#gentle-wave" x="48" y="3" fill="rgba(255,255,255,0.5)" />
            <use xlinkHref="#gentle-wave" x="48" y="5" fill="rgba(255,255,255,0.3)" />
            <use xlinkHref="#gentle-wave" x="48" y="7" fill="#ffffff" />
          </g>
        </svg>
      </section>

      {/* ABOUT THE PROJECT SECTION (Solid Background) */}
      <section className="w-full py-24 px-6 bg-white text-slate-900 border-b border-slate-200">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl mx-auto"
        >
          <div className="flex items-center gap-4 mb-10 justify-center">
            <svg className="w-10 h-10 text-[#0d4f37]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">About the Project</h2>
          </div>
          
          <p className="text-xl md:text-2xl leading-relaxed text-center mb-16 max-w-4xl mx-auto text-slate-600 font-medium">
            The SIT Club Hub is a centralized platform designed to democratize access to extracurricular life at the Shibaura Institute of Technology. By bringing together verified data into a single, intuitive hub, we empower students to discover hidden communities, engage in vibrant events, and seamlessly utilize campus facilities.
          </p>
          
          <motion.div 
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
            }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-10"
          >
            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="text-center">
              <div className="text-xl md:text-2xl font-extrabold text-[#0d4f37] mb-2">Centralized</div>
              <div className="text-sm text-slate-500 uppercase tracking-widest font-bold">Platform</div>
            </motion.div>
            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="text-center">
              <div className="text-xl md:text-2xl font-extrabold text-[#0d4f37] mb-2">Bilingual</div>
              <div className="text-sm text-slate-500 uppercase tracking-widest font-bold">Native Support</div>
            </motion.div>
            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="text-center">
              <div className="text-xl md:text-2xl font-extrabold text-[#0d4f37] mb-2">Verified</div>
              <div className="text-sm text-slate-500 uppercase tracking-widest font-bold">Information</div>
            </motion.div>
            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="text-center">
              <div className="text-xl md:text-2xl font-extrabold text-[#0d4f37] mb-2">Secure</div>
              <div className="text-sm text-slate-500 uppercase tracking-widest font-bold">Community</div>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* FEATURED SERVICES: ENGAGE & OCCUPY (Dark Background) */}
      <section 
        id="explore" 
        className="relative w-full flex flex-col items-center py-[var(--spacing-xxl)] px-[var(--spacing-l)] overflow-hidden bg-[#0d4f37] text-white"
      >
        {/* STARS ANIMATION */}
        <div id="stars"></div>
        <div id="stars2"></div>
        <div id="stars3"></div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Featured Services</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">Engage in campus life and occupy the spaces that SIT offers.</p>
        </motion.div>
        
        <motion.div 
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
          }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="relative z-10 card-grid"
        >
          {/* CLUBS CARD */}
          <motion.div variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}>
            <Link href="/clubs" className="card group block">
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
          </motion.div>

          {/* EVENTS CARD */}
          <motion.div variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}>
            <Link href="/events" className="card group block">
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
          </motion.div>

          {/* FACILITIES CARD */}
          <motion.div variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}>
            <Link href="/facilities" className="card group block">
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
          </motion.div>
        </motion.div>
      </section>

      <SystemDiagram />

      {/* PLATFORM BENEFITS (Squares Animation) */}
      <section className="relative w-full py-24 px-6 bg-[#0d4f37] text-white overflow-hidden">
        {/* SQUARES ANIMATION */}
        <ul className="circles">
          <li></li><li></li><li></li><li></li><li></li>
          <li></li><li></li><li></li><li></li><li></li>
        </ul>

        <div className="relative z-10 max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-extrabold mb-4">{t('home.valuesTitle')}</h2>
          </motion.div>
          
          <motion.div 
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
            }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-12"
          >
            
            <motion.div variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }} className="flex flex-col items-center text-center">
              <div className="p-4 bg-white/10 rounded-full mb-6">
                <svg className="w-8 h-8 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"></path></svg>
              </div>
              <h4 className="text-2xl font-bold mb-4">{t('home.valueVisibility')}</h4>
              <p className="text-emerald-100/90 text-lg leading-relaxed">{t('home.valueVisibilityDesc')}</p>
            </motion.div>

            <motion.div variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }} className="flex flex-col items-center text-center">
              <div className="p-4 bg-white/10 rounded-full mb-6">
                <svg className="w-8 h-8 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"></path></svg>
              </div>
              <h4 className="text-2xl font-bold mb-4">{t('home.valueBilingual')}</h4>
              <p className="text-emerald-100/90 text-lg leading-relaxed">{t('home.valueBilingualDesc')}</p>
            </motion.div>

            <motion.div variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }} className="flex flex-col items-center text-center">
              <div className="p-4 bg-white/10 rounded-full mb-6">
                <svg className="w-8 h-8 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>
              </div>
              <h4 className="text-2xl font-bold mb-4">{t('home.valueReviews')}</h4>
              <p className="text-emerald-100/90 text-lg leading-relaxed">{t('home.valueReviewsDesc')}</p>
            </motion.div>

          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="w-full py-12 bg-slate-50 text-center text-slate-500 relative z-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col items-center">
          <div className="flex items-center gap-3 mb-6">
            <Image src="/shibaura_logo.png" alt="SIT Logo" width={40} height={40} className="opacity-80" />
            <span className="font-bold text-xl text-slate-700">SIT Club Hub</span>
          </div>
          <p className="text-sm font-medium">
            © {new Date().getFullYear()} Shibaura Institute of Technology. All rights reserved.
          </p>
        </div>
      </footer>

    </div>
  );
}
