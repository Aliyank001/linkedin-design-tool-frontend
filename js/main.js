// Main JavaScript - Global functionality

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in and update navigation
    updateNavigation();

    // Mobile menu toggle
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuToggle && navLinks) {
        mobileMenuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            this.classList.toggle('active');
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!event.target.closest('.nav-content')) {
                navLinks.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
            }
        });

        // Close mobile menu when clicking a link
        navLinks.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function() {
                navLinks.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
            });
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add scroll animation to elements
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements with animation
    document.querySelectorAll('.feature-card, .gallery-item, .solution-point').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Utility function to show toast messages
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
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Add CSS animations for toast
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
    .user-info {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 0.5rem 1rem;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 8px;
    }
    .user-info span {
        color: white;
        font-weight: 500;
    }
    .btn-logout {
        padding: 0.5rem 1rem;
        background: #ef4444;
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 0.9rem;
        transition: background 0.3s ease;
    }
    .btn-logout:hover {
        background: #dc2626;
    }
`;
document.head.appendChild(style);

// Update navigation based on login status
function updateNavigation() {
    const token = localStorage.getItem('userToken');
    const userInfoNav = document.getElementById('userInfoNav');
    const userName = document.getElementById('userName');
    const loginLink = document.getElementById('loginLink');
    const registerLink = document.getElementById('registerLink');
    const logoutBtn = document.getElementById('logoutBtn');

    if (token) {
        // User is logged in
        const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
        
        if (userInfoNav && userName && loginLink && registerLink) {
            userInfoNav.style.display = 'flex';
            userName.textContent = userInfo.name || 'User';
            loginLink.style.display = 'none';
            registerLink.style.display = 'none';
        }

        // Add logout handler
        if (logoutBtn) {
            logoutBtn.addEventListener('click', handleLogout);
        }
    } else {
        // User is not logged in
        if (userInfoNav && loginLink && registerLink) {
            userInfoNav.style.display = 'none';
            loginLink.style.display = 'block';
            registerLink.style.display = 'block';
        }
    }
}

// Handle logout
function handleLogout() {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userInfo');
    localStorage.removeItem('pendingRegistration');
    
    showToast('Logged out successfully', 'success');
    
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

document.head.appendChild(style);
