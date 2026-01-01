// Designer Page JavaScript - Core functionality for LinkedIn design tool

// API Configuration
const API_BASE = window.location.origin;

document.addEventListener('DOMContentLoaded', async function() {
    // Show loading while checking authentication
    showLoading('Verifying access...');
    
    // Check authentication first
    await checkAuthentication();
    
    // Hide loading after auth check
    hideLoading();

    // Canvas setup
    const canvas = document.getElementById('designCanvas');
    const ctx = canvas.getContext('2d');
    
    // Design state
    let currentMode = 'cover'; // 'cover' or 'post'
    let currentTemplate = 1;
    let currentTheme = {
        gradient: 'linear-gradient(135deg, #0077b5, #00a0dc)',
        colors: ['#0077b5', '#00a0dc']
    };
    
    let designData = {
        headline: 'Professional LinkedIn Designer',
        subtext: 'Creating Impact Through Design',
        headlineSize: 36,
        subtextSize: 18,
        fontFamily: "'Segoe UI', sans-serif",
        alignment: 'center',
        offsetX: 0,
        offsetY: 0
    };

    // Canvas dimensions (actual export size)
    const dimensions = {
        cover: { width: 1584, height: 396 },
        post: { width: 1200, height: 1200 }
    };

    // Display scale for preview (makes post preview smaller)
    const displayScale = {
        cover: 1,
        post: 0.5  // Posts will display at 50% size (600x600) but export at full size
    };

    // Initialize canvas
    function initCanvas() {
        const dim = dimensions[currentMode];
        canvas.width = dim.width;
        canvas.height = dim.height;
        
        // Apply display scaling for better preview
        const scale = displayScale[currentMode];
        canvas.style.width = (dim.width * scale) + 'px';
        canvas.style.height = (dim.height * scale) + 'px';
        
        updateDimensionsDisplay();
        renderDesign();
    }

    function updateDimensionsDisplay() {
        const dim = dimensions[currentMode];
        document.getElementById('canvasDimensions').textContent = `${dim.width} × ${dim.height}`;
    }

    // Templates data
    const templates = {
        cover: [
            { id: 1, name: 'Professional', gradient: ['#0077b5', '#00a0dc'] },
            { id: 2, name: 'Modern', gradient: ['#6366f1', '#8b5cf6'] },
            { id: 3, name: 'Elegant', gradient: ['#1f2937', '#374151'] },
            { id: 4, name: 'Vibrant', gradient: ['#f43f5e', '#fb923c'] },
            { id: 5, name: 'Success', gradient: ['#10b981', '#059669'] },
            { id: 6, name: 'Minimal', gradient: ['#ffffff', '#f3f4f6'] }
        ],
        post: [
            { id: 1, name: 'Bold', gradient: ['#0077b5', '#00a0dc'] },
            { id: 2, name: 'Creative', gradient: ['#6366f1', '#8b5cf6'] },
            { id: 3, name: 'Classic', gradient: ['#1f2937', '#374151'] },
            { id: 4, name: 'Energetic', gradient: ['#f43f5e', '#fb923c'] }
        ]
    };

    // Load templates
    function loadTemplates() {
        const templatesGrid = document.getElementById('templatesGrid');
        templatesGrid.innerHTML = '';
        
        const currentTemplates = templates[currentMode];
        currentTemplates.forEach(template => {
            const item = document.createElement('div');
            item.className = `template-item ${currentMode === 'post' ? 'post-template' : ''}`;
            item.style.background = `linear-gradient(135deg, ${template.gradient[0]}, ${template.gradient[1]})`;
            item.textContent = template.name;
            item.dataset.templateId = template.id;
            
            if (template.id === currentTemplate) {
                item.classList.add('active');
            }
            
            item.addEventListener('click', () => selectTemplate(template));
            templatesGrid.appendChild(item);
        });
    }

    function selectTemplate(template) {
        currentTemplate = template.id;
        currentTheme.colors = template.gradient;
        
        // Update active state
        document.querySelectorAll('.template-item').forEach(item => {
            item.classList.remove('active');
            if (parseInt(item.dataset.templateId) === template.id) {
                item.classList.add('active');
            }
        });
        
        renderDesign();
    }

    // Mode selector
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const mode = this.dataset.mode;
            if (mode === currentMode) return;
            
            currentMode = mode;
            currentTemplate = 1;
            
            // Update active state
            document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Reset offsets
            designData.offsetX = 0;
            designData.offsetY = 0;
            
            initCanvas();
            loadTemplates();
        });
    });

    // Theme selector
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const theme = this.dataset.theme;
            const bgStyle = window.getComputedStyle(this).background;
            
            // Extract colors from gradient
            const colors = extractColorsFromGradient(bgStyle);
            currentTheme.colors = colors;
            
            // Update active state
            document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            renderDesign();
        });
    });

    function extractColorsFromGradient(bgStyle) {
        // Simple extraction - in production, use more robust parsing
        if (bgStyle.includes('rgb(255, 255, 255)')) {
            return ['#ffffff', '#f3f4f6'];
        }
        // Default to professional blue
        return ['#0077b5', '#00a0dc'];
    }

    // Text inputs
    document.getElementById('headlineText').addEventListener('input', function(e) {
        designData.headline = e.target.value;
        renderDesign();
    });

    document.getElementById('subtextText').addEventListener('input', function(e) {
        designData.subtext = e.target.value;
        renderDesign();
    });

    // Font controls
    document.getElementById('fontFamily').addEventListener('change', function(e) {
        designData.fontFamily = e.target.value;
        renderDesign();
    });

    document.getElementById('headlineFontSize').addEventListener('input', function(e) {
        designData.headlineSize = parseInt(e.target.value);
        document.getElementById('headlineSizeValue').textContent = e.target.value + 'px';
        renderDesign();
    });

    document.getElementById('subtextFontSize').addEventListener('input', function(e) {
        designData.subtextSize = parseInt(e.target.value);
        document.getElementById('subtextSizeValue').textContent = e.target.value + 'px';
        renderDesign();
    });

    // Alignment buttons
    document.querySelectorAll('.align-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            designData.alignment = this.dataset.align;
            
            // Update active state
            document.querySelectorAll('.align-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            renderDesign();
        });
    });

    // Position controls
    document.querySelectorAll('.position-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const direction = this.dataset.direction;
            const step = 10;
            
            switch(direction) {
                case 'up':
                    designData.offsetY -= step;
                    break;
                case 'down':
                    designData.offsetY += step;
                    break;
                case 'left':
                    designData.offsetX -= step;
                    break;
                case 'right':
                    designData.offsetX += step;
                    break;
                case 'reset':
                    designData.offsetX = 0;
                    designData.offsetY = 0;
                    break;
            }
            
            renderDesign();
        });
    });

    // Render design on canvas
    function renderDesign() {
        const dim = dimensions[currentMode];
        
        // Clear canvas
        ctx.clearRect(0, 0, dim.width, dim.height);
        
        // Draw gradient background
        const gradient = ctx.createLinearGradient(0, 0, dim.width, dim.height);
        gradient.addColorStop(0, currentTheme.colors[0]);
        gradient.addColorStop(1, currentTheme.colors[1]);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, dim.width, dim.height);
        
        // Calculate text position
        let textX = dim.width / 2 + designData.offsetX;
        let textY = dim.height / 2 + designData.offsetY;
        
        // Adjust alignment
        ctx.textAlign = designData.alignment;
        if (designData.alignment === 'left') {
            textX = 100 + designData.offsetX;
        } else if (designData.alignment === 'right') {
            textX = dim.width - 100 + designData.offsetX;
        }
        
        // Draw headline
        ctx.fillStyle = currentTheme.colors[0] === '#ffffff' ? '#1f2937' : '#ffffff';
        ctx.font = `bold ${designData.headlineSize}px ${designData.fontFamily}`;
        ctx.fillText(designData.headline, textX, textY - 20);
        
        // Draw subtext
        ctx.font = `${designData.subtextSize}px ${designData.fontFamily}`;
        ctx.fillStyle = currentTheme.colors[0] === '#ffffff' ? '#6b7280' : 'rgba(255, 255, 255, 0.9)';
        ctx.fillText(designData.subtext, textX, textY + designData.headlineSize);
        
        // Add decorative elements for certain templates
        if (currentMode === 'cover') {
            drawCoverDecorations();
        } else {
            drawPostDecorations();
        }
    }

    function drawCoverDecorations() {
        // Add subtle decorative elements
        ctx.strokeStyle = currentTheme.colors[0] === '#ffffff' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 2;
        
        // Top left corner accent
        ctx.beginPath();
        ctx.moveTo(50, 50);
        ctx.lineTo(150, 50);
        ctx.stroke();
        
        // Bottom right corner accent
        ctx.beginPath();
        ctx.moveTo(canvas.width - 150, canvas.height - 50);
        ctx.lineTo(canvas.width - 50, canvas.height - 50);
        ctx.stroke();
    }

    function drawPostDecorations() {
        // Add frame or border for posts
        ctx.strokeStyle = currentTheme.colors[0] === '#ffffff' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 3;
        ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);
    }

    // Download functionality
    document.getElementById('downloadPNG').addEventListener('click', function() {
        downloadDesign('png');
    });

    document.getElementById('downloadJPG').addEventListener('click', function() {
        downloadDesign('jpeg');
    });

    function downloadDesign(format) {
        const link = document.createElement('a');
        const filename = `linkedin-${currentMode}-${Date.now()}.${format === 'jpeg' ? 'jpg' : 'png'}`;
        
        link.download = filename;
        link.href = canvas.toDataURL(`image/${format}`, 1.0);
        link.click();
        
        // Show success message
        showToast(`Design downloaded as ${format.toUpperCase()}!`, 'success');
    }

    // Authentication check function
    async function checkAuthentication() {
        const token = localStorage.getItem('userToken');
        
        if (!token) {
            // Not logged in, redirect to login
            showToast('Please login to access the designer', 'error');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);
            return;
        }

        try {
            // Verify token and check approval status
            const response = await fetch(`${API_BASE}/api/user/design-access`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!data.success || !data.canAccess) {
                // Not approved or token invalid
                if (data.message && data.message.includes('pending')) {
                    showToast('Your account is pending approval', 'info');
                } else if (data.message && data.message.includes('rejected')) {
                    showToast('Your account was rejected. Please contact admin.', 'error');
                } else {
                    showToast('Access denied. Please login again.', 'error');
                }
                
                localStorage.removeItem('userToken');
                localStorage.removeItem('userInfo');
                
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);
                return;
            }

            // User is approved, show welcome message
            const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
            if (userInfo && userInfo.name) {
                showToast(`Welcome back, ${userInfo.name}!`, 'success');
            }
        } catch (error) {
            console.error('Auth check error:', error);
            showToast('Authentication error. Please login again.', 'error');
            
            localStorage.removeItem('userToken');
            localStorage.removeItem('userInfo');
            
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);
        }
    }

    // Initialize
    initCanvas();
    loadTemplates();
});
