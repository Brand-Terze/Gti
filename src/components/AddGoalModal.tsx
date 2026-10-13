import React, { useState, useEffect } from 'react';
import { X, Clock, Plus, Target, Layers, GitBranch, Calendar } from 'lucide-react';
import { MainGoal } from '../types';

interface AddGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  goals: MainGoal[];
  defaultLevel?: 'main' | 'sub' | 'nested';
  defaultMainId?: string;
  defaultSubId?: string;
  onAddMainGoal: (title: string, dueTime?: string) => void;
  onAddSubGoal: (mainId: string, title: string, dueTime?: string) => void;
  onAddNestedGoal: (mainId: string, subId: string, title: string, dueTime?: string) => void;
}

export const AddGoalModal: React.FC<AddGoalModalProps> = ({
  isOpen,
  onClose,
  goals,
  defaultLevel = 'main',
  defaultMainId,
  defaultSubId,
  onAddMainGoal,
  onAddSubGoal,
  onAddNestedGoal,
}) => {
  const [level, setLevel] = useState<'main' | 'sub' | 'nested'>(defaultLevel);
  const [title, setTitle] = useState('');
  const [hasDueTime, setHasDueTime] = useState(false);
  const [dueTime, setDueTime] = useState('');
  const [selectedMainId, setSelectedMainId] = useState<string>('');
  const [selectedSubId, setSelectedSubId] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  // Sync state whenever modal opens or props change
  useEffect(() => {
    if (isOpen) {
      setLevel(defaultLevel);
      setTitle('');
      setHasDueTime(false);
      setDueTime('');
      setError(null);

      // Default selection if goals exist
      const initialMain = defaultMainId || (goals.length > 0 ? goals[0].id : '');
      setSelectedMainId(initialMain);

      const mainObj = goals.find((g) => g.id === initialMain);
      const initialSub = defaultSubId || (mainObj && mainObj.subGoals.length > 0 ? mainObj.subGoals[0].id : '');
      setSelectedSubId(initialSub);
    }
  }, [isOpen, defaultLevel, defaultMainId, defaultSubId, goals]);

  // When selectedMainId changes, update selectedSubId
  const handleMainChange = (mainId: string) => {
    setSelectedMainId(mainId);
    const mainObj = goals.find((g) => g.id === mainId);
    if (mainObj && mainObj.subGoals.length > 0) {
      setSelectedSubId(mainObj.subGoals[0].id);
    } else {
      setSelectedSubId('');
    }
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('يرجى إدخال عنوان الهدف');
      return;
    }

    const finalDueTime = hasDueTime && dueTime.trim() ? dueTime.trim() : undefined;

    if (level === 'main') {
      onAddMainGoal(title.trim(), finalDueTime);
      onClose();
    } else if (level === 'sub') {
      if (!selectedMainId) {
        setError('يرجى اختيار الهدف الرئيسي أولاً');
        return;
      }
      onAddSubGoal(selectedMainId, title.trim(), finalDueTime);
      onClose();
    } else if (level === 'nested') {
      if (!selectedMainId || !selectedSubId) {
        setError('يرجى اختيار الهدف الرئيسي والفرعي أولاً');
        return;
      }
      onAddNestedGoal(selectedMainId, selectedSubId, title.trim(), finalDueTime);
      onClose();
    }
  };

  const selectedMainObj = goals.find((g) => g.id === selectedMainId);
  const availableSubGoals = selectedMainObj ? selectedMainObj.subGoals : [];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-slate-900 border-t border-slate-800 rounded-t-3xl shadow-2xl p-5 pb-7 max-h-[88vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">إضافة هدف جديد</h3>
              <p className="text-[11px] text-slate-400">حدد مستوى الهدف ووقت الانتهاء (اختياري)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Level Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              اختر نوع الهدف
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setLevel('main')}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-medium transition-all ${
                  level === 'main'
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30'
                    : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-800'
                }`}
              >
                <Target className="w-4 h-4 mb-1" />
                <span>رئيسي</span>
              </button>

              <button
                type="button"
                disabled={goals.length === 0}
                onClick={() => {
                  if (goals.length > 0) setLevel('sub');
                }}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-medium transition-all ${
                  goals.length === 0
                    ? 'opacity-40 cursor-not-allowed bg-slate-800/40 border-slate-800 text-slate-500'
                    : level === 'sub'
                    ? 'bg-violet-600 text-white border-violet-500 shadow-md shadow-violet-600/30'
                    : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-800'
                }`}
              >
                <Layers className="w-4 h-4 mb-1" />
                <span>فرعي</span>
              </button>

              <button
                type="button"
                disabled={!goals.some((g) => g.subGoals.length > 0)}
                onClick={() => {
                  if (goals.some((g) => g.subGoals.length > 0)) setLevel('nested');
                }}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-medium transition-all ${
                  !goals.some((g) => g.subGoals.length > 0)
                    ? 'opacity-40 cursor-not-allowed bg-slate-800/40 border-slate-800 text-slate-500'
                    : level === 'nested'
                    ? 'bg-amber-600 text-white border-amber-500 shadow-md shadow-amber-600/30'
                    : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-800'
                }`}
              >
                <GitBranch className="w-4 h-4 mb-1" />
                <span>متفرع</span>
              </button>
            </div>
            {goals.length === 0 && (
              <p className="text-[10px] text-slate-400 mt-1.5">
                * ابدأ بإضافة هدف رئيسي أولاً لتتمكن من تفريعه لاحقاً.
              </p>
            )}
          </div>

          {/* Parent selectors if Sub or Nested */}
          {level === 'sub' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                اختر الهدف الرئيسي التابع له:
              </label>
              <select
                value={selectedMainId}
                onChange={(e) => handleMainChange(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                {goals.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          {level === 'nested' && (
            <div className="space-y-2">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  1. الهدف الرئيسي:
                </label>
                <select
                  value={selectedMainId}
                  onChange={(e) => handleMainChange(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  {goals.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  2. الهدف الفرعي المتفرع منه:
                </label>
                {availableSubGoals.length > 0 ? (
                  <select
                    value={selectedSubId}
                    onChange={(e) => setSelectedSubId(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    {availableSubGoals.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.title}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="text-[11px] text-amber-400 p-2 bg-amber-500/10 rounded-lg">
                    الهدف الرئيسي المختار لا يحتوي على أهداف فرعية بعد. يرجى اختيار هدف رئيسي آخر أو إضافة هدف فرعي أولاً.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Goal Title Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              عنوان الهدف:
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={
                level === 'main'
                  ? 'مثال: إنهاء مشروع التطبيق الذكي'
                  : level === 'sub'
                  ? 'مثال: تصميم شاشة تسجيل الدخول'
                  : 'مثال: كتابة كود التحقق من كلمة المرور'
              }
              className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              autoFocus
            />
          </div>

          {/* Optional Due Time Section */}
          <div className="pt-2 border-t border-slate-800/80">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>إضافة وقت انتهاء (اختياري)</span>
              </label>
              <input
                type="checkbox"
                id="dueTimeToggle"
                checked={hasDueTime}
                onChange={(e) => setHasDueTime(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 bg-slate-800 border-slate-700 focus:ring-0 cursor-pointer"
              />
            </div>

            {hasDueTime && (
              <div className="space-y-2 mt-2 p-3 bg-slate-800/50 rounded-xl border border-slate-700/60">
                <input
                  type="text"
                  value={dueTime}
                  onChange={(e) => setDueTime(e.target.value)}
                  placeholder="مثال: 05:00 م أو غداً 12:00 ظهراً"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />

                {/* Quick Due Time Presets */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {['اليوم 04:00 م', 'اليوم 08:00 م', 'قبل منتصف الليل', 'غداً صباحاً'].map((preset) => (
                    <button
                      type="button"
                      key={preset}
                      onClick={() => setDueTime(preset)}
                      className="px-2 py-1 text-[10px] rounded-md bg-slate-700/60 hover:bg-slate-700 text-slate-300 transition-colors"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-3">
            <button
              type="submit"
              className="flex-1 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/25 transition-all flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة الهدف الآن</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold rounded-xl border border-slate-700 transition-colors"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
