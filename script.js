'use strict';

// Keep everything in this browser; no backend is needed for this assignment.
const STORAGE_KEY = 'taskflow_tasks_v1';
const NAME = 'Employee'; // Change to your name.
const ROLE = 'Team Member'; // Change to your job title.
const $ = (id) => document.getElementById(id);
let tasks = loadTasks();

$('profileName').textContent = NAME;
$('profileRole').textContent = ROLE;
$('avatar').textContent = NAME.trim().charAt(0).toUpperCase() || 'E';

const today = new Date();
$('currentDay').textContent = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(today);
$('currentDate').textContent = new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'long', year: 'numeric' }).format(today);

function loadTasks() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    if (!Array.isArray(saved)) return [];
    return saved.filter(task => task && typeof task.id === 'string' && typeof task.text === 'string' && ['low', 'medium', 'high'].includes(task.priority) && typeof task.completed === 'boolean');
  } catch (error) {
    console.warn('Saved tasks could not be read:', error);
    return [];
  }
}

function saveTasks() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    $('formMessage').textContent = 'Storage unavailable: tasks may disappear after refresh.';
  }
}

function todayLocal() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatDate(dateString) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return dateString;
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'short', year: 'numeric' }).format(date);
}

function createTaskElement(task) {
  const card = document.createElement('article');
  card.className = `task${task.completed ? ' completed' : ''}`;

  const top = document.createElement('div');
  top.className = 'task-top';
  const label = document.createElement('label');
  label.className = 'task-check';
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = task.completed;
  checkbox.setAttribute('aria-label', `Mark ${task.text} as ${task.completed ? 'not done' : 'done'}`);
  checkbox.addEventListener('change', () => toggleTask(task.id));
  const title = document.createElement('span');
  title.className = 'task-title';
  title.textContent = task.text; // textContent prevents user-provided HTML from executing.
  label.append(checkbox, title);

  const deleteButton = document.createElement('button');
  deleteButton.className = 'delete-one';
  deleteButton.type = 'button';
  deleteButton.textContent = '×';
  deleteButton.title = 'Delete this task';
  deleteButton.setAttribute('aria-label', `Delete task: ${task.text}`);
  deleteButton.addEventListener('click', () => deleteTask(task.id));
  top.append(label, deleteButton);

  const bottom = document.createElement('div');
  bottom.className = 'task-bottom';
  const priority = document.createElement('span');
  priority.className = `priority ${task.priority}`;
  priority.textContent = `${task.priority[0].toUpperCase()}${task.priority.slice(1)} priority`;
  const created = document.createElement('span');
  created.className = 'task-date';
  created.textContent = `Created ${formatDate(task.createdAt)}`;
  bottom.append(priority, created);

  if (task.dueDate) {
    const due = document.createElement('span');
    due.className = 'task-date';
    due.textContent = `Due ${formatDate(task.dueDate)}`;
    bottom.append(due);
    if (!task.completed && task.dueDate < todayLocal()) {
      const late = document.createElement('span');
      late.className = 'late';
      late.textContent = 'Overdue';
      bottom.append(late);
    }
  }
  card.append(top, bottom);
  return card;
}

function renderList(element, list, icon, message) {
  element.replaceChildren();
  if (!list.length) {
    const empty = document.createElement('div');
    empty.className = 'empty';
    const symbol = document.createElement('span');
    symbol.className = 'empty-icon';
    symbol.textContent = icon;
    empty.append(symbol, document.createTextNode(message));
    element.append(empty);
    return;
  }
  list.forEach(task => element.append(createTaskElement(task)));
}

function render() {
  const todo = tasks.filter(task => !task.completed);
  const done = tasks.filter(task => task.completed);
  $('totalCount').textContent = String(tasks.length);
  $('todoCount').textContent = String(todo.length);
  $('doneCount').textContent = String(done.length);
  const percent = tasks.length ? Math.round(done.length / tasks.length * 100) : 0;
  $('progressCount').textContent = `${percent}%`;
  $('progressBar').style.width = `${percent}%`;
  $('todoBadge').textContent = String(todo.length);
  $('doneBadge').textContent = String(done.length);
  $('deleteAll').disabled = tasks.length === 0;
  renderList($('todoList'), todo, '☑', 'Nothing pending. Add your first task!');
  renderList($('doneList'), done, '✓', 'Completed tasks will appear here.');
}

function toggleTask(id) {
  tasks = tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task);
  saveTasks();
  render();
}

function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveTasks();
  render();
}

$('taskForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const text = $('taskText').value.trim();
  if (!text) {
    $('formMessage').textContent = 'Please write a task first.';
    $('taskText').focus();
    return;
  }
  const id = typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  tasks.unshift({ id, text, priority: $('priority').value, dueDate: $('dueDate').value, createdAt: todayLocal(), completed: false });
  saveTasks();
  render();
  $('taskForm').reset();
  $('formMessage').textContent = 'Task added successfully!';
  $('taskText').focus();
});

$('deleteAll').addEventListener('click', () => {
  if (!tasks.length) return;
  const dialog = $('confirmDialog');
  if (typeof dialog.showModal === 'function') dialog.showModal();
  else if (confirm('Delete all tasks?')) clearAllTasks();
});

function clearAllTasks() {
  tasks = [];
  saveTasks();
  render();
}

$('confirmDialog').addEventListener('close', () => {
  if ($('confirmDialog').returnValue === 'confirm') clearAllTasks();
});

render();
