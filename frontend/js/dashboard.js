/**
 * TaskFlow Team Manager - Dashboard Module
 * Handles dashboard metrics and recent activity
 */

async function initDashboard() {

    if (!protectPage()) return;

    updateUserUI();

    await loadDashboardStats();
}

/**
 * Load dashboard statistics
 */
async function loadDashboardStats() {

    try {

        const stats = await API.dashboard.stats();

        renderStatsCards(stats);

    } catch (error) {

        console.error('Failed to load dashboard stats:', error);

        showToast('Failed to load dashboard statistics', 'error');
    }
}

/**
 * Render statistics cards
 */
function renderStatsCards(stats) {

    const overdueTasks = 0;

    const cards = [
        {
            id: 'total-projects',
            value: stats.total_projects || 0,
            label: 'Projects',
            icon: 'bi-folder',
            color: 'primary'
        },
        {
            id: 'total-tasks',
            value: stats.total_tasks || 0,
            label: 'Total Tasks',
            icon: 'bi-kanban',
            color: 'info'
        },
        {
            id: 'completed-tasks',
            value: stats.completed_tasks || 0,
            label: 'Completed',
            icon: 'bi-check-circle',
            color: 'success'
        },
        {
            id: 'pending-tasks',
            value: stats.pending_tasks || 0,
            label: 'Pending',
            icon: 'bi-clock',
            color: 'warning'
        }
    ];

    const container = document.getElementById('stats-cards');

    if (!container) return;

    container.innerHTML = cards.map(card => `
        <div class="col-xl-3 col-md-6 mb-4">
            <div class="card stat-card h-100 border-0 shadow-sm">
                <div class="card-body">

                    <div class="d-flex align-items-center justify-content-between mb-3">

                        <div class="stat-icon bg-${card.color}-subtle text-${card.color}">
                            <i class="bi ${card.icon}"></i>
                        </div>

                    </div>

                    <h3 class="stat-value mb-1">
                        ${card.value}
                    </h3>

                    <p class="stat-label text-muted mb-0">
                        ${card.label}
                    </p>

                </div>
            </div>
        </div>
    `).join('');
}

/**
 * Initialize dashboard
 */
document.addEventListener('DOMContentLoaded', initDashboard);