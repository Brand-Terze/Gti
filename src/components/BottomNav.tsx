import React from 'react';
import { Target, Backpack, Menu, Plus } from 'lucide-react';
import { TabType } from '../types';

interface BottomNavProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  onOpenMenuSheet: () => void;
  onOpenAddModal: () => void;
  isMenuOpen: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  onOpenMenuSheet,
  onOpenAddModal,
  isMenuOpen,
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 max-w-md mx-auto pointer-events-none select-none">
      {/* Floating Big Add Button (+) centered directly above the bottom bar */}
      <div className="relative flex justify-center -mb-6 z-50 pointer-events-auto">
        <button
          onClick={onOpenAddModal}
          title="إضافة هدف جديد"
          className="w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 text-white flex items-center justify-center shadow-xl shadow-indigo-600/40 border-4 border-slate-950 active:scale-90 hover:scale-105 transition-all duration-200 group"
          aria-label="إضافة هدف جديد"
        >
          <Plus className="w-6 h-6 stroke-[2.5] group-hover:rotate-90 transition-transform duration-300" />
        </button>
      </div>

      {/* Main Bottom Bar */}
      <nav className="pointer-events-auto bg-slate-900/95 backdrop-blur-xl border-t border-slate-800/90 shadow-2xl px-5 pt-2 pb-3">
        <div className="grid grid-cols-3 items-center">
          {/* Button 1: الأهداف */}
          <button
            onClick={() => onSelectTab('goals')}
            className={`flex flex-col items-center justify-center py-1 transition-colors ${
              activeTab === 'goals' && !isMenuOpen
                ? 'text-indigo-400 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Target className="w-5 h-5 mb-1 stroke-[2.2]" />
            <span className="text-[11px] leading-tight">الأهداف</span>
            {activeTab === 'goals' && !isMenuOpen && (
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-0.5" />
            )}
          </button>

          {/* Spacer for Center FAB */}
          <div className="flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[10px] text-slate-500 mt-5 font-medium">إضافة</span>
          </div>

          {/* Right Group: الشنطة & القائمة */}
          <div className="grid grid-cols-2 gap-1">
            {/* Button 2: الشنطة */}
            <button
              onClick={() => onSelectTab('bag')}
              className={`flex flex-col items-center justify-center py-1 transition-colors ${
                activeTab === 'bag' && !isMenuOpen
                  ? 'text-indigo-400 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Backpack className="w-5 h-5 mb-1 stroke-[2.2]" />
              <span className="text-[11px] leading-tight">الشنطة</span>
              {activeTab === 'bag' && !isMenuOpen && (
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-0.5" />
              )}
            </button>

            {/* Button 3: القائمة (Opens bottom sheet) */}
            <button
              onClick={onOpenMenuSheet}
              className={`flex flex-col items-center justify-center py-1 transition-colors ${
                isMenuOpen ? 'text-indigo-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Menu className="w-5 h-5 mb-1 stroke-[2.2]" />
              <span className="text-[11px] leading-tight">القائمة</span>
              {isMenuOpen && (
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-0.5" />
              )}
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
};
