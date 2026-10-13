import React from 'react';
import { Target, CheckCircle2, Clock } from 'lucide-react';
import { MainGoal } from '../types';

interface DailyProgressCircleProps {
  goals: MainGoal[];
}

export const DailyProgressCircle: React.FC<DailyProgressCircleProps> = ({ goals }) => {
  // Calculate total items and completed items across all levels
  let totalItems = 0;
  let completedItems = 0;

  goals.forEach((main) => {
    totalItems += 1;
    if (main.completed) completedItems += 1;

    main.subGoals.forEach((sub) => {
      totalItems += 1;
      if (sub.completed) completedItems += 1;

      sub.nestedGoals.forEach((nested) => {
        totalItems += 1;
        if (nested.completed) completedItems += 1;
      });
    });
  });

  const percentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  // SVG circular progress calculation
  const radius = 64;
  const strokeWidth = 10;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Motivational message
  const getMotivation = () => {
    if (totalItems === 0) return 'أضف هدفك الأول لتبدأ رحلة إنجاز اليوم';
    if (percentage === 0) return 'ابدأ يومك بنشاط وأنجز أول خطوة!';
    if (percentage < 50) return 'بداية طيبة، استمر في التقدم!';
    if (percentage < 80) return 'تجاوزت النصف بنجاح، اقتربت!';
    if (percentage < 100) return 'أداء استثنائي! خطوات معدودة للختام';
    return 'ما شاء الله! أنجزت كل أهدافك اليوم بنجاح 🌟';
  };

  return (
    <div className="bg-gradient-to-b from-slate-900 to-slate-900/90 rounded-3xl p-5 border border-slate-800 shadow-xl shadow-slate-950/40 relative overflow-hidden">
      {/* Subtle ambient background glow */}
      <div className="absolute top-0 right-1/4 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-col items-center text-center">
        <div className="flex items-center gap-2 text-xs font-medium text-indigo-400 mb-3 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
          <Target className="w-3.5 h-3.5" />
          <span>نسبة إنجاز اليوم</span>
        </div>

        {/* Circular Progress Ring */}
        <div className="relative w-36 h-36 flex items-center justify-center my-1">
          <svg className="w-full h-full -rotate-90" viewBox={`0 0 ${radius * 2} ${radius * 2}`}>
            {/* Background Track */}
            <circle
              stroke="currentColor"
              fill="transparent"
              strokeWidth={strokeWidth}
              r={normalizedRadius}
              cx={radius}
              cy={radius}
              className="text-slate-800"
            />
            {/* Progress Stroke */}
            <circle
              stroke="url(#progressGradient)"
              fill="transparent"
              strokeWidth={strokeWidth}
              strokeDasharray={`${circumference} ${circumference}`}
              style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.6s ease' }}
              strokeLinecap="round"
              r={normalizedRadius}
              cx={radius}
              cy={radius}
            />
            {/* SVG Gradient definition */}
            <defs>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
            </defs>
          </svg>

          {/* Centered Text */}
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-3xl font-extrabold text-white font-sans tabular-nums tracking-tight">
              {percentage}%
            </span>
            <span className="text-[11px] text-slate-400 font-medium mt-0.5">
              مكتمل
            </span>
          </div>
        </div>

        {/* Motivational text */}
        <p className="text-sm font-semibold text-slate-200 mt-2 max-w-xs leading-relaxed">
          {getMotivation()}
        </p>

        {/* Quick summary stats */}
        <div className="grid grid-cols-3 gap-2 w-full mt-4 pt-4 border-t border-slate-800/80">
          <div className="flex flex-col items-center p-2 rounded-2xl bg-slate-800/40">
            <span className="text-xs text-slate-400">الإجمالي</span>
            <span className="text-sm font-bold text-white font-sans tabular-nums mt-0.5">
              {totalItems}
            </span>
          </div>
          <div className="flex flex-col items-center p-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
            <span className="text-xs text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              المنجز
            </span>
            <span className="text-sm font-bold text-emerald-300 font-sans tabular-nums mt-0.5">
              {completedItems}
            </span>
          </div>
          <div className="flex flex-col items-center p-2 rounded-2xl bg-amber-500/10 border border-amber-500/20">
            <span className="text-xs text-amber-400 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              المتبقي
            </span>
            <span className="text-sm font-bold text-amber-300 font-sans tabular-nums mt-0.5">
              {Math.max(0, totalItems - completedItems)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
