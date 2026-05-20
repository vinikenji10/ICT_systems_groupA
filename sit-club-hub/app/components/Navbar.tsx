"use client";

import Link from 'next/link';
import { useAuth } from '../hooks/useAuth';

export default function Navbar() {
  const { user, userRole, loginWithGoogle, logout } = useAuth();

  return (
    <nav className="w-full bg-white shadow-sm sticky top-0 z-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-3">
              <img 
                src="https://firebasestorage.googleapis.com/v0/b/ict-systems-project-a.firebasestorage.app/o/Assets%2FShibaura_Institute_of_Technology_logo.svg.png?alt=media" 
                alt="SIT Logo" 
                className="h-10 w-auto"
              />
              <span className="font-bold text-xl text-slate-800 tracking-tight">Club Hub</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-8 items-center">
            <Link href="/" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">
              Discovery
            </Link>
            <Link href="/events" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">
              Events
            </Link>
            <Link href="/schedule" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">
              Planner
            </Link>
            {/* Show Leader Portal only if user has the 'leader' role */}
            {userRole === 'leader' && (
              <Link href="/dashboard" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">
                Leader Portal
              </Link>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <button className="text-sm font-medium text-slate-600 hover:text-slate-900 border px-3 py-1.5 rounded-md hover:bg-slate-50 transition-colors">
              EN / 日本語
            </button>
            
            {user ? (
              <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold text-slate-900">{user.displayName}</p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider">{userRole}</p>
                </div>
                <button 
                  onClick={logout}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link 
                href="/login"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}