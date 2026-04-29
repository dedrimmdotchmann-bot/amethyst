
// Constitution review functionality
if (window.location.pathname.includes('constitution.html')) {
    const user = getCurrentUser();
    
    if (!user) {
        window.location.href = 'index.html';
    }
    
    // Sections definition
    const sections = [
        { id: 1, title: 'Sections 1-3' },
        { id: 2, title: 'Sections 4-5' },
        { id: 3, title: 'Sections 6-9' },
        { id: 4, title: 'Sections 10-18' }
    ];
    
    // Load existing user feedback
    const allReviews = JSON.parse(localStorage.getItem('reviews'));
    let userReviews = allReviews.filter(r => r.userId === user.id);
    
    // Update UI with existing feedback
    const sectionCards = document.querySelectorAll('.section-card');
    sectionCards.forEach((card, index) => {
        const sectionId = index + 1;
        const existing = userReviews.find(r => r.sectionId === sectionId);
        
        if (existing) {
            const textarea = card.querySelector('textarea');
            const voteSelect = card.querySelector('.vote');
            if (textarea) textarea.value = existing.feedback;
            if (voteSelect) voteSelect.value = existing.vote;
        }
    });
    
    // Update stats
    document.getElementById('reviewCount').textContent = allReviews.length;
    const hasSubmitted = userReviews.length === 4;
    document.getElementById('userStatus').textContent = hasSubmitted ? '✓ Submitted' : 'Pending';
    
    // Load community feedback summary
    loadCommunityFeedback();
    
    // Submit all feedback
    document.getElementById('submitAllFeedback').addEventListener('click', () => {
        const newReviews = [];
        let allValid = true;
        
        sectionCards.forEach((card, index) => {
            const sectionId = index + 1;
            const textarea = card.querySelector('textarea');
            const voteSelect = card.querySelector('.vote');
            
            const feedback = textarea ? textarea.value.trim() : '';
            const vote = voteSelect ? voteSelect.value : '';
            
            if (!vote) {
                allValid = false;
                alert(`Please select a vote for ${sections[index].title}`);
                return;
            }
            
            newReviews.push({
                id: `${user.id}_section${sectionId}`,
                userId: user.id,
                userName: user.fullname,
                userZone: user.zone,
                sectionId: sectionId,
                sectionTitle: sections[index].title,
                feedback: feedback || '(No additional comments)',
                vote: vote,
                timestamp: new Date().toISOString()
            });
        });
        
        if (!allValid) return;
        
        // Remove old reviews for this user and add new ones
        const filteredReviews = allReviews.filter(r => r.userId !== user.id);
        const updatedReviews = [...filteredReviews, ...newReviews];
        localStorage.setItem('reviews', JSON.stringify(updatedReviews));
        
        // Update user's review count
        const users = JSON.parse(localStorage.getItem('users'));
        users[user.id].reviewsSubmitted = 4;
        localStorage.setItem('users', JSON.stringify(users));
        
        // Log activity
        logActivity(user.id, 'constitution_review', 'Submitted constitution feedback for all 4 sections');
        
        alert('Thank you! Your feedback has been submitted successfully.');
        location.reload();
    });
    
    // Load community feedback
    function loadCommunityFeedback() {
        const allReviews = JSON.parse(localStorage.getItem('reviews'));
        const container = document.getElementById('communityFeedback');
        
        if (allReviews.length === 0) {`
            container.innerHTML = '<p class="empty">No feedback submitted yet. Be the first!</p>';
[4/16/2026 5:01 PM] O: return;`
        }
        
        // Group by section
        const bySection = {};
        sections.forEach(s => { bySection[s.id] = []; });
        
        allReviews.forEach(review => {
            if (bySection[review.sectionId]) {
                bySection[review.sectionId].push(review);
            }
        });
        
        let html = '';
        for (const [sectionId, reviews] of Object.entries(bySection)) {
            if (reviews.length > 0) {
                const section = sections.find(s => s.id == sectionId);
                html += <div style="margin-bottom: 20px;"><h4>${section.title}</h4>;
                
                // Summary stats
                const approveCount = reviews.filter(r => r.vote === 'approve').length;
                const amendCount = reviews.filter(r => r.vote === 'amend').length;
                const rejectCount = reviews.filter(r => r.vote === 'reject').length;
                
                html += 
                    <div style="display: flex; gap: 15px; margin-bottom: 10px; font-size: 0.8rem;">
                        <span>✅ Approve: ${approveCount}</span>
                        <span>✏️ Amend: ${amendCount}</span>
                        <span>❌ Reject: ${rejectCount}</span>
                    </div>
                ;
                
                // Show latest 3 feedbacks
                html += '<div style="font-size: 0.85rem;">';
                reviews.slice(0, 3).forEach(r => {
                    html += 
                        <div class="feedback-item">
                            <strong>${r.userName}</strong> (${r.userZone}) voted <strong>${r.vote}</strong>
                            <p>${r.feedback.substring(0, 150)}${r.feedback.length > 150 ? '...' : ''}</p>
                            <span class="feedback-date">${new Date(r.timestamp).toLocaleDateString()}</span>
                        </div>
                    ;
                });
                html += '</div></div>';
            }
        }
        
        container.innerHTML = html;
    }
}