# Task Manager Refactor TODO

- [x] Create `src/services/taskService.js` and move `TaskApiService` + `INITIAL_TASKS` from `src/App.jsx`.

- [x] Create reusable components under `src/components/`:
  - [x] `TinyDonutChart.jsx`
  - [x] `CategoryBarBreakdown.jsx`
  - [x] `ToastContainer.jsx`
  - [x] `TaskCard.jsx`
  - [x] `TaskModal.jsx`

- [ ] Create page under `src/pages/TaskManagerPage.jsx`:
  - [ ] Move all state, handlers, memos, and main JSX from `src/App.jsx`.
  - [ ] Replace inline component definitions with imports from `src/components/*`.
  - [ ] Replace inlined API usage with `taskApi` from `src/services/taskService.js`.
- [x] Edit `src/App.jsx` to be a thin wrapper that renders `TaskManagerPage`.
- [x] Run `npm run build` (or `npm run dev`) and fix any import/build issues.


