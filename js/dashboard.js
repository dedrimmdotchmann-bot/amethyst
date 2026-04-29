// Dashboard functionality - only runs on dashboard page
if (window.location.pathname.includes('dashboard.html')) {
    const user = getCurrentUser();
    
    if (!user) {
        window.location.href = 'index.html';
    }
    
    // Display user name
    document.getElementById('userName').textContent = user.fullname.split(' ')[0];
    document.getElementById('userZone').textContent = user.zone;
    
    // Get total members
    const users = JSON.parse(localStorage.getItem('users'));
    const totalMembers = Object.keys(users).length;
    document.getElementById('totalMembers').textContent = totalMembers;
    
    // Get total reviews
    const reviews = JSON.parse(localStorage.getItem('reviews'));
    const userReviews = reviews.filter(r => r.userId === user.id);
    document.getElementById('totalReviews').textContent = reviews.length;
    document.getElementById('userReviews').textContent = userReviews.length;
    
    // Get active votes (mock - can be expanded)
    document.getElementById('activeVotes').textContent = '1'; // Constitution Review is active
    
    // Member since
    if (user.memberSince) {
        const date = new Date(user.memberSince);
        document.getElementById('memberSince').textContent = date.toLocaleDateString();
    }
    
    // Last login
    if (user.lastLogin) {
        const date = new Date(user.lastLogin);
        document.getElementById('lastLogin').textContent = date.toLocaleString();
    } else {
        document.getElementById('lastLogin').textContent = 'First login';
    }
    
    // Recent activity
    const activities = JSON.parse(localStorage.getItem('activity'));
    const userActivities = activities.filter(a => a.userId === user.id).slice(0, 5);
    const activityContainer = document.getElementById('recentActivity');
    
    if (userActivities.length > 0) {
        activityContainer.innerHTML = userActivities.map(activity => 
            <div class="feedback-item">
                <strong>${activity.action}</strong>: ${activity.details}
                <span class="feedback-date">${new Date(activity.timestamp).toLocaleString()}</span>
            </div>
        ).join('');
    } else {
        activityContainer.innerHTML = '<p class="empty">No recent activity</p>';
    }
}
