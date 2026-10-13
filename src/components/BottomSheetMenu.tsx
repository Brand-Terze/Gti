import React from 'react';
import {
  Timer,
  Flame,
  FileText,
  Settings,
  History,
  User,
  X,
  ChevronLeft,
} from 'lucide-react';
import { MenuItemId } from '../types';

interface BottomSheetMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMenuItem: (id: MenuItemId, title: string) => void;
}

interface MenuButtonConfig {
  id: MenuItemId;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  gradient: string;
}

export const BottomSheetMenu: React.FC<BottomSheetMenuProps> = ({
  isOpen,
  onClose,
  onSelectMenuItem,
}) => {
  if (!isOpen) return null;

  const menuItems: MenuButtonConfig[] = [
    {
      id: 'timer',
      title: 'المؤقت',
      subtitle: 'بومودورو والتركيز',
      icon: <Timer className="w-5 h-5" />,
      gradient: 'from-amber-500/20 to-orange-500/10 text-amber-400 border-amber-500/30',
    },
    {
      id: 'habits',
      title: 'العادات',
      subtitle: 'بناء ومتابعة العادات',
      icon: <Flame className="w-5 h-5" />,
      gradient: 'from-rose-500/20 to-pink-500/10 text-rose-400 border-rose-500/30',
    },
    {
      id: 'notes',
      title: 'مذكرة',
      subtitle: 'تدوين الخواطر والملاحظات',
      icon: <FileText className="w-5 h-5" />,
      gradient: 'from-emerald-500/20 to-teal-500/10 text-emerald-400 border-emerald-500/30',
    },
    {
      id: 'settings',
      title: 'الإعدادات',
      subtitle: 'تخصيص التطبيق والتنبيهات',
      icon: <Settings className="w-5 h-5" />,
      gradient: 'from-blue-500/20 to-indigo-500/10 text-blue-400 border-blue-500/30',
    },
    {
      id: 'history',
      title: 'سجل',
      subtitle: 'أرشيف الإنجازات السابقة',
      icon: <History className="w-5 h-5" />,
      gradient: 'from-purple-500/20 to-violet-500/10 text-purple-400 border-purple-500/30',
    },
    {
      id: 'profile',
      title: 'حسابي',
      subtitle: 'البيانات الشخصية والإحصائيات',
      icon: <User className="w-5 h-5" />,
      gradient: 'from-cyan-500/20 to-sky-500/10 text-cyan-400 border-cyan-500/30',
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-slate-900 border-t border-slate-800 rounded-t-3xl shadow-2xl p-5 pb-8 animate-in slide-in-from-bottom duration-300 max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Drag Handle */}
        <div className="w-12 h-1.5 bg-slate-700/80 rounded-full mx-auto mb-3" />

        {/* Sheet Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white">القائمة السريعة</h3>
            <p className="text-[11px] text-slate-400">اختر من الأدوات المتاحة أدناه</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 6 Buttons Grid */}
        <div className="grid grid-cols-2 gap-3">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onSelectMenuItem(item.id, item.title)}
              className="flex items-center gap-3 p-3 rounded-2xl bg-slate-800/70 hover:bg-slate-800 border border-slate-700/80 transition-all duration-200 active:scale-[0.98] group text-right"
            >
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center border shadow-sm ${item.gradient} group-hover:scale-105 transition-transform shrink-0`}
              >
                {item.icon}
              </div>
              <div className="flex-1 min-w-0">
                <span className="block text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">
                  {item.title}
                </span>
                <span className="block text-[10px] text-slate-400 truncate mt-0.5">
                  {item.subtitle}
                </span>
              </div>
              <ChevronLeft className="w-4 h-4 text-slate-500 group-hover:text-slate-300 transition-colors shrink-0" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
