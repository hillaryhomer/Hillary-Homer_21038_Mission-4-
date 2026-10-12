# TaskFlow — Daily To-Do List

Responsive daily task tracker created with HTML, CSS, and vanilla JavaScript.

## Features
- Profile (name and job role) and current date
- Add a task with Low, Medium, or High priority
- Optional due date and overdue badge (bonus)
- To Do and Done columns with interactive checkboxes
- Delete a single task or all tasks (with confirmation)
- Task counters and completion progress
- Mobile-friendly layout
- Data saved automatically using localStorage

## Run locally
Open `index.html` in a modern browser. No dependencies or server required.

## Customize profile
Edit `NAME` and `ROLE` at the top of `script.js`.

## Files
- `index.html`: structure
- `style.css`: layout, colors, responsive design
- `script.js`: task logic and browser storage

## Manual test checklist
1. Add a task, confirm it appears in To Do with today's creation date and the selected priority.
2. Check the task, confirm it moves to Done with crossed-out text.
3. Uncheck it, confirm it moves back to To Do.
4. Delete one task, confirm other tasks remain.
5. Add multiple tasks, select Delete all, cancel (no deletion); repeat and confirm (everything deleted).
6. Refresh the page, confirm existing tasks persist.
7. Add a task with a past due date, confirm it shows Overdue while unfinished.
8. Resize to mobile width, confirm buttons and columns remain usable.

## Submission
Push these files to a GitHub repository or compress the `todo-list` folder into ZIP, then submit the repository link/ZIP using the course Google Form. Submit proof through Google Classroom.
