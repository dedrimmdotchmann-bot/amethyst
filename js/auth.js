// Initialize localStorage if empty
if (!localStorage.getItem('users')) {
    const defaultUsers = {
        admin: {
            id: 'admin1',fullname: 'Blessing Brian Inyang',
            email: 'admin@amethyst.ng',
            zone: 'South-South',
            gender: 'Male',
            password: 'admin123',
            role: 'admin',
            memberSince: new Date().toISOString(),
            lastLogin: null,
            reviewsSubmitted: 0
        }
    };
    localStorage.setItem('users', JSON.stringify(defaultUsers));
}

if (!localStorage.getItem('reviews')) {
    localStorage.setItem('reviews', JSON.stringify([]));
}

if (!localStorage.getItem('activity')) {
    localStorage.setItem('activity', JSON.stringify([]));
}

// Helper Functions
function logActivity(userId, action, details) {
    const activities = JSON.parse(localStorage.getItem('activity'));
    activities.unshift({
        userId,
        action,
        details,
        timestamp: new Date().toISOString()
    });
    localStorage.setItem('activity', JSON.stringify(activities.slice(0, 50))); // Keep last 50
}

function getCurrentUser() {
    return JSON.parse(sessionStorage.getItem('currentUser'));
}

function setCurrentUser(user) {
    sessionStorage.setItem('currentUser', JSON.stringify(user));
}

function clearCurrentUser() {
    sessionStorage.removeItem('currentUser');
}

function isAuthenticated() {
    return getCurrentUser() !== null;
}

// Redirect if not authenticated
function requireAuth() {
    if (!isAuthenticated() && !window.location.pathname.includes('index.html')) {
        window.location.href = 'index.html';
    }
}

// Login Function
function login(email, password) {
    const users = JSON.parse(localStorage.getItem('users'));
    const user = Object.values(users).find(u => u.email === email && u.password === password);
    
    if (user) {
        // Update last login
        user.lastLogin = new Date().toISOString();
        users[user.id] = user;
        localStorage.setItem('users', JSON.stringify(users));
        
        // Set session
        const { password: _, ...userWithoutPassword } = user;
        setCurrentUser(userWithoutPassword);
        
        // Log activity
        logActivity(user.id, 'login', 'User logged in');
        
        return { success: true, user: userWithoutPassword };
    }
    return { success: false, message: 'Invalid email or password' };
}

// Signup Function
function signup(fullname, email, zone, gender, password) {
    const users = JSON.parse(localStorage.getItem('users'));
    
    // Check if email exists
    if (Object.values(users).some(u => u.email === email)) {
        return { success: false, message: 'Email already registered' };
    }
    
    const newUser = {
        id: 'user_' + Date.now(),
        fullname,
        email,
        zone,
        gender,
        password,
        role: 'member',
        memberSince: new Date().toISOString(),
        lastLogin: null,
        reviewsSubmitted: 0
    };
    
    users[newUser.id] = newUser;
    localStorage.setItem('users', JSON.stringify(users));
    
    // Log activity
    logActivity(newUser.id, 'signup', 'New member registered');
    
    const { password: _, ...userWithoutPassword } = newUser;
    return { success: true, user: userWithoutPassword };
}

// Event Listeners for index.html
if (document.getElementById('login')) {
    document.getElementById('login').addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const result = login(email, password);
        
        if (result.success) {
            window.location.href = 'dashboard.html';
        } else {
            alert(result.message);
        }
    });
}

if (document.getElementById('signup')) {
    document.getElementById('signup').addEventListener('submit', (e) => {e.preventDefault();
        const fullname = document.getElementById('signupFullname').value;
        const email = document.getElementById('signupEmail').value;
        const zone = document.getElementById('signupZone').value;
        const gender = document.getElementById('signupGender').value;
        const password = document.getElementById('signupPassword').value;
        
        const result = signup(fullname, email, zone, gender, password);
        
        if (result.success) {
            alert('Account created successfully! Please login.');
            showLogin();
        } else {
            alert(result.message);
        }
    });
}

// Toggle forms
function showSignup() {
    document.getElementById('loginForm').classList.remove('active');
    document.getElementById('signupForm').classList.add('active');
}

function showLogin() {
    document.getElementById('signupForm').classList.remove('active');
    document.getElementById('loginForm').classList.add('active');
}

// Logout handler for all pages
if (document.getElementById('logoutBtn')) {
    document.getElementById('logoutBtn').addEventListener('click', (e) => {
        e.preventDefault();
        const user = getCurrentUser();
        if (user) {
            logActivity(user.id, 'logout', 'User logged out');
        }
        clearCurrentUser();
        window.location.href = 'index.html';
    });
}

// Auto-check auth on pages that need it
if (!window.location.pathname.includes('index.html')) {
    requireAuth();
}
