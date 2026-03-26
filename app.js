// accenture-todo-app JavaScript

// --- Login Form ---

const loginContainer = document.getElementById('login-container');
const todoContainer = document.getElementById('todo-container');
const loginForm = document.getElementById('login-form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const emailError = document.getElementById('email-error');
const passwordError = document.getElementById('password-error');
const logoutBtn = document.getElementById('logout-btn');

// Email format validation
const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

// Validate a single field; returns true if valid
const validateEmail = () => {
    const value = emailInput.value.trim();
    if (!value) {
        emailError.textContent = 'Email is required.';
        emailInput.classList.add('input-error');
        return false;
    }
    if (!isValidEmail(value)) {
        emailError.textContent = 'Please enter a valid email address.';
        emailInput.classList.add('input-error');
        return false;
    }
    emailError.textContent = '';
    emailInput.classList.remove('input-error');
    return true;
};

const validatePassword = () => {
    const value = passwordInput.value.trim();
    if (!value) {
        passwordError.textContent = 'Password is required.';
        passwordInput.classList.add('input-error');
        return false;
    }
    if (value.length < 6) {
        passwordError.textContent = 'Password must be at least 6 characters.';
        passwordInput.classList.add('input-error');
        return false;
    }
    passwordError.textContent = '';
    passwordInput.classList.remove('input-error');
    return true;
};

// Show/hide sections
const showTodoApp = () => {
    loginContainer.style.display = 'none';
    todoContainer.style.display = '';
    loadTodos();
    renderTodos();
};

const showLoginForm = () => {
    todoContainer.style.display = 'none';
    loginContainer.style.display = '';
    loginForm.reset();
    emailError.textContent = '';
    passwordError.textContent = '';
    emailInput.classList.remove('input-error');
    passwordInput.classList.remove('input-error');
};

// Inline validation on blur
emailInput.addEventListener('blur', validateEmail);
passwordInput.addEventListener('blur', validatePassword);

// Clear error on input
emailInput.addEventListener('input', () => {
    if (emailInput.classList.contains('input-error')) validateEmail();
});
passwordInput.addEventListener('input', () => {
    if (passwordInput.classList.contains('input-error')) validatePassword();
});

// Login form submission
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const emailOk = validateEmail();
    const passOk = validatePassword();
    if (emailOk && passOk) {
        sessionStorage.setItem('loggedIn', 'true');
        showTodoApp();
    }
});

// Logout
logoutBtn.addEventListener('click', () => {
    sessionStorage.removeItem('loggedIn');
    showLoginForm();
});

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
    if (sessionStorage.getItem('loggedIn') === 'true') {
        showTodoApp();
    }
    // Login form is shown by default (no else needed as it's visible in HTML)
});

