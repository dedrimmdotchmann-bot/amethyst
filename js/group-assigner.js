// js/group-assigner.js - Auto-assign users to groups

const GROUP_MAPPINGS = {
    // Region mapping (based on user's zone)
    region: {
        "North-Central": "region_nc",
        "North-East": "region_ne",
        "North-West": "region_nw",
        "South-East": "region_se",
        "South-South": "region_ss",
        "South-West": "region_sw"
    },
    // Interest mapping
    interests: {
        "Philosophy": "interest_philosophy",
        "Ethics": "interest_philosophy",
        "Science": "interest_science",
        "Education": "interest_science",
        "Career": "interest_career",
        "Skill": "interest_career",
        "Activism": "interest_social",
        "Social Impact": "interest_social",
        "Book Club": "interest_book",
        "Reading": "interest_book",
        "Wellbeing": "interest_wellbeing",
        "Mental Health": "interest_wellbeing"
    },
    // Program mapping
    programs: {
        "Mentorship": "program_mentorship",
        "Speakers Bureau": "program_speakers",
        "Research": "program_research",
        "Youth": "program_youth",
        "Women": "program_women"
    }
};

// Assign users to groups
function assignUsersToGroups(users) {
    const userGroups = JSON.parse(localStorage.getItem('coret_user_groups') || '{}');
    let assignedCount = 0;
    
    for (const user of users) {
        const groups = [];
        
        // Assign region group based on zone
        if (user.zone && GROUP_MAPPINGS.region[user.zone]) {
            groups.push(GROUP_MAPPINGS.region[user.zone]);
        }
        
        // Assign interest groups
        if (user.interests) {
            const userInterests = user.interests.split(',').map(i => i.trim());
            for (const interest of userInterests) {
                for (const [key, value] of Object.entries(GROUP_MAPPINGS.interests)) {
                    if (interest.toLowerCase().includes(key.toLowerCase())) {
                        if (!groups.includes(value)) groups.push(value);
                    }
                }
            }
        }
        
        // Assign program groups based on age/preferences
        if (user.ageRange === '18-25' && !groups.includes('program_youth')) {
            groups.push('program_youth');
        }
        if (user.gender === 'Female' && !groups.includes('program_women')) {
            groups.push('program_women');
        }
        
        if (groups.length > 0) {
            userGroups[user.email] = groups;
            assignedCount++;
        }
    }
    
    localStorage.setItem('coret_user_groups', JSON.stringify(userGroups));
    console.log(`✅ Assigned ${assignedCount} users to groups`);
    return assignedCount;
}

// Get user's groups
function getUserGroups(email) {
    const userGroups = JSON.parse(localStorage.getItem('coret_user_groups') || '{}');
    return userGroups[email] || [];
}

// Add user to specific group
function addToGroup(email, groupId) {
    const userGroups = JSON.parse(localStorage.getItem('coret_user_groups') || '{}');
    if (!userGroups[email]) userGroups[email] = [];
    if (!userGroups[email].includes(groupId)) {
        userGroups[email].push(groupId);
        localStorage.setItem('coret_user_groups', JSON.stringify(userGroups));
        console.log(`✅ Added ${email} to group ${groupId}`);
        return true;
    }
    return false;
}

// Remove user from group
function removeFromGroup(email, groupId) {
    const userGroups = JSON.parse(localStorage.getItem('coret_user_groups') || '{}');
    if (userGroups[email]) {
        userGroups[email] = userGroups[email].filter(g => g !== groupId);
        localStorage.setItem('coret_user_groups', JSON.stringify(userGroups));
        console.log(`❌ Removed ${email} from group ${groupId}`);
        return true;
    }
    return false;
}

// Get all members of a group
function getGroupMembers(groupId) {
    const members = JSON.parse(localStorage.getItem('amethyst_members') || '[]');
    const userGroups = JSON.parse(localStorage.getItem('coret_user_groups') || '{}');
    
    return members.filter(member => {
        const userGroupList = userGroups[member.email] || [];
        return userGroupList.includes(groupId);
    });
}

console.log("✅ Group assigner module loaded");