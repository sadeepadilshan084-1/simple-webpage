const STORAGE_KEY = 'todos-v1';
let todos = [];

function $(s) { return document.querySelector(s) }

function load() {
    try {
        todos = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch (e) { todos = [] }
}

function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function generateId() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7) }

function render() {
    const ul = $('#tasks');
    ul.innerHTML = '';
    if (todos.length === 0) { ul.innerHTML = '<li class="task"><div class="meta"><div class="title" style="color:var(--muted)">No todos yet</div></div></li>'; return }
    todos.slice().reverse().forEach(t => {
        const li = document.createElement('li');
        li.className = 'task' + (t.completed ? ' completed' : '');

        const chk = document.createElement('input');
        chk.type = 'checkbox';
        chk.checked = !!t.completed;
        chk.addEventListener('change', () => { toggleComplete(t.id) });

        const meta = document.createElement('div');
        meta.className = 'meta';
        const title = document.createElement('div');
        title.className = 'title';
        title.textContent = t.text;

        const due = document.createElement('div');
        due.className = 'due';
        if (t.due) {
            const d = new Date(t.due);
            due.textContent = 'Due: ' + d.toLocaleString();
        } else due.textContent = '';

        meta.appendChild(title);
        if (due.textContent) meta.appendChild(due);

        const actions = document.createElement('div');
        actions.className = 'actions';
        const del = document.createElement('button');
        del.className = 'action-btn';
        del.textContent = 'Delete';
        del.addEventListener('click', () => { removeTodo(t.id) });

        actions.appendChild(del);

        li.appendChild(chk);
        li.appendChild(meta);
        li.appendChild(actions);
        ul.appendChild(li);
    });
}

function addTodo(text, due) {
    const task = { id: generateId(), text: text.trim(), due: due || null, completed: false, notified: false };
    todos.push(task);
    save();
    render();
}

function removeTodo(id) {
    todos = todos.filter(t => t.id !== id);
    save(); render();
}

function toggleComplete(id) {
    todos = todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    save(); render();
}

function clearCompleted() {
    todos = todos.filter(t => !t.completed);
    save(); render();
}
function clearAll() {
    todos = [];
    save(); render();
}

function checkReminders() {
    const now = Date.now();
    let changed = false;
    todos.forEach(t => {
        if (t.due && !t.notified && !t.completed) {
            const dueMs = new Date(t.due).getTime();
            if (!isNaN(dueMs) && now >= dueMs) {
                notify(t);
                t.notified = true;
                changed = true;
            }
        }
    });
    if (changed) save();
}

function notify(task) {
    const title = 'Reminder: ' + task.text;
    const options = { body: task.due ? ('Due ' + new Date(task.due).toLocaleString()) : '', tag: task.id };
    if (window.Notification && Notification.permission === 'granted') {
        new Notification(title, options);
    } else if (window.Notification && Notification.permission !== 'denied') {
        Notification.requestPermission().then(p => { if (p === 'granted') new Notification(title, options); else alert(title + '\n' + options.body); });
    } else {
        alert(title + '\n' + options.body);
    }
}

// wiring
window.addEventListener('load', () => {
    load();
    render();
    // periodic check
    checkReminders();
    setInterval(checkReminders, 15000);

    $('#task-form').addEventListener('submit', e => {
        e.preventDefault();
        const text = $('#task-input').value;
        const dueVal = $('#due-input').value;
        if (!text.trim()) return;
        const due = dueVal ? new Date(dueVal).toISOString() : null;
        if (due && window.Notification && Notification.permission !== 'granted') {
            Notification.requestPermission();
        }
        addTodo(text, due);
        $('#task-input').value = '';
        $('#due-input').value = '';
    });

    $('#clear-completed').addEventListener('click', () => { clearCompleted(); });
    $('#clear-all').addEventListener('click', () => { if (confirm('Clear all todos?')) clearAll(); });
});
