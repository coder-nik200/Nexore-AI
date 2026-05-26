import React, { useState, useEffect, useRef } from 'react';
import {
  Search, Bell, Cpu, PlayCircle, TrendingUp, HelpCircle,
  LogOut, Plus, Milestone, CheckCircle, AlertTriangle, BadgeAlert, Laptop,
  Activity, MoreVertical, Zap, Folder, CheckSquare, BarChart, Users, Settings,
  MessageCircle, Rocket, Shield, HardDrive, ExternalLink, Menu, X, ChevronDown, ChevronUp
} from 'lucide-react';
import { Project, ActivityItem } from '../types';
import { AVATARS } from '../data';
import GlobalFooter from './GlobalFooter';

interface DashboardViewProps {
  projects: Project[];
  activities: ActivityItem[];
  onSelectProject: (projectId: string) => void;
  onLogout: () => void;
  onNavigate: (view: string) => void;
  activeSidebarTab: string;
}

// Per-day task data for the chart
const DAY_DATA: Record<string, { pct: number; tasks: { title: string; status: 'done' | 'inprogress' | 'review'; time: string }[] }> = {
  Mon: {
    pct: 42,
    tasks: [
      { title: 'Baseline model benchmarking', status: 'done', time: '9:00 AM' },
      { title: 'Set up CUDA environment', status: 'done', time: '11:30 AM' },
      { title: 'Draft quantization spec', status: 'inprogress', time: '2:00 PM' },
    ]
  },
  Tue: {
    pct: 60,
    tasks: [
      { title: 'Int8 layer compression tests', status: 'done', time: '8:45 AM' },
      { title: 'Refactor weight loader', status: 'done', time: '10:00 AM' },
      { title: 'Neural layer profiling', status: 'done', time: '1:15 PM' },
      { title: 'Latency regression check', status: 'inprogress', time: '4:30 PM' },
    ]
  },
  Wed: {
    pct: 45,
    tasks: [
      { title: 'Sync with infra team', status: 'done', time: '9:30 AM' },
      { title: 'Sparse attention module', status: 'review', time: '11:00 AM' },
      { title: 'Memory footprint analysis', status: 'inprogress', time: '3:00 PM' },
    ]
  },
  Thu: {
    pct: 75,
    tasks: [
      { title: 'C++ binding port complete', status: 'done', time: '8:00 AM' },
      { title: 'Edge device deployment test', status: 'done', time: '10:30 AM' },
      { title: 'Transformer block pruning', status: 'done', time: '1:00 PM' },
      { title: 'Pipeline CI integration', status: 'done', time: '3:45 PM' },
      { title: 'Snapdragon benchmark run', status: 'review', time: '5:00 PM' },
    ]
  },
  Fri: {
    pct: 65,
    tasks: [
      { title: 'AI report generation', status: 'done', time: '9:15 AM' },
      { title: 'Sprint retrospective notes', status: 'done', time: '11:00 AM' },
      { title: 'Model accuracy validation', status: 'review', time: '2:30 PM' },
      { title: 'Deploy to staging env', status: 'inprogress', time: '4:00 PM' },
    ]
  },
  Sat: {
    pct: 85,
    tasks: [
      { title: 'Quantized inference benchmark', status: 'done', time: '10:00 AM' },
      { title: 'API endpoint stress test', status: 'done', time: '12:00 PM' },
      { title: 'Final weight checkpoint save', status: 'done', time: '2:00 PM' },
      { title: 'Documentation update', status: 'done', time: '4:00 PM' },
      { title: 'Hotfix: memory leak patch', status: 'review', time: '5:30 PM' },
    ]
  },
  Sun: {
    pct: 95,
    tasks: [
      { title: 'Full pipeline integration test', status: 'done', time: '8:00 AM' },
      { title: 'Prod deployment checklist', status: 'done', time: '10:00 AM' },
      { title: 'Latency optimized to 11ms', status: 'done', time: '12:30 PM' },
      { title: 'AI board health report', status: 'done', time: '2:00 PM' },
      { title: 'Sprint close — v2.4 shipped', status: 'done', time: '4:00 PM' },
      { title: 'Stakeholder demo prep', status: 'done', time: '5:30 PM' },
    ]
  },
};

const STATUS_STYLE = {
  done: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20',
  inprogress: 'bg-[#d0bcff]/10 text-[#d0bcff] border border-[#d0bcff]/20',
  review: 'bg-[#ffb869]/10 text-[#ffb869] border border-[#ffb869]/20',
};

export default function DashboardView({
  projects,
  activities,
  onSelectProject,
  onLogout,
  onNavigate,
  activeSidebarTab
}: DashboardViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [timeRange, setTimeRange] = useState<'7' | '30'>('30');
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [showAllActivities, setShowAllActivities] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // New project state
  const [newProjName, setNewProjName] = useState('');
  const [newProjCategory, setNewProjCategory] = useState('');
  const [newProjStatus, setNewProjStatus] = useState<'On Track' | 'Delayed' | 'Completed'>('On Track');
  const [newProjProgress, setNewProjProgress] = useState(10);

  // Sticky chart panel
  const chartRef = useRef<HTMLDivElement>(null);
  const [isChartSticky, setIsChartSticky] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const main = mainRef.current;
    if (!main) return;
    const handleScroll = () => {
      if (!chartRef.current) return;
      const chartTop = chartRef.current.getBoundingClientRect().top;
      setIsChartSticky(chartTop < 72);
    };
    main.addEventListener('scroll', handleScroll, { passive: true });
    return () => main.removeEventListener('scroll', handleScroll);
  }, []);

  const filteredProjects = projects.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Activity visibility: show only milestone/done activities until expanded
  const visibleActivities = showAllActivities
    ? activities
    : activities.filter(a => a.type === 'milestone' || a.type === 'ai').slice(0, 4);

  const days = Object.keys(DAY_DATA);
  const selectedDayData = selectedDay ? DAY_DATA[selectedDay] : null;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0A0A0B] text-[#e5e2e3]">

      {/* Mobile sidebar overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/60 lg:hidden" onClick={() => setMobileSidebarOpen(false)} />
      )}

      {/* Sidebar Navigation */}
      <aside className={`
        fixed left-0 top-0 h-full flex flex-col z-40 bg-[#201f20] border-r border-[#494454]/10 w-64
        transition-transform duration-300 ease-in-out
        ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:sticky lg:shrink-0
      `}>
        <div className="p-5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#6d3bd7] to-[#3131c0] flex items-center justify-center text-white shrink-0">
            <Zap className="fill-current text-white" size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold text-white">Nexora AI</h1>
            <p className="text-[10px] font-mono text-[#cbc3d7]/70 uppercase tracking-widest">Workspace</p>
          </div>
          <button onClick={() => setMobileSidebarOpen(false)} className="lg:hidden text-[#cbc3d7] hover:text-white shrink-0">
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 mt-6 flex flex-col gap-1 px-2 overflow-y-auto">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: <BarChart size={18} /> },
            { id: 'projects', label: 'Projects Board', icon: <Folder size={18} /> },
            { id: 'tasks', label: 'Tasks', icon: <CheckSquare size={18} /> },
            { id: 'analytics', label: 'Analytics', icon: <Zap size={18} /> },
            { id: 'team', label: 'Team', icon: <Users size={18} /> },
            { id: 'settings', label: 'Settings', icon: <Settings size={18} /> },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => { onNavigate(item.id); setMobileSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${activeSidebarTab === item.id
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
            onClick={() => { onNavigate('help'); setMobileSidebarOpen(false); }}
            className="w-full text-[#cbc3d7] flex items-center gap-3 px-4 py-3 hover:bg-[#353436]/50 rounded-lg text-left text-sm transition-all"
          >
            <HelpCircle size={18} />
            <span>Help Support</span>
          </button>
          <button
            onClick={onLogout}
            className="w-full text-red-400 flex items-center gap-3 px-4 py-3 hover:bg-red-900/25 rounded-lg text-left text-sm transition-all"
          >
            <LogOut size={18} />
            <span>Back to Landing</span>
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <main ref={mainRef} className="flex-1 min-w-0 flex flex-col h-screen overflow-y-auto">

        {/* Top Navbar Header */}
        <header className="sticky top-0 w-full z-30 flex justify-between items-center px-3 sm:px-6 lg:px-8 py-3 sm:py-4 bg-[#131314]/90 backdrop-blur-xl border-b border-[#494454]/10 shrink-0">
          <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden flex items-center justify-center w-8 h-8 rounded-lg bg-[#1c1b1c] border border-[#494454]/30 text-[#cbc3d7] shrink-0"
            >
              <Menu size={16} />
            </button>

            <div className="relative flex-1 max-w-xs sm:max-w-md lg:max-w-xl">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#cbc3d7] size-[16px]" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#1c1b1c] border border-[#494454]/20 rounded-full py-2 pl-9 pr-4 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#d0bcff] transition-all text-white placeholder:text-[#cbc3d7]/40"
                placeholder="Search tasks or projects..."
                type="text"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 shrink-0 ml-2 sm:ml-4">
            <button
              onClick={() => setShowNotification(!showNotification)}
              className="hover:bg-[#353436] rounded-full p-2 transition-all relative cursor-pointer"
            >
              <Bell size={18} className="text-[#cbc3d7]" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500"></span>
            </button>
            <button className="hidden sm:flex hover:bg-[#353436] rounded-full p-2 transition-all cursor-pointer">
              <Cpu size={18} className="text-[#cbc3d7]" />
            </button>
            <div className="h-6 w-[1px] bg-[#494454]/30 hidden sm:block"></div>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="text-right hidden md:block">
                <p className="text-sm font-bold text-white">Nitish Bharti</p>
                <p className="text-[10px] text-[#cbc3d7] font-mono uppercase tracking-wide">Senior Lead</p>
              </div>
              <div className="relative">
                <img
                  alt="User Avatar"
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-[#d0bcff]/20 object-cover"
                  src={AVATARS.nitish}
                  referrerPolicy="no-referrer"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#131314]"></span>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Workspace */}
        <div className="p-3 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6 sm:space-y-8 flex-grow">

          {/* Notification */}
          {showNotification && (
            <div className="p-4 bg-[#201f20] border border-[#d0bcff]/20 rounded-xl shadow-2xl relative">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-xs font-mono font-bold text-[#d0bcff]">LATEST WORKSPACE ALERT</h4>
                <button onClick={() => setShowNotification(false)} className="text-xs hover:underline text-[#cbc3d7]">Dismiss</button>
              </div>
              <p className="text-xs text-[#cbc3d7]">
                AI Server Agent successfully completed structural latency optimization for <strong>Neural Engine v2.4</strong>. Average inference delay reduced by 14%.
              </p>
            </div>
          )}

          {/* Page Greeting */}
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-1">Dashboard Overview</h2>
            <p className="text-sm text-[#cbc3d7] font-light">Real-time performance metrics and AI orchestration status.</p>
          </div>

          {/* KPI Widget Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            <div className="glass-panel rounded-xl p-4 sm:p-6 transition-transform hover:-translate-y-1">
              <div className="flex justify-between items-start mb-3 sm:mb-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-[#d0bcff]/10 flex items-center justify-center text-[#d0bcff]">
                  <CheckSquare size={18} />
                </div>
                <span className="text-xs font-mono text-emerald-400 flex items-center gap-1 font-semibold">
                  +12% <TrendingUp size={12} />
                </span>
              </div>
              <p className="text-[10px] font-mono text-[#cbc3d7] uppercase tracking-wider">Total Tasks</p>
              <h3 className="text-2xl sm:text-3xl font-bold mt-1 text-white">1,284</h3>
            </div>

            <div className="glass-panel rounded-xl p-4 sm:p-6 ai-pulse-border transition-transform hover:-translate-y-1">
              <div className="flex justify-between items-start mb-3 sm:mb-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-[#c0c1ff]/10 flex items-center justify-center text-[#c0c1ff]">
                  <Cpu size={18} />
                </div>
                <span className="text-xs font-mono text-[#d0bcff] font-semibold tracking-wide uppercase px-2 py-0.5 rounded bg-[#d0bcff]/10 border border-[#d0bcff]/20">Active</span>
              </div>
              <p className="text-[10px] font-mono text-[#cbc3d7] uppercase tracking-wider">AI Automations</p>
              <h3 className="text-2xl sm:text-3xl font-bold mt-1 text-white">86</h3>
            </div>

            <div className="glass-panel rounded-xl p-4 sm:p-6 transition-transform hover:-translate-y-1">
              <div className="flex justify-between items-start mb-3 sm:mb-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-[#ffb869]/10 flex items-center justify-center text-[#ffb869]">
                  <Activity size={18} />
                </div>
                <span className="text-xs font-mono text-[#cbc3d7] font-semibold">92%</span>
              </div>
              <p className="text-[10px] font-mono text-[#cbc3d7] uppercase tracking-wider">Team Velocity</p>
              <h3 className="text-2xl sm:text-3xl font-bold mt-1 text-white">42.5</h3>
            </div>

            <div className="glass-panel rounded-xl p-4 sm:p-6 transition-transform hover:-translate-y-1">
              <div className="flex justify-between items-start mb-3 sm:mb-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-[#c0c1ff]">
                  <Zap size={18} />
                </div>
                <span className="text-xs font-mono text-emerald-400 font-semibold">↑ 24h</span>
              </div>
              <p className="text-[10px] font-mono text-[#cbc3d7] uppercase tracking-wider">Time Saved</p>
              <h3 className="text-2xl sm:text-3xl font-bold mt-1 text-white">312<span className="text-sm font-light ml-1 text-[#cbc3d7]">hrs</span></h3>
            </div>
          </div>

          {/* Analytics + Activity — sticky layout on scroll */}
          <div ref={chartRef} className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Recent Activity Feed */}
            <div className="lg:col-span-1 glass-panel rounded-xl flex flex-col">
              <div className="p-5 sm:p-6 border-b border-[#494454]/10 flex justify-between items-center">
                <h4 className="text-sm sm:text-base font-bold text-white uppercase tracking-wider">Recent Activity</h4>
                <button
                  onClick={() => setShowAllActivities(!showAllActivities)}
                  className="text-[#d0bcff] text-xs hover:underline transition-all flex items-center gap-1"
                >
                  {showAllActivities ? (
                    <><ChevronUp size={12} /> Show Less</>
                  ) : (
                    <><ChevronDown size={12} /> View All</>
                  )}
                </button>
              </div>

              <div className="p-5 sm:p-6 flex-grow space-y-5 overflow-y-auto max-h-[420px] lg:max-h-none">
                {visibleActivities.map((act, index) => (
                  <div key={act.id} className="flex gap-3 relative">
                    {index < visibleActivities.length - 1 && (
                      <div className="absolute left-4 top-9 bottom-0 w-[1px] bg-[#494454]/20"></div>
                    )}
                    <div className={`z-10 w-8 h-8 rounded-full bg-[#201f20] flex items-center justify-center border shrink-0 ${act.type === 'ai' ? 'border-[#d0bcff]/40' : act.type === 'milestone' ? 'border-emerald-500/40' : 'border-[#494454]/40'
                      }`}>
                      {act.type === 'ai' && <Cpu size={14} className="text-[#d0bcff]" />}
                      {act.type === 'milestone' && <CheckCircle size={14} className="text-emerald-400" />}
                      {act.type === 'user' && <Users size={14} className="text-[#cbc3d7]" />}
                      {act.type === 'system' && <Activity size={14} className="text-[#ffb869]" />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-[#cbc3d7] leading-relaxed">{act.message}</p>
                      <p className="text-[10px] font-mono text-[#cbc3d7]/50 mt-1">{act.time}</p>
                    </div>
                  </div>
                ))}

                {!showAllActivities && activities.length > visibleActivities.length && (
                  <button
                    onClick={() => setShowAllActivities(true)}
                    className="w-full py-2 text-[10px] font-mono text-[#d0bcff]/60 hover:text-[#d0bcff] border border-dashed border-[#494454]/20 rounded-lg transition-all"
                  >
                    + {activities.length - visibleActivities.length} more activities
                  </button>
                )}
              </div>
            </div>

            {/* Productivity Insights Chart — sticky when scrolled past */}
            <div className={`lg:col-span-2 glass-panel rounded-xl flex flex-col transition-all duration-300 ${isChartSticky ? 'lg:sticky lg:top-[72px] lg:self-start' : ''
              }`}>
              <div className="p-5 sm:p-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-white uppercase tracking-wide">Productivity Insights</h4>
                  <p className="text-xs text-[#cbc3d7]/70 font-light mt-0.5">
                    {selectedDay
                      ? `${selectedDay} — ${DAY_DATA[selectedDay].pct}% completion · ${DAY_DATA[selectedDay].tasks.length} tasks`
                      : 'Click a bar to inspect daily tasks'}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => setTimeRange('7')}
                    className={`px-3 py-1 rounded-full text-[10px] font-mono border transition-all cursor-pointer ${timeRange === '7' ? 'bg-[#353436] text-white border-[#494454]' : 'bg-transparent text-[#cbc3d7] border-transparent'
                      }`}
                  >
                    7 Days
                  </button>
                  <button
                    onClick={() => setTimeRange('30')}
                    className={`px-3 py-1 rounded-full text-[10px] font-mono border transition-all cursor-pointer ${timeRange === '30' ? 'bg-[#d0bcff]/10 text-[#d0bcff] border-[#d0bcff]/20' : 'bg-transparent text-[#cbc3d7] border-transparent'
                      }`}
                  >
                    30 Days
                  </button>
                </div>
              </div>

              {/* Chart bars */}
              <div className="px-4 sm:px-6 pb-2">
                <div className="relative h-40 sm:h-48 flex items-end justify-between gap-1.5 sm:gap-3">
                  {days.map((day) => {
                    const d = DAY_DATA[day];
                    const isSelected = selectedDay === day;
                    const isPeak = day === 'Sun';
                    return (
                      <div
                        key={day}
                        onClick={() => setSelectedDay(selectedDay === day ? null : day)}
                        className="flex-1 flex flex-col items-center group h-full justify-end cursor-pointer relative"
                      >
                        {isPeak && (
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#d0bcff] to-[#c0c1ff] text-[#1000a9] text-[8px] font-mono font-bold px-1.5 py-0.5 rounded shadow-lg select-none uppercase tracking-widest animate-pulse whitespace-nowrap z-10">
                            Peak
                          </div>
                        )}
                        <div
                          className={`w-full rounded-t-lg transition-all duration-200 ${isSelected
                              ? 'bg-gradient-to-t from-[#3131c0] to-[#d0bcff] shadow-lg shadow-[#d0bcff]/20 scale-105'
                              : isPeak
                                ? 'bg-gradient-to-t from-[#3131c0] to-[#6d3bd7] shadow-lg shadow-[#6d3bd7]/20 group-hover:opacity-90'
                                : 'bg-[#d0bcff]/20 hover:bg-[#d0bcff]/40'
                            }`}
                          style={{ height: `${d.pct}%` }}
                          title={`${day}: ${d.pct}%`}
                        ></div>
                        <span className={`text-[9px] sm:text-[10px] font-mono mt-2 transition-colors ${isSelected ? 'text-[#d0bcff] font-bold' : 'text-[#cbc3d7]'}`}>
                          {day}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="border-t border-[#494454]/10 mt-3 pt-3 flex justify-between text-[10px] sm:text-[11px] text-[#cbc3d7]/50 font-mono">
                  <span>Task Completion Velocity</span>
                  <span>{timeRange === '30' ? 'Average: 84.6%' : 'Average: 73.1%'}</span>
                </div>
              </div>

              {/* Day detail panel — slides in when a day is selected */}
              {selectedDayData && (
                <div className="mx-4 sm:mx-6 mb-4 sm:mb-6 mt-2 bg-[#131314]/60 rounded-xl border border-[#494454]/15 overflow-hidden">
                  <div className="px-4 py-3 border-b border-[#494454]/10 flex justify-between items-center">
                    <h5 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                      {selectedDay} — {selectedDayData.tasks.length} Tasks
                    </h5>
                    <button onClick={() => setSelectedDay(null)} className="text-[#cbc3d7]/50 hover:text-white transition-colors">
                      <X size={14} />
                    </button>
                  </div>
                  <div className="divide-y divide-[#494454]/10 max-h-44 overflow-y-auto">
                    {selectedDayData.tasks.map((task, i) => (
                      <div key={i} className="px-4 py-2.5 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${task.status === 'done' ? 'bg-emerald-400' : task.status === 'inprogress' ? 'bg-[#d0bcff]' : 'bg-[#ffb869]'
                            }`} />
                          <span className={`text-xs truncate ${task.status === 'done' ? 'text-[#cbc3d7]/70 line-through' : 'text-white'}`}>
                            {task.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[9px] font-mono text-[#cbc3d7]/40 hidden sm:block">{task.time}</span>
                          <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded uppercase ${STATUS_STYLE[task.status]}`}>
                            {task.status === 'inprogress' ? 'WIP' : task.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Active Projects */}
          <section className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-lg sm:text-xl font-bold tracking-tight text-white">Active Projects</h4>
              <button
                onClick={() => setShowAddProjectModal(true)}
                className="bg-gradient-to-r from-[#6d3bd7] to-[#3131c0] text-white px-3 sm:px-4 py-2 rounded-xl text-xs font-mono tracking-wider flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all cursor-pointer"
              >
                <Plus size={16} /> <span className="hidden sm:inline">NEW PROJECT</span><span className="sm:hidden">New</span>
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:gap-4">
              {filteredProjects.map((p) => (
                <div
                  key={p.id}
                  onClick={() => onSelectProject(p.id)}
                  className="glass-panel p-4 sm:p-5 rounded-xl flex flex-wrap lg:flex-nowrap items-center gap-3 sm:gap-6 group hover:bg-[#201f20] transition-all cursor-pointer border border-transparent hover:border-[#d0bcff]/10"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-tr from-[#6d3bd7] to-[#3131c0] flex items-center justify-center text-white shrink-0 shadow-lg shadow-[#3131c0]/15">
                    {p.name.includes("Neural") ? <Zap size={20} className="animate-pulse" /> : p.name.includes("Visual") ? <Rocket size={20} /> : p.name.includes("Security") ? <Shield size={20} /> : <HardDrive size={20} />}
                  </div>

                  <div className="flex-grow min-w-[160px]">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h5 className="font-bold text-sm sm:text-base text-white group-hover:text-[#d0bcff] transition-colors">{p.name}</h5>
                      <span className="text-[9px] uppercase font-mono px-2 py-0.5 rounded bg-[#cbc3d7]/10 text-[#cbc3d7]/80">Active</span>
                    </div>
                    <p className="text-xs text-[#cbc3d7]/60 font-light mt-0.5">{p.category}</p>
                  </div>

                  <div className="w-full sm:w-40 lg:w-48 shrink-0">
                    <div className="flex justify-between mb-1">
                      <span className="text-[10px] font-mono text-[#cbc3d7]">Progress</span>
                      <span className="text-[10px] font-mono text-[#d0bcff] font-bold">{p.progress}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-[#1c1b1c] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#6d3bd7] to-[#d0bcff] rounded-full transition-all duration-1000"
                        style={{ width: `${p.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex -space-x-2 shrink-0">
                    {p.team.slice(0, 3).map((t, idx) => (
                      <img
                        key={idx}
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-[#131314] object-cover"
                        alt={t.name}
                        title={t.name}
                        src={t.avatar}
                        referrerPolicy="no-referrer"
                      />
                    ))}
                    {p.team.length > 3 && (
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-[#131314] bg-[#353436] flex items-center justify-center text-[10px] font-mono text-white font-bold">
                        +{p.team.length - 3}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`w-2.5 h-2.5 rounded-full ${p.status === 'Completed' ? 'bg-emerald-500' : p.status === 'Delayed' ? 'bg-[#ffb869]' : 'bg-[#d0bcff]'
                      }`}></span>
                    <span className="text-xs font-mono font-medium">{p.status}</span>
                  </div>

                  <button className="text-[#cbc3d7] hover:text-[#d0bcff] transition-colors ml-auto shrink-0" onClick={e => e.stopPropagation()}>
                    <MoreVertical size={16} />
                  </button>
                </div>
              ))}

              {filteredProjects.length === 0 && (
                <div className="text-center py-10 glass-panel rounded-xl">
                  <p className="text-sm text-[#cbc3d7]/60">No projects found. Try resetting your search filter or add a new project.</p>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Create Project Modal */}
        {showAddProjectModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="bg-[#201f20] border border-[#d0bcff]/20 rounded-2xl w-full max-w-md p-5 sm:p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-sm sm:text-base font-bold text-white uppercase tracking-wider">Initialize Smart Project</h3>
                <button onClick={() => setShowAddProjectModal(false)} className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#1c1b1c] text-[#cbc3d7] hover:text-white hover:bg-[#353436] transition-all">
                  <X size={14} />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-[#cbc3d7] uppercase mb-1">Project Name</label>
                  <input
                    value={newProjName}
                    onChange={(e) => setNewProjName(e.target.value)}
                    placeholder="e.g. LLM fine-tuning container"
                    className="w-full bg-[#1c1b1c] border border-[#494454]/40 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#d0bcff]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-[#cbc3d7] uppercase mb-1">Category & Subsystems</label>
                  <input
                    value={newProjCategory}
                    onChange={(e) => setNewProjCategory(e.target.value)}
                    placeholder="e.g. Core Infrastructure / PyTorch"
                    className="w-full bg-[#1c1b1c] border border-[#494454]/40 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#d0bcff]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-[#cbc3d7] uppercase mb-1">Default Status</label>
                  <select
                    value={newProjStatus}
                    onChange={(e) => setNewProjStatus(e.target.value as any)}
                    className="w-full bg-[#1c1b1c] border border-[#494454]/40 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#d0bcff]"
                  >
                    <option value="On Track">On Track (Recommended)</option>
                    <option value="Delayed">Delayed</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-mono text-[#cbc3d7] uppercase mb-1">Initial Mock Progress: {newProjProgress}%</label>
                  <input
                    type="range" min="0" max="100"
                    value={newProjProgress}
                    onChange={(e) => setNewProjProgress(parseInt(e.target.value))}
                    className="w-full h-1 bg-[#1c1b1c] rounded-lg appearance-none cursor-pointer accent-[#d0bcff]"
                  />
                </div>
              </div>
              <div className="flex gap-3 justify-end mt-6">
                <button onClick={() => setShowAddProjectModal(false)} className="px-4 py-2 rounded-xl text-xs text-[#cbc3d7] hover:bg-[#353436] transition-all">
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (newProjName && newProjCategory) {
                      projects.push({
                        id: `p${projects.length + 1}`,
                        name: newProjName,
                        category: newProjCategory,
                        status: newProjStatus,
                        progress: newProjProgress,
                        team: [
                          { name: 'Alex Rivera', avatar: AVATARS.alexRivera },
                          { name: 'Mahima', avatar: AVATARS.head7 }
                        ],
                        icon: 'smart_toy'
                      });
                      setShowAddProjectModal(false);
                      setNewProjName('');
                      setNewProjCategory('');
                    }
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-[#6d3bd7] to-[#3131c0] rounded-xl text-xs font-bold text-white hover:opacity-95 transition-all"
                >
                  Confirm Initialize
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Global Footer */}
        <GlobalFooter />
      </main>
    </div>
  );
}