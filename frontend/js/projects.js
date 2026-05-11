/**
 * TaskFlow Team Manager - Projects Module
 * Handles project CRUD operations
 */

let PROJECTS_DATA = [];

/**
 * Initialize projects page
 */
async function initProjects() {

    if (!protectPage()) return;

    updateUserUI();

    await loadProjects();

    setupEventListeners();
}

/**
 * Load projects
 */
async function loadProjects() {

    try {

        const projects = await API.projects.list();

        PROJECTS_DATA = projects || [];

        renderProjects(PROJECTS_DATA);

        updateProjectStats(PROJECTS_DATA);

    } catch (error) {

        console.error('Failed to load projects:', error);

        showToast('Failed to load projects', 'error');
    }
}

/**
 * Render projects grid
 */
function renderProjects(projects) {

    const container = document.getElementById('projects-container');

    const emptyState = document.getElementById('empty-state');

    if (!container) return;

    const searchTerm =
        document.getElementById('project-search')?.value.toLowerCase() || '';

    const filteredProjects = projects.filter(p =>
        p.title.toLowerCase().includes(searchTerm) ||
        p.description.toLowerCase().includes(searchTerm)
    );

    if (filteredProjects.length === 0) {

        container.innerHTML = '';

        if (emptyState) {
            emptyState.classList.remove('d-none');
        }

        return;
    }

    if (emptyState) {
        emptyState.classList.add('d-none');
    }

    container.innerHTML = filteredProjects.map(project => `

        <div class="col-lg-4 col-md-6 mb-4">

            <div class="card project-card h-100 border-0 shadow-sm">

                <div class="card-body">

                    <div class="project-icon bg-primary-subtle text-primary mb-3">
                        <i class="bi bi-folder"></i>
                    </div>

                    <h5 class="card-title mb-2">
                        ${project.title}
                    </h5>

                    <p class="card-text text-muted small mb-3">
                        ${project.description || 'No description'}
                    </p>

                    <div class="d-flex align-items-center justify-content-between pt-3 border-top">

                        <small class="text-muted">
                            Project ID: ${project.id}
                        </small>

                    </div>

                </div>

            </div>

        </div>

    `).join('');
}

/**
 * Update project statistics
 */
function updateProjectStats(projects) {

    const totalEl = document.getElementById('total-projects');

    if (totalEl) {
        totalEl.textContent = projects.length;
    }
}

/**
 * Setup event listeners
 */
function setupEventListeners() {

    const searchInput = document.getElementById('project-search');

    if (searchInput) {

        searchInput.addEventListener('input', () => {

            renderProjects(PROJECTS_DATA);
        });
    }

    const createForm = document.getElementById('create-project-form');

    if (createForm) {

        createForm.addEventListener('submit', handleCreateProject);
    }
}

/**
 * Handle create project
 */
async function handleCreateProject(event) {

    event.preventDefault();

    const title =
        document.getElementById('project-title').value.trim();

    const description =
        document.getElementById('project-description').value.trim();

    const submitBtn =
        document.getElementById('create-project-btn');

    if (!title) {

        showToast('Project title is required', 'error');

        return;
    }

    setLoading(submitBtn, true);

    try {

        await API.projects.create({
            title,
            description
        });

        const modal = bootstrap.Modal.getInstance(
            document.getElementById('createProjectModal')
        );

        if (modal) {
            modal.hide();
        }

        event.target.reset();

        await loadProjects();

        showToast('Project created successfully!', 'success');

    } catch (error) {

        console.error(error);

        showToast('Failed to create project', 'error');

    } finally {

        setLoading(submitBtn, false);
    }
}

/**
 * Initialize when DOM is ready
 */
document.addEventListener('DOMContentLoaded', initProjects);