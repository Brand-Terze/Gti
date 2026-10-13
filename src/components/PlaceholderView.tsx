import React from 'react';
import {
  Backpack,
  Timer,
  Flame,
  FileText,
  Settings,
  History,
  User,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface PlaceholderViewProps {
  title: string;
  type: string;
  onBackToGoals: () => void;
}

export const PlaceholderView: React.FC<PlaceholderViewProps> = ({
  title,
  type,
  onBackToGoals,
}) => {
  const getIcon = () => {
    switch (type) {
      case 'bag':
        return <Backpack className="w-10 h-10 text-indigo-400" />;
      case 'timer':
        return <Timer className="w-10 h-10 text-amber-400" />;
      case 'habits':
        return <Flame className="w-10 h-10 text-rose-400" />;
      case 'notes':
        return <FileText className="w-10 h-10 text-emerald-400" />;
      case 'settings':
        return <Settings className="w-10 h-10 text-blue-400" />;
      case 'history':
        return <History className="w-10 h-10 text-purple-400" />;
      case 'profile':
        return <User className="w-10 h-10 text-cyan-400" />;
      default:
        return <Sparkles className="w-10 h-10 text-indigo-400" />;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 py-8 text-center animate-in fade-in duration-200">
      <div className="w-20 h-20 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-4 shadow-xl shadow-slate-950/40">
        {getIcon()}
      </div>

      <h2 className="text-lg font-bold text-white mb-2">{title}</h2>

      <p className="text-xs text-slate-400 max-w-xs leading-relaxed mb-6">
        هذا القسم جاهز ومبرمج في الهيكل، وهو فارغ حالياً حسب طلبك. سنقوم ببرمجة محتواه وتفعيله في الخطوات القادمة فور رغبتك.
      </p>

      <button
        onClick={onBackToGoals}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all"
      >
        <span>العودة إلى شاشة الأهداف</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};
