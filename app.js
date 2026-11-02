"use strict";
class TodoApp {
    constructor() {
        this.todos = [];
        this.filter = 'all';
        this.nextId = Date.now();
        this.storageKey = 'cse343-lab4-todos';
        this.form = document.querySelector('#todo-form');
        this.input = document.querySelector('#todo-input');
        this.list = document.querySelector('#todo-list');
        this.count = document.querySelector('#items-left');
        this.clearCompleted = document.querySelector('#clear-completed');
        this.clearAll = document.querySelector('#clear-all');
        this.load();
        this.form.addEventListener('submit', (event) => {
            event.preventDefault();
            const title = this.input.value.trim();
            if (!title) {
                this.input.focus();
                return;
            }
            this.todos = [...this.todos, { id: this.nextId++, title, completed: false }];
            this.input.value = '';
            this.update();
            this.input.focus();
        });
        document.querySelectorAll('[data-filter]').forEach((button) => {
            button.addEventListener('click', () => {
                this.filter = button.dataset.filter;
                this.render();
            });
        });
        this.clearCompleted.addEventListener('click', () => {
            this.todos = this.todos.filter((todo) => !todo.completed);
            this.update();
        });
        this.clearAll.addEventListener('click', () => {
            this.todos = [];
            this.update();
        });
        this.render();
    }
    load() {
        var _a;
        try {
            const saved = JSON.parse((_a = localStorage.getItem(this.storageKey)) !== null && _a !== void 0 ? _a : 'null');
            if (Array.isArray(saved)) {
                this.todos = saved.filter((todo) => todo !== null && typeof todo === 'object' &&
                    typeof todo.id === 'number' && Number.isFinite(todo.id) &&
                    typeof todo.title === 'string' && todo.title.trim().length > 0 &&
                    typeof todo.completed === 'boolean');
                this.nextId = Math.max(this.nextId, ...this.todos.map((todo) => todo.id + 1));
                return;
            }
        }
        catch ( /* The app also works when browser storage is unavailable. */_b) { /* The app also works when browser storage is unavailable. */ }
        this.todos = [
            { id: this.nextId++, title: 'See Lecture', completed: false },
            { id: this.nextId++, title: 'Solve assignment', completed: false }
        ];
    }
    update() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.todos));
        }
        catch ( /* Keep the current session usable even if saving is blocked. */_a) { /* Keep the current session usable even if saving is blocked. */ }
        this.render();
    }
    edit(todo, label) {
        const editor = document.createElement('input');
        editor.className = 'edit-input';
        editor.value = todo.title;
        editor.maxLength = 300;
        editor.setAttribute('aria-label', 'Edit task');
        label.replaceWith(editor);
        editor.focus();
        editor.select();
        let finished = false;
        const finish = (save) => {
            if (finished)
                return;
            finished = true;
            const title = editor.value.trim();
            if (save && title) {
                this.todos = this.todos.map((item) => item.id === todo.id ? Object.assign(Object.assign({}, item), { title }) : item);
            }
            this.update();
        };
        editor.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                finish(true);
            }
            if (event.key === 'Escape')
                finish(false);
        });
        editor.addEventListener('blur', () => finish(true));
    }
    render() {
        this.list.replaceChildren();
        const visible = this.todos.filter((todo) => this.filter === 'all' || (this.filter === 'completed' ? todo.completed : !todo.completed));
        visible.forEach((todo) => {
            const row = document.createElement('li');
            row.className = `todo-row${todo.completed ? ' completed' : ''}`;
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = todo.completed;
            checkbox.setAttribute('aria-label', `Mark ${todo.title} as ${todo.completed ? 'active' : 'completed'}`);
            checkbox.addEventListener('change', () => {
                this.todos = this.todos.map((item) => item.id === todo.id ? Object.assign(Object.assign({}, item), { completed: checkbox.checked }) : item);
                this.update();
            });
            const title = document.createElement('span');
            title.className = 'todo-title';
            title.textContent = todo.title;
            title.tabIndex = 0;
            title.setAttribute('aria-describedby', 'edit-tip');
            title.addEventListener('dblclick', () => this.edit(todo, title));
            title.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' || event.key === 'F2') {
                    event.preventDefault();
                    this.edit(todo, title);
                }
            });
            const remove = document.createElement('button');
            remove.type = 'button';
            remove.className = 'delete-button';
            remove.textContent = '\u{1F5D1}';
            remove.setAttribute('aria-label', `Delete ${todo.title}`);
            remove.addEventListener('click', () => {
                this.todos = this.todos.filter((item) => item.id !== todo.id);
                this.update();
            });
            row.append(checkbox, title, remove);
            this.list.append(row);
        });
        if (!visible.length) {
            const empty = document.createElement('li');
            empty.className = 'empty';
            empty.textContent = this.filter === 'all' ? 'No tasks yet. Add one above!' : `No ${this.filter} tasks.`;
            this.list.append(empty);
        }
        const remaining = this.todos.filter((todo) => !todo.completed).length;
        this.count.textContent = `${remaining} ${remaining === 1 ? 'item' : 'items'} left`;
        this.clearCompleted.disabled = !this.todos.some((todo) => todo.completed);
        this.clearAll.disabled = !this.todos.length;
        document.querySelectorAll('[data-filter]').forEach((button) => {
            button.setAttribute('aria-pressed', String(button.dataset.filter === this.filter));
        });
    }
}
new TodoApp();
