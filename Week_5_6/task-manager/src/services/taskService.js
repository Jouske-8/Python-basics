const INITIAL_TASKS = [
  {
    id: "task-1",
    title: "Design Premium Dashboard",
    description:
      "Design high-fidelity mockups for the project management analytics page in Figma. Include comprehensive light & dark mode variants.",
    status: "In Progress", // "To Do" | "In Progress" | "Review" | "Done"
    priority: "High", // "Low" | "Medium" | "High"
    category: "Work", // "Work" | "Personal" | "Shopping" | "Health" | "Urgent"
    dueDate: "2026-07-15",
    subtasks: [
      { id: "sub-1", text: "Create wireframe structures", completed: true },
      { id: "sub-2", text: "Build high-fidelity color concepts", completed: false },
      { id: "sub-3", text: "Design unified system tokens", completed: false },
    ],
    createdAt: "2026-06-25T10:00:00.000Z",
  },
  {
    id: "task-2",
    title: "Weekly Grocery Prep",
    description:
      "Stock up on organic vegetables, berries, dairy alternatives, whole grains, and basic protein sources for meal prep.",
    status: "To Do",
    priority: "Medium",
    category: "Personal",
    dueDate: "2026-06-28",
    subtasks: [
      { id: "sub-4", text: "Select farm-fresh greens", completed: false },
      { id: "sub-5", text: "Pick up fresh high-protein yogurt", completed: false },
    ],
    createdAt: "2026-06-26T08:00:00.000Z",
  },
  {
    id: "task-3",
    title: "Read Clean Architecture Ch. 5-8",
    description:
      "Review SOLID design principles and structural dependencies inside modern clean architecture models.",
    status: "Done",
    priority: "Low",
    category: "Personal",
    dueDate: "2026-06-24",
    subtasks: [
      { id: "sub-6", text: "Read Chapter 5 (SRP)", completed: true },
      { id: "sub-7", text: "Read Chapter 6 (OCP)", completed: true },
    ],
    createdAt: "2026-06-20T14:00:00.000Z",
  },
  {
    id: "task-4",
    title: "Connect Firebase Auth API",
    description:
      "Incorporate robust authentication API endpoints inside our custom state manager hooks.",
    status: "Review",
    priority: "High",
    category: "Work",
    dueDate: "2026-06-30",
    subtasks: [
      { id: "sub-8", text: "Configure secure environment variables", completed: true },
      { id: "sub-9", text: "Test standard login response flows", completed: true },
      { id: "sub-10", text: "Develop automatic token refresh flow", completed: false },
    ],
    createdAt: "2026-06-24T09:00:00.000Z",
  },
];

class TaskApiService {
  constructor() {
    this.STORAGE_KEY = "react_task_manager_data";
    this.simulatedErrorMode = false;
  }

  // Toggle API failures
  setErrorMode(enabled) {
    this.simulatedErrorMode = Boolean(enabled);
  }

  _getLocalDB() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error("Local storage read failure, fallback loaded", e);
    }
    this._setLocalDB(INITIAL_TASKS);
    return INITIAL_TASKS;
  }

  _setLocalDB(tasks) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tasks));
    } catch (e) {
      console.error("Local storage save failure", e);
    }
  }

  // Simulates standard RESTful API delay with mock outcomes
  async fetchTasks() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (this.simulatedErrorMode) {
          reject(
            new Error(
              "Database offline: Failed to establish server connection. Try toggling sandbox mode."
            )
          );
        } else {
          resolve(this._getLocalDB());
        }
      }, 700);
    });
  }

  async saveTask(task) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (this.simulatedErrorMode) {
          reject(new Error("Gateway Timeout: Failed to persist records to the server."));
        } else {
          const db = this._getLocalDB();
          let updatedDb;
          const isExisting = db.some((t) => t.id === task.id);

          if (isExisting) {
            updatedDb = db.map((t) => (t.id === task.id ? task : t));
          } else {
            updatedDb = [task, ...db];
          }

          this._setLocalDB(updatedDb);
          resolve(task);
        }
      }, 500);
    });
  }

  async deleteTask(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (this.simulatedErrorMode) {
          reject(new Error("Internal Server Error: Execution of task deletion failed."));
        } else {
          const db = this._getLocalDB();
          const updatedDb = db.filter((t) => t.id !== id);
          this._setLocalDB(updatedDb);
          resolve(id);
        }
      }, 500);
    });
  }
}

export const taskApi = new TaskApiService();
export { INITIAL_TASKS };

