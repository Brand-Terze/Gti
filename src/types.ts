export interface NestedSubGoal {
  id: string;
  title: string;
  completed: boolean;
  dueTime?: string;
  createdAt: number;
}

export interface SubGoal {
  id: string;
  title: string;
  completed: boolean;
  dueTime?: string;
  nestedGoals: NestedSubGoal[];
  createdAt: number;
  isExpanded?: boolean;
}

export interface MainGoal {
  id: string;
  title: string;
  completed: boolean;
  dueTime?: string;
  subGoals: SubGoal[];
  createdAt: number;
  category?: string;
  isExpanded?: boolean;
}

export type TabType = 'goals' | 'bag';

export type MenuItemId =
  | 'timer'
  | 'habits'
  | 'notes'
  | 'settings'
  | 'history'
  | 'profile';

export interface MenuItem {
  id: MenuItemId;
  title: string;
  description: string;
  iconName: string;
}
