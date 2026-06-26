import React from 'react';

export default function TinyDonutChart({ tasks }) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === 'Done').length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  // SVG Ring Math
  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
      <div className="relative flex items-center justify-center">
        <svg className="w-20 h-20 transform -rotate-90">
          <circle
            cx="40"
            cy="40"
            r={radius}
            className="text-slate-100"
            strokeWidth="6"
            stroke="currentColor"
            fill="transparent"
          />
          <circle
            cx="40"
            cy="40"
            r={radius}
            className="text-indigo-600 transition-all duration-500 ease-out"
            strokeWidth="6"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
          />
        </svg>
        <span className="absolute text-sm font-bold text-slate-700">{percentage}%</span>
      </div>
      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Completion</h4>
        <p className="text-2xl font-bold text-slate-800">
          {completed}/{total}
        </p>
        <p className="text-xs text-slate-500">Tasks resolved overall</p>
      </div>
    </div>
  );
}

