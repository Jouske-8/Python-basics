import React, { useEffect, useMemo, useState } from 'react';
import { taskApi } from '../services/taskService.js';

import TinyDonutChart from '../components/TinyDonutChart.jsx';
import CategoryBarBreakdown from '../components/CategoryBarBreakdown.jsx';
import ToastContainer from '../components/ToastContainer.jsx';
import TaskCard from '../components/TaskCard.jsx';
import TaskModal from '../components/TaskModal.jsx';

export default function TaskManagerPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);
  const [sandboxErrorEnabled, setSandboxErrorEnabled] = useState(false);

  // Filter/Sort State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState('All');
  const [filterCategory, setFilterCategory] = useState('All');
  const [sortBy, setSortBy] = useState('dueDateAsc'); // dueDateAsc | dueDateDesc | priorityHigh | titleAsc
  const [viewLayout, setViewLayout] = useState('board'); // board (Kanban) | list

  // Modal Control
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Alert system state
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  useEffect(() => {
    taskApi.setErrorMode(sandboxErrorEnabled);
  }, [sandboxErrorEnabled]);

  // Load Initial Tasks from Mock API
  const handleLoadTasks = async () => {
    setLoading(true);
    setApiError(null);
    try {
      const data = await taskApi.fetchTasks();
      setTasks(data);
    } catch (err) {
      setApiError(err.message);
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleLoadTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Save/Update Task API Execution
  const handleSaveTask = async (taskPayload) => {
    try {
      const saved = await taskApi.saveTask(taskPayload);

      setTasks((prev) => {
        const exists = prev.some((t) => t.id === saved.id);
        if (exists) {
          return prev.map((t) => (t.id === saved.id ? saved : t));
        }
        return [saved, ...prev];
      });

      addToast(
        editingTask ? `Successfully saved updates to \"${saved.title}\".` : `Created new workspace task \"${saved.title}\".`,
        'success'
      );

      setIsModalOpen(false);
      setEditingTask(null);
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  // Delete Task execution
  const handleDeleteTask = async (id) => {
    const targetTask = tasks.find((t) => t.id === id);
    const originalTitle = targetTask ? targetTask.title : 'Selected Task';

    try {
      await taskApi.deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      addToast(`Permanently deleted task \"${originalTitle}\".`, 'success');
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  // Switch task status directly (Board column interaction or Select dropdown)
  const handleUpdateTaskStatus = async (id, nextStatus) => {
    const taskToMove = tasks.find((t) => t.id === id);
    if (!taskToMove || taskToMove.status === nextStatus) return;

    const updated = { ...taskToMove, status: nextStatus };
    try {
      await taskApi.saveTask(updated);
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
      addToast(`Moved \"${taskToMove.title}\" state to \"${nextStatus}\".`, 'success');
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  // Toggle subtask completeness inline from Dashboard Card
  const handleToggleSubtask = async (taskId, subtaskId) => {
    const parentTask = tasks.find((t) => t.id === taskId);
    if (!parentTask) return;

    const updatedSubtasks = parentTask.subtasks.map((s) =>
      s.id === subtaskId ? { ...s, completed: !s.completed } : s
    );
    const updatedTask = { ...parentTask, subtasks: updatedSubtasks };

    try {
      setTasks((prev) => prev.map((t) => (t.id === taskId ? updatedTask : t)));
      await taskApi.saveTask(updatedTask);
    } catch (err) {
      setTasks((prev) => prev.map((t) => (t.id === taskId ? parentTask : t)));
      addToast(err.message, 'error');
    }
  };

  const handleOpenCreateModal = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const processedTasks = useMemo(() => {
    let output = [...tasks];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      output = output.filter(
        (t) => t.title.toLowerCase().includes(query) || t.description.toLowerCase().includes(query)
      );
    }

    if (filterPriority !== 'All') {
      output = output.filter((t) => t.priority === filterPriority);
    }

    if (filterCategory !== 'All') {
      output = output.filter((t) => t.category === filterCategory);
    }

    output.sort((a, b) => {
      if (sortBy === 'dueDateAsc') return new Date(a.dueDate) - new Date(b.dueDate);
      if (sortBy === 'dueDateDesc') return new Date(b.dueDate) - new Date(a.dueDate);
      if (sortBy === 'priorityHigh') {
        const score = { High: 3, Medium: 2, Low: 1 };
        return score[b.priority] - score[a.priority];
      }
      if (sortBy === 'titleAsc') return a.title.localeCompare(b.title);
      return 0;
    });

    return output;
  }, [tasks, searchQuery, filterPriority, filterCategory, sortBy]);

  const statsSummary = useMemo(() => {
    const total = tasks.length;
    const todo = tasks.filter((t) => t.status === 'To Do').length;
    const progress = tasks.filter((t) => t.status === 'In Progress').length;
    const review = tasks.filter((t) => t.status === 'Review').length;
    const done = tasks.filter((t) => t.status === 'Done').length;
    return { total, todo, progress, review, done };
  }, [tasks]);

  const columns = ['To Do', 'In Progress', 'Review', 'Done'];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased pb-20">
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      <header className="bg-slate-900 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-md">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-black tracking-tight flex items-center gap-2">
                  SprintTask
                  <span className="text-xs bg-indigo-500 bg-opacity-40 text-indigo-200 px-2 py-0.5 rounded-full font-bold">
                    PRO
                  </span>
                </h1>
                <p className="text-xs text-slate-400">Collaborative Workspace Task Coordinator</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 bg-slate-800 p-2.5 rounded-xl border border-slate-700 text-xs">
              <span className="font-semibold text-slate-300">Sandbox API Config:</span>
              <button
                onClick={() => {
                  setSandboxErrorEnabled(!sandboxErrorEnabled);
                  addToast(
                    !sandboxErrorEnabled
                      ? 'Simulated offline errors ACTIVE. Actions will trigger API failures.'
                      : 'API simulation ONLINE. Operations now execute correctly.',
                    !sandboxErrorEnabled ? 'error' : 'success'
                  );
                }}
                className={`px-3 py-1 rounded font-bold transition-all ${
                  sandboxErrorEnabled
                    ? 'bg-rose-500 text-white shadow-sm'
                    : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                }`}
              >
                {sandboxErrorEnabled ? '⚠️ Server Sim Offline' : '🟢 Server Sim Online'}
              </button>
              <button
                onClick={handleLoadTasks}
                className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-bold transition-all"
                title="Force API Fetch"
              >
                Sync DB
              </button>
            </div>
          </div>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <TinyDonutChart tasks={tasks} />

          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 grid grid-cols-4 gap-2">
            <div className="bg-slate-50 rounded-lg p-2 flex flex-col justify-center items-center">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">To Do</span>
              <span className="text-xl font-bold text-slate-700 mt-1">{statsSummary.todo}</span>
            </div>
            <div className="bg-indigo-50 rounded-lg p-2 flex flex-col justify-center items-center">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-indigo-500">Active</span>
              <span className="text-xl font-bold text-indigo-600 mt-1">{statsSummary.progress}</span>
            </div>
            <div className="bg-amber-50 rounded-lg p-2 flex flex-col justify-center items-center">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-amber-500">Review</span>
              <span className="text-xl font-bold text-amber-600 mt-1">{statsSummary.review}</span>
            </div>
            <div className="bg-emerald-50 rounded-lg p-2 flex flex-col justify-center items-center">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-emerald-500">Done</span>
              <span className="text-xl font-bold text-emerald-600 mt-1">{statsSummary.done}</span>
            </div>
          </div>

          <CategoryBarBreakdown tasks={tasks} />
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
            <div className="flex-1 min-w-[260px] relative">
              <input
                type="text"
                placeholder="Search tasks by description or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-sm pl-9 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
              />
              <span className="absolute left-3 top-2.5 text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="text-xs font-semibold px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer text-slate-600"
                >
                  <option value="All">All Categories</option>
                  <option value="Work">Work</option>
                  <option value="Personal">Personal</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Health">Health</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>

              <div>
                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="text-xs font-semibold px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer text-slate-600"
                >
                  <option value="All">All Priorities</option>
                  <option value="Low">Low Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="High">High Priority</option>
                </select>
              </div>

              <div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-xs font-semibold px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer text-slate-600"
                >
                  <option value="dueDateAsc">Date: Earliest First</option>
                  <option value="dueDateDesc">Date: Latest First</option>
                  <option value="priorityHigh">Priority: High First</option>
                  <option value="titleAsc">Title: Alphabetical</option>
                </select>
              </div>

              <div className="flex items-center gap-0.5 bg-slate-100 p-1 rounded-lg border border-slate-200">
                <button
                  onClick={() => setViewLayout('board')}
                  className={`p-1.5 rounded-md transition-colors ${
                    viewLayout === 'board' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                  }`}
                  title="Kanban Board View"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4z"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => setViewLayout('list')}
                  className={`p-1.5 rounded-md transition-colors ${
                    viewLayout === 'list' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                  }`}
                  title="Compact List View"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>

              <button
                onClick={handleOpenCreateModal}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2.5 rounded-lg shadow-sm transition-all flex items-center gap-1"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                </svg>
                New Task
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
            {[1, 2, 3, 4].map((idx) => (
              <div key={idx} className="bg-white border border-slate-100 rounded-xl p-5 h-64 space-y-4">
                <div className="flex justify-between">
                  <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                  <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                </div>
                <div className="h-6 bg-slate-200 rounded w-4/5"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-slate-200 rounded"></div>
                  <div className="h-3 bg-slate-200 rounded w-5/6"></div>
                </div>
                <div className="pt-4 border-t border-slate-100 flex justify-between">
                  <div className="h-3 bg-slate-200 rounded w-1/3"></div>
                  <div className="h-3 bg-slate-200 rounded w-1/5"></div>
                </div>
              </div>
            ))}
          </div>
        ) : apiError ? (
          <div className="bg-rose-50 border border-rose-100 rounded-2xl p-8 text-center max-w-xl mx-auto my-12">
            <div className="bg-rose-100 text-rose-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Remote Service Interrupted</h3>
            <p className="text-xs text-slate-600 mb-6 leading-relaxed max-w-sm mx-auto">{apiError}</p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setSandboxErrorEnabled(false)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg shadow-sm transition-all"
              >
                Restore Online Sync
              </button>
              <button
                onClick={handleLoadTasks}
                className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 font-semibold text-xs bg-white transition-all"
              >
                Retry Request
              </button>
            </div>
          </div>
        ) : processedTasks.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center max-w-lg mx-auto">
            <div className="bg-slate-50 text-slate-400 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2"
                />
              </svg>
            </div>
            <h3 className="text-base font-bold text-slate-700 mb-1">No Matching Tasks Located</h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto mb-5 leading-relaxed">
              We couldn't locate any tasks aligned with your current filter attributes or query parameters.
            </p>
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => {
                  setSearchQuery('');
                  setFilterPriority('All');
                  setFilterCategory('All');
                }}
                className="px-3.5 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg text-xs font-bold transition-all"
              >
                Clear Search Constraints
              </button>
              <button
                onClick={handleOpenCreateModal}
                className="px-3.5 py-1.5 bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg text-xs font-bold transition-all"
              >
                Register Fresh Workspace
              </button>
            </div>
          </div>
        ) : viewLayout === 'board' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
            {columns.map((col) => {
              const columnTasks = processedTasks.filter((t) => t.status === col);

              let badgeColor = 'bg-slate-100 text-slate-700';
              if (col === 'In Progress') badgeColor = 'bg-indigo-100 text-indigo-700';
              if (col === 'Review') badgeColor = 'bg-amber-100 text-amber-700';
              if (col === 'Done') badgeColor = 'bg-emerald-100 text-emerald-700';

              return (
                <div
                  key={col}
                  className="bg-slate-100 bg-opacity-70 rounded-2xl p-4 border border-slate-200 border-opacity-50 flex flex-col max-h-[80vh]"
                >
                  <div className="flex items-center justify-between mb-4 px-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${badgeColor}`}>{col}</span>
                      <span className="text-xs text-slate-400 font-semibold">{columnTasks.length}</span>
                    </div>
                    <button
                      onClick={() => {
                        setEditingTask(null);
                        setIsModalOpen(true);
                      }}
                      className="text-slate-400 hover:text-indigo-600 p-1 rounded-lg hover:bg-white transition-all"
                      title={`Add task into ${col}`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>

                  <div className="space-y-4 overflow-y-auto pr-1 flex-1 pb-2">
                    {columnTasks.length > 0 ? (
                      columnTasks.map((task) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          onEdit={handleOpenEditModal}
                          onDelete={handleDeleteTask}
                          onUpdateStatus={handleUpdateTaskStatus}
                          onToggleSubtask={handleToggleSubtask}
                        />
                      ))
                    ) : (
                      <div className="border border-dashed border-slate-300 rounded-xl p-6 text-center text-xs text-slate-400 py-10 bg-slate-50 bg-opacity-50">
                        No tasks here.
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white border border-slate-100 rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-xs text-slate-500 font-bold uppercase tracking-wider">
                    <th className="px-6 py-4">Title & Description</th>
                    <th className="px-6 py-4 w-32">Status</th>
                    <th className="px-6 py-4 w-28">Priority</th>
                    <th className="px-6 py-4 w-28">Category</th>
                    <th className="px-6 py-4 w-32">Due Date</th>
                    <th className="px-6 py-4 w-24 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {processedTasks.map((task) => {
                    const totalSub = task.subtasks?.length || 0;
                    const compSub = task.subtasks?.filter((s) => s.completed).length || 0;

                    return (
                      <tr key={task.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-semibold text-slate-800">{task.title}</div>
                          <div className="text-xs text-slate-500 mt-0.5 line-clamp-1">{task.description}</div>
                          {totalSub > 0 && (
                            <div className="flex items-center gap-2 mt-2 text-xs text-indigo-600 font-medium">
                              <span className="bg-indigo-50 px-1.5 py-0.5 rounded">
                                {compSub}/{totalSub} Checklist Items
                              </span>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={task.status}
                            onChange={(e) => handleUpdateTaskStatus(task.id, e.target.value)}
                            className="text-xs font-semibold text-slate-600 bg-slate-50 rounded border border-slate-200 px-2 py-1 focus:outline-none"
                          >
                            <option value="To Do">To Do</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Review">Review</option>
                            <option value="Done">Done</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded border ${
                              task.priority === 'High'
                                ? 'bg-rose-50 text-rose-700 border-rose-100'
                                : task.priority === 'Medium'
                                  ? 'bg-amber-50 text-amber-700 border-amber-100'
                                  : 'bg-slate-50 text-slate-600 border-slate-100'
                            }`}
                          >
                            {task.priority}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-600 font-medium">{task.category}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-600">{task.dueDate}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-xs">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleOpenEditModal(task)}
                              className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteTask(task.id)}
                              className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      <TaskModal
        isOpen={isModalOpen}
        taskToEdit={editingTask}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
        }}
        onSave={handleSaveTask}
      />
    </div>
  );
}

