# Testing Guide - LinkedIn Design Tool

## 🚀 Complete User Flow Test

Follow these steps to test the entire application:

---

## ✅ Step 1: Start the Backend Server

```powershell
cd "E:\ALIYAN PROJECT\linkedIn\backend"
node server.js
```

**Expected:** Server running at http://localhost:5000

---

## ✅ Step 2: Test User Registration

1. Open browser: http://localhost:5000/register.html
2. Fill in the form:
   - Full Name: `Test User`
   - Email: `test@example.com`
   - Password: `Password123`
   - Confirm Password: `Password123`
   - Payment Method: Select `Binance`
   - Upload a test image (any JPG/PNG)
   - Check "I agree to terms"
3. Click "Create Account"

**Expected:**
- Success message appears
- Form resets
- User data saved to MongoDB
- Status: Pending approval

---

## ✅ Step 3: Try to Login (Pending Status)

1. Open: http://localhost:5000/login.html
2. Enter:
   - Email: `test@example.com`
   - Password: `Password123`
3. Click "Login"

**Expected:**
- Info modal appears: "Account pending approval"
- Cannot access designer yet

---

## ✅ Step 4: Admin Approval

1. Open admin panel: http://localhost:5000/admin
2. Login with:
   - Email: `admin@linkedindesign.com`
   - Password: `Admin@123456`
3. Go to Dashboard
4. Find "Test User" in pending users
5. Click "Approve" button

**Expected:**
- User status changes to "Approved"
- User can now access designer

---

## ✅ Step 5: User Login (Approved)

1. Go back to: http://localhost:5000/login.html
2. Login again with:
   - Email: `test@example.com`
   - Password: `Password123`
3. Click "Login"

**Expected:**
- Success message
- Redirected to designer page
- Welcome message: "Welcome back, Test User!"
- Navigation shows user name and logout button

---

## ✅ Step 6: Test Designer Access Protection

### Test A: Without Login
1. Open incognito/private window
2. Try to access: http://localhost:5000/designer.html
3. **Expected:** Redirected to login page with error message

### Test B: With Login (Approved User)
1. Already logged in from Step 5
2. Access: http://localhost:5000/designer.html
3. **Expected:** Designer loads successfully

---

## ✅ Step 7: Test Designer Functionality

1. On designer page:
   - Switch between Cover and Post modes
   - Select different templates
   - Change themes
   - Edit text (headline and subtext)
   - Adjust font size and alignment
   - Download as PNG/JPG

**Expected:** All features work correctly

---

## ✅ Step 8: Test Logout

1. Click "Logout" button in navigation
2. **Expected:**
   - Success message
   - Redirected to home page
   - Navigation shows Login/Register again
   - Cannot access designer anymore

---

## ✅ Step 9: Test Navigation Consistency

1. Visit home page: http://localhost:5000/
2. **Not logged in:** Shows Login and "Get Started"
3. **Logged in:** Shows username and Logout button
4. Navigate between pages - navigation state persists

---

## 🔧 Test Different User Scenarios

### Scenario 1: Rejected User
1. Register new user: `rejected@example.com`
2. Admin rejects with reason: "Invalid payment screenshot"
3. Try to login
4. **Expected:** Error message with rejection reason

### Scenario 2: Multiple Users
1. Register 3-5 different users
2. Approve some, reject others
3. Check admin dashboard analytics
4. **Expected:** Correct counts and percentages

### Scenario 3: Invalid Credentials
1. Try to login with wrong password
2. **Expected:** "Login failed" error
3. Try non-existent email
4. **Expected:** "Login failed" error

---

## 📊 Admin Panel Tests

### Dashboard
- ✅ Shows total users count
- ✅ Shows approved/pending/rejected counts
- ✅ Shows approval rate percentage
- ✅ Recent registrations table
- ✅ Pending users with approve/reject buttons

### Users Page
- ✅ Filter by status (All/Pending/Approved/Rejected)
- ✅ Search by name or email
- ✅ View payment screenshots
- ✅ Delete users
- ✅ Pagination works (if >20 users)

---

## 🐛 Common Issues & Solutions

### Issue: "Network error" on registration
**Solution:** Check if backend server is running on port 5000

### Issue: Designer redirects to login even after login
**Solution:** 
1. Check browser console for errors
2. Verify token is saved: Check localStorage in DevTools
3. Make sure user status is "approved" in admin panel

### Issue: Navigation doesn't show username
**Solution:**
1. Clear browser cache
2. Hard refresh (Ctrl+Shift+R)
3. Check if main.js is loaded

### Issue: Images/Screenshots not uploading
**Solution:**
1. Check file size < 5MB
2. Ensure uploads folder exists: `backend/uploads/payment-screenshots`
3. Check file permissions

---

## ✅ Success Criteria

All tests pass when:

1. ✅ User can register with payment screenshot
2. ✅ Registration saves to database
3. ✅ User cannot login until approved
4. ✅ Admin can approve/reject users
5. ✅ Approved users can login and access designer
6. ✅ Rejected users see rejection reason
7. ✅ Designer is protected (auth required)
8. ✅ Navigation shows correct state (logged in/out)
9. ✅ Logout works and clears session
10. ✅ All designer features work
11. ✅ Admin panel analytics are accurate
12. ✅ Payment screenshots are stored and viewable

---

## 🎯 Performance Checklist

- [ ] Page loads in < 2 seconds
- [ ] No console errors
- [ ] Forms validate properly
- [ ] API responses < 500ms
- [ ] Images load correctly
- [ ] Mobile responsive (test on phone)
- [ ] Works in Chrome, Firefox, Edge

---

## 📝 Test Results Template

```
Date: ___________
Tester: ___________

Registration: [ PASS / FAIL ]
Login (Pending): [ PASS / FAIL ]
Admin Approval: [ PASS / FAIL ]
Login (Approved): [ PASS / FAIL ]
Designer Protection: [ PASS / FAIL ]
Designer Features: [ PASS / FAIL ]
Logout: [ PASS / FAIL ]
Navigation State: [ PASS / FAIL ]
Admin Dashboard: [ PASS / FAIL ]
User Management: [ PASS / FAIL ]

Overall Status: [ PASS / FAIL ]
Notes: 
___________________________________
___________________________________
```

---

**Happy Testing! 🚀**
