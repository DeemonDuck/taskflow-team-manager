/**
 * TaskFlow Team Manager - Tasks Module
 * Handles task CRUD operations
 */

let TASKS_DATA = [];
let PROJECTS_DATA = [];

/**
 * Initialize tasks page
 */
async function initTasks() {

    if (!protectPage()) return;

    updateUserUI();

    await loadProjects();

    await loadTasks();

    setupEventListeners();
}

/**
 * Load projects for dropdown
 */
async function loadProjects() {

    try {

        PROJECTS_DATA = await API.projects.list();

        populateProjectDropdowns();

    } catch (error) {

        console.error('Failed to load projects:', error);
    }
}

/**
 * Populate project dropdowns
 */
function populateProjectDropdowns() {

    const projectSelect =
        document.getElementById('task-project');

    if (!projectSelect) return;

    projectSelect.innerHTML = `
        <option value="">Select project...</option>
    `;

    PROJECTS_DATA.forEach(project => {

        projectSelect.innerHTML += `
            <option value="${project.id}">
                ${project.title}
            </option>
        `;
    });
}

/**
 * Load tasks
 */
async function loadTasks() {

    try {

        TASKS_DATA = await API.tasks.list();

        renderTasks(TASKS_DATA);

        updateTaskStats(TASKS_DATA);

    } catch (error) {

        console.error('Failed to load tasks:', error);

        showToast('Failed to load tasks', 'error');
    }
}

/**
 * Render tasks table
 */
function renderTasks(tasks) {

    const tbody =
        document.getElementById('tasks-table-body');

    if (!tbody) return;

    if (tasks.length === 0) {

        tbody.innerHTML = `
            <tr>
                <td colspan="4" class="text-center py-4 text-muted">
                    No tasks found
                </td>
            </tr>
        `;

        return;
    }

    tbody.innerHTML = tasks.map(task => `

        <tr>

            <td>
                ${task.title}
            </td>

            <td>
                ${task.description || 'No description'}
            </td>

            <td>
                <span class="badge bg-${task.status === 'Completed' ? 'success' : 'warning'}">
                    ${task.status}
                </span>
            </td>

            <td>
                Project ID: ${task.project_id}
            </td>

        </tr>

    `).join('');
}

/**
 * Update task statistics
 */
function updateTaskStats(tasks) {

    const totalEl =
        document.getElementById('total-tasks-count');

    const pendingEl =
        document.getElementById('pending-tasks-count');

    const completedEl =
        document.getElementById('completed-tasks-count');

    if (totalEl) {
        totalEl.textContent = tasks.length;
    }

    if (pendingEl) {

        pendingEl.textContent =
            tasks.filter(t => t.status === 'Pending').length;
    }

    if (completedEl) {

        completedEl.textContent =
            tasks.filter(t => t.status === 'Completed').length;
    }
}

/**
 * Setup event listeners
 */
function setupEventListeners() {

    const createForm =
        document.getElementById('create-task-form');

    if (createForm) {

        createForm.addEventListener(
            'submit',
            handleCreateTask
        );
    }
}

/**
 * Handle create task
 */
async function handleCreateTask(event) {

    event.preventDefault();

    const title =
        document.getElementById('task-title').value.trim();

    const description =
        document.getElementById('task-description').value.trim();

    const projectId =
        parseInt(document.getElementById('task-project').value);

    const submitBtn =
        document.getElementById('create-task-btn');

    if (!title) {

        showToast('Task title is required', 'error');

        return;
    }

    if (!projectId) {

        showToast('Please select a project', 'error');

        return;
    }

    setLoading(submitBtn, true);

    try {

        await API.tasks.create({
            title,
            description,
            status: 'Pending',
            project_id: projectId
        });

        const modal = bootstrap.Modal.getInstance(
            document.getElementById('createTaskModal')
        );

        if (modal) {
            modal.hide();
        }

        event.target.reset();

        await loadTasks();

        showToast('Task created successfully!', 'success');

    } catch (error) {

        console.error(error);

        showToast('Failed to create task', 'error');

    } finally {

        setLoading(submitBtn, false);
    }
}

/**
 * Initialize when DOM is ready
 */
document.addEventListener('DOMContentLoaded', initTasks);