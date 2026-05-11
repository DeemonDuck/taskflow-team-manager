/**
 * TaskFlow Team Manager - Authentication Module
 * Handles login, register, token management, and route protection
 */

/**
 * Check if user is authenticated
 */
function isAuthenticated() {
    const token = localStorage.getItem('token');
    return !!token;
}

/**
 * Get current user from localStorage
 */
function getCurrentUser() {
    try {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    } catch {
        return null;
    }
}

/**
 * Get user role
 */
function getUserRole() {
    const user = getCurrentUser();
    return user ? user.role : null;
}

/**
 * Check if current user is admin
 */
function isAdmin() {
    return getUserRole() === 'admin';
}

/**
 * Protect page - redirect to login if not authenticated
 */
function protectPage() {
    if (!isAuthenticated()) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

/**
 * Logout user
 */
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'login.html';
}

/**
 * Handle login form submission
 */
async function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const submitBtn = document.getElementById('login-btn');
    const errorDiv = document.getElementById('login-error');

    // Validation
    if (!email || !password) {
        showFieldError(errorDiv, 'Please enter both email and password');
        return;
    }

    if (!isValidEmail(email)) {
        showFieldError(errorDiv, 'Please enter a valid email address');
        return;
    }

    setLoading(submitBtn, true);
    hideFieldError(errorDiv);

    try {

        const data = await API.auth.login({
            email,
            password
        });

        localStorage.setItem('token', data.access_token);

        localStorage.setItem('user', JSON.stringify({
            email: email,
            role: 'member'
        }));

        showToast('Login successful!', 'success');

        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 500);

    } catch (error) {
        showFieldError(errorDiv, error.message || 'Invalid credentials. Please try again.');
    } finally {
        setLoading(submitBtn, false);
    }
}

/**
 * Handle register form submission
 */
async function handleRegister(event) {
    event.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const submitBtn = document.getElementById('register-btn');
    const errorDiv = document.getElementById('register-error');

    // Validation
    if (!name || !email || !password || !confirmPassword) {
        showFieldError(errorDiv, 'Please fill in all fields');
        return;
    }

    if (!isValidEmail(email)) {
        showFieldError(errorDiv, 'Please enter a valid email address');
        return;
    }

    if (password.length < 6) {
        showFieldError(errorDiv, 'Password must be at least 6 characters');
        return;
    }

    if (password !== confirmPassword) {
        showFieldError(errorDiv, 'Passwords do not match');
        return;
    }

    setLoading(submitBtn, true);
    hideFieldError(errorDiv);

    try {

        await API.auth.register({
            name,
            email,
            password
        });

        showToast('Registration successful! Please login.', 'success');

        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1000);

    } catch (error) {
        showFieldError(errorDiv, error.message || 'Registration failed. Please try again.');
    } finally {
        setLoading(submitBtn, false);
    }
}

/**
 * Update UI with user info (navbar, sidebar)
 */
function updateUserUI() {
    const user = getCurrentUser();
    if (!user) return;

    const userNameElements = document.querySelectorAll('.user-name');
    const userRoleElements = document.querySelectorAll('.user-role');
    const userAvatarElements = document.querySelectorAll('.user-avatar');

    userNameElements.forEach(el => el.textContent = user.name || user.email);

    userRoleElements.forEach(el => {
        el.textContent = user.role
            ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
            : 'Member';

        el.className = `user-role badge ${user.role === 'admin' ? 'bg-danger' : 'bg-info'}`;
    });

    const initials = user.name
        ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        : user.email.substring(0, 2).toUpperCase();

    userAvatarElements.forEach(el => {
        el.textContent = initials;
    });

    const adminOnlyElements = document.querySelectorAll('.admin-only');

    adminOnlyElements.forEach(el => {
        el.style.display = isAdmin() ? '' : 'none';
    });
}

/**
 * Helper: Validate email format
 */
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Helper: Show field error
 */
function showFieldError(element, message) {
    if (element) {
        element.textContent = message;
        element.classList.remove('d-none');
    }
}

/**
 * Helper: Hide field error
 */
function hideFieldError(element) {
    if (element) {
        element.textContent = '';
        element.classList.add('d-none');
    }
}

/**
 * Helper: Set button loading state
 */
function setLoading(button, loading) {

    if (!button) return;

    if (loading) {

        button.dataset.originalText = button.textContent;
        button.disabled = true;

        button.innerHTML = `
            <span class="spinner-border spinner-border-sm me-2" role="status"></span>
            Loading...
        `;

    } else {

        button.disabled = false;
        button.textContent = button.dataset.originalText || button.textContent;
    }
}