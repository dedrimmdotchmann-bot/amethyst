// js/google-sync.js - Google Sheets Integration for Auto Import

const GOOGLE_CONFIG = {
    // REPLACE THIS URL WITH YOUR PUBLISHED GOOGLE SHEETS CSV LINK
    // How to get: File → Share → Publish to web → Link → CSV
    csvUrl: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSAMPLE/pub?output=csv",
    syncInterval: 300000, // 5 minutes (300,000 ms)
    lastSync: null,
    autoSyncEnabled: true
};

// Fetch data from Google Sheets
async function fetchGoogleFormData() {
    try {
        console.log("📊 Fetching Google Form data...");
        const response = await fetch(GOOGLE_CONFIG.csvUrl);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const csvText = await response.text();
        return parseGoogleCSV(csvText);
    } catch (error) {
        console.error("❌ Error fetching Google Form data:", error.message);
        return [];
    }
}

// Parse CSV from Google Sheets
function parseGoogleCSV(csvText) {
    const lines = csvText.split("\n");
    if (lines.length < 2) return [];
    
    const headers = lines[0].split(",").map(h => h.replace(/"/g, '').trim().toLowerCase());
    const users = [];
    
    for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        
        const values = lines[i].split(",").map(v => v.replace(/"/g, '').trim());
        const user = {};
        
        headers.forEach((header, idx) => {
            if (header.includes('name') || header === 'fullname') {
                user.fullName = values[idx];
            } else if (header.includes('email')) {
                user.email = values[idx];
            } else if (header.includes('phone') || header === 'mobilenumber') {
                user.phone = values[idx];
            } else if (header.includes('state')) {
                user.state = values[idx];
            } else if (header.includes('zone')) {
                user.zone = values[idx];
            } else if (header.includes('gender')) {
                user.gender = values[idx];
            } else if (header.includes('worldview')) {
                user.worldview = values[idx];
            } else if (header.includes('interest')) {
                user.interests = values[idx];
            } else if (header.includes('age') || header.includes('agerange')) {
                user.ageRange = values[idx];
            }
        });
        
        if (user.email && user.fullName) {
            user.password = generateSimplePassword(user.fullName);
            users.push(user);
        }
    }
    
    console.log(`📋 Parsed ${users.length} users from CSV`);
    return users;
}

// Generate simple password
function generateSimplePassword(name) {
    const firstPart = name.split(' ')[0].substring(0, 4).toLowerCase();
    const randomNum = Math.floor(Math.random() * 10000);
    return `${firstPart}${randomNum}@Coret2026`;
}

// Sync Google Forms to Amethyst
async function syncGoogleForms() {
    if (!GOOGLE_CONFIG.autoSyncEnabled) return;
    
    console.log("🔄 Syncing Google Forms at", new Date().toLocaleTimeString());
    const newUsers = await fetchGoogleFormData();
    
    if (newUsers.length === 0) {
        console.log("ℹ️ No new users found from Google Forms");
        return;
    }
    
    const existing = JSON.parse(localStorage.getItem('amethyst_members') || '[]');
    let importedCount = 0;
    
    for (const user of newUsers) {
        if (!existing.some(e => e.email === user.email)) {
            const newMember = {
                id: `GOOGLE_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
                ...user,
                registrationDate: new Date().toISOString(),
                status: 'active',
                role: 'member',
                source: 'google_form_auto'
            };
            existing.push(newMember);
            importedCount++;
            console.log(`✅ Imported: ${user.fullName} (${user.email})`);
        }
    }
    
    if (importedCount > 0) {
        localStorage.setItem('amethyst_members', JSON.stringify(existing));
        console.log(`🎉 Auto-imported ${importedCount} new users from Google Forms!`);
        
        // Also assign to groups
        if (typeof assignUsersToGroups === 'function') {
            assignUsersToGroups(newUsers);
        }
    }
    
    GOOGLE_CONFIG.lastSync = new Date();
    return importedCount;
}

// Manual sync function (can be called from admin panel)
async function manualSync() {
    console.log("📢 Manual sync triggered by admin");
    const count = await syncGoogleForms();
    alert(`Sync complete! ${count} new users imported.`);
    return count;
}

// Auto-start sync if enabled
if (GOOGLE_CONFIG.autoSyncEnabled) {
    // Initial sync after 5 seconds
    setTimeout(() => {
        syncGoogleForms();
    }, 5000);
    
    // Set up periodic sync
    setInterval(() => {
        syncGoogleForms();
    }, GOOGLE_CONFIG.syncInterval);
}

console.log("✅ Google Forms sync module loaded. Auto-sync every 5 minutes.");