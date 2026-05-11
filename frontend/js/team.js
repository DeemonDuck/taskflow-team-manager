/**
 * TaskFlow Team Manager - Team Module
 * Handles team member listing
 */

let TEAM_DATA = [];

/**
 * Initialize team page
 */
async function initTeam() {

    if (!protectPage()) return;

    updateUserUI();

    await loadTeam();

    setupEventListeners();
}

/**
 * Load team members
 */
async function loadTeam() {

    try {

        const currentUser = getCurrentUser();

        TEAM_DATA = currentUser ? [currentUser] : [];

        renderTeam(TEAM_DATA);

        updateTeamStats(TEAM_DATA);

    } catch (error) {

        console.error('Failed to load team:', error);

        showToast('Failed to load team members', 'error');
    }
}

/**
 * Render team members
 */
function renderTeam(users) {

    const container =
        document.getElementById('team-container');

    const emptyState =
        document.getElementById('empty-state');

    if (!container) return;

    const searchTerm =
        document.getElementById('team-search')
            ?.value.toLowerCase() || '';

    const filteredUsers = users.filter(user =>
        user.email.toLowerCase().includes(searchTerm)
    );

    if (filteredUsers.length === 0) {

        container.innerHTML = '';

        if (emptyState) {
            emptyState.classList.remove('d-none');
        }

        return;
    }

    if (emptyState) {
        emptyState.classList.add('d-none');
    }

    container.innerHTML = filteredUsers.map(user => `

        <div class="col-lg-4 col-md-6 mb-4">

            <div class="card team-card h-100 border-0 shadow-sm">

                <div class="card-body">

                    <div class="d-flex align-items-center mb-3">

                        <div class="team-avatar me-3 bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                             style="width:56px;height:56px;font-size:20px;font-weight:600;">

                            ${user.email.substring(0, 2).toUpperCase()}

                        </div>

                        <div class="flex-grow-1">

                            <h5 class="mb-1">
                                ${user.email}
                            </h5>

                            <span class="badge bg-info text-dark">
                                ${user.role || 'member'}
                            </span>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    `).join('');
}

/**
 * Update team statistics
 */
function updateTeamStats(users) {

    const totalEl =
        document.getElementById('total-members');

    const adminEl =
        document.getElementById('admin-count');

    const memberEl =
        document.getElementById('member-count');

    if (totalEl) {
        totalEl.textContent = users.length;
    }

    if (adminEl) {
        adminEl.textContent =
            users.filter(u => u.role === 'admin').length;
    }

    if (memberEl) {
        memberEl.textContent =
            users.filter(u => u.role !== 'admin').length;
    }
}

/**
 * Setup event listeners
 */
function setupEventListeners() {

    const searchInput =
        document.getElementById('team-search');

    if (searchInput) {

        searchInput.addEventListener('input', () => {

            renderTeam(TEAM_DATA);
        });
    }
}

/**
 * Initialize when DOM is ready
 */
document.addEventListener('DOMContentLoaded', initTeam);