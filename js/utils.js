// Utility Functions for Enhanced UX

// Show loading overlay
function showLoading(message = 'Processing...') {
    const overlay = document.getElementById('loadingOverlay');
    const text = document.getElementById('loadingText');
    if (overlay) {
        if (text) text.textContent = message;
        overlay.classList.add('active');
    }
}

// Hide loading overlay
function hideLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.classList.remove('active');
    }
}

// Enhanced toast with icons
function showToast(message, type = 'info', duration = 3000) {
    const icons = {
        success: '✓',
        error: '✕',
        info: 'ℹ',
        warning: '⚠'
    };

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <span class="toast-icon">${icons[type] || icons.info}</span>
        <span>${message}</span>
    `;
    
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        z-index: 9999;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        min-width: 300px;
        max-width: 500px;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// Validate email
function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Validate password strength
function validatePassword(password) {
    const errors = [];
    
    if (password.length < 8) {
        errors.push('Password must be at least 8 characters');
    }
    if (!/[A-Z]/.test(password)) {
        errors.push('Password must contain at least one uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
        errors.push('Password must contain at least one lowercase letter');
    }
    if (!/[0-9]/.test(password)) {
        errors.push('Password must contain at least one number');
    }
    
    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

// Show input error
function showInputError(inputElement, message) {
    inputElement.classList.add('input-error');
    inputElement.classList.remove('input-success');
    
    // Remove existing error message
    const existingError = inputElement.parentElement.querySelector('.error-message');
    if (existingError) existingError.remove();
    
    // Add new error message
    const errorDiv = document.createElement('span');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    inputElement.parentElement.appendChild(errorDiv);
}

// Show input success
function showInputSuccess(inputElement) {
    inputElement.classList.add('input-success');
    inputElement.classList.remove('input-error');
    
    // Remove error message
    const existingError = inputElement.parentElement.querySelector('.error-message');
    if (existingError) existingError.remove();
}

// Clear input state
function clearInputState(inputElement) {
    inputElement.classList.remove('input-success', 'input-error');
    const existingError = inputElement.parentElement.querySelector('.error-message');
    if (existingError) existingError.remove();
}

// Debounce function for real-time validation
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// Handle API errors
function handleAPIError(error, defaultMessage = 'An error occurred') {
    console.error('API Error:', error);
    
    if (error.message === 'Failed to fetch') {
        return 'Network error. Please check your connection.';
    }
    
    if (error.response) {
        switch (error.response.status) {
            case 400:
                return error.response.data?.message || 'Invalid request';
            case 401:
                return 'Unauthorized. Please login again.';
            case 403:
                return 'Access denied';
            case 404:
                return 'Resource not found';
            case 500:
                return 'Server error. Please try again later.';
            default:
                return error.response.data?.message || defaultMessage;
        }
    }
    
    return defaultMessage;
}

// Confirm dialog
function showConfirm(message, onConfirm, onCancel) {
    const confirmed = window.confirm(message);
    if (confirmed && onConfirm) {
        onConfirm();
    } else if (!confirmed && onCancel) {
        onCancel();
    }
    return confirmed;
}

// Check if user is authenticated
function isAuthenticated() {
    return !!localStorage.getItem('userToken');
}

// Get user info from localStorage
function getUserInfo() {
    const userInfo = localStorage.getItem('userInfo');
    return userInfo ? JSON.parse(userInfo) : null;
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Export functions
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        showLoading,
        hideLoading,
        showToast,
        validateEmail,
        validatePassword,
        showInputError,
        showInputSuccess,
        clearInputState,
        debounce,
        formatFileSize,
        handleAPIError,
        showConfirm,
        isAuthenticated,
        getUserInfo,
        formatDate
    };
}
