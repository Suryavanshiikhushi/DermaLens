/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * DermaLens — Look Beyond the Label
 * Pure Frontend Architecture (Zero-Backend Dependency)
 * Focused strictly on User Registration and Product Scanning Functionality
 */

import React, { useState, useEffect } from 'react';
import { UserProfile } from './types';
import { AuthPage } from './components/AuthPage';
import { ProductScanningStudio } from './components/ProductScanningStudio';
import { Eye, User, Sparkles, LogOut, RefreshCw, ShieldCheck } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [showProfileEdit, setShowProfileEdit] = useState<boolean>(false);

  // Check stored user on mount - opens directly to Registration if no user exists
  useEffect(() => {
    const savedUser = localStorage.getItem('dermalens_user') || localStorage.getItem('purecheck_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Failed to parse user profile', e);
      }
    }
  }, []);

  const handleLogin = (newUser: UserProfile) => {
    setUser(newUser);
    setShowProfileEdit(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('dermalens_user');
    localStorage.removeItem('purecheck_user');
    setUser(null);
    setShowProfileEdit(false);
  };

  const handleUpdateSkinType = (newSkinType: string) => {
    if (user) {
      const updated = { ...user, skinType: newSkinType };
      setUser(updated);
      localStorage.setItem('dermalens_user', JSON.stringify(updated));
    }
  };

  // 1. Initial Entry Point / Registration Screen
  // If user is not registered or requests profile editing, open directly to registration
  if (!user || showProfileEdit) {
    return (
      <div className="relative min-h-screen bg-neutral-50 text-neutral-900">
        {user && showProfileEdit && (
          <div className="absolute top-4 left-4 z-20">
            <button
              onClick={() => setShowProfileEdit(false)}
              className="px-4 py-2 rounded-xl bg-white border border-rose-200 text-rose-700 font-bold text-xs shadow-sm hover:bg-rose-50 transition flex items-center gap-1.5"
            >
              ← Back to Product Scanner
            </button>
          </div>
        )}
        <AuthPage onLoginSuccess={handleLogin} />
      </div>
    );
  }

  // 2. Product Scanning Studio
  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50/20 via-neutral-50 to-rose-50/10 text-neutral-900 flex flex-col font-sans selection:bg-rose-500/20 selection:text-rose-900">
      {/* Sleek Top Navigation */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-rose-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Brand Identity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-700 via-rose-600 to-rose-800 flex items-center justify-center text-white shadow-md shadow-rose-700/20">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-lg tracking-tight text-neutral-900">
                  Derma<span className="text-rose-600">Lens</span>
                </span>
                <span className="px-2 py-0.2 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-[10px] font-bold">
                  Scanner
                </span>
              </div>
              <p className="text-[10px] font-serif italic text-rose-800/80 -mt-0.5">
                Look Beyond the Label
              </p>
            </div>
          </div>

          {/* User Profile & Actions */}
          <div className="flex items-center gap-3">
            {/* User Profile Chip */}
            <div className="hidden sm:flex items-center gap-2.5 px-3.5 py-1.5 rounded-2xl bg-rose-50/70 border border-rose-100 text-xs">
              <div className="w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center text-[10px] font-bold">
                {user.name ? user.name[0].toUpperCase() : 'U'}
              </div>
              <div className="text-left">
                <span className="block font-bold text-neutral-900 text-xs leading-none">
                  {user.name}
                </span>
                <span className="text-[10px] text-rose-700 font-medium">
                  {user.skinType || 'All Skin Types'}
                </span>
              </div>
            </div>

            {/* Switch / Edit Profile Button */}
            <button
              onClick={() => setShowProfileEdit(true)}
              className="px-3 py-1.5 rounded-xl border border-rose-200 bg-white hover:bg-rose-50 text-rose-700 text-xs font-semibold transition flex items-center gap-1.5 shadow-xs"
              title="Edit Profile or Target Skin Type"
            >
              <User className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Edit Profile</span>
            </button>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="p-2 rounded-xl text-neutral-400 hover:text-rose-700 hover:bg-rose-50 transition"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Product Scanning View */}
      <main className="flex-1 py-4">
        <ProductScanningStudio
          user={user}
          onUpdateUserSkinType={handleUpdateSkinType}
        />
      </main>

      {/* Minimal Footer */}
      <footer className="py-6 border-t border-rose-100 bg-white text-center text-xs text-neutral-400">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} DermaLens — High-Precision Cosmetic & Food Scanner</p>
          <div className="flex items-center gap-4 text-[11px] text-neutral-500">
            <span className="flex items-center gap-1 text-rose-700 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" /> Verified Databases
            </span>
            <span>Real-Time Internet Match</span>
            <span>Deterministic Parsing</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
