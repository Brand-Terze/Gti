import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { DailyProgressCircle } from './components/DailyProgressCircle';
import { GoalsView } from './components/GoalsView';
import { AddGoalModal } from './components/AddGoalModal';
import { BottomNav } from './components/BottomNav';
import { BottomSheetMenu } from './components/BottomSheetMenu';
import { PlaceholderView } from './components/PlaceholderView';
import { MainGoal, TabType, MenuItemId } from './types';

const STORAGE_KEY = 'masari_goals_v1';

const sampleInitialGoals: MainGoal[] = [
  {
    id: 'goal-1',
    title: 'تطوير تطبيق مساري للأندرويد',
    completed: false,
    dueTime: 'اليوم 09:00 م',
    createdAt: Date.now() - 100000,
    isExpanded: true,
    subGoals: [
      {
        id: 'sub-1',
        title: 'برمجة شاشة الأزرار السفلية والقائمة',
        completed: true,
        dueTime: '02:00 م',
        createdAt: Date.now() - 80000,
        isExpanded: true,
        nestedGoals: [
          {
            id: 'nested-1',
            title: 'إضافة نافذة القائمة النصفية السفلية',
            completed: true,
            dueTime: '01:30 م',
            createdAt: Date.now() - 70000,
          },
        ],
      },
      {
        id: 'sub-2',
        title: 'برمجة شجرة الأهداف (رئيسية، فرعية، متفرعة)',
        completed: false,
        dueTime: '06:00 م',
        createdAt: Date.now() - 60000,
        isExpanded: true,
        nestedGoals: [
          {
            id: 'nested-2',
            title: 'دائرة حساب نسبة الإنجاز اليومية التفاعلية',
            completed: true,
            dueTime: '04:00 م',
            createdAt: Date.now() - 50000,
          },
          {
            id: 'nested-3',
            title: 'زر الإضافة العائم الكبير في منتصف الشاشة (+)',
            completed: false,
            dueTime: '05:30 م',
            createdAt: Date.now() - 40000,
          },
        ],
      },
    ],
  },
  {
    id: 'goal-2',
    title: 'ممارسة الرياضة والاهتمام بالصحة',
    completed: false,
    dueTime: 'اليوم 10:30 م',
    createdAt: Date.now() - 30000,
    isExpanded: true,
    subGoals: [
      {
        id: 'sub-3',
        title: 'المشي وتمارين اللياقة 45 دقيقة',
        completed: true,
        dueTime: '07:00 م',
        createdAt: Date.now() - 20000,
        nestedGoals: [],
      },
      {
        id: 'sub-4',
        title: 'شرب 3 لتر ماء على مدار اليوم',
        completed: false,
        dueTime: 'قبل النوم',
        createdAt: Date.now() - 10000,
        nestedGoals: [],
      },
    ],
  },
];

export default function App() {
  const [goals, setGoals] = useState<MainGoal[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback to sample
    }
    return sampleInitialGoals;
  });

  const [activeTab, setActiveTab] = useState<TabType>('goals');
  const [activeMenuItem, setActiveMenuItem] = useState<{ id: MenuItemId; title: string } | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isMobileFrame, setIsMobileFrame] = useState(true);

  const [addModalConfig, setAddModalConfig] = useState<{
    level: 'main' | 'sub' | 'nested';
    parentMainId?: string;
    parentSubId?: string;
  }>({
    level: 'main',
  });

  // Save to localStorage whenever goals change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
    } catch {
      // ignore
    }
  }, [goals]);

  // Toggle handlers
  const handleToggleMainGoal = (goalId: string) => {
    setGoals((prev) =>
      prev.map((main) => {
        if (main.id !== goalId) return main;
        const newCompleted = !main.completed;
        return {
          ...main,
          completed: newCompleted,
          // When completing a main goal, auto-complete children if toggled on
          subGoals: newCompleted
            ? main.subGoals.map((sub) => ({
                ...sub,
                completed: true,
                nestedGoals: sub.nestedGoals.map((n) => ({ ...n, completed: true })),
              }))
            : main.subGoals,
        };
      })
    );
  };

  const handleToggleSubGoal = (mainId: string, subId: string) => {
    setGoals((prev) =>
      prev.map((main) => {
        if (main.id !== mainId) return main;
        const updatedSubs = main.subGoals.map((sub) => {
          if (sub.id !== subId) return sub;
          const newCompleted = !sub.completed;
          return {
            ...sub,
            completed: newCompleted,
            nestedGoals: newCompleted
              ? sub.nestedGoals.map((n) => ({ ...n, completed: true }))
              : sub.nestedGoals,
          };
        });

        // If all subgoals are completed, mark main as completed
        const allCompleted = updatedSubs.length > 0 && updatedSubs.every((s) => s.completed);
        return {
          ...main,
          completed: allCompleted ? true : main.completed,
          subGoals: updatedSubs,
        };
      })
    );
  };

  const handleToggleNestedGoal = (mainId: string, subId: string, nestedId: string) => {
    setGoals((prev) =>
      prev.map((main) => {
        if (main.id !== mainId) return main;
        const updatedSubs = main.subGoals.map((sub) => {
          if (sub.id !== subId) return sub;
          const updatedNested = sub.nestedGoals.map((n) =>
            n.id === nestedId ? { ...n, completed: !n.completed } : n
          );
          const allNestedDone = updatedNested.length > 0 && updatedNested.every((n) => n.completed);
          return {
            ...sub,
            completed: allNestedDone ? true : sub.completed,
            nestedGoals: updatedNested,
          };
        });
        return {
          ...main,
          subGoals: updatedSubs,
        };
      })
    );
  };

  // Delete handlers
  const handleDeleteMainGoal = (goalId: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== goalId));
  };

  const handleDeleteSubGoal = (mainId: string, subId: string) => {
    setGoals((prev) =>
      prev.map((main) => {
        if (main.id !== mainId) return main;
        return {
          ...main,
          subGoals: main.subGoals.filter((s) => s.id !== subId),
        };
      })
    );
  };

  const handleDeleteNestedGoal = (mainId: string, subId: string, nestedId: string) => {
    setGoals((prev) =>
      prev.map((main) => {
        if (main.id !== mainId) return main;
        return {
          ...main,
          subGoals: main.subGoals.map((sub) => {
            if (sub.id !== subId) return sub;
            return {
              ...sub,
              nestedGoals: sub.nestedGoals.filter((n) => n.id !== nestedId),
            };
          }),
        };
      })
    );
  };

  // Expand / collapse handlers
  const handleToggleExpandMain = (goalId: string) => {
    setGoals((prev) =>
      prev.map((main) =>
        main.id === goalId ? { ...main, isExpanded: main.isExpanded === false ? true : false } : main
      )
    );
  };

  const handleToggleExpandSub = (mainId: string, subId: string) => {
    setGoals((prev) =>
      prev.map((main) => {
        if (main.id !== mainId) return main;
        return {
          ...main,
          subGoals: main.subGoals.map((sub) =>
            sub.id === subId ? { ...sub, isExpanded: sub.isExpanded === false ? true : false } : sub
          ),
        };
      })
    );
  };

  // Add handlers
  const handleAddMainGoal = (title: string, dueTime?: string) => {
    const newGoal: MainGoal = {
      id: `goal-${Date.now()}`,
      title,
      completed: false,
      dueTime,
      subGoals: [],
      createdAt: Date.now(),
      isExpanded: true,
    };
    setGoals((prev) => [newGoal, ...prev]);
  };

  const handleAddSubGoal = (mainId: string, title: string, dueTime?: string) => {
    const newSub: {
      id: string;
      title: string;
      completed: boolean;
      dueTime?: string;
      nestedGoals: [];
      createdAt: number;
      isExpanded: boolean;
    } = {
      id: `sub-${Date.now()}`,
      title,
      completed: false,
      dueTime,
      nestedGoals: [],
      createdAt: Date.now(),
      isExpanded: true,
    };

    setGoals((prev) =>
      prev.map((main) => {
        if (main.id !== mainId) return main;
        return {
          ...main,
          isExpanded: true,
          subGoals: [...main.subGoals, newSub],
        };
      })
    );
  };

  const handleAddNestedGoal = (mainId: string, subId: string, title: string, dueTime?: string) => {
    const newNested = {
      id: `nested-${Date.now()}`,
      title,
      completed: false,
      dueTime,
      createdAt: Date.now(),
    };

    setGoals((prev) =>
      prev.map((main) => {
        if (main.id !== mainId) return main;
        return {
          ...main,
          isExpanded: true,
          subGoals: main.subGoals.map((sub) => {
            if (sub.id !== subId) return sub;
            return {
              ...sub,
              isExpanded: true,
              nestedGoals: [...sub.nestedGoals, newNested],
            };
          }),
        };
      })
    );
  };

  const openAddModal = (level: 'main' | 'sub' | 'nested', parentMainId?: string, parentSubId?: string) => {
    setAddModalConfig({ level, parentMainId, parentSubId });
    setIsAddModalOpen(true);
  };

  const handleSelectTab = (tab: TabType) => {
    setActiveTab(tab);
    setActiveMenuItem(null);
    setIsMenuOpen(false);
  };

  const handleSelectMenuItem = (id: MenuItemId, title: string) => {
    setActiveMenuItem({ id, title });
    setIsMenuOpen(false);
  };

  const getActiveTitle = () => {
    if (activeMenuItem) return activeMenuItem.title;
    if (activeTab === 'bag') return 'الشنطة';
    return 'الأهداف';
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex justify-center selection:bg-indigo-500 selection:text-white">
      {/* Native Mobile App Container */}
      <div className="w-full max-w-md min-h-screen bg-slate-950 flex flex-col relative shadow-2xl border-x border-slate-900">
        {/* Android Native Header */}
        <Header activeTabTitle={getActiveTitle()} />

        {/* Scrollable Content Area */}
        <main className="flex-1 px-4 py-3 pb-28">
          {activeMenuItem ? (
            <PlaceholderView
              title={activeMenuItem.title}
              type={activeMenuItem.id}
              onBackToGoals={() => {
                setActiveMenuItem(null);
                setActiveTab('goals');
              }}
            />
          ) : activeTab === 'bag' ? (
            <PlaceholderView
              title="الشنطة"
              type="bag"
              onBackToGoals={() => setActiveTab('goals')}
            />
          ) : (
            <div className="space-y-4">
              {/* 1. Daily Progress Circle */}
              <DailyProgressCircle goals={goals} />

              {/* 2. Hierarchical Goals List */}
              <GoalsView
                goals={goals}
                onToggleMainGoal={handleToggleMainGoal}
                onToggleSubGoal={handleToggleSubGoal}
                onToggleNestedGoal={handleToggleNestedGoal}
                onDeleteMainGoal={handleDeleteMainGoal}
                onDeleteSubGoal={handleDeleteSubGoal}
                onDeleteNestedGoal={handleDeleteNestedGoal}
                onToggleExpandMain={handleToggleExpandMain}
                onToggleExpandSub={handleToggleExpandSub}
                onOpenAddModal={openAddModal}
              />
            </div>
          )}
        </main>

        {/* Bottom Navigation with Big Centered Plus FAB (+) */}
        <BottomNav
          activeTab={activeTab}
          onSelectTab={handleSelectTab}
          onOpenMenuSheet={() => setIsMenuOpen(true)}
          onOpenAddModal={() => openAddModal('main')}
          isMenuOpen={isMenuOpen}
        />

        {/* Half-Screen Bottom Sheet Menu */}
        <BottomSheetMenu
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          onSelectMenuItem={handleSelectMenuItem}
        />

        {/* Add Goal Modal */}
        <AddGoalModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          goals={goals}
          defaultLevel={addModalConfig.level}
          defaultMainId={addModalConfig.parentMainId}
          defaultSubId={addModalConfig.parentSubId}
          onAddMainGoal={handleAddMainGoal}
          onAddSubGoal={handleAddSubGoal}
          onAddNestedGoal={handleAddNestedGoal}
        />
      </div>
    </div>
  );
}
