import React, { useMemo } from 'react';

export default function CategoryBarBreakdown({ tasks }) {
  const categories = ['Work', 'Personal', 'Shopping', 'Health', 'Urgent'];

  const data = useMemo(() => {
    const counts = {};
    categories.forEach((c) => (counts[c] = 0));
    tasks.forEach((t) => {
      if (counts[t.category] !== undefined) counts[t.category]++;
    });
    return counts;
  }, [tasks]);

  const maxVal = Math.max(...Object.values(data), 1);

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex-1 min-w-[280px]">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
        Tasks Category Density
      </h4>
      <div className="space-y-2">
        {categories.map((cat) => {
          const count = data[cat];
          const pct = Math.round((count / maxVal) * 100);

          let color = 'bg-slate-500';
          if (cat === 'Work') color = 'bg-blue-500';
          if (cat === 'Personal') color = 'bg-emerald-500';
          if (cat === 'Shopping') color = 'bg-purple-500';
          if (cat === 'Health') color = 'bg-teal-500';
          if (cat === 'Urgent') color = 'bg-rose-500';

          return (
            <div key={cat} className="flex items-center text-xs">
              <span className="w-16 font-medium text-slate-600">{cat}</span>
              <div className="flex-1 bg-slate-100 h-2.5 rounded-full mx-2 overflow-hidden">
                <div className={`h-full ${color} rounded-full`} style={{ width: `${pct}%` }} />
              </div>
              <span className="w-6 text-right font-bold text-slate-700">{count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

