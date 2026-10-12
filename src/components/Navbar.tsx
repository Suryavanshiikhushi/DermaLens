import React, { useState } from 'react';
import { UserProfile } from '../types';
import { Sparkles, Barcode, Activity, Share2, LogOut, ChevronDown, Apple, Eye, ShieldAlert } from 'lucide-react';

interface NavbarProps {
  user: UserProfile;
  currentTab: 'home' | 'skin' | 'food' | 'dashboard' | 'community';
  onSelectTab: (tab: 'home' | 'skin' | 'food' | 'dashboard' | 'community') => void;
  onOpenBarcodeModal: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  currentTab,
  onSelectTab,
  onOpenBarcodeModal,
  onLogout,
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-rose-100 shadow-[0_1px_3px_rgba(190,18,60,0.04)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <div
            onClick={() => onSelectTab('home')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-700 via-rose-600 to-rose-800 flex items-center justify-center text-white shadow-md shadow-rose-700/25 group-hover:scale-105 transition-transform duration-200">
              <Eye className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1.5">
                <span className="font-extrabold text-neutral-900 text-lg tracking-tight group-hover:text-rose-700 transition-colors">
                  Derma<span className="text-rose-600">Lens</span>
                </span>
                <span className="text-xs font-serif italic text-rose-700/90 font-medium hidden sm:inline">
                  — Look Beyond the Label
                </span>
              </div>
              <span className="text-[10px] tracking-wider uppercase font-semibold text-neutral-400 sm:hidden">
                Look Beyond the Label
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5">
            <button
              onClick={() => onSelectTab('home')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                currentTab === 'home'
                  ? 'bg-rose-50 text-rose-700 border border-rose-200/80 shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/70'
              }`}
            >
              Inspection Hub
            </button>
            <button
              onClick={() => onSelectTab('skin')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                currentTab === 'skin'
                  ? 'bg-rose-50 text-rose-700 border border-rose-200/80 shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/70'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-rose-600" />
              Skin Ingredients
            </button>
            <button
              onClick={() => onSelectTab('food')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                currentTab === 'food'
                  ? 'bg-rose-50 text-rose-700 border border-rose-200/80 shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/70'
              }`}
            >
              <Apple className="w-3.5 h-3.5 text-rose-600" />
              Food Ingredients
            </button>
            <button
              onClick={() => onSelectTab('dashboard')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                currentTab === 'dashboard'
                  ? 'bg-rose-50 text-rose-700 border border-rose-200/80 shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/70'
              }`}
            >
              <Activity className="w-3.5 h-3.5 text-rose-600" />
              Exposure Telemetry
            </button>
            <button
              onClick={() => onSelectTab('community')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                currentTab === 'community'
                  ? 'bg-rose-50 text-rose-700 border border-rose-200/80 shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/70'
              }`}
            >
              <Share2 className="w-3.5 h-3.5 text-rose-600" />
              Transparency Reports
            </button>
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-3">
            {/* In-Store Barcode trigger */}
            <button
              onClick={onOpenBarcodeModal}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white hover:bg-rose-50 text-neutral-800 border border-rose-200 hover:border-rose-300 text-xs font-semibold transition shadow-xs"
              title="Scan barcode in-store"
            >
              <Barcode className="w-4 h-4 text-rose-600" />
              <span className="hidden sm:inline">In-Store Barcode</span>
            </button>

            {/* Profile Menu */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-xl bg-white hover:bg-rose-50/50 border border-neutral-200 text-neutral-700 text-xs transition shadow-xs"
              >
                <div className="w-6 h-6 rounded-full bg-rose-100 text-rose-700 font-bold flex items-center justify-center text-[11px] border border-rose-200">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="font-semibold hidden sm:inline max-w-[100px] truncate text-neutral-800">
                  {user.name.split(' ')[0]}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-rose-100 shadow-xl p-3 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-3 py-2 border-b border-rose-50 mb-2">
                    <p className="text-xs font-bold text-neutral-900 truncate">{user.name}</p>
                    <p className="text-[11px] text-neutral-500 truncate">{user.email}</p>
                    <p className="text-[10px] text-neutral-400 mt-1">{user.phone}</p>
                    {user.skinType && (
                      <span className="inline-block mt-1.5 px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 text-[10px] font-semibold border border-rose-200">
                        {user.skinType}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1">
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        onSelectTab('dashboard');
                      }}
                      className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-neutral-700 hover:bg-rose-50 hover:text-rose-700 flex items-center gap-2 font-medium"
                    >
                      <Activity className="w-3.5 h-3.5 text-rose-600" />
                      View Exposure History
                    </button>
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        onSelectTab('community');
                      }}
                      className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-neutral-700 hover:bg-rose-50 hover:text-rose-700 flex items-center gap-2 font-medium"
                    >
                      <Share2 className="w-3.5 h-3.5 text-rose-600" />
                      Community Reports
                    </button>
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        onLogout();
                      }}
                      className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 pt-2 border-t border-neutral-100 font-semibold"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="flex md:hidden overflow-x-auto px-4 py-2 border-t border-rose-100 gap-2 bg-white">
        <button
          onClick={() => onSelectTab('home')}
          className={`px-3 py-1 rounded-lg text-xs whitespace-nowrap font-medium ${
            currentTab === 'home' ? 'bg-rose-50 text-rose-700 font-bold border border-rose-200' : 'text-neutral-500'
          }`}
        >
          Hub
        </button>
        <button
          onClick={() => onSelectTab('skin')}
          className={`px-3 py-1 rounded-lg text-xs whitespace-nowrap font-medium ${
            currentTab === 'skin' ? 'bg-rose-50 text-rose-700 font-bold border border-rose-200' : 'text-neutral-500'
          }`}
        >
          Skin Ingredients
        </button>
        <button
          onClick={() => onSelectTab('food')}
          className={`px-3 py-1 rounded-lg text-xs whitespace-nowrap font-medium ${
            currentTab === 'food' ? 'bg-rose-50 text-rose-700 font-bold border border-rose-200' : 'text-neutral-500'
          }`}
        >
          Food Ingredients
        </button>
        <button
          onClick={() => onSelectTab('dashboard')}
          className={`px-3 py-1 rounded-lg text-xs whitespace-nowrap font-medium ${
            currentTab === 'dashboard' ? 'bg-rose-50 text-rose-700 font-bold border border-rose-200' : 'text-neutral-500'
          }`}
        >
          Exposure Tracker
        </button>
        <button
          onClick={() => onSelectTab('community')}
          className={`px-3 py-1 rounded-lg text-xs whitespace-nowrap font-medium ${
            currentTab === 'community' ? 'bg-rose-50 text-rose-700 font-bold border border-rose-200' : 'text-neutral-500'
          }`}
        >
          Reports
        </button>
      </div>
    </header>
  );
};
