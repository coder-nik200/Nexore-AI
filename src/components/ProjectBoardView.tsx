import React, { useState } from 'react';
import { 
  Search, Bell, Cpu, ArrowLeft, Plus, CheckCircle, 
  Paperclip, MessageCircle, AlertCircle, PlayCircle, MoreVertical, Send,
  HelpCircle, ChevronRight, CornerDownRight, Check, Trash, Zap, ArrowRightLeft,
  Settings, Folder, BarChart, Users, CheckSquare, LogOut, Laptop, Menu, X
} from 'lucide-react';
import { Task, Project, ChatMessage } from '../types';
import { AVATARS } from '../data';

interface ProjectBoardViewProps {
  project: Project;
  tasks: Task[];
  onAddTask: (task: Partial<Task>) => void;
  onUpdateTaskStatus: (taskId: string, newStatus: Task['status']) => void;
  onDeleteTask: (taskId: string) => void;
  onBackToDashboard: () => void;
  onNavigate: (view: string) => void;
  activeSidebarTab: string;
}

export default function ProjectBoardView({
  project,
  tasks,
  onAddTask,
  onUpdateTaskStatus,
  onDeleteTask,
  onBackToDashboard,
  onNavigate,
  activeSidebarTab
}: ProjectBoardViewProps) {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'ai',
      text: "Hello Alex! I've analyzed the Neural Engine v2.4 board. Would you like a summary of the current sprint progress or should I generate the weekly report?",
      timestamp: '10:42 AM'
    },
    {
      id: 'm2',
      sender: 'user',
      text: "Summarize this project",
      timestamp: '10:43 AM'
    },
    {
      id: 'm3',
      sender: 'ai',
      text: `### Current project health is Optimal (84%).
- **12 tasks completed** this sprint.
- **Bottleneck identified** in **Quantization Module**.
- **Suggested action**: Reassign '*Neural Layering*' to a Senior Engineer for rapid delivery bindings.`,
      timestamp: '10:43 AM',
      boardSuggestion: {
        action: 'Reassign Neural Layering',
        description: 'Suggested reassignment to Senior Dev with C++ background'
      }
    }
  ]);

  const [chatInput, setChatInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [taskModalColumn, setTaskModalColumn] = useState<Task['status'] | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [aiPanelOpen, setAiPanelOpen] = useState(false);

  // New task form fields
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState('ENGINEERING');
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');

  const handleSendChatMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isAiLoading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setIsAiLoading(true);

    try {
      const quantizationTask = tasks.find(t => t.id === 't3');

      const boardState = {
        tasksCount: tasks.length,
        completedCount: tasks.filter(t => t.status === 'done').length,
        inProgressCount: tasks.filter(t => t.status === 'inprogress').length,
        quantizationProgress: quantizationTask ? `${quantizationTask.progress}%` : '65%',
        activeTaskTitle: quantizationTask ? quantizationTask.title : 'Refactor Quantization Module',
        tasks: tasks.map(t => ({
          title: t.title,
          status: t.status,
          category: t.category,
          priority: t.priority
        }))
      };

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSend, boardState })
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setChatMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error('Failed to get reaction:', err);
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: `I apologize, Alex. The AI backend encountered an issue analyzing the live container frame. 

**Local Summary fallback**:
- Board status: Active.
- Active items: **${tasks.filter(t => t.status === 'inprogress').length}** In Progress.
- Suggestions: Continue with the **Refactor Quantization Module** sprint targets which are at **65% done**.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, aiMsg]);
    } finally {
      setIsAiLoading(false);
    }
  };

  const currentBoardColumns: { id: Task['status']; title: string; color: string }[] = [
    { id: 'todo', title: 'To Do', color: 'border-t-2 border-t-[#cbc3d7]' },
    { id: 'inprogress', title: 'In Progress', color: 'border-t-2 border-t-[#6d3bd7]' },
    { id: 'review', title: 'Review', color: 'border-t-2 border-t-[#ffb869]' },
    { id: 'done', title: 'Done', color: 'border-t-2 border-t-emerald-500' }
  ];

  const getTaskCategoryStyle = (cat: string) => {
    switch (cat.toUpperCase()) {
      case 'RESEARCH': return 'bg-[#cbc3d7]/10 text-[#cbc3d7]';
      case 'AI SUGGESTED': return 'bg-[#d0bcff]/10 text-[#d0bcff] border border-[#d0bcff]/20 animate-pulse';
      case 'ENGINEERING': return 'bg-[#6d3bd7]/25 text-[#d0bcff]';
      case 'DESIGN': return 'bg-[#ffb869]/10 text-[#ffb869]';
      case 'INFRA': return 'bg-[#3131c0]/25 text-[#c0c1ff]';
      default: return 'bg-[#cbc3d7]/10 text-[#cbc3d7]';
    }
  };

  const handleApplySuggestion = () => {
    onAddTask({
      title: "Optimized Weight Layering Matrix",
      description: "Reassign spatial layers as suggested by Nexora AI for 12% velocity improvement.",
      status: 'inprogress',
      category: 'AI SUGGESTED',
      priority: 'high',
      assignees: [{ name: 'Alex Rivera', avatar: AVATARS.alexRivera }]
    });

    const mockMsg: ChatMessage = {
      id: `ai-apply-${Date.now()}`,
      sender: 'ai',
      text: `✅ **Applied Suggestion!** I have successfully initialized, prioritized and added the task "**Optimized Weight Layering Matrix**" into your In Progress board column, assigned to **Alex Rivera**!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatMessages(prev => [...prev, mockMsg]);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0A0A0B] text-[#e5e2e3]">

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`
        fixed left-0 top-0 h-full flex flex-col z-40 bg-[#201f20] border-r border-[#494454]/10 w-64
        transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:relative lg:shrink-0
      `}>
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#6d3bd7] to-[#3131c0] flex items-center justify-center text-white shrink-0">
            <Zap className="fill-current text-white" size={20} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">Nexora AI</h1>
            <p className="text-[10px] font-mono text-[#cbc3d7]/70 uppercase tracking-widest">Workspace</p>
          </div>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="ml-auto lg:hidden text-[#cbc3d7] hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 mt-8 flex flex-col gap-1 px-2 overflow-y-auto">
          <button 
            onClick={() => { onNavigate('dashboard'); setSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
              activeSidebarTab === 'dashboard' 
                ? 'text-[#d0bcff] bg-[#d0bcff]/5 border-l-2 border-[#d0bcff]' 
                : 'text-[#cbc3d7] hover:bg-[#353436]/50'
            }`}
          >
            <BarChart size={18} />
            <span className="text-sm font-medium">Dashboard</span>
          </button>

          <button 
            onClick={() => { onNavigate('projects'); setSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
              activeSidebarTab === 'projects' 
                ? 'text-[#d0bcff] bg-[#d0bcff]/5 border-l-2 border-[#d0bcff]' 
                : 'text-[#cbc3d7] hover:bg-[#353436]/50'
            }`}
          >
            <Folder size={18} />
            <span className="text-sm font-medium">Projects Board</span>
          </button>

          <button 
            onClick={() => { onNavigate('tasks'); setSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
              activeSidebarTab === 'tasks' 
                ? 'text-[#d0bcff] bg-[#d0bcff]/5 border-l-2 border-[#d0bcff]' 
                : 'text-[#cbc3d7] hover:bg-[#353436]/50'
            }`}
          >
            <CheckSquare size={18} />
            <span className="text-sm font-medium">Tasks</span>
          </button>

          <button 
            onClick={() => { onNavigate('analytics'); setSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
              activeSidebarTab === 'analytics' 
                ? 'text-[#d0bcff] bg-[#d0bcff]/5 border-l-2 border-[#d0bcff]' 
                : 'text-[#cbc3d7] hover:bg-[#353436]/50'
            }`}
          >
            <Zap size={18} />
            <span className="text-sm font-medium">Analytics</span>
          </button>

          <button 
            onClick={() => { onNavigate('team'); setSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
              activeSidebarTab === 'team' 
                ? 'text-[#d0bcff] bg-[#d0bcff]/5 border-l-2 border-[#d0bcff]' 
                : 'text-[#cbc3d7] hover:bg-[#353436]/50'
            }`}
          >
            <Users size={18} />
            <span className="text-sm font-medium">Team</span>
          </button>

          <button 
            onClick={() => { onNavigate('settings'); setSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
              activeSidebarTab === 'settings' 
                ? 'text-[#d0bcff] bg-[#d0bcff]/5 border-l-2 border-[#d0bcff]' 
                : 'text-[#cbc3d7] hover:bg-[#353436]/50'
            }`}
          >
            <Settings size={18} />
            <span className="text-sm font-medium">Settings</span>
          </button>
        </nav>

        <div className="p-4 border-t border-[#494454]/10 flex flex-col gap-1">
          <button 
            onClick={() => { onNavigate('help'); setSidebarOpen(false); }}
            className="w-full text-[#cbc3d7] flex items-center gap-3 px-4 py-3 hover:bg-[#353436]/50 rounded-lg text-left text-sm transition-all"
          >
            <HelpCircle size={18} />
            <span>Help Support</span>
          </button>
          <button 
            onClick={onBackToDashboard}
            className="w-full text-[#cbc3d7] flex items-center gap-3 px-4 py-3 hover:bg-red-900/25 rounded-lg text-left text-sm transition-all text-red-400"
          >
            <LogOut size={18} />
            <span>To Dashboard</span>
          </button>
        </div>
      </aside>

      {/* Main Column */}
      <main className="flex-1 min-w-0 flex flex-col h-screen overflow-hidden">
        {/* Top Navbar Header */}
        <header className="shrink-0 w-full z-30 flex justify-between items-center px-3 sm:px-6 lg:px-8 py-3 sm:py-4 bg-[#131314]/80 backdrop-blur-xl border-b border-[#494454]/10">
          <div className="flex items-center gap-2 sm:gap-4 min-w-0">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden flex items-center justify-center w-8 h-8 rounded-lg bg-[#1c1b1c] border border-[#494454]/30 text-[#cbc3d7] shrink-0"
            >
              <Menu size={16} />
            </button>

            <button 
              onClick={onBackToDashboard}
              className="hidden sm:flex items-center gap-1 bg-[#1c1b1c] border border-[#494454]/30 hover:bg-[#353436] px-3 sm:px-4 py-2 rounded-xl text-xs font-mono tracking-wider transition-all cursor-pointer shrink-0"
            >
              <ArrowLeft size={16} /> <span className="hidden md:inline">BACK TO DASHBOARD</span>
            </button>
            <div className="hidden sm:block h-6 w-[1.5px] bg-[#494454]/30 shrink-0"></div>
            <div className="min-w-0">
              <h2 className="text-sm sm:text-base font-bold text-white tracking-wide truncate">{project.name}</h2>
              <p className="text-[10px] font-mono text-[#cbc3d7]/60 tracking-wider uppercase hidden sm:block">Project Board • Live Sprint</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <div className="hidden sm:flex -space-x-2">
              {project.team.map((t, idx) => (
                <img 
                  key={idx}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-[#131314] object-cover" 
                  title={t.name}
                  alt={t.name}
                  src={t.avatar}
                  referrerPolicy="no-referrer"
                />
              ))}
            </div>
            
            {/* Mobile AI panel toggle */}
            <button
              onClick={() => setAiPanelOpen(!aiPanelOpen)}
              className="xl:hidden flex items-center justify-center w-8 h-8 rounded-lg bg-[#1c1b1c] border border-[#494454]/30 text-[#cbc3d7]"
              title="Toggle AI Panel"
            >
              <Cpu size={16} />
            </button>

            <button className="hidden xl:flex hover:bg-[#353436] rounded-full p-2 transition-all cursor-pointer">
              <Cpu size={20} className="text-[#cbc3d7]" />
            </button>
          </div>
        </header>

        {/* Kanban Board Container & Assistant Split Columns */}
        <div className="flex-1 flex overflow-hidden min-h-0">
          
          {/* Active Task Kanban columns viewport */}
          <div className="flex-1 p-3 sm:p-5 lg:p-8 overflow-x-auto overflow-y-auto min-w-0">
            <div className="flex items-start gap-3 sm:gap-4 lg:gap-6 h-full" style={{ minWidth: 'max-content' }}>
              
              {currentBoardColumns.map((col) => {
                const columnTasks = tasks.filter((t) => t.status === col.id);
                return (
                  <div key={col.id} className="w-[220px] sm:w-[250px] lg:w-[280px] xl:w-[300px] shrink-0 flex flex-col bg-[#131314]/40 rounded-xl max-h-[calc(100vh-130px)] sm:max-h-[calc(100vh-150px)] border border-[#494454]/10">
                    
                    {/* Column Header */}
                    <div className={`p-3 sm:p-4 ${col.color} flex justify-between items-center bg-[#131314] rounded-t-xl shrink-0`}>
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-bold text-white">{col.title}</span>
                        <span className="text-xs font-mono font-bold text-[#958ea0] bg-[#1c1b1c] px-2 py-0.5 rounded-full">
                          {columnTasks.length}
                        </span>
                      </div>
                      
                      <button 
                        onClick={() => setTaskModalColumn(col.id)}
                        className="hover:bg-[#353436] text-[#cbc3d7] hover:text-white rounded-full p-1.5 transition-all text-xs flex items-center gap-0.5 cursor-pointer"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    {/* Column Body Tasks stack */}
                    <div className="p-2 sm:p-3 flex-grow overflow-y-auto space-y-2 sm:space-y-3">
                      {columnTasks.map((t) => (
                        <div key={t.id} className="kanban-card p-3 sm:p-4 rounded-xl flex flex-col gap-2 sm:gap-3 group relative">
                          
                          <div className="flex justify-between items-center gap-2">
                            <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded uppercase ${getTaskCategoryStyle(t.category)}`}>
                              {t.category}
                            </span>
                            
                            <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                t.priority === 'high' ? 'bg-red-500' : t.priority === 'medium' ? 'bg-[#ffb869]' : 'bg-emerald-400'
                              }`} title={`Priority: ${t.priority}`}></span>
                              
                              <button 
                                onClick={() => onDeleteTask(t.id)} 
                                className="text-[#cbc3d7] hover:text-red-400 transition-colors p-1"
                                title="Delete task"
                              >
                                <Trash size={12} />
                              </button>
                            </div>
                          </div>

                          <div>
                            <h5 className="font-bold text-xs sm:text-sm text-white leading-tight mb-1 group-hover:text-[#d0bcff] transition-all">
                              {t.title}
                            </h5>
                            <p className="text-xs text-[#cbc3d7]/70 font-light leading-relaxed line-clamp-2">
                              {t.description}
                            </p>
                          </div>

                          {t.status === 'inprogress' && t.progress !== undefined && (
                            <div className="mt-1 w-full space-y-1">
                              <div className="flex justify-between items-center text-[10px] font-mono">
                                <span className="text-[#cbc3d7]/70">Port Progress</span>
                                <span className="text-[#d0bcff] font-bold">{t.progress}% done</span>
                              </div>
                              <div className="h-1 w-full bg-[#1c1b1c] rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-gradient-to-r from-[#6d3bd7] to-[#d0bcff] rounded-full transition-all duration-300"
                                  style={{ width: `${t.progress}%` }}
                                ></div>
                              </div>
                            </div>
                          )}

                          {t.subtasks && t.subtasks.length > 0 && (
                            <div className="space-y-1 mt-1 border-t border-[#494454]/10 pt-2">
                              {t.subtasks.map((sub, sIdx) => (
                                <div key={sIdx} className="flex items-center gap-2 text-[10px] text-[#cbc3d7]/80">
                                  <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 ${
                                    sub.completed ? 'bg-[#6d3bd7]/30 border-[#d0bcff]/40 text-[#d0bcff]' : 'border-[#494454]'
                                  }`}>
                                    {sub.completed && <Check size={8} />}
                                  </div>
                                  <span className={sub.completed ? 'line-through text-[#cbc3d7]/40' : ''}>{sub.text}</span>
                                </div>
                              ))}
                            </div>
                          )}

                          <div className="flex justify-between items-center gap-2 mt-2 pt-2 border-t border-[#494454]/10 shrink-0">
                            <div className="flex items-center gap-3">
                              {t.listAttachment && (
                                <div className="flex items-center gap-1 font-mono text-[9px] text-[#958ea0] hover:text-[#d0bcff] transition-all">
                                  <Paperclip size={10} />
                                  <span>{t.listAttachment}</span>
                                </div>
                              )}
                              
                              {t.commentsCount !== undefined && (
                                <div className="flex items-center gap-0.5 font-mono text-[9px] text-[#958ea0]">
                                  <MessageCircle size={10} />
                                  <span>{t.commentsCount}</span>
                                </div>
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-0.5 mr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                {col.id !== 'todo' && (
                                  <button 
                                    onClick={() => {
                                      const order: Task['status'][] = ['todo', 'inprogress', 'review', 'done'];
                                      const prevIdx = order.indexOf(col.id) - 1;
                                      onUpdateTaskStatus(t.id, order[prevIdx]);
                                    }}
                                    className="w-4 h-4 rounded bg-[#353436] hover:bg-[#d0bcff] hover:text-[#3c0091] text-white flex items-center justify-center text-[10px] font-bold"
                                    title="Move Left"
                                  >
                                    ←
                                  </button>
                                )}
                                {col.id !== 'done' && (
                                  <button 
                                    onClick={() => {
                                      const order: Task['status'][] = ['todo', 'inprogress', 'review', 'done'];
                                      const nextIdx = order.indexOf(col.id) + 1;
                                      onUpdateTaskStatus(t.id, order[nextIdx]);
                                    }}
                                    className="w-4 h-4 rounded bg-[#353436] hover:bg-[#d0bcff] hover:text-[#3c0091] text-white flex items-center justify-center text-[10px] font-bold"
                                    title="Move Right"
                                  >
                                    →
                                  </button>
                                )}
                              </div>

                              {t.assignees.map((a, aIdx) => (
                                <img 
                                  key={aIdx} 
                                  className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border border-[#131314] object-cover" 
                                  title={a.name}
                                  alt={a.name}
                                  src={a.avatar}
                                  referrerPolicy="no-referrer"
                                />
                              ))}
                            </div>
                          </div>

                        </div>
                      ))}

                      {columnTasks.length === 0 && (
                        <div className="text-center py-8 border border-dashed border-[#494454]/15 rounded-xl">
                          <p className="text-[11px] text-[#cbc3d7]/40">No Tasks</p>
                        </div>
                      )}
                    </div>

                  </div>
                );
              })}

            </div>
          </div>

          {/* AI Cognitive Assistant panel — slides in on mobile, fixed on xl+ */}
          <div className={`
            ${aiPanelOpen ? 'flex' : 'hidden'} xl:flex
            w-[calc(100vw-1rem)] sm:w-80 md:w-96 max-w-[380px]
            bg-[#131314] border-l border-[#494454]/10 flex-col
            h-[calc(100vh-57px)] sm:h-[calc(100vh-64px)]
            shrink-0 bg-density-glass
            fixed right-0 top-[57px] sm:top-[64px] z-20
            xl:relative xl:top-auto xl:right-auto xl:z-auto
          `}>
            
            {/* Header profile status */}
            <div className="p-3 sm:p-4 border-b border-[#494454]/10 bg-[#1c1b1c] ai-pulse-border shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#6d3bd7] to-[#3131c0] flex items-center justify-center text-white relative shrink-0">
                  <Cpu size={16} />
                  <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#1c1b1c] animate-pulse"></span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Nexora AI Agent</h4>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                    <span className="text-[9px] font-mono text-[#958ea0] uppercase tracking-wide truncate">Project Health: Optimal (84%)</span>
                  </div>
                </div>
                <button
                  onClick={() => setAiPanelOpen(false)}
                  className="xl:hidden text-[#cbc3d7] hover:text-white shrink-0"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Chat list viewport */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4 min-h-0">
              {chatMessages.map((msg) => (
                <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl p-3 sm:p-3.5 text-xs leading-relaxed ${
                    msg.sender === 'user' 
                      ? 'bg-gradient-to-br from-[#6d3bd7] to-[#3131c0] text-white rounded-tr-none'
                      : 'bg-[#1c1b1c] text-[#cbc3d7] rounded-tl-none border border-[#494454]/20'
                  }`}>
                    <div className="space-y-2 whitespace-pre-wrap">
                      {msg.text.split('\n').map((line, lIdx) => {
                        if (line.startsWith('###')) {
                          return <h4 key={lIdx} className="font-bold text-white mt-1 uppercase text-[11px] tracking-wide">{line.replace('###', '')}</h4>;
                        }
                        if (line.startsWith('-') || line.startsWith('•')) {
                          return (
                            <div key={lIdx} className="flex gap-2 pl-2">
                              <span className="text-[#d0bcff]">•</span>
                              <span>{line.substring(2)}</span>
                            </div>
                          );
                        }
                        return <p key={lIdx}>{line}</p>;
                      })}
                    </div>

                    {msg.boardSuggestion && (
                      <div className="mt-3 bg-[#131314] rounded-xl p-3 border border-[#d0bcff]/20 flex flex-col gap-2">
                        <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#d0bcff]">
                          <Zap size={12} className="animate-bounce" />
                          <span>COG AI ACTION PROPOSAL</span>
                        </div>
                        <p className="text-[11px] font-bold text-white">{msg.boardSuggestion.action}</p>
                        <p className="text-[10px] text-[#cbc3d7]/80">{msg.boardSuggestion.description}</p>
                        <button 
                          onClick={handleApplySuggestion}
                          className="w-full py-1.5 bg-[#d0bcff] text-[#3c0091] font-bold font-mono text-[9px] rounded-lg tracking-wider uppercase hover:opacity-90 active:scale-95 transition-all cursor-pointer"
                        >
                          APPLY SUGGESTION
                        </button>
                      </div>
                    )}
                  </div>
                  <span className="text-[9px] font-mono text-[#cbc3d7]/40 mt-1 px-1">{msg.timestamp}</span>
                </div>
              ))}

              {isAiLoading && (
                <div className="flex flex-col items-start select-none">
                  <div className="bg-[#1c1b1c] text-[#cbc3d7] rounded-2xl rounded-tl-none p-3.5 border border-[#494454]/20 max-w-[85%] flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#d0bcff] animate-bounce"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#d0bcff] animate-bounce delay-150"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#d0bcff] animate-bounce delay-300"></span>
                    <span className="text-[10px] font-mono text-[#cbc3d7]/50 ml-1">Analyzing workspace layers...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Micro Quick Queries selection */}
            <div className="p-2 border-t border-[#494454]/10 bg-[#131314] flex flex-wrap gap-1.5 shrink-0 select-none">
              <button 
                onClick={() => handleSendChatMessage("Summarize this project")}
                className="text-[10px] font-mono px-2 py-1 rounded bg-[#1c1b1c] hover:bg-[#353436] border border-[#494454]/20 text-[#cbc3d7] transition-all cursor-pointer"
              >
                Summarize Board
              </button>
              <button 
                onClick={() => handleSendChatMessage("Identify active blockers")}
                className="text-[10px] font-mono px-2 py-1 rounded bg-[#1c1b1c] hover:bg-[#353436] border border-[#494454]/20 text-[#cbc3d7] transition-all cursor-pointer"
              >
                Identify Blockers
              </button>
              <button 
                onClick={() => handleSendChatMessage("Suggest optimal optimization steps")}
                className="text-[10px] font-mono px-2 py-1 rounded bg-[#1c1b1c] hover:bg-[#353436] border border-[#494454]/20 text-[#cbc3d7] transition-all cursor-pointer"
              >
                Suggest Optimization
              </button>
            </div>

            {/* Chat bottom layout */}
            <div className="p-3 border-t border-[#494454]/10 bg-[#1c1b1c] shrink-0">
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendChatMessage(chatInput);
                }}
                className="relative flex items-center"
              >
                <input 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask Nexora AI Agent..." 
                  className="w-full bg-[#131414] border border-[#494454]/30 rounded-xl py-2 pl-3.5 pr-10 text-xs focus:outline-none focus:ring-1 focus:ring-[#d0bcff] transition-all text-white placeholder:text-[#cbc3d7]/30"
                  type="text"
                />
                <button 
                  type="submit"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 bg-[#d0bcff]/10 hover:bg-[#d0bcff] text-[#d0bcff] hover:text-[#3c0091] rounded-lg flex items-center justify-center transition-all cursor-pointer"
                >
                  <Send size={12} />
                </button>
              </form>
            </div>

          </div>

        </div>

        {/* Create Task Modal Dialog */}
        {taskModalColumn !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="bg-[#201f20] border border-[#d0bcff]/20 rounded-2xl w-full max-w-md p-4 sm:p-6 shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Create sprint task</h3>
                <span className="text-[10px] font-mono bg-[#6d3bd7]/30 text-[#d0bcff] px-2 py-0.5 rounded uppercase">COLUMN: {taskModalColumn}</span>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-[#cbc3d7] uppercase mb-1">Task Title</label>
                  <input 
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="e.g. Refactor model parsing functions" 
                    className="w-full bg-[#1c1b1c] border border-[#494454]/40 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#d0bcff]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-[#cbc3d7] uppercase mb-1">Detailed Description</label>
                  <textarea 
                    value={newTaskDesc}
                    onChange={(e) => setNewTaskDesc(e.target.value)}
                    placeholder="Provide details of execution steps or dependency links here..." 
                    rows={3}
                    className="w-full bg-[#1c1b1c] border border-[#494454]/40 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#d0bcff]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-[#cbc3d7] uppercase mb-1">Category</label>
                    <select 
                      value={newTaskCategory}
                      onChange={(e) => setNewTaskCategory(e.target.value)}
                      className="w-full bg-[#1c1b1c] border border-[#494454]/40 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#d0bcff]"
                    >
                      <option value="ENGINEERING">ENGINEERING</option>
                      <option value="RESEARCH">RESEARCH</option>
                      <option value="DESIGN">DESIGN</option>
                      <option value="INFRA">INFRA</option>
                      <option value="AI SUGGESTED">AI SUGGESTED</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-[#cbc3d7] uppercase mb-1">Priority</label>
                    <select 
                      value={newTaskPriority}
                      onChange={(e) => setNewTaskPriority(e.target.value as any)}
                      className="w-full bg-[#1c1b1c] border border-[#494454]/40 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#d0bcff]"
                    >
                      <option value="low">Low Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="high">High Priority</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 justify-end mt-6">
                <button 
                  onClick={() => setTaskModalColumn(null)}
                  className="px-4 py-2 rounded-xl text-xs text-[#cbc3d7] hover:bg-[#353436] transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    if (newTaskTitle) {
                      onAddTask({
                        title: newTaskTitle,
                        description: newTaskDesc,
                        status: taskModalColumn,
                        category: newTaskCategory,
                        priority: newTaskPriority,
                        commentsCount: 0,
                        assignees: [{ name: 'Alex Rivera', avatar: AVATARS.alexRivera }],
                        ...(taskModalColumn === 'inprogress' ? { progress: 10 } : {})
                      });
                      setTaskModalColumn(null);
                      setNewTaskTitle('');
                      setNewTaskDesc('');
                    }
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-[#6d3bd7] to-[#3131c0] rounded-xl text-xs font-bold text-white hover:opacity-95 transition-all"
                >
                  Add Sprint Task
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}