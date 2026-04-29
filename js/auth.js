// ============================================
// AMETHYST AUTH SYSTEM - FIXED PASSWORD LOGIN
// ============================================

// Initialize localStorage with default admin if empty
function initializeData() {
    // Initialize members if empty
    if (!localStorage.getItem('amethyst_members')) {
        const defaultMembers = [
            {
                id: 'admin_001',
                fullName: 'System Administrator',
                email: 'admin@amethyst.ng',
                password: 'admin123',
                zone: 'South-West',
                gender: 'Prefer not to say',
                role: 'admin',
                status: 'active',
                registrationDate: new Date().toISOString()
            }
        ];
        localStorage.setItem('amethyst_members', JSON.stringify(defaultMembers));
        console.log('✅ Default admin account created');
    }
    
    // Initialize email log
    if (!localStorage.getItem('amethyst_email_log')) {
        localStorage.setItem('amethyst_email_log', JSON.stringify([]));
    }
}

// Call initialization
initializeData();

// Current logged in user
let currentUser = null;

// Helper: Show message
function showMessage(formId, message, isError = false) {
    const form = document.getElementById(formId);
    if (!form) return;
    
    // Remove existing message
    const existingMsg = form.querySelector('.form-message');
    if (existingMsg) existingMsg.remove();
    
    const msgDiv = document.createElement('div');
    msgDiv.className = `form-message ${isError ? 'error' : 'success'}`;
    msgDiv.textContent = message;
    msgDiv.style.padding = '10px';
    msgDiv.style.marginBottom = '15px';
    msgDiv.style.borderRadius = '5px';
    msgDiv.style.backgroundColor = isError ? '#fee' : '#e6f7e6';
    msgDiv.style.color = isError ? '#c33' : '#2a7f2a';
    msgDiv.style.border = `1px solid ${isError ? '#fcc' : '#b3e6b3'}`;
    
    form.insertBefore(msgDiv, form.firstChild);
    
    setTimeout(() => {
        if (msgDiv) msgDiv.remove();
    }, 5000);
}

// LOGIN FUNCTION - FIXED
document.getElementById('login')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    console.log('🔐 Attempting login for:', email);
    
    const members = JSON.parse(localStorage.getItem('amethyst_members') || '[]');
    console.log('📋 Total members in system:', members.length);
    
    // Find user by email
    const user = members.find(m => m.email === email);
    
    if (!user) {
        console.log('❌ User not found:', email);
        showMessage('loginForm', 'User not found. Please check your email.', true);
        return;
    }
    
    // Check password
    if (user.password === password) {
        console.log('✅ Login successful:', user.fullName);
        currentUser = user;
        sessionStorage.setItem('amethyst_current_user', JSON.stringify(user));
        window.location.href = 'dashboard.html';
    } else {
        console.log('❌ Wrong password for:', email);
        console.log('   Expected:', user.password);
        console.log('   Received:', password);
        showMessage('loginForm', 'Incorrect password. Please try again.', true);
    }
});

// SIGNUP FUNCTION
document.getElementById('signup')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const fullName = document.getElementById('signupFullname').value;
    const email = document.getElementById('signupEmail').value;
    const zone = document.getElementById('signupZone').value;
    const gender = document.getElementById('signupGender').value;
    const password = document.getElementById('signupPassword').value;
    
    const members = JSON.parse(localStorage.getItem('amethyst_members') || '[]');
    
    // Check if email exists
    if (members.some(m => m.email === email)) {
        showMessage('signupForm', 'Email already registered. Please login.', true);
        return;
    }
    
    // Create new member
    const newMember = {
        id: `MEMBER_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        fullName: fullName,
        email: email,
        password: password,
        zone: zone,
        gender: gender,
        role: 'member',
        status: 'active',
        registrationDate: new Date().toISOString()
    };
    
    members.push(newMember);
    localStorage.setItem('amethyst_members', JSON.stringify(members));
    
    showMessage('signupForm', 'Account created successfully! Please login.', false);
    
    // Clear form
    document.getElementById('signup').reset();
    
    // Switch to login after 2 seconds
    setTimeout(() => {
        showLogin();
    }, 2000);
});

// UI Functions
function showLogin() {
    document.getElementById('loginForm').classList.add('active');
    document.getElementById('signupForm').classList.remove('active');
}

function showSignup() {
    document.getElementById('signupForm').classList.add('active');
    document.getElementById('loginForm').classList.remove('active');
}

// ============================================
// FUNCTION TO ADD THE 9 IMPORTED USERS
// ============================================
function importNineUsers() {
    const nineUsers = [
        { fullName: "Melody F. Samuel", email: "samuelmelly425@gmail.com", phone: "07081200764", worldview: "Atheist", ageRange: "18 - 25", gender: "Male", location: "lle-ife, Osun State", zone: "South-West", password: "melody123@Coret" },
        { fullName: "Chinaza James-Ibe", email: "nazaekpere.ji@gmail.com", phone: "08106833221", worldview: "Non-Religious", ageRange: "18 - 25", gender: "Female", location: "Imo, Nigeria", zone: "South-East", password: "chinaza123@Coret" },
        { fullName: "Chioma Black", email: "chiomablack2001@gmail.com", phone: "07015457824", worldview: "Humanist", ageRange: "18 - 25", gender: "Female", location: "Enugu, Nigeria", zone: "South-East", password: "chioma123@Coret" },
        { fullName: "Maduka Anthony ikenna", email: "anthonymaduka71@gmail.com", phone: "08037835130", worldview: "Humanist", ageRange: "40 - 55", gender: "Male", location: "Aba, Nigeria", zone: "South-East", password: "maduka123@Coret" },
        { fullName: "B. B. Inyang", email: "blessinbrian@gmail.com", phone: "+2348186423960", worldview: "Humanist", ageRange: "26 - 39", gender: "Male", location: "Enugu, Nigeria", zone: "South-East", password: "blessin123@Coret" },
        { fullName: "Najibu Abubakar", email: "Najeebabubakar3rd@gmail.com", phone: "07060732239", worldview: "Humanist", ageRange: "26 - 39", gender: "Male", location: "Bauchi, Nigeria", zone: "North-East", password: "najibu123@Coret" },
        { fullName: "Muhammed Babangida", email: "muhammedbabangida29@gmail.com", phone: "07032122593", worldview: "Humanist", ageRange: "26 - 39", gender: "Male", location: "Gashua", zone: "North-East", password: "muhammed123@Coret" },
        { fullName: "Juliet Obiajulu", email: "julietobi777@gmail.com", phone: "08130922127", worldview: "Theist", ageRange: "26 - 39", gender: "Female", location: "Delta Nigeria", zone: "South-South", password: "juliet123@Coret" },
        { fullName: "Emmanuel Ike", email: "emmanuelikeamadi@gmail.com", phone: "09157818284", worldview: "Humanist", ageRange: "26 - 39", gender: "Male", location: "Port Harcourt", zone: "South-South", password: "emmanuel123@Coret" }
    ];
    
    const members = JSON.parse(localStorage.getItem('amethyst_members') || '[]');
    let addedCount = 0;
    
    for (const user of nineUsers) {
        // Check if user already exists
        if (!members.some(m => m.email === user.email)) {
            const newMember = {
                id: `IMPORTED_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`,
                fullName: user.fullName,
                email: user.email,
                phone: user.phone,
                password: user.password,  // Using fixed password
                worldview: user.worldview,
                ageRange: user.ageRange,
                gender: user.gender,
                location: user.location,
                zone: user.zone,
                role: 'member',
                status: 'active',
                registrationDate: new Date().toISOString(),
                source: 'csv_import'
            };
            
            members.push(newMember);
            addedCount++;
            
            console.log(`✅ Imported: ${user.fullName} (${user.email})`);
            console.log(`   Password: ${user.password}`);
        }
    }
    
    if (addedCount > 0) {
        localStorage.setItem('amethyst_members', JSON.stringify(members));
        console.log(`🎉 Successfully imported ${addedCount} new users!`);
        
        // Display all users and their passwords
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📋 ALL USER CREDENTIALS:');
        nineUsers.forEach(u => {
            console.log(`${u.fullName}: ${u.email} / ${u.password}`);
        });
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        return addedCount;
    } else {
        console.log('ℹ️ All 9 users already exist in the system.');
        return 0;
    }
}

// Auto-import users when page loads (if not already imported)
function autoImportOnLoad() {
    const importFlag = localStorage.getItem('amethyst_users_imported');
    if (!importFlag) {
        const count = importNineUsers();
        if (count > 0) {
            localStorage.setItem('amethyst_users_imported', 'true');
            console.log(`🎉 Auto-imported ${count} users from Google Form!`);
        }
    }
}

// Run auto-import
autoImportOnLoad();

// Export for use in dashboard
window.amethystData = {
    importNineUsers,
    getMembers: () => JSON.parse(localStorage.getItem('amethyst_members') || '[]')
};

// Debug function - shows all users and passwords in console
function showAllUsers() {
    const members = JSON.parse(localStorage.getItem('amethyst_members') || '[]');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📋 ALL USERS IN SYSTEM:');
    members.forEach(m => {
        console.log(`👤 ${m.fullName || m.email}`);
        console.log(`   Email: ${m.email}`);
        console.log(`   Password: ${m.password}`);
        console.log(`   Role: ${m.role || 'member'}`);
        console.log('---');
    });
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    return members;
}

// Call this from browser console to see all users: showAllUsers()