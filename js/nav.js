// js/nav.js - Unified Navigation for all pages

function getCurrentUser() {
    return JSON.parse(sessionStorage.getItem('amethyst_current_user') || '{}');
}

function isLoggedIn() {
    return sessionStorage.getItem('amethyst_current_user') !== null;
}

function isAdmin() {
    const user = getCurrentUser();
    return user.role === 'admin' || user.email === 'admin@amethyst.ng';
}

function getCurrentPage() {
    const path = window.location.pathname;
    return path.split('/').pop();
}

function createNav() {
    const loggedIn = isLoggedIn();
    const admin = isAdmin();
    const currentPage = getCurrentPage();
    const user = getCurrentUser();
    
    let bannerHtml = '<div class="amethyst-banner" style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 15px 24px;">';
    bannerHtml += '<div style="max-width: 1400px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap;">';
    bannerHtml += '<div><span style="font-size: 28px;">🔮</span>';
    bannerHtml += '<span style="font-size: 20px; font-weight: bold; margin-left: 10px;">Amethyst</span>';
    bannerHtml += '<span style="font-size: 12px; opacity: 0.8; margin-left: 10px;">CORET Foundation Nigeria</span></div>';
    
    if (loggedIn) {
        bannerHtml += '<div><span style="font-size: 14px;">👋 ' + (user.fullName || user.email) + '</span></div>';
    }
    bannerHtml += '</div></div>';
    
    let navHtml = '<nav style="background: white; border-bottom: 2px solid #e2e8f0; padding: 12px 24px; position: sticky; top: 0; z-index: 100;">';
    navHtml += '<div style="max-width: 1400px; margin: 0 auto; display: flex; gap: 20px; flex-wrap: wrap; justify-content: center;">';
    
    // Home - always visible
    const homeStyle = currentPage === 'index.html' ? '#667eea' : '#4a5568';
    navHtml += '<a href="index.html" style="color: ' + homeStyle + '; text-decoration: none; padding: 8px 16px; border-radius: 8px; font-weight: 500;">🏠 Home</a>';
    
    // About - always visible
    const aboutStyle = currentPage === 'about.html' ? '#667eea' : '#4a5568';
    navHtml += '<a href="about.html" style="color: ' + aboutStyle + '; text-decoration: none; padding: 8px 16px; border-radius: 8px; font-weight: 500;">ℹ️ About</a>';
    
    // Constitution - only for logged in (faded if not)
    const constitutionStyle = currentPage === 'constitution.html' ? '#667eea' : '#4a5568';
    const constitutionOpacity = loggedIn ? '1' : '0.5';
    const constitutionEvents = loggedIn ? 'auto' : 'none';
    navHtml += '<a href="constitution.html" style="color: ' + constitutionStyle + '; text-decoration: none; padding: 8px 16px; border-radius: 8px; font-weight: 500; opacity: ' + constitutionOpacity + '; pointer-events: ' + constitutionEvents + ';">📜 Constitution</a>';
    
    // Dashboard - only for logged in (faded if not)
    const dashboardStyle = currentPage === 'dashboard.html' ? '#667eea' : '#4a5568';
    const dashboardOpacity = loggedIn ? '1' : '0.5';
    const dashboardEvents = loggedIn ? 'auto' : 'none';
    navHtml += '<a href="dashboard.html" style="color: ' + dashboardStyle + '; text-decoration: none; padding: 8px 16px; border-radius: 8px; font-weight: 500; opacity: ' + dashboardOpacity + '; pointer-events: ' + dashboardEvents + ';">📊 Dashboard</a>';
    
    // Groups - only for logged in (faded if not)
    const groupsStyle = currentPage === 'groups.html' ? '#667eea' : '#4a5568';
    const groupsOpacity = loggedIn ? '1' : '0.5';
    const groupsEvents = loggedIn ? 'auto' : 'none';
    navHtml += '<a href="groups.html" style="color: ' + groupsStyle + '; text-decoration: none; padding: 8px 16px; border-radius: 8px; font-weight: 500; opacity: ' + groupsOpacity + '; pointer-events: ' + groupsEvents + ';">👥 Groups</a>';
    
    // Admin menu - only for admin users
    if (admin) {
        const adminStyle = currentPage.includes('import') ? '#667eea' : '#4a5568';
        navHtml += '<a href="data/import-users.html" style="color: ' + adminStyle + '; text-decoration: none; padding: 8px 16px; border-radius: 8px; font-weight: 500;">📥 Admin</a>';
    }
    
    // Login/Logout button
    if (!loggedIn) {
        navHtml += '<a href="index.html" style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 8px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">🔐 Login</a>';
    } else {
        navHtml += '<a href="#" onclick="logoutUser(); return false;" style="color: #f56565; text-decoration: none; padding: 8px 16px; border-radius: 8px; font-weight: 500;">🚪 Logout</a>';
    }
    
    navHtml += '</div></nav>';
    
    return bannerHtml + navHtml;
}

function logoutUser() {
    sessionStorage.removeItem('amethyst_current_user');
    window.location.href = 'index.html';
}

function addNav() {
    const existingNav = document.querySelector('.amethyst-banner');
    if (existingNav) existingNav.remove();
    const navHtml = createNav();
    document.body.insertAdjacentHTML('afterbegin', navHtml);
}

// Initialize navigation when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addNav);
} else {
    addNav();
}