// Register Page JavaScript

// API Configuration
const API_BASE = window.location.origin;

// Add utils script dynamically if not already loaded
if (!window.showLoading) {
    const script = document.createElement('script');
    script.src = 'js/utils.js';
    document.head.appendChild(script);
}

document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    const paymentMethodSelect = document.getElementById('paymentMethod');
    const paymentDetails = document.getElementById('paymentDetails');
    const paymentInstructions = document.getElementById('paymentInstructions');
    const fileInput = document.getElementById('paymentScreenshot');
    const filePreview = document.getElementById('filePreview');
    const successModal = document.getElementById('successModal');

    // Payment method instructions
    const paymentMethods = {
        binance: {
            title: 'Binance Payment',
            instructions: `
                <p><strong>Pay $29 via Binance:</strong></p>
                <ol>
                    <li>Open your Binance app</li>
                    <li>Go to Pay → Send</li>
                    <li>Send <strong>$29 USDT</strong> to:</li>
                    <li><code style="background: #f3f4f6; padding: 0.5rem; border-radius: 4px; display: block; margin: 0.5rem 0;">binance_wallet_id_here</code></li>
                    <li>Take a screenshot of the confirmation</li>
                    <li>Upload the screenshot below</li>
                </ol>
            `
        },
        easypaisa: {
            title: 'EasyPaisa Payment',
            instructions: `
                <p><strong>Pay via EasyPaisa:</strong></p>
                <ol>
                    <li>Open EasyPaisa app</li>
                    <li>Go to Send Money</li>
                    <li>Send <strong>PKR 8,000</strong> to:</li>
                    <li><code style="background: #f3f4f6; padding: 0.5rem; border-radius: 4px; display: block; margin: 0.5rem 0;">03XX-XXXXXXX</code></li>
                    <li>Take a screenshot of the transaction</li>
                    <li>Upload the screenshot below</li>
                </ol>
            `
        },
        nayapay: {
            title: 'NayaPay Payment',
            instructions: `
                <p><strong>Pay via NayaPay:</strong></p>
                <ol>
                    <li>Open NayaPay app</li>
                    <li>Go to Send Money</li>
                    <li>Send <strong>PKR 8,000</strong> to:</li>
                    <li><code style="background: #f3f4f6; padding: 0.5rem; border-radius: 4px; display: block; margin: 0.5rem 0;">03XX-XXXXXXX</code></li>
                    <li>Take a screenshot of the confirmation</li>
                    <li>Upload the screenshot below</li>
                </ol>
            `
        }
    };

    // Show payment instructions based on selected method
    paymentMethodSelect.addEventListener('change', function() {
        const method = this.value;
        
        if (method && paymentMethods[method]) {
            paymentInstructions.innerHTML = paymentMethods[method].instructions;
            paymentDetails.style.display = 'block';
        } else {
            paymentDetails.style.display = 'none';
        }
    });

    // File upload preview
    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                showToast('Please upload an image file', 'error');
                this.value = '';
                return;
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                showToast('File size must be less than 5MB', 'error');
                this.value = '';
                return;
            }

            // Show preview
            const reader = new FileReader();
            reader.onload = function(event) {
                filePreview.innerHTML = `
                    <img src="${event.target.result}" alt="Payment screenshot preview">
                    <p><strong>File:</strong> ${file.name}</p>
                `;
            };
            reader.readAsDataURL(file);
        }
    });

    // Form validation and submission
    registerForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Get form data
        const fullName = document.getElementById('fullName').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const paymentMethod = document.getElementById('paymentMethod').value;
        const paymentScreenshot = document.getElementById('paymentScreenshot').files[0];
        const agreeTerms = document.getElementById('agreeTerms').checked;

        // Validate password match
        if (password !== confirmPassword) {
            showToast('Passwords do not match', 'error');
            return;
        }

        // Validate password strength
        if (password.length < 8) {
            showToast('Password must be at least 8 characters', 'error');
            return;
        }

        // Validate payment method
        if (!paymentMethod) {
            showToast('Please select a payment method', 'error');
            return;
        }

        // Validate payment screenshot
        if (!paymentScreenshot) {
            showToast('Please upload payment screenshot', 'error');
            return;
        }

        // Validate terms agreement
        if (!agreeTerms) {
            showToast('Please agree to the terms and conditions', 'error');
            return;
        }

        // Submit to backend
        await submitRegistration(fullName, email, password, paymentMethod, paymentScreenshot);
    });

    async function submitRegistration(fullName, email, password, paymentMethod, paymentScreenshot) {
        // Show loading overlay
        showLoading('Uploading payment screenshot...');
        
        const submitBtn = registerForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.classList.add('btn-loading');
        submitBtn.disabled = true;

        try {
            // Create FormData for file upload
            const formData = new FormData();
            formData.append('name', fullName);
            formData.append('email', email);
            formData.append('password', password);
            formData.append('paymentMethod', paymentMethod);
            formData.append('paymentScreenshot', paymentScreenshot);

            // Update loading message
            showLoading('Creating your account...');

            // Send to backend
            const response = await fetch(`${API_BASE}/api/auth/register`, {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                // Hide loading
                hideLoading();
                
                // Store registration data in localStorage
                const registrationData = {
                    fullName: fullName,
                    email: email,
                    paymentMethod: paymentMethod,
                    registeredAt: new Date().toISOString(),
                    status: 'pending_approval'
                };
                localStorage.setItem('pendingRegistration', JSON.stringify(registrationData));

                // Reset form
                registerForm.reset();
                filePreview.innerHTML = '';
                paymentDetails.style.display = 'none';

                // Show success modal
                successModal.classList.add('active');

                showToast('✓ Registration successful! Awaiting admin approval', 'success', 4000);
            } else {
                hideLoading();
                showToast(data.message || 'Registration failed. Please try again.', 'error');
            }
        } catch (error) {
            hideLoading();
            console.error('Registration error:', error);
            showToast('Network error. Please check your connection and try again.', 'error');
        } finally {
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.classList.remove('btn-loading');
            submitBtn.disabled = false;
        }
    }

    // Close modal when clicking outside
    successModal.addEventListener('click', function(e) {
        if (e.target === successModal) {
            this.classList.remove('active');
        }
    });

    // Form field validation feedback
    const requiredFields = registerForm.querySelectorAll('[required]');
    requiredFields.forEach(field => {
        field.addEventListener('blur', function() {
            if (this.value.trim() === '') {
                this.style.borderColor = '#ef4444';
            } else {
                this.style.borderColor = '#10b981';
            }
        });

        field.addEventListener('input', function() {
            if (this.value.trim() !== '') {
                this.style.borderColor = '#d1d5db';
            }
        });
    });

    // Email validation
    const emailInput = document.getElementById('email');
    emailInput.addEventListener('blur', function() {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(this.value)) {
            this.style.borderColor = '#ef4444';
            showToast('Please enter a valid email address', 'error');
        } else {
            this.style.borderColor = '#10b981';
        }
    });

    // Password strength indicator
    const passwordInput = document.getElementById('password');
    passwordInput.addEventListener('input', function() {
        const password = this.value;
        let strength = 0;

        if (password.length >= 8) strength++;
        if (password.match(/[a-z]+/)) strength++;
        if (password.match(/[A-Z]+/)) strength++;
        if (password.match(/[0-9]+/)) strength++;
        if (password.match(/[$@#&!]+/)) strength++;

        // Update border color based on strength
        if (strength < 2) {
            this.style.borderColor = '#ef4444';
        } else if (strength < 4) {
            this.style.borderColor = '#f59e0b';
        } else {
            this.style.borderColor = '#10b981';
        }
    });

    // Mobile menu toggle (from main.js but included for standalone functionality)
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuToggle && navLinks) {
        mobileMenuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }
});

// Toast notification function (duplicated for standalone functionality)
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
