import React from 'react';
import { Smartphone, CheckCircle2 } from 'lucide-react';

interface HeaderProps {
  activeTabTitle: string;
}

export const Header: React.FC<HeaderProps> = ({ activeTabTitle }) => {
  // Format Arabic current date
  const now = new Date();
  const dateStr = now.toLocaleDateString('ar-EG', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-4 pt-2 pb-2.5 select-none shrink-0">
      {/* Android Status Bar with Punch Hole */}
      <div className="relative flex items-center justify-between text-[11px] text-slate-400 font-sans tracking-wide pb-1.5 mb-1.5 border-b border-slate-800/60">
        {/* Left: Clock */}
        <div className="flex items-center gap-1.5 font-medium text-slate-300">
          <span>{now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}</span>
        </div>

        {/* Center: Punch Hole Camera */}
        <div className="absolute left-1/2 -translate-x-1/2 top-0 flex items-center justify-center">
          <div className="w-3.5 h-3.5 rounded-full bg-black border border-slate-800 shadow-inner flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-slate-950/80" />
          </div>
        </div>

        {/* Right: Network & Battery */}
        <div className="flex items-center gap-1.5 text-[10px] text-slate-300">
          <span>5G</span>
          <span>98%</span>
          <div className="w-4 h-2 rounded-[2px] border border-slate-400 p-[1px] flex items-center">
            <div className="w-full h-full bg-emerald-400 rounded-[1px]" />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
              مساري
              <span className="text-[11px] font-normal text-indigo-400">· {activeTabTitle}</span>
            </h1>
            <p className="text-[10px] text-slate-400">{dateStr}</p>
          </div>
        </div>
      </div>
    </header>
  );
};
