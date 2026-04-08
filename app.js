// accenture-todo-app JavaScript

// --- Todo App ---

const todoInput = document.getElementById('new-todo');
const addBtn = document.getElementById('add-btn');
const todoList = document.getElementById('todo-list');

let todos = [];

// Generate unique ID for each task
const generateId = () => Date.now().toString() + Math.random().toString(36).slice(2);

// Load todos from localStorage (key: 'todos')
const loadTodos = () => {
    const stored = localStorage.getItem('todos');
    todos = stored ? JSON.parse(stored) : [];
};

// Save todos to localStorage (key: 'todos')
const saveTodos = () => {
    localStorage.setItem('todos', JSON.stringify(todos));
};

// Render todos with checkbox and delete button
const renderTodos = () => {
    todoList.innerHTML = '';
    todos.forEach((todo) => {
        const li = document.createElement('li');
        li.className = 'todo-item';

        // Checkbox for completion
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = !!todo.completed;
        checkbox.className = 'todo-checkbox';
        checkbox.addEventListener('change', () => toggleComplete(todo.id));

        // Task text
        const span = document.createElement('span');
        span.className = 'todo-text' + (todo.completed ? ' completed' : '');
        span.textContent = todo.text;

        // Delete button
        const delBtn = document.createElement('button');
        delBtn.className = 'delete-btn';
        delBtn.textContent = 'Delete';
        delBtn.addEventListener('click', () => deleteTodo(todo.id));

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(delBtn);
        todoList.appendChild(li);
    });
};

// Add new todo with unique id
const addTodo = () => {
    const text = todoInput.value.trim();
    if (!text) return;
    const newTodo = {
        id: generateId(),
        text,
        completed: false
    };
    todos.push(newTodo);
    saveTodos();
    renderTodos();
    todoInput.value = '';
    todoInput.focus();
};

// Toggle complete by id
const toggleComplete = (id) => {
    todos = todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    saveTodos();
    renderTodos();
};

// Delete todo by id
const deleteTodo = (id) => {
    todos = todos.filter(todo => todo.id !== id);
    saveTodos();
    renderTodos();
};

// Event listeners
addBtn.addEventListener('click', addTodo);
todoInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') addTodo();
});

document.addEventListener('DOMContentLoaded', () => {
    loadTodos();
    renderTodos();
});

