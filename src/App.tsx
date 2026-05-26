import React, { useState, useEffect } from 'react';
import {
  Plus, CheckSquare, Trash, BarChart, Users, Settings,
  HelpCircle, LogOut, ArrowLeft, RefreshCw, Cpu, Check, Folder, Info, Eye, LogIn, Menu, X, Zap
} from 'lucide-react';
import LandingPage from './components/LandingPage';
import DashboardView from './components/DashboardView';
import ProjectBoardView from './components/ProjectBoardView';
import { Task, Project, ActivityItem } from './types';
import { INITIAL_PROJECTS, INITIAL_TASKS, INITIAL_ACTIVITIES, AVATARS } from './data';

export default function App() {
  const [view, setView] = useState<string>(() => {
    const saved = localStorage.getItem('nexora_view');
    return saved ? saved : 'landing';
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('nexora_projects');
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('nexora_tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [activities, setActivities] = useState<ActivityItem[]>(() => {
    const saved = localStorage.getItem('nexora_activities');
    return saved ? JSON.parse(saved) : INITIAL_ACTIVITIES;
  });

  const [selectedProjectId, setSelectedProjectId] = useState<string>(() => {
    const saved = localStorage.getItem('nexora_selected_project_id');
    return saved ? saved : 'p4';
  });

  // Track settings config
  const [geminiStatus, setGeminiStatus] = useState<string>('checking');
  const [savedApiKey, setSavedApiKey] = useState<string>('');

  // Sidebar mobile toggle (shared across all non-board views)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Add Task modal state
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState('ENGINEERING');
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [newTaskStatus, setNewTaskStatus] = useState<Task['status']>('todo');

  useEffect(() => {
    localStorage.setItem('nexora_view', view);
  }, [view]);

  useEffect(() => {
    localStorage.setItem('nexora_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('nexora_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('nexora_activities', JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    localStorage.setItem('nexora_selected_project_id', selectedProjectId);
  }, [selectedProjectId]);

  useEffect(() => {
    fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: "PING", boardState: {} })
    })
      .then(r => r.json())
      .then(data => {
        if (data.localMode) {
          setGeminiStatus('local');
        } else {
          setGeminiStatus('active');
        }
      })
      .catch(() => {
        setGeminiStatus('local');
      });
  }, []);

  const handleSelectProject = (projectId: string) => {
    setSelectedProjectId(projectId);
    setView('projects');
  };

  const handleAddTask = (newTask: Partial<Task>) => {
    const task: Task = {
      id: `t-${Date.now()}`,
      title: newTask.title || 'Untitled Task',
      description: newTask.description || '',
      status: newTask.status || 'todo',
      category: newTask.category || 'ENGINEERING',
      priority: newTask.priority || 'medium',
      assignees: newTask.assignees || [{ name: 'Alex Rivera', avatar: AVATARS.alexRivera }],
      commentsCount: 0,
      subtasks: newTask.subtasks || [],
      progress: newTask.progress,
      isAISuggested: newTask.isAISuggested,
      listAttachment: newTask.listAttachment
    };

    setTasks(prev => [task, ...prev]);

    const activity: ActivityItem = {
      id: `act-${Date.now()}`,
      type: task.isAISuggested ? 'ai' : 'user',
      icon: task.isAISuggested ? 'auto_fix_high' : 'person',
      message: `${task.isAISuggested ? 'AI recommended action completed' : 'Task created'}: "${task.title}"`,
      time: 'Just now'
    };
    setActivities(prev => [activity, ...prev]);
  };

  const handleUpdateTaskStatus = (taskId: string, newStatus: Task['status']) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const updated = { ...t, status: newStatus };
        if (newStatus === 'inprogress' && t.progress === undefined) {
          updated.progress = 10;
        } else if (newStatus === 'done') {
          updated.progress = 100;
        }
        return updated;
      }
      return t;
    }));

    const task = tasks.find(t => t.id === taskId);
    if (task) {
      const activity: ActivityItem = {
        id: `act-${Date.now()}`,
        type: 'user',
        icon: 'swap_horiz',
        message: `Task "${task.title}" moved to ${newStatus.toUpperCase()}`,
        time: 'Just now'
      };
      setActivities(prev => [activity, ...prev]);
    }
  };

  const handleDeleteTask = (taskId: string) => {
    const taskToDelete = tasks.find(t => t.id === taskId);
    setTasks(prev => prev.filter(t => t.id !== taskId));

    if (taskToDelete) {
      const activity: ActivityItem = {
        id: `act-${Date.now()}`,
        type: 'system',
        icon: 'delete',
        message: `Task "${taskToDelete.title}" was purged from board.`,
        time: 'Just now'
      };
      setActivities(prev => [activity, ...prev]);
    }
  };

  // Handle modal form submit
  const handleModalAddTask = () => {
    if (!newTaskTitle.trim()) return;
    handleAddTask({
      title: newTaskTitle.trim(),
      description: newTaskDesc.trim(),
      status: newTaskStatus,
      category: newTaskCategory,
      priority: newTaskPriority,
      assignees: [{ name: 'Alex Rivera', avatar: AVATARS.alexRivera }],
      ...(newTaskStatus === 'inprogress' ? { progress: 10 } : {})
    });
    // Reset form
    setNewTaskTitle('');
    setNewTaskDesc('');
    setNewTaskCategory('ENGINEERING');
    setNewTaskPriority('medium');
    setNewTaskStatus('todo');
    setShowAddTaskModal(false);
  };

  const selectedProjectObj = projects.find(p => p.id === selectedProjectId) || projects[3];

  if (view === 'landing') {
    return <LandingPage onGetStarted={() => setView('dashboard')} />;
  }

  // Shared sidebar for inner views
  const renderSidebar = (currentTab: string) => {
    return (
      <>
        {/* Mobile overlay */}
        {mobileSidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/60 lg:hidden"
            onClick={() => setMobileSidebarOpen(false)}
          />
        )}

        <aside className={`
          fixed left-0 top-0 h-full flex flex-col z-40 bg-[#201f20] border-r border-[#494454]/10 w-64
          transition-transform duration-300 ease-in-out
          ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:sticky lg:shrink-0
        `}>
          <div className="p-5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#6d3bd7] to-[#3131c0] flex items-center justify-center text-white shrink-0">
              <Cpu className="fill-current text-white" size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-bold text-white">Nexora AI</h1>
              <p className="text-[10px] font-mono text-[#cbc3d7]/70 uppercase tracking-widest">Workspace</p>
            </div>
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="lg:hidden text-[#cbc3d7] hover:text-white shrink-0"
            >
              <X size={18} />
            </button>
          </div>

          <nav className="flex-1 mt-6 flex flex-col gap-1 px-2 overflow-y-auto">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: <BarChart size={18} /> },
              { id: 'projects', label: 'Projects Board', icon: <Folder size={18} /> },
              { id: 'tasks', label: 'Tasks', icon: <CheckSquare size={18} /> },
              { id: 'analytics', label: 'Analytics', icon: <Cpu size={18} /> },
              { id: 'team', label: 'Team', icon: <Users size={18} /> },
              { id: 'settings', label: 'Settings', icon: <Settings size={18} /> },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => { setView(item.id); setMobileSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all cursor-pointer ${currentTab === item.id
                    ? 'text-[#d0bcff] bg-[#d0bcff]/5 border-l-2 border-[#d0bcff]'
                    : 'text-[#cbc3d7] hover:bg-[#353436]/50'
                  }`}
              >
                {item.icon}
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-[#494454]/10 flex flex-col gap-1">
            <button
              onClick={() => { setView('help'); setMobileSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all cursor-pointer ${currentTab === 'help'
                  ? 'text-[#d0bcff] bg-[#d0bcff]/5 border-l-2 border-[#d0bcff]'
                  : 'text-[#cbc3d7] hover:bg-[#353436]/50'
                }`}
            >
              <HelpCircle size={18} />
              <span className="text-sm">Help Support</span>
            </button>
            <button
              onClick={() => setView('landing')}
              className="w-full text-red-400 flex items-center gap-3 px-4 py-3 hover:bg-red-900/25 rounded-lg text-left text-sm transition-all cursor-pointer"
            >
              <LogOut size={18} />
              <span>Back to Landing</span>
            </button>
          </div>
        </aside>
      </>
    );
  };

  const renderTopHeader = (title: string, subtitle: string) => {
    return (
      <header className="sticky top-0 w-full z-30 flex justify-between items-center px-3 sm:px-6 lg:px-8 py-3 sm:py-4 bg-[#131314]/80 backdrop-blur-xl border-b border-[#494454]/10 select-none shrink-0">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="lg:hidden flex items-center justify-center w-8 h-8 rounded-lg bg-[#1c1b1c] border border-[#494454]/30 text-[#cbc3d7] shrink-0"
          >
            <Menu size={16} />
          </button>

          <button
            onClick={() => setView('dashboard')}
            className="hidden sm:flex items-center gap-1 bg-[#1c1b1c] border border-[#494454]/30 hover:bg-[#353436] px-3 sm:px-4 py-2 rounded-xl text-xs font-mono tracking-wider transition-all cursor-pointer shrink-0"
          >
            <ArrowLeft size={16} />
            <span className="hidden md:inline">BACK TO DASHBOARD</span>
          </button>
          <div className="hidden sm:block h-6 w-[1.5px] bg-[#494454]/30 shrink-0"></div>
          <div className="min-w-0">
            <h2 className="text-sm sm:text-base font-bold text-white tracking-wide truncate">{title}</h2>
            <p className="text-[10px] font-mono text-[#cbc3d7]/60 tracking-wider uppercase hidden sm:block">{subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-white">Nitish Bharti</p>
            <p className="text-[10px] text-[#cbc3d7] font-mono uppercase tracking-wide">Senior Lead</p>
          </div>
          <img
            alt="User"
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-[#d0bcff]/20 object-cover"
            src={AVATARS.nitish}
            referrerPolicy="no-referrer"
          />
        </div>
      </header>
    );
  };

  if (view === 'dashboard') {
    return (
      <DashboardView
        projects={projects}
        activities={activities}
        onSelectProject={handleSelectProject}
        onLogout={() => setView('landing')}
        onNavigate={(newView) => setView(newView)}
        activeSidebarTab="dashboard"
      />
    );
  }

  if (view === 'projects') {
    return (
      <ProjectBoardView
        project={selectedProjectObj}
        tasks={tasks}
        onAddTask={handleAddTask}
        onUpdateTaskStatus={handleUpdateTaskStatus}
        onDeleteTask={handleDeleteTask}
        onBackToDashboard={() => setView('dashboard')}
        onNavigate={(newView) => setView(newView)}
        activeSidebarTab="projects"
      />
    );
  }

  if (view === 'tasks') {
    return (
      <div className="flex h-screen w-screen overflow-hidden bg-[#0A0A0B] text-[#e5e2e3]">
        {renderSidebar('tasks')}

        <main className="flex-1 min-w-0 flex flex-col h-screen overflow-hidden lg:pl-0">
          {renderTopHeader("All Sprint Tasks", "Manage execution targets in flat grid layout")}

          <div className="flex-1 overflow-y-auto p-3 sm:p-6 lg:p-8">
            <div className="max-w-5xl mx-auto w-full space-y-6">
              {/* Header row */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white">Grid Sprint Task View</h3>
                  <p className="text-xs text-[#cbc3d7]/60">Full flat stack list of tasks across all statuses.</p>
                </div>
                <button
                  onClick={() => setShowAddTaskModal(true)}
                  className="bg-gradient-to-r from-[#6d3bd7] to-[#3131c0] text-white px-4 py-2.5 rounded-xl text-xs font-mono tracking-wider flex items-center gap-2 hover:opacity-90 transition-all cursor-pointer self-start sm:self-auto shrink-0"
                >
                  <Plus size={16} /> ADD TASK
                </button>
              </div>

              {/* Task table */}
              <div className="rounded-xl overflow-hidden border border-[#494454]/10 bg-[#131314]/50">
                {/* Desktop header */}
                <div className="hidden sm:grid p-4 bg-[#1c1b1c] border-b border-[#494454]/15 grid-cols-12 gap-4 text-xs font-mono text-[#958ea0] uppercase tracking-wider font-bold">
                  <div className="col-span-5">Task Details</div>
                  <div className="col-span-2">Category</div>
                  <div className="col-span-2">Status</div>
                  <div className="col-span-2">Priority</div>
                  <div className="col-span-1 text-right">Del</div>
                </div>

                <div className="divide-y divide-[#494454]/15">
                  {tasks.map((t) => (
                    <div key={t.id} className="hover:bg-[#201f20]/40 transition-all">
                      {/* Desktop row */}
                      <div className="hidden sm:grid p-4 sm:p-5 grid-cols-12 gap-4 items-center">
                        <div className="col-span-5 flex items-start gap-3 sm:gap-4">
                          <button
                            onClick={() => handleUpdateTaskStatus(t.id, t.status === 'done' ? 'todo' : 'done')}
                            className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 mt-0.5 cursor-pointer transition-colors ${t.status === 'done' ? 'bg-emerald-500 border-emerald-500 text-[#131314]' : 'border-[#494454] hover:border-[#d0bcff]'
                              }`}
                          >
                            {t.status === 'done' && <Check size={12} className="stroke-[3]" />}
                          </button>
                          <div className="min-w-0">
                            <h5 className={`font-semibold text-sm leading-snug truncate ${t.status === 'done' ? 'line-through text-[#cbc3d7]/40' : 'text-white'}`}>{t.title}</h5>
                            <p className="text-xs text-[#cbc3d7]/60 leading-normal mt-0.5 line-clamp-1">{t.description}</p>
                          </div>
                        </div>
                        <div className="col-span-2 font-mono text-[10px] tracking-wide uppercase">
                          <span className="bg-[#cbc3d7]/15 px-2 py-1 rounded text-[#d0bcff] truncate block w-fit max-w-full">{t.category}</span>
                        </div>
                        <div className="col-span-2 font-mono text-xs capitalize text-white">
                          {t.status === 'todo' && 'To Do'}
                          {t.status === 'inprogress' && <span className="text-[#d0bcff]">In Progress</span>}
                          {t.status === 'review' && <span className="text-[#ffb869]">Review</span>}
                          {t.status === 'done' && <span className="text-emerald-500">Done</span>}
                        </div>
                        <div className="col-span-2">
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase ${t.priority === 'high' ? 'bg-red-500/10 text-red-400' : t.priority === 'medium' ? 'bg-[#ffb869]/10 text-[#ffb869]' : 'bg-emerald-500/10 text-emerald-400'
                            }`}>
                            {t.priority}
                          </span>
                        </div>
                        <div className="col-span-1 text-right">
                          <button
                            onClick={() => handleDeleteTask(t.id)}
                            className="p-1.5 hover:bg-red-900/10 rounded-lg text-[#cbc3d7] hover:text-red-400 transition-all cursor-pointer"
                          >
                            <Trash size={14} />
                          </button>
                        </div>
                      </div>

                      {/* Mobile card */}
                      <div className="sm:hidden p-4 flex flex-col gap-2">
                        <div className="flex items-start gap-3">
                          <button
                            onClick={() => handleUpdateTaskStatus(t.id, t.status === 'done' ? 'todo' : 'done')}
                            className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 mt-0.5 cursor-pointer transition-colors ${t.status === 'done' ? 'bg-emerald-500 border-emerald-500 text-[#131314]' : 'border-[#494454] hover:border-[#d0bcff]'
                              }`}
                          >
                            {t.status === 'done' && <Check size={12} className="stroke-[3]" />}
                          </button>
                          <div className="flex-1 min-w-0">
                            <h5 className={`font-semibold text-sm leading-snug ${t.status === 'done' ? 'line-through text-[#cbc3d7]/40' : 'text-white'}`}>{t.title}</h5>
                            <p className="text-xs text-[#cbc3d7]/60 mt-0.5 line-clamp-2">{t.description}</p>
                          </div>
                          <button
                            onClick={() => handleDeleteTask(t.id)}
                            className="p-1.5 text-[#cbc3d7] hover:text-red-400 transition-all cursor-pointer shrink-0"
                          >
                            <Trash size={14} />
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2 pl-8">
                          <span className="bg-[#cbc3d7]/15 px-2 py-0.5 rounded text-[10px] font-mono text-[#d0bcff] uppercase">{t.category}</span>
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase ${t.priority === 'high' ? 'bg-red-500/10 text-red-400' : t.priority === 'medium' ? 'bg-[#ffb869]/10 text-[#ffb869]' : 'bg-emerald-500/10 text-emerald-400'
                            }`}>{t.priority}</span>
                          <span className="text-[10px] font-mono text-[#cbc3d7]/50">
                            {t.status === 'todo' && 'To Do'}
                            {t.status === 'inprogress' && <span className="text-[#d0bcff]">In Progress</span>}
                            {t.status === 'review' && <span className="text-[#ffb869]">Review</span>}
                            {t.status === 'done' && <span className="text-emerald-500">Done</span>}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Add Task Modal */}
        {showAddTaskModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="bg-[#201f20] border border-[#d0bcff]/20 rounded-2xl w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">
              {/* Modal header */}
              <div className="flex justify-between items-center px-5 sm:px-6 pt-5 sm:pt-6 pb-4 border-b border-[#494454]/15">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">New Sprint Task</h3>
                  <p className="text-[11px] text-[#cbc3d7]/50 font-mono mt-0.5">Fill in the details below</p>
                </div>
                <button
                  onClick={() => setShowAddTaskModal(false)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#1c1b1c] text-[#cbc3d7] hover:text-white hover:bg-[#353436] transition-all"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Modal body */}
              <div className="px-5 sm:px-6 py-5 space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-[11px] font-mono text-[#cbc3d7]/80 uppercase tracking-wider mb-1.5">
                    Task Title <span className="text-red-400">*</span>
                  </label>
                  <input
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="e.g. Refactor model parsing functions"
                    className="w-full bg-[#1c1b1c] border border-[#494454]/40 focus:border-[#d0bcff]/50 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-[#cbc3d7]/30 focus:outline-none focus:ring-1 focus:ring-[#d0bcff]/30 transition-all"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-[11px] font-mono text-[#cbc3d7]/80 uppercase tracking-wider mb-1.5">Description</label>
                  <textarea
                    value={newTaskDesc}
                    onChange={(e) => setNewTaskDesc(e.target.value)}
                    placeholder="Provide details about the execution steps or dependency links..."
                    rows={3}
                    className="w-full bg-[#1c1b1c] border border-[#494454]/40 focus:border-[#d0bcff]/50 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-[#cbc3d7]/30 focus:outline-none focus:ring-1 focus:ring-[#d0bcff]/30 transition-all resize-none"
                  />
                </div>

                {/* Status + Category */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono text-[#cbc3d7]/80 uppercase tracking-wider mb-1.5">Status</label>
                    <select
                      value={newTaskStatus}
                      onChange={(e) => setNewTaskStatus(e.target.value as Task['status'])}
                      className="w-full bg-[#1c1b1c] border border-[#494454]/40 focus:border-[#d0bcff]/50 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#d0bcff]/30 transition-all"
                    >
                      <option value="todo">To Do</option>
                      <option value="inprogress">In Progress</option>
                      <option value="review">Review</option>
                      <option value="done">Done</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-[#cbc3d7]/80 uppercase tracking-wider mb-1.5">Category</label>
                    <select
                      value={newTaskCategory}
                      onChange={(e) => setNewTaskCategory(e.target.value)}
                      className="w-full bg-[#1c1b1c] border border-[#494454]/40 focus:border-[#d0bcff]/50 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#d0bcff]/30 transition-all"
                    >
                      <option value="ENGINEERING">Engineering</option>
                      <option value="RESEARCH">Research</option>
                      <option value="DESIGN">Design</option>
                      <option value="INFRA">Infra</option>
                      <option value="AI SUGGESTED">AI Suggested</option>
                    </select>
                  </div>
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-[11px] font-mono text-[#cbc3d7]/80 uppercase tracking-wider mb-2">Priority</label>
                  <div className="flex gap-2">
                    {(['low', 'medium', 'high'] as const).map(p => (
                      <button
                        key={p}
                        onClick={() => setNewTaskPriority(p)}
                        className={`flex-1 py-2 rounded-xl text-[11px] font-mono uppercase tracking-wider border transition-all cursor-pointer ${newTaskPriority === p
                            ? p === 'high'
                              ? 'bg-red-500/20 border-red-500/40 text-red-400'
                              : p === 'medium'
                                ? 'bg-[#ffb869]/20 border-[#ffb869]/40 text-[#ffb869]'
                                : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                            : 'bg-[#1c1b1c] border-[#494454]/30 text-[#cbc3d7]/50 hover:border-[#494454]/60'
                          }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal footer */}
              <div className="flex gap-3 justify-end px-5 sm:px-6 pb-5 sm:pb-6">
                <button
                  onClick={() => setShowAddTaskModal(false)}
                  className="px-4 py-2 rounded-xl text-xs text-[#cbc3d7] hover:bg-[#353436] transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleModalAddTask}
                  disabled={!newTaskTitle.trim()}
                  className="px-5 py-2 bg-gradient-to-r from-[#6d3bd7] to-[#3131c0] rounded-xl text-xs font-bold text-white hover:opacity-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  Add Sprint Task
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (view === 'analytics') {
    return (
      <div className="flex h-screen w-screen overflow-hidden bg-[#0A0A0B] text-[#e5e2e3]">
        {renderSidebar('analytics')}
        <main className="flex-1 min-w-0 flex flex-col h-screen overflow-hidden">
          {renderTopHeader("Predictive Analytics", "Deep insights on sprint trajectories & resource allocations")}

          <div className="flex-1 overflow-y-auto p-3 sm:p-6 lg:p-8">
            <div className="max-w-5xl mx-auto w-full space-y-6 sm:space-y-8">
              <div className="flex flex-col gap-1">
                <h3 className="text-xl sm:text-2xl font-bold text-white">Cognitive Analytics Engine</h3>
                <p className="text-xs text-[#cbc3d7]/60 font-light">Advanced statistical telemetry generated automatically from task completions and developer commits.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                <div className="glass-panel p-5 sm:p-6 rounded-xl flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-mono uppercase tracking-wider text-[#958ea0] mb-2">Estimated Build Risk</h4>
                    <p className="text-2xl sm:text-3xl font-bold text-[#ffb869]">LOW (14%)</p>
                  </div>
                  <p className="text-[11px] text-[#cbc3d7]/70 mt-4 leading-relaxed">No major backlog items are currently running over typical sprint boundaries.</p>
                </div>

                <div className="glass-panel p-5 sm:p-6 rounded-xl flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-mono uppercase tracking-wider text-[#958ea0] mb-2">Quantization Efficiency</h4>
                    <p className="text-2xl sm:text-3xl font-bold text-white">94.2%</p>
                  </div>
                  <p className="text-[11px] text-[#cbc3d7]/70 mt-4 leading-relaxed">AI suggestion pruning increased edge layer computational speed significantly.</p>
                </div>

                <div className="glass-panel p-5 sm:p-6 rounded-xl flex flex-col justify-between sm:col-span-2 md:col-span-1">
                  <div>
                    <h4 className="text-xs font-mono uppercase tracking-wider text-[#958ea0] mb-2">Transformer Sparsity</h4>
                    <p className="text-2xl sm:text-3xl font-bold text-[#d0bcff]">45% Sparse</p>
                  </div>
                  <p className="text-[11px] text-[#cbc3d7]/70 mt-4 leading-relaxed">Structured sparsity rules applied correctly by cognitive pipelines.</p>
                </div>
              </div>

              <div className="glass-panel rounded-xl p-5 sm:p-8">
                <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-6">Execution Latency Telemetry (Target vs Actual)</h4>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="truncate pr-2">Baseline Model (Unquantized)</span>
                      <span className="font-mono shrink-0">42ms / token</span>
                    </div>
                    <div className="h-2 bg-[#1c1b1c] rounded-full overflow-hidden">
                      <div className="h-full bg-[#cbc3d7]/40 rounded-full" style={{ width: '90%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="truncate pr-2">Int8 Quantized Core (C++ Binding)</span>
                      <span className="font-mono text-[#ffb869] shrink-0">14ms / token</span>
                    </div>
                    <div className="h-2 bg-[#1c1b1c] rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#6d3bd7] to-[#ffb869] rounded-full" style={{ width: '33%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="truncate pr-2">Nexora AI Structured Pruned Target</span>
                      <span className="font-mono text-emerald-400 font-bold shrink-0">11ms / token</span>
                    </div>
                    <div className="h-2 bg-[#1c1b1c] rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#6d3bd7] to-emerald-400 rounded-full" style={{ width: '25%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (view === 'team') {
    return (
      <div className="flex h-screen w-screen overflow-hidden bg-[#0A0A0B] text-[#e5e2e3]">
        {renderSidebar('team')}
        <main className="flex-1 min-w-0 flex flex-col h-screen overflow-hidden">
          {renderTopHeader("Workspace Developers", "Core engineering members and workload metrics")}

          <div className="flex-1 overflow-y-auto p-3 sm:p-6 lg:p-8">
            <div className="max-w-5xl mx-auto w-full space-y-6 sm:space-y-8">
              <div className="flex flex-col gap-1">
                <h3 className="text-xl sm:text-2xl font-bold text-white">Engineering Directory</h3>
                <p className="text-xs text-[#cbc3d7]/60">Active members of the Neural Engine v2.4 sprint team.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {[
                  { name: 'Alex Rivera', role: 'Sr. Edge Specialist', roleColor: 'text-[#d0bcff]', desc: 'Managing quantization, sub-byte layers, and GPU matrix kernels.', avatar: AVATARS.alexRivera, active: 92, dot: 'bg-emerald-500' },
                  { name: 'Nitish Bharti', role: 'Lead Architect', roleColor: 'text-[#d0bcff]', desc: 'Supervising pipeline configurations, latency constraints, and board health.', avatar: AVATARS.nitish, active: 85, dot: 'bg-emerald-500' },
                  { name: 'Mahima', role: 'Systems Engineer', roleColor: 'text-[#c0c1ff]', desc: 'Devoting focus to Latency Benchmarking benchmarks on snapdragon chips.', avatar: AVATARS.head7, active: 64, dot: 'bg-amber-500' },
                  { name: 'Sam', role: 'ML Engineer', roleColor: 'text-[#ffb869]', desc: 'Compiling C++ binding ports and quantizing neural layer targets.', avatar: AVATARS.head8, active: 96, dot: 'bg-emerald-500' },
                ].map((member) => (
                  <div key={member.name} className="glass-panel p-5 sm:p-6 rounded-xl flex items-center gap-4 sm:gap-6">
                    <img
                      alt={member.name}
                      className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 border-[#d0bcff]/20 object-cover shrink-0"
                      src={member.avatar}
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-grow min-w-0">
                      <h5 className="font-bold text-white text-sm sm:text-base">{member.name}</h5>
                      <p className={`text-xs font-mono uppercase tracking-wider ${member.roleColor}`}>{member.role}</p>
                      <p className="text-xs text-[#cbc3d7]/80 mt-1.5 font-light line-clamp-2">{member.desc}</p>
                      <div className="flex items-center gap-2 mt-2 sm:mt-3 text-[10px] text-[#cbc3d7]/50 font-mono">
                        <span className={`w-2 h-2 rounded-full ${member.dot} shrink-0`}></span>
                        <span>Active Level: {member.active}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (view === 'settings') {
    return (
      <div className="flex h-screen w-screen overflow-hidden bg-[#0A0A0B] text-[#e5e2e3]">
        {renderSidebar('settings')}
        <main className="flex-1 min-w-0 flex flex-col h-screen overflow-hidden">
          {renderTopHeader("Workspace Settings", "Credentials, API configuration, and options")}

          <div className="flex-1 overflow-y-auto p-3 sm:p-6 lg:p-8">
            <div className="max-w-5xl mx-auto w-full space-y-6 sm:space-y-8">
              <div className="flex flex-col gap-1">
                <h3 className="text-xl sm:text-2xl font-bold text-white">General Configuration</h3>
                <p className="text-xs text-[#cbc3d7]/60">Configure your parameters, secrets, and environment bindings below.</p>
              </div>

              <div className="glass-panel rounded-2xl p-5 sm:p-8 space-y-6">
                <div>
                  <h4 className="text-sm font-bold text-white mb-2 uppercase tracking-wider">App secrets setup</h4>
                  <p className="text-xs text-[#cbc3d7]/70 font-light mb-4">
                    The Google Gemini AI Key is managed server-side. Set your secret value in the Secrets panel in AI Studio UI.
                    This keeps your private key fully concealed from your browser, adhering to the high-security directives.
                  </p>

                  <div className="p-4 rounded-xl bg-[#1c1b1c] border border-[#d0bcff]/20 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#6d3bd7] to-[#3131c0] flex items-center justify-center text-white shrink-0">
                        <Cpu size={14} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-white font-mono font-bold uppercase">Gemini SDK Connectivity</p>
                        <p className="text-[11px] text-[#cbc3d7] mt-0.5">
                          {geminiStatus === 'active'
                            ? '✨ Real cognitive pipeline is active via remote Gemini model API key'
                            : '⚡ Offline simulated workspace model is active (Offline Sandbox Mode)'}
                        </p>
                      </div>
                    </div>
                    <span className={`text-[10px] font-mono px-3 py-1 rounded-full uppercase self-start sm:self-auto shrink-0 ${geminiStatus === 'active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-[#ffb869]/10 text-[#ffb869] border border-[#ffb869]/20'
                      }`}>
                      {geminiStatus === 'active' ? 'LIVE' : 'SANDBOX'}
                    </span>
                  </div>
                </div>

                <div className="border-t border-[#494454]/10 pt-6">
                  <label className="block text-xs font-mono text-[#cbc3d7] uppercase mb-1">Workspace Name</label>
                  <input
                    defaultValue="Nexora AI Developer Sandbox"
                    className="w-full max-w-md bg-[#1c1b1c] border border-[#494454]/40 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#d0bcff]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#cbc3d7] uppercase mb-1">Timezone Location</label>
                  <select
                    defaultValue="UTC"
                    className="w-full max-w-md bg-[#1c1b1c] border border-[#494454]/40 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#d0bcff]"
                  >
                    <option value="UTC">Coordinated Universal Time (UTC)</option>
                    <option value="PST">Pacific Standard Time (PST)</option>
                    <option value="EST">Eastern Standard Time (EST)</option>
                  </select>
                </div>

                <div className="border-t border-[#494454]/10 pt-6">
                  <button
                    onClick={() => alert("Settings successfully committed!")}
                    className="bg-gradient-to-r from-[#6d3bd7] to-[#3131c0] text-white px-6 py-3 rounded-xl text-xs font-bold tracking-wider hover:opacity-90 active:scale-95 transition-all cursor-pointer uppercase"
                  >
                    Save Workspace Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Help support layout
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0A0A0B] text-[#e5e2e3]">
      {renderSidebar('help')}
      <main className="flex-1 min-w-0 flex flex-col h-screen overflow-hidden">
        {renderTopHeader("Support & Manual", "Guidance on deploying, managing, and automating with Nexora AI")}

        <div className="flex-1 overflow-y-auto p-3 sm:p-6 lg:p-8">
          <div className="max-w-5xl mx-auto w-full space-y-6 sm:space-y-8">
            <div className="flex flex-col gap-1">
              <h3 className="text-xl sm:text-2xl font-bold text-white">Guidance Center</h3>
              <p className="text-xs text-[#cbc3d7]/60">Maximize your cognitive coordination inside your new applet.</p>
            </div>

            <div className="glass-panel rounded-2xl p-5 sm:p-8 space-y-6">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Frequently Asked Questions</h4>

              <div className="space-y-4">
                {[
                  {
                    q: 'How does the AI Agent analyze my board state?',
                    a: 'The client compiles your task checklist elements, column distribution (To Do, In Progress, Review, Done), and individual item progression levels. This context is securely transmitted server-side to the Gemini 3.5 model endpoint whenever a prompt is executed, returning technical advice tailored exactly to your progress parameters.'
                  },
                  {
                    q: 'How do I move cards between task columns?',
                    a: 'Simply hover over any card in your Kanban dashboard board; two side arrows (← & →) will dynamically appear in the actions section, allowing you to move tasks between columns with a simple single click, ensuring seamless accessibility.'
                  },
                  {
                    q: 'How do I configure my Gemini API Key?',
                    a: 'Go to the settings menu of AI Studio, then click "Secrets". Add a new secret named GEMINI_API_KEY and paste your API key there. The workspace backend proxy will automatically detect this and switch your Chatbot out of sandbox simulation to a real, live AI coordinator!'
                  }
                ].map((faq, i) => (
                  <details key={i} className="group border-b border-[#494454]/10 pb-4 cursor-pointer">
                    <summary className="font-bold text-sm text-white hover:text-[#d0bcff] transition-colors list-none flex justify-between items-center gap-3">
                      <span>{faq.q}</span>
                      <span className="group-open:rotate-180 transition-transform shrink-0 text-[#cbc3d7]/50">▼</span>
                    </summary>
                    <p className="text-xs text-[#cbc3d7]/70 mt-2 font-light leading-relaxed">{faq.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}