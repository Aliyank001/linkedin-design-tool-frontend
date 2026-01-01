// Login Page JavaScript

// API Configuration
const API_BASE = window.location.origin;

// Add utils script dynamically if not already loaded
if (!window.showLoading) {
    const script = document.createElement('script');
    script.src = 'js/utils.js';
    document.head.appendChild(script);
}

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const infoModal = document.getElementById('infoModal');

    // Check if already logged in
    const token = localStorage.getItem('userToken');
    if (token) {
        // Verify token is still valid
        checkAuthStatus();
    }

    // Check for pending registration
    const pendingRegistration = localStorage.getItem('pendingRegistration');
    if (pendingRegistration) {
        const data = JSON.parse(pendingRegistration);
        if (data.status === 'pending_approval') {
            showToast('Your account is pending approval. Please wait for admin verification.', 'info');
        }
    }

    // Form submission
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Get form data
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const rememberMe = document.getElementById('rememberMe').checked;

        // Validate inputs
        if (!email || !password) {
            showToast('Please enter both email and password', 'error');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showToast('Please enter a valid email address', 'error');
            return;
        }

        // Attempt login
        await attemptLogin(email, password, rememberMe);
    });

    async function attemptLogin(email, password, rememberMe) {
        // Show loading state
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Logging in...';
        submitBtn.disabled = true;

        try {
            const response = await fetch(`${API_BASE}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                // Store token and user info
                localStorage.setItem('userToken', data.token);
                localStorage.setItem('userInfo', JSON.stringify(data.user));
                
                // Remove pending registration
                localStorage.removeItem('pendingRegistration');

                // Check user status
                if (data.user.status === 'approved') {
                    showToast('Login successful! Redirecting...', 'success');
                    setTimeout(() => {
                        window.location.href = 'designer.html';
                    }, 1000);
                } else if (data.user.status === 'pending') {
                    // Clear token since user is not approved yet
                    localStorage.removeItem('userToken');
                    localStorage.removeItem('userInfo');
                    showToast('Your account is pending approval', 'info');
                    showInfoModal();
                } else if (data.user.status === 'rejected') {
                    // Clear token for rejected users
                    localStorage.removeItem('userToken');
                    localStorage.removeItem('userInfo');
                    showToast('Your account was rejected: ' + (data.user.rejectionReason || 'Please contact admin'), 'error');
                }
            } else if (response.status === 403) {
                // Account pending or rejected
                if (data.status === 'pending' || data.message.includes('pending')) {
                    showToast('Your account is pending approval. Please wait for admin verification.', 'info');
                    showInfoModal();
                } else if (data.reason) {
                    showToast('Account rejected: ' + data.reason, 'error');
                } else {
                    showToast(data.message || 'Account not approved', 'error');
                }
            } else {
                showToast(data.message || 'Login failed. Please check your credentials.', 'error');
            }
        } catch (error) {
            console.error('Login error:', error);
            showToast('Network error. Please check your connection and try again.', 'error');
        } finally {
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }

    async function checkAuthStatus() {
        const token = localStorage.getItem('userToken');
        if (!token) return;

        try {
            const response = await fetch(`${API_BASE}/api/auth/status`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (data.success && data.user.status === 'approved') {
                // Already logged in and approved, redirect to designer
                window.location.href = 'designer.html';
            }
        } catch (error) {
            // Token invalid, clear it
            localStorage.removeItem('userToken');
            localStorage.removeItem('userInfo');
        }
    }

    function showInfoModal() {
        infoModal.classList.add('active');
    }

    // Close modal when clicking outside
    infoModal.addEventListener('click', function(e) {
        if (e.target === infoModal) {
            this.classList.remove('active');
        }
    });

    // Form field validation
    const emailInput = document.getElementById('loginEmail');
    const passwordInput = document.getElementById('loginPassword');

    emailInput.addEventListener('blur', function() {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (this.value && !emailRegex.test(this.value)) {
            this.style.borderColor = '#ef4444';
        } else if (this.value) {
            this.style.borderColor = '#10b981';
        }
    });

    emailInput.addEventListener('input', function() {
        if (this.value) {
            this.style.borderColor = '#d1d5db';
        }
    });

    passwordInput.addEventListener('input', function() {
        if (this.value.length > 0) {
            this.style.borderColor = '#d1d5db';
        }
    });

    // Remember me functionality
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
        emailInput.value = savedEmail;
        document.getElementById('rememberMe').checked = true;
    }

    loginForm.addEventListener('submit', function() {
        const rememberMe = document.getElementById('rememberMe').checked;
        const email = emailInput.value;

        if (rememberMe) {
            localStorage.setItem('rememberedEmail', email);
        } else {
            localStorage.removeItem('rememberedEmail');
        }
    });

    // Forgot password link (placeholder)
    const forgotPasswordLink = document.querySelector('.link-secondary');
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', function(e) {
            e.preventDefault();
            showToast('Password reset functionality coming soon!', 'info');
        });
    }

    // Mobile menu toggle
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuToggle && navLinks) {
        mobileMenuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }

    // Enter key support
    loginForm.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            loginForm.requestSubmit();
        }
    });
});

// Close modal function (global)
function closeModal() {
    const infoModal = document.getElementById('infoModal');
    infoModal.classList.remove('active');
}

// Toast notification function
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background-color: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#0077b5'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        z-index: 9999;
        animation: slideIn 0.3s ease;
        font-weight: 500;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}
