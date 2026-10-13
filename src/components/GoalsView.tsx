import React from 'react';
import {
  CheckCircle2,
  Circle,
  Clock,
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
  CornerDownLeft,
  ListTodo,
} from 'lucide-react';
import { MainGoal, SubGoal, NestedSubGoal } from '../types';

interface GoalsViewProps {
  goals: MainGoal[];
  onToggleMainGoal: (goalId: string) => void;
  onToggleSubGoal: (mainId: string, subId: string) => void;
  onToggleNestedGoal: (mainId: string, subId: string, nestedId: string) => void;
  onDeleteMainGoal: (goalId: string) => void;
  onDeleteSubGoal: (mainId: string, subId: string) => void;
  onDeleteNestedGoal: (mainId: string, subId: string, nestedId: string) => void;
  onToggleExpandMain: (goalId: string) => void;
  onToggleExpandSub: (mainId: string, subId: string) => void;
  onOpenAddModal: (level: 'main' | 'sub' | 'nested', parentMainId?: string, parentSubId?: string) => void;
}

export const GoalsView: React.FC<GoalsViewProps> = ({
  goals,
  onToggleMainGoal,
  onToggleSubGoal,
  onToggleNestedGoal,
  onDeleteMainGoal,
  onDeleteSubGoal,
  onDeleteNestedGoal,
  onToggleExpandMain,
  onToggleExpandSub,
  onOpenAddModal,
}) => {
  if (goals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center rounded-3xl border border-dashed border-slate-800 bg-slate-900/40">
        <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-3">
          <ListTodo className="w-8 h-8" />
        </div>
        <h3 className="text-base font-bold text-white mb-1">لا توجد أهداف مضافة بعد</h3>
        <p className="text-xs text-slate-400 max-w-xs mb-4">
          اضغط على زر الإضافة (+) بالأسفل لإضافة أول هدف رئيسي، ويمكنك تفريع مهام فرعية ومتفرعة منه بحرية.
        </p>
        <button
          onClick={() => onOpenAddModal('main')}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-md transition-transform active:scale-95"
        >
          <Plus className="w-4 h-4" />
          إضافة هدف رئيسي
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3 pb-24">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-sm font-bold text-slate-300 flex items-center gap-2">
          <span>قائمة الأهداف</span>
          <span className="text-[11px] font-normal text-slate-400 font-sans tabular-nums">
            ({goals.length} رئيسي)
          </span>
        </h2>
        <span className="text-[11px] text-indigo-400">
          رئيسية · فرعية · متفرعة
        </span>
      </div>

      <div className="space-y-3">
        {goals.map((main) => {
          const isExpanded = main.isExpanded !== false;
          const totalSub = main.subGoals.length;
          const completedSub = main.subGoals.filter((s) => s.completed).length;

          return (
            <div
              key={main.id}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                main.completed
                  ? 'bg-slate-900/60 border-slate-800/80 opacity-80'
                  : 'bg-slate-900 border-slate-800 shadow-md shadow-slate-950/20 hover:border-slate-700'
              }`}
            >
              {/* Main Goal Row */}
              <div className="p-3.5 flex items-start gap-3">
                {/* Checkbox */}
                <button
                  onClick={() => onToggleMainGoal(main.id)}
                  className="mt-0.5 text-slate-400 hover:text-indigo-400 transition-colors shrink-0"
                  aria-label={main.completed ? 'تعيين كغير مكتمل' : 'تعيين كمكتمل'}
                >
                  {main.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-500/20" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-500 hover:text-indigo-400" />
                  )}
                </button>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/20">
                      رئيسي
                    </span>
                    <span
                      className={`text-sm font-semibold break-words ${
                        main.completed ? 'line-through text-slate-400' : 'text-white'
                      }`}
                    >
                      {main.title}
                    </span>
                  </div>

                  {/* Due Time & Stats */}
                  <div className="flex items-center gap-3 mt-1.5 text-[11px] text-slate-400 flex-wrap">
                    {main.dueTime && (
                      <span className="flex items-center gap-1 text-amber-400 font-sans">
                        <Clock className="w-3 h-3" />
                        <span>ينتهي: {main.dueTime}</span>
                      </span>
                    )}

                    {totalSub > 0 && (
                      <span className="text-slate-400 font-sans tabular-nums">
                        {completedSub}/{totalSub} فرعي مكتمل
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  {/* Quick Add Sub Goal */}
                  <button
                    onClick={() => onOpenAddModal('sub', main.id)}
                    title="إضافة هدف فرعي لهذا الهدف"
                    className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>

                  {/* Expand / Collapse Subgoals */}
                  {totalSub > 0 && (
                    <button
                      onClick={() => onToggleExpandMain(main.id)}
                      title={isExpanded ? 'طي الأهداف الفرعية' : 'عرض الأهداف الفرعية'}
                      className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  )}

                  {/* Delete Main Goal */}
                  <button
                    onClick={() => onDeleteMainGoal(main.id)}
                    title="حذف الهدف الرئيسي"
                    className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Sub-goals container */}
              {isExpanded && totalSub > 0 && (
                <div className="border-t border-slate-800/80 bg-slate-950/40 p-2 pr-4 pl-3 space-y-2">
                  {main.subGoals.map((sub) => {
                    const isSubExpanded = sub.isExpanded !== false;
                    const totalNested = sub.nestedGoals.length;
                    const completedNested = sub.nestedGoals.filter((n) => n.completed).length;

                    return (
                      <div
                        key={sub.id}
                        className={`rounded-xl border transition-all ${
                          sub.completed
                            ? 'bg-slate-900/40 border-slate-800/60 opacity-85'
                            : 'bg-slate-900/80 border-slate-800/80'
                        }`}
                      >
                        {/* Sub Goal Row */}
                        <div className="p-2.5 flex items-start gap-2.5">
                          <button
                            onClick={() => onToggleSubGoal(main.id, sub.id)}
                            className="mt-0.5 text-slate-400 hover:text-indigo-400 transition-colors shrink-0"
                            aria-label={sub.completed ? 'تعيين كغير مكتمل' : 'تعيين كمكتمل'}
                          >
                            {sub.completed ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 fill-emerald-500/20" />
                            ) : (
                              <Circle className="w-4 h-4 text-slate-500 hover:text-indigo-400" />
                            )}
                          </button>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-[9px] font-bold text-violet-400 bg-violet-500/10 px-1.5 py-0.5 rounded border border-violet-500/20">
                                فرعي
                              </span>
                              <span
                                className={`text-xs font-medium break-words ${
                                  sub.completed ? 'line-through text-slate-400' : 'text-slate-200'
                                }`}
                              >
                                {sub.title}
                              </span>
                            </div>

                            <div className="flex items-center gap-3 mt-1 text-[10px] text-slate-400 flex-wrap">
                              {sub.dueTime && (
                                <span className="flex items-center gap-1 text-amber-400 font-sans">
                                  <Clock className="w-2.5 h-2.5" />
                                  <span>ينتهي: {sub.dueTime}</span>
                                </span>
                              )}
                              {totalNested > 0 && (
                                <span className="text-slate-400 font-sans tabular-nums">
                                  {completedNested}/{totalNested} متفرع مكتمل
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            {/* Quick Add Nested Goal */}
                            <button
                              onClick={() => onOpenAddModal('nested', main.id, sub.id)}
                              title="إضافة هدف متفرع من هذا الفرعي"
                              className="p-1 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded transition-colors"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>

                            {/* Expand Nested */}
                            {totalNested > 0 && (
                              <button
                                onClick={() => onToggleExpandSub(main.id, sub.id)}
                                title={isSubExpanded ? 'طي الأهداف المتفرعة' : 'عرض الأهداف المتفرعة'}
                                className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
                              >
                                {isSubExpanded ? (
                                  <ChevronUp className="w-3.5 h-3.5" />
                                ) : (
                                  <ChevronDown className="w-3.5 h-3.5" />
                                )}
                              </button>
                            )}

                            {/* Delete Sub Goal */}
                            <button
                              onClick={() => onDeleteSubGoal(main.id, sub.id)}
                              title="حذف الهدف الفرعي"
                              className="p-1 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Nested Sub-Goals container */}
                        {isSubExpanded && totalNested > 0 && (
                          <div className="border-t border-slate-800/60 bg-slate-950/60 p-2 pr-3 pl-2 space-y-1.5">
                            {sub.nestedGoals.map((nested) => (
                              <div
                                key={nested.id}
                                className={`flex items-start gap-2 p-1.5 rounded-lg border transition-all ${
                                  nested.completed
                                    ? 'bg-slate-900/30 border-slate-800/40 opacity-80'
                                    : 'bg-slate-900/60 border-slate-800/60'
                                }`}
                              >
                                <button
                                  onClick={() => onToggleNestedGoal(main.id, sub.id, nested.id)}
                                  className="mt-0.5 text-slate-400 hover:text-indigo-400 transition-colors shrink-0"
                                  aria-label={nested.completed ? 'تعيين كغير مكتمل' : 'تعيين كمكتمل'}
                                >
                                  {nested.completed ? (
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                  ) : (
                                    <Circle className="w-3.5 h-3.5 text-slate-500 hover:text-indigo-400" />
                                  )}
                                </button>

                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <span className="text-[8px] font-bold text-amber-400 bg-amber-500/10 px-1 py-0.2 rounded border border-amber-500/20">
                                      متفرع
                                    </span>
                                    <span
                                      className={`text-[11px] break-words ${
                                        nested.completed
                                          ? 'line-through text-slate-400'
                                          : 'text-slate-300'
                                      }`}
                                    >
                                      {nested.title}
                                    </span>
                                  </div>

                                  {nested.dueTime && (
                                    <div className="flex items-center gap-1 mt-0.5 text-[9px] text-amber-400 font-sans">
                                      <Clock className="w-2.5 h-2.5" />
                                      <span>ينتهي: {nested.dueTime}</span>
                                    </div>
                                  )}
                                </div>

                                <button
                                  onClick={() => onDeleteNestedGoal(main.id, sub.id, nested.id)}
                                  title="حذف الهدف المتفرع"
                                  className="p-1 text-slate-400 hover:text-rose-400 rounded transition-colors shrink-0"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
