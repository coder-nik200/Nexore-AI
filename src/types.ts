export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'inprogress' | 'review' | 'done';
  category: string;
  priority: 'low' | 'medium' | 'high';
  progress?: number;
  subtasks?: { text: string; completed: boolean }[];
  isAISuggested?: boolean;
  listAttachment?: string;
  assignees: { name: string; avatar: string }[];
  commentsCount?: number;
  dueDate?: string;
}

export interface Project {
  id: string;
  name: string;
  category: string;
  progress: number;
  status: 'On Track' | 'Delayed' | 'Completed';
  team: { name: string; avatar: string }[];
  icon: string;
}

export interface ActivityItem {
  id: string;
  type: 'ai' | 'user' | 'system' | 'milestone';
  icon: string;
  message: string;
  time: string;
}

export interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  isStreaming?: boolean;
  suggestions?: string[];
  boardSuggestion?: {
    action: string;
    description: string;
  };
}
