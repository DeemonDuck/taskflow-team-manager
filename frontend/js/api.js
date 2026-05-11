/**
 * TaskFlow Team Manager - API Module
 * Central API configuration and HTTP helpers for FastAPI backend integration
 */

const API_BASE = "https://taskflow-team-manager-production.up.railway.app";

/**
 * Generic API request wrapper with JWT auth
 */
async function apiRequest(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;

    const defaultHeaders = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    };

    const token = localStorage.getItem('token');
    if (token) {
        defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers
        }
    };

    try {
        const response = await fetch(url, config);

        if (response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = 'login.html';
            return null;
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || `HTTP ${response.status}: ${response.statusText}`);
        }

        if (response.status === 204) {
            return null;
        }

        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

/**
 * API endpoints object
 */
const API = {
    auth: {
        login: (credentials) => apiRequest('/login', {
            method: 'POST',
            body: JSON.stringify(credentials)
        }),
        register: (data) => apiRequest('/register', {
            method: 'POST',
            body: JSON.stringify(data)
        }),
        me: () => apiRequest('/auth/me')
    },

    projects: {
        list: () => apiRequest('/projects'),
        create: (data) => apiRequest('/projects', {
            method: 'POST',
            body: JSON.stringify(data)
        }),
        get: (id) => apiRequest(`/projects/${id}`),
        update: (id, data) => apiRequest(`/projects/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        }),
        delete: (id) => apiRequest(`/projects/${id}`, {
            method: 'DELETE'
        })
    },

    tasks: {
        list: () => apiRequest('/tasks'),
        create: (data) => apiRequest('/tasks', {
            method: 'POST',
            body: JSON.stringify(data)
        }),
        get: (id) => apiRequest(`/tasks/${id}`),
        update: (id, data) => apiRequest(`/tasks/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        }),
        delete: (id) => apiRequest(`/tasks/${id}`, {
            method: 'DELETE'
        }),
        updateStatus: (id, status) => apiRequest(`/tasks/${id}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status })
        })
    },

    users: {
        list: () => apiRequest('/users'),
        get: (id) => apiRequest(`/users/${id}`)
    },

    dashboard: {
        stats: () => apiRequest('/dashboard'),
        recentProjects: () => apiRequest('/dashboard/recent-projects'),
        recentTasks: () => apiRequest('/dashboard/recent-tasks')
    }
};

/**
 * Show toast notification
 */
function showToast(message, type = 'success') {
    const toastContainer = document.getElementById('toast-container') || createToastContainer();

    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-white bg-${type === 'success' ? 'success' : type === 'error' ? 'danger' : 'warning'} border-0`;
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">${message}</div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;

    toastContainer.appendChild(toast);
    const bsToast = new bootstrap.Toast(toast, { delay: 3000 });
    bsToast.show();

    toast.addEventListener('hidden.bs.toast', () => toast.remove());
}

function createToastContainer() {
    const container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container position-fixed top-0 end-0 p-3';
    container.style.zIndex = '9999';
    document.body.appendChild(container);
    return container;
}

/**
 * Format date for display
 */
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

/**
 * Format datetime for display
 */
function formatDateTime(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}
