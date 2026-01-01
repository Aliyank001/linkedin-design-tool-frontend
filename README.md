# LinkedIn Design Tool - Frontend

A professional web-based design tool for creating stunning LinkedIn graphics including cover images and posts.

## 🌟 Features

### User Features
- **LinkedIn Cover Designer** - Create custom 1584×396px cover images
- **LinkedIn Post Designer** - Design engaging 1200×1200px posts
- **6 Pre-made Templates** - Quick start with professional designs
- **6 Color Themes** - Beautiful gradient and solid color schemes
- **Text Customization** - Full control over fonts, sizes, and positioning
- **Live Preview** - See changes in real-time on canvas
- **High-Quality Export** - Download as PNG or JPEG
- **User Authentication** - Secure login and registration
- **Payment Verification** - Manual approval system with screenshot upload
- **Responsive Design** - Works on desktop, tablet, and mobile

### Pages
1. **Home Page** (`index.html`) - Landing page with features and pricing
2. **Designer** (`designer.html`) - Canvas-based design tool
3. **Register** (`register.html`) - User registration with payment upload
4. **Login** (`login.html`) - User authentication

## 🚀 Quick Start

### Prerequisites
- Web browser (Chrome, Firefox, Safari, Edge)
- Backend API running (see backend README)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/YOUR-USERNAME/linkedin-design-tool-frontend.git
cd linkedin-design-tool-frontend
```

2. **Serve the files**

Using Python:
```bash
python -m http.server 8000
```

Using Node.js:
```bash
npx serve
```

Using VS Code:
- Install "Live Server" extension
- Right-click `index.html` > "Open with Live Server"

3. **Access the application**
```
http://localhost:8000
```

## 📁 Project Structure

```
frontend/
├── index.html              # Landing page
├── designer.html           # Design tool interface
├── register.html           # User registration
├── login.html             # User login
├── css/
│   ├── styles.css         # Global styles
│   ├── main.css           # Landing page styles
│   ├── designer.css       # Canvas tool styles
│   ├── auth.css           # Login/register styles
│   └── loading.css        # Loading spinner styles
└── js/
    ├── main.js            # Navigation and auth state
    ├── designer.js        # Canvas rendering logic
    ├── register.js        # Registration form handler
    ├── login.js           # Login form handler
    └── utils.js           # Shared utilities
```

## 🎨 Design Tool Features

### Canvas Dimensions
- **Cover**: 1584 × 396 pixels (LinkedIn cover size)
- **Post**: 1200 × 1200 pixels (scaled to 50% for preview)

### Templates
**Cover Templates (6):**
1. Gradient with centered text
2. Split design with accent
3. Bold statement layout
4. Professional minimal
5. Creative diagonal
6. Modern split-tone

**Post Templates (4):**
1. Quote style
2. Announcement format
3. Tip/Advice layout
4. Promotional design

### Color Themes (6)
1. LinkedIn Blue
2. Sunset Gradient
3. Forest Green
4. Purple Dream
5. Fire Orange
6. Ocean Teal

### Text Controls
- Headline text and size (12-72px)
- Subtext and size (12-48px)
- Font family selection
- Alignment (left, center, right)
- Position offset (X and Y)

### Export Options
- PNG format (default)
- JPEG format
- Full resolution export

## 🔐 Authentication Flow

### Registration
1. User fills registration form
2. Selects payment method (Binance/EasyPaisa/NayaPay)
3. Uploads payment screenshot
4. Account status: **Pending**
5. Admin reviews and approves

### Login
1. User enters credentials
2. System checks approval status:
   - **Pending**: Shows "waiting for approval" message
   - **Approved**: Redirects to designer
   - **Rejected**: Shows rejection reason

### Designer Access
- Only approved users can access the designer
- Unauthenticated users redirected to login
- Session managed with JWT tokens

## 🌐 API Integration

The frontend connects to the backend API:

```javascript
const API_BASE = window.location.origin; // e.g., http://localhost:5000

// Example API endpoints
POST /api/auth/register   - User registration
POST /api/auth/login      - User login
GET  /api/auth/status     - Check auth status
GET  /api/user/design-access - Verify designer access
```

## 📱 Responsive Design

### Breakpoints
- Desktop: > 1024px
- Tablet: 768px - 1024px
- Mobile: < 768px

### Mobile Features
- Hamburger menu navigation
- Touch-friendly buttons
- Optimized canvas controls
- Responsive form layouts

## 🎯 User Journey

1. **Visit Home** → Learn about features
2. **Register** → Submit payment screenshot
3. **Wait for Approval** → Admin reviews
4. **Login** → Access designer
5. **Create Design** → Use templates and customize
6. **Download** → Export high-quality image

## 🛠️ Technologies Used

- **HTML5** - Semantic markup
- **CSS3** - Grid, Flexbox, CSS Variables, Animations
- **Vanilla JavaScript** - ES6+, async/await
- **Canvas API** - Design rendering
- **LocalStorage** - Client-side storage
- **Fetch API** - HTTP requests

## 🎨 Customization

### Modify Colors
Edit CSS variables in `css/styles.css`:
```css
:root {
    --primary-color: #0077b5;
    --secondary-color: #00a0dc;
    --success-color: #10b981;
    --error-color: #ef4444;
}
```

### Add Templates
Add new templates in `js/designer.js`:
```javascript
const coverTemplates = [
    // Add your template function
    (ctx, data, width, height) => {
        // Your drawing logic
    }
];
```

### Add Themes
Add themes in `js/designer.js`:
```javascript
const themes = [
    {
        name: 'Your Theme',
        gradient: 'linear-gradient(135deg, #color1, #color2)',
        colors: ['#color1', '#color2']
    }
];
```

## 🐛 Troubleshooting

### Issue: Can't access designer after approval
**Solution:** Logout and login again to refresh your session

### Issue: Canvas looks blurry
**Solution:** Canvas is rendered at full resolution but displayed at 50% for posts

### Issue: "Server not running" error
**Solution:** Start the backend server first (see backend README)

### Issue: Payment screenshot won't upload
**Solution:** Check file is under 5MB and in JPEG/PNG format

## 🔒 Security Features

- JWT token authentication
- Protected designer route
- XSS prevention with text sanitization
- CORS configuration
- Secure file upload validation

## 📊 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🚀 Deployment

### Using Vercel
```bash
npm install -g vercel
vercel
```

### Using Netlify
```bash
npm install -g netlify-cli
netlify deploy
```

### Update API URL
Before deployment, update API base URL in all JS files:
```javascript
const API_BASE = 'https://your-backend-api.com';
```

## 📝 Environment Configuration

No environment variables needed for frontend. Update API endpoints in:
- `js/designer.js`
- `js/login.js`
- `js/register.js`

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit pull request

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Developer Notes

### Adding New Features
- Follow existing code structure
- Use ES6+ syntax
- Add comments for complex logic
- Test on multiple browsers
- Maintain responsive design

### Code Style
- Use camelCase for variables
- Use descriptive function names
- Keep functions small and focused
- Add error handling
- Use async/await for async operations

## 🌟 Credits

Developed by [Your Name]

## 📞 Support

For issues or questions:
- Create an issue on GitHub
- Email: support@example.com

---

**Made with ❤️ for LinkedIn content creators**
