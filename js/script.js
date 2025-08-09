document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const dateInput = document.getElementById('date-input');
    const taskListBody = document.getElementById('task-list-body');
    const sortSelect = document.getElementById('sort-select'); 
    const deleteAllBtn = document.getElementById('delete-all-btn');

    function addTask(text, date) {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const newTask = {
            id: Date.now(), 
            text: text,
            date: date,
            status: 'Pending'
        };
        tasks.push(newTask);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTable();
    }

    function deleteTask(id) {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks = tasks.filter(task => task.id !== id);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTable();
    }

    function toggleTaskStatus(id) {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const task = tasks.find(task => task.id === id); 
        if (task) {
            task.status = (task.status === 'Pending') ? 'Completed' : 'Pending';
            localStorage.setItem('tasks', JSON.stringify(tasks));
            renderTable();
        }
    }

    function renderTable() {
        taskListBody.innerHTML = '';
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const sortValue = sortSelect.value; 

        switch (sortValue) {
            case 'name-asc': 
                tasks.sort((a, b) => a.text.localeCompare(b.text));
                break;
            case 'name-desc': 
                tasks.sort((a, b) => b.text.localeCompare(a.text));
                break;
            case 'date-asc': 
                tasks.sort((a, b) => new Date(a.date) - new Date(b.date));
                break;
            case 'date-desc': 
                tasks.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
        }

        if (tasks.length === 0) {
            taskListBody.innerHTML = `
                <tr class="empty-row">
                    <td colspan="4">No task found</td>
                </tr>
            `;
        } else {
            tasks.forEach((task) => {
                const row = document.createElement('tr');
                row.className = 'task-row';
                if (task.status === 'Completed') {
                    row.classList.add('completed');
                }
                
                row.innerHTML = `
                    <td><span class="task-text" data-id="${task.id}">${task.text}</span></td>
                    <td>${formatDate(task.date)}</td>
                    <td><span class="status-badge">${task.status}</span></td>
                    <td><button class="action-btn delete-btn" data-id="${task.id}">🗑️</button></td>
                `;
                taskListBody.appendChild(row);
            });
        }
    }

    taskListBody.addEventListener('click', (e) => {
        const target = e.target;
        const id = target.closest('[data-id]')?.dataset.id;

        if (!id) return; 

        const taskId = parseInt(id, 10); 

        if (target.classList.contains('delete-btn')) {
            deleteTask(taskId);
        } else if (target.classList.contains('task-text')) {
            toggleTaskStatus(taskId);
        }
    });

    sortSelect.addEventListener('change', renderTable);


    function deleteAllTasks() {
        if (confirm('Are you sure you want to delete all tasks?')) {
            localStorage.removeItem('tasks');
            renderTable();
        }
    }

    function formatDate(dateString) {
        if (!dateString) return 'No Date';
        const [year, month, day] = dateString.split('-');
        return `${day}/${month}/${year}`;
    }

    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const taskText = taskInput.value.trim();
        const taskDate = dateInput.value;
        if (taskText === '' || taskDate === '') {
            alert('Harap isi nama tugas dan tanggalnya.');
            return;
        }
        addTask(taskText, taskDate);
        taskForm.reset();
        taskInput.focus();
    });

    deleteAllBtn.addEventListener('click', deleteAllTasks);

    renderTable(); 
});