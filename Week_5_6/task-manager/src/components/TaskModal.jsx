import React, { useEffect, useState } from 'react';

export default function TaskModal({ isOpen, taskToEdit, onClose, onSave }) {
  if (!isOpen) return null;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('To Do');
  const [priority, setPriority] = useState('Medium');
  const [category, setCategory] = useState('Work');
  const [dueDate, setDueDate] = useState('');

  // Subtasks logic
  const [subtasks, setSubtasks] = useState([]);
  const [newSubtaskText, setNewSubtaskText] = useState('');

  // Validation States
  const [errors, setErrors] = useState({});

  // Seed form when editing is triggered
  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title || '');
      setDescription(taskToEdit.description || '');
      setStatus(taskToEdit.status || 'To Do');
      setPriority(taskToEdit.priority || 'Medium');
      setCategory(taskToEdit.category || 'Work');
      setDueDate(taskToEdit.dueDate || '');
      setSubtasks(taskToEdit.subtasks || []);
    } else {
      setTitle('');
      setDescription('');
      setStatus('To Do');
      setPriority('Medium');
      setCategory('Work');

      // Default to one week out
      const defaultDate = new Date();
      defaultDate.setDate(defaultDate.getDate() + 7);
      setDueDate(defaultDate.toISOString().split('T')[0]);
      setSubtasks([]);
    }
    setErrors({});
  }, [taskToEdit, isOpen]);

  const validate = () => {
    const newErrors = {};
    if (!title.trim()) {
      newErrors.title = 'Task title is strictly required.';
    } else if (title.trim().length < 3) {
      newErrors.title = 'Task title must be at least 3 characters long.';
    } else if (title.trim().length > 80) {
      newErrors.title = 'Task title cannot exceed 80 characters.';
    }

    if (description.length > 500) {
      newErrors.description = 'Task description cannot exceed 500 characters.';
    }

    if (!dueDate) {
      newErrors.dueDate = 'Please specify a target date.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddSubtask = (e) => {
    e.preventDefault();
    if (!newSubtaskText.trim()) return;
    setSubtasks([
      ...subtasks,
      { id: `sub-${Date.now()}`, text: newSubtaskText.trim(), completed: false },
    ]);
    setNewSubtaskText('');
  };

  const handleRemoveSubtask = (subId) => {
    setSubtasks(subtasks.filter((s) => s.id !== subId));
  };

  const handleToggleSubtaskLocal = (subId) => {
    setSubtasks(subtasks.map((s) => (s.id === subId ? { ...s, completed: !s.completed } : s)));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const savedTask = {
      id: taskToEdit ? taskToEdit.id : `task-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
      category,
      dueDate,
      subtasks,
      createdAt: taskToEdit ? taskToEdit.createdAt : new Date().toISOString(),
    };

    onSave(savedTask);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900 bg-opacity-65 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden transform transition-all border border-slate-100 flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-800">
            {taskToEdit ? 'Modify Existing Task' : 'Register New Task Workspace'}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors text-xl leading-none"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">
              Task Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g., Code API validation middleware"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full text-sm px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.title
                  ? 'border-rose-400 focus:ring-rose-200 focus:border-rose-500'
                  : 'border-slate-300 focus:ring-indigo-200 focus:border-indigo-500'
              }`}
            />
            {errors.title && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">
              Detailed Description
            </label>
            <textarea
              placeholder="Provide clean notes, documentation references or requirements..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="3"
              className={`w-full text-sm px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.description
                  ? 'border-rose-400 focus:ring-rose-200 focus:border-rose-500'
                  : 'border-slate-300 focus:ring-indigo-200 focus:border-indigo-500'
              }`}
            />
            <div className="flex justify-between items-center text-[10px] text-slate-400 mt-0.5">
              <span>Limit notes to 500 characters.</span>
              <span className={description.length > 500 ? 'text-rose-500 font-bold' : ''}>
                {description.length}/500 chars
              </span>
            </div>
            {errors.description && (
              <p className="text-xs text-rose-500 mt-1 font-medium">{errors.description}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">
                State Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 bg-white"
              >
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Review">Review</option>
                <option value="Done">Done</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">
                System Category Tag
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 bg-white"
              >
                <option value="Work">Work</option>
                <option value="Personal">Personal</option>
                <option value="Shopping">Shopping</option>
                <option value="Health">Health</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">
                Urgency Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full text-sm px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 bg-white"
              >
                <option value="Low">Low Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="High">High Priority</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1">
                Due Date Target <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className={`w-full text-sm px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.dueDate ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-300 focus:ring-indigo-200'
                }`}
              />
              {errors.dueDate && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.dueDate}</p>}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-1.5">
              Task Checklist (Subtasks)
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                placeholder="Add subtask items..."
                value={newSubtaskText}
                onChange={(e) => setNewSubtaskText(e.target.value)}
                className="flex-1 text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSubtask(e);
                  }
                }}
              />
              <button
                type="button"
                onClick={handleAddSubtask}
                className="px-3 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-all font-semibold text-xs whitespace-nowrap"
              >
                Add Link
              </button>
            </div>

            {subtasks.length > 0 ? (
              <div className="space-y-1.5 max-h-40 overflow-y-auto border border-slate-100 rounded-lg p-2 bg-slate-50">
                {subtasks.map((sub) => (
                  <div
                    key={sub.id}
                    className="flex items-center justify-between gap-2 p-1.5 bg-white border border-slate-100 rounded text-xs"
                  >
                    <label className="flex items-center gap-2 cursor-pointer flex-1">
                      <input
                        type="checkbox"
                        checked={sub.completed}
                        onChange={() => handleToggleSubtaskLocal(sub.id)}
                        className="w-3.5 h-3.5 rounded text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className={sub.completed ? 'line-through text-slate-400' : 'text-slate-700'}>
                        {sub.text}
                      </span>
                    </label>
                    <button
                      type="button"
                      onClick={() => handleRemoveSubtask(sub.id)}
                      className="text-rose-500 hover:text-rose-700 text-base font-bold leading-none px-1"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No checklist items defined yet.</p>
            )}
          </div>
        </form>

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 transition-all font-semibold text-xs"
          >
            Cancel
          </button>
          <button
            onClick={handleFormSubmit}
            type="button"
            className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-md transition-all font-bold text-xs"
          >
            Commit Task
          </button>
        </div>
      </div>
    </div>
  );
}

