import React from 'react';

export default function TaskCard({
  task,
  onEdit,
  onDelete,
  onUpdateStatus,
  onToggleSubtask,
}) {
  const getPriorityStyle = (prio) => {
    switch (prio) {
      case 'High':
        return 'bg-rose-50 text-rose-700 border-rose-100';
      case 'Medium':
        return 'bg-amber-50 text-amber-700 border-amber-100';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  const getCategoryColor = (cat) => {
    switch (cat) {
      case 'Work':
        return 'bg-blue-100 text-blue-800';
      case 'Personal':
        return 'bg-emerald-100 text-emerald-800';
      case 'Shopping':
        return 'bg-purple-100 text-purple-800';
      case 'Health':
        return 'bg-teal-100 text-teal-800';
      case 'Urgent':
        return 'bg-rose-100 text-rose-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  const completedSubtasksCount = task.subtasks
    ? task.subtasks.filter((s) => s.completed).length
    : 0;
  const totalSubtasksCount = task.subtasks ? task.subtasks.length : 0;
  const progressPercent =
    totalSubtasksCount > 0
      ? Math.round((completedSubtasksCount / totalSubtasksCount) * 100)
      : 0;

  // Determine relative due status
  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'Done';
  const isDueToday =
    new Date(task.dueDate).toDateString() === new Date().toDateString() &&
    task.status !== 'Done';

  return (
    <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-slate-200 transition-all duration-200 flex flex-col justify-between group">
      <div>
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex flex-wrap gap-1.5">
            <span
              className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-md border ${getPriorityStyle(
                task.priority
              )}`}
            >
              {task.priority} Priority
            </span>
            <span
              className={`px-2 py-0.5 text-[10px] font-semibold rounded-md ${getCategoryColor(
                task.category
              )}`}
            >
              {task.category}
            </span>
          </div>

          <select
            value={task.status}
            onChange={(e) => onUpdateStatus(task.id, e.target.value)}
            className="text-[11px] font-semibold text-slate-500 bg-slate-50 rounded px-2 py-0.5 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Review">Review</option>
            <option value="Done">Done</option>
          </select>
        </div>

        <h3 className="text-base font-semibold text-slate-800 leading-snug mb-1.5 group-hover:text-indigo-600 transition-colors">
          {task.title}
        </h3>

        <p className="text-xs text-slate-500 leading-relaxed mb-4 line-clamp-3">
          {task.description || (
            <em className="text-slate-300">No additional notes.</em>
          )}
        </p>

        {totalSubtasksCount > 0 && (
          <div className="mb-4 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600 mb-1.5">
              <span>Subtasks Checklist</span>
              <span>
                {completedSubtasksCount}/{totalSubtasksCount} ({progressPercent}%)
              </span>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full mb-3 overflow-hidden">
              <div
                className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
              {task.subtasks.map((sub) => (
                <label
                  key={sub.id}
                  className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer hover:text-slate-800 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={sub.completed}
                    onChange={() => onToggleSubtask(task.id, sub.id)}
                    className="w-3.5 h-3.5 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500"
                  />
                  <span className={sub.completed ? 'line-through text-slate-400' : ''}>
                    {sub.text}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        <div
          className={`flex items-center gap-1 font-medium ${
            isOverdue
              ? 'text-rose-600 font-semibold'
              : isDueToday
                ? 'text-amber-600 font-semibold'
                : 'text-slate-500'
          }`}
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span className="truncate max-w-[110px] sm:max-w-none">
            {isOverdue ? 'Overdue: ' : isDueToday ? 'Due Today: ' : 'Due: '}
            {task.dueDate}
          </span>
        </div>

        <div className="flex gap-1.5">
          <button
            onClick={() => onEdit(task)}
            className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded transition-colors"
            title="Edit Task Settings"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
            title="Delete Task Permanently"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

