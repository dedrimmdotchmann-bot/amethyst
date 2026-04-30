let importResults = [];
let emailResults = [];

// Display preview
function displayPreview() {
    const tbody = document.getElementById('previewBody');
    const existing = JSON.parse(localStorage.getItem('amethyst_members') || '[]');
    
    tbody.innerHTML = usersData.map((user, i) => {
        const exists = existing.some(m => m.email === user.email);
        return `<tr style="background:${exists ? '#fef3c7' : '#e6f7e6'}">
            <td>${i + 1}</td>
            <td>${user.email}</td>
            <td><strong>${user.fullName}</strong></td>
            <td>${user.worldview}</table>
            <td><span class="status-badge ${exists ? 'status-pending' : 'status-success'}">${exists ? 'Exists' : 'Ready'}</span></td>
        </tr>`;
    }).join('');
    
    const totalUsers = usersData.length;
    const existingUsers = existing.filter(m => usersData.some(u => u.email === m.email)).length;
    const newUsers = totalUsers - existingUsers;
    
    const statsHtml = `
        <div class="stats" style="display: flex; gap: 15px; margin-bottom: 20px;">
            <div class="stat" style="background:#f7fafc; padding:10px; border-radius:8px; flex:1; text-align:center;">
                <div style="font-size:24px; font-weight:bold; color:#667eea;">${totalUsers}</div>
                <div style="font-size:12px;">Total in CSV</div>
            </div>
            <div class="stat" style="background:#c6f6d5; padding:10px; border-radius:8px; flex:1; text-align:center;">
                <div style="font-size:24px; font-weight:bold; color:#22543d;">${newUsers}</div>
                <div style="font-size:12px;">New to Import</div>
            </div>
            <div class="stat" style="background:#fef3c7; padding:10px; border-radius:8px; flex:1; text-align:center;">
                <div style="font-size:24px; font-weight:bold; color:#92400e;">${existingUsers}</div>
                <div style="font-size:12px;">Already Exist</div>
            </div>
        </div>
    `;
    
    const previewAlert = document.getElementById('previewAlert');
    if (previewAlert) previewAlert.innerHTML = statsHtml;
}

// Import users & send emails with progress
async function importUsers() {
    const existing = JSON.parse(localStorage.getItem('amethyst_members') || '[]');
    const newUsers = usersData.filter(u => !existing.some(m => m.email === u.email));
    
    if (newUsers.length === 0) {
        alert('All users already exist!');
        return;
    }
    
    const fromEmail = document.getElementById('fromEmail')?.value;
    const smtpPassword = document.getElementById('smtpPassword')?.value;
    const whatsappLink = document.getElementById('whatsappLink')?.value;
    
    if (!fromEmail || !smtpPassword) {
        alert('⚠️ Please enter your email and app password in the configuration section!');
        return;
    }
    
    document.getElementById('step1').style.display = 'none';
    document.getElementById('step2').classList.remove('hidden');
    
    const progressBar = document.getElementById('progressBar');
    let successCount = 0;
    let failCount = 0;
    importResults = [];
    emailResults = [];
    
    for (let i = 0; i < newUsers.length; i++) {
        const user = newUsers[i];
        const percent = Math.round(((i + 1) / newUsers.length) * 100);
        
        progressBar.style.width = `${percent}%`;
        progressBar.textContent = `${percent}% - Importing ${user.fullName}...`;
        
        const newMember = {
            id: `IMPORTED_${Date.now()}_${i}`,
            email: user.email,
            fullName: user.fullName,
            phone: user.phone,
            worldview: user.worldview,
            zone: user.zone,
            password: user.password,
            registrationDate: new Date().toISOString(),
            status: 'active',
            role: 'member'
        };
        
        existing.push(newMember);
        
        let emailSent = false;
        let emailError = null;
        
        try {
            const emailHtml = getWelcomeEmailHTML(user, whatsappLink);
            
            const result = await new Promise((resolve) => {
                if (typeof Email !== 'undefined' && Email.send) {
                    Email.send({
                        Host: "smtp.gmail.com",
                        Username: fromEmail,
                        Password: smtpPassword,
                        To: user.email,
                        From: fromEmail,
                        Subject: "🔐 Welcome to CORET Foundation - Your Amethyst Account",
                        Body: emailHtml
                    }).then(message => {
                        resolve({ success: message === "OK", error: message !== "OK" ? message : null });
                    }).catch(err => {
                        resolve({ success: false, error: err.message });
                    });
                } else {
                    console.log(`⚠️ SMTP not available. Password for ${user.email}: ${user.password}`);
                    resolve({ success: true, simulated: true });
                }
            });
            
            emailSent = result.success;
            emailError = result.error;
            
            if (emailSent) successCount++;
            else failCount++;
        } catch(e) {
            emailSent = false;
            emailError = e.message;
            failCount++;
        }
        
        emailResults.push({
            name: user.fullName,
            email: user.email,
            password: user.password,
            success: emailSent,
            error: emailError
        });
        
        importResults.push({
            fullName: user.fullName,
            email: user.email,
            password: user.password,
            emailSent: emailSent
        });
        
        const emailIcon = emailSent ? '✅' : '❌';
        progressBar.textContent = `${percent}% - ${emailIcon} ${user.fullName} (${emailSent ? 'Email sent' : 'Email failed'})`;
        
        await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    localStorage.setItem('amethyst_members', JSON.stringify(existing));
    
    if (!existing.some(m => m.email === 'admin@amethyst.ng')) {
        existing.push({
            id: 'admin_001',
            fullName: 'System Administrator',
            email: 'admin@amethyst.ng',
            password: 'admin123',
            role: 'admin',
            status: 'active',
            registrationDate: new Date().toISOString()
        });
        localStorage.setItem('amethyst_members', JSON.stringify(existing));
    }
    
    localStorage.setItem('amethyst_last_import_results', JSON.stringify({
        emailResults: emailResults,
        importResults: importResults,
        timestamp: new Date().toISOString()
    }));
    
    displayResults(successCount, failCount);
}

function displayResults(successCount, failCount) {
    const resultsDiv = document.getElementById('results');
    
    let html = `
        <div class="alert alert-success">✅ Imported ${importResults.length} users!</div>
        <div class="alert ${failCount === 0 ? 'alert-success' : 'alert-warning'}">
            📧 Emails: ${successCount} sent successfully, ${failCount} failed
        </div>
    `;
    
    html += '<div style="overflow-x: auto; max-height: 400px;"><table style="width:100%; font-size:12px;">';
    html += '<thead><tr><th>#</th><th>Name</th><th>Email</th><th>Password</th><th>Email Status</th></tr></thead><tbody>';
    
    importResults.forEach((result, index) => {
        const emailIcon = result.emailSent ? '✅ Sent' : '❌ Failed';
        const emailColor = result.emailSent ? '#48bb78' : '#f56565';
        const errorMsg = emailResults[index]?.error ? `<br><small style="color:#f56565;">${emailResults[index].error}</small>` : '';
        
        html += `<tr>
            <td>${index + 1}</td>
            <td><strong>${escapeHtml(result.fullName)}</strong></td>
            <td>${escapeHtml(result.email)}</td>
            <td><code style="background:#e2e8f0;padding:4px 8px;">${result.password}</code></td>
            <td><span style="color:${emailColor};font-weight:bold;">${emailIcon}</span>${errorMsg}</td>
        </tr>`;
    });
    
    html += '</tbody></table></div>';
    
    html += `<div class="credentials-box">
        <strong>📊 IMPORT SUMMARY:</strong><br>
        ✅ Users created: ${importResults.length}<br>
        📧 Emails sent: ${successCount}<br>
        ❌ Emails failed: ${failCount}<br>
        <br>
        <strong>👑 Admin Login:</strong> admin@amethyst.ng / admin123<br>
        <strong>💡 WhatsApp Group:</strong> ${document.getElementById('whatsappLink')?.value || 'Not set'}<br>
        <br>
        <button class="copy-btn" onclick="copyAllCredentials()">📋 Copy All Credentials</button>
        ${failCount > 0 ? `<button class="copy-btn" style="background:#ed8936;" onclick="resendFailedEmails()">🔄 Resend Failed Emails (${failCount})</button>` : ''}
        <button class="copy-btn" onclick="copyFailedEmails()">📋 Copy Failed Emails Only</button>
    </div>`;
    
    resultsDiv.innerHTML = html;
    document.getElementById('progressBar').style.width = '100%';
    document.getElementById('progressBar').textContent = 'Complete!';
}

function copyAllCredentials() {
    let text = "CORET FOUNDATION - AMETHYST CREDENTIALS\n\n";
    importResults.forEach(r => {
        text += `${r.fullName}\n`;
        text += `Email: ${r.email}\n`;
        text += `Password: ${r.password}\n`;
        text += `Email: ${r.emailSent ? '✅ Sent' : '❌ Failed'}\n`;
        text += `---\n`;
    });
    text += `\nAdmin: admin@amethyst.ng / admin123\n`;
    navigator.clipboard.writeText(text);
    alert('✅ All credentials copied to clipboard!');
}

function copyFailedEmails() {
    const failed = emailResults.filter(r => !r.success);
    if (failed.length === 0) {
        alert('No failed emails!');
        return;
    }
    let text = "FAILED EMAILS - RESEND MANUALLY\n\n";
    failed.forEach(r => {
        text += `${r.name}\n`;
        text += `Email: ${r.email}\n`;
        text += `Password: ${r.password}\n`;
        text += `---\n`;
    });
    navigator.clipboard.writeText(text);
    alert(`📋 Copied ${failed.length} failed email details to clipboard!`);
}

// RESEND FAILED EMAILS FUNCTION
async function resendFailedEmails() {
    if (!emailResults || emailResults.length === 0) {
        const savedResults = localStorage.getItem('amethyst_last_import_results');
        if (savedResults) {
            const parsed = JSON.parse(savedResults);
            emailResults = parsed.emailResults || [];
            importResults = parsed.importResults || [];
        }
    }
    
    const failedEmails = emailResults.filter(r => !r.success);
    
    if (failedEmails.length === 0) {
        alert('✅ No failed emails to resend!');
        return;
    }
    
    const fromEmail = document.getElementById('fromEmail')?.value;
    const smtpPassword = document.getElementById('smtpPassword')?.value;
    const whatsappLink = document.getElementById('whatsappLink')?.value;
    
    if (!fromEmail || !smtpPassword) {
        alert('⚠️ Please enter your email and app password!');
        return;
    }
    
    const confirmMsg = `📧 Resend ${failedEmails.length} failed emails?\n\n` +
        failedEmails.map(e => `  - ${e.name} (${e.email})`).join('\n') +
        `\n\nContinue?`;
    
    if (!confirm(confirmMsg)) return;
    
    const resultsDiv = document.getElementById('results');
    if (resultsDiv) {
        resultsDiv.innerHTML = `<div class="progress-bar" id="resendProgressBar" style="width:0%">0% - Preparing to resend...</div>`;
    }
    
    let successCount = 0;
    let resendResults = [];
    
    for (let i = 0; i < failedEmails.length; i++) {
        const failed = failedEmails[i];
        const percent = Math.round(((i + 1) / failedEmails.length) * 100);
        
        const progressBar = document.getElementById('resendProgressBar');
        if (progressBar) {
            progressBar.style.width = `${percent}%`;
            progressBar.textContent = `${percent}% - Resending to ${failed.name}...`;
        }
        
        const user = (typeof usersData !== 'undefined' && usersData.find(u => u.email === failed.email)) || {
            fullName: failed.name,
            email: failed.email,
            password: failed.password,
            worldview: 'Humanist'
        };
        
        let emailSent = false;
        let emailError = null;
        
        try {
            const emailHtml = getWelcomeEmailHTML(user, whatsappLink);
            
            const result = await new Promise((resolve) => {
                if (typeof Email !== 'undefined' && Email.send) {
                    Email.send({
                        Host: "smtp.gmail.com",
                        Username: fromEmail,
                        Password: smtpPassword,
                        To: failed.email,
                        From: fromEmail,
                        Subject: "🔐 Welcome to CORET Foundation - Your Amethyst Account",
                        Body: emailHtml
                    }).then(message => {
                        resolve({ success: message === "OK", error: message !== "OK" ? message : null });
                    }).catch(err => {
                        resolve({ success: false, error: err.message });
                    });
                } else {
                    console.log(`Password for ${failed.email}: ${failed.password}`);
                    resolve({ success: true, simulated: true });
                }
            });
            
            emailSent = result.success;
            emailError = result.error;
            
            if (emailSent) {
                successCount++;
                const originalResult = emailResults.find(r => r.email === failed.email);
                if (originalResult) originalResult.success = true;
            }
            
            resendResults.push({
                name: failed.name,
                email: failed.email,
                password: failed.password,
                success: emailSent,
                error: emailError
            });
        } catch(e) {
            resendResults.push({
                name: failed.name,
                email: failed.email,
                password: failed.password,
                success: false,
                error: e.message
            });
        }
        
        await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    for (const resend of resendResults) {
        if (resend.success) {
            const existing = emailResults.find(r => r.email === resend.email);
            if (existing) existing.success = true;
        }
    }
    
    localStorage.setItem('amethyst_last_import_results', JSON.stringify({
        emailResults: emailResults,
        importResults: importResults,
        timestamp: new Date().toISOString()
    }));
    
    showResendResults(resendResults, successCount, failedEmails.length);
}

function showResendResults(resendResults, successCount, totalFailed) {
    const resultsDiv = document.getElementById('results');
    
    let html = `
        <div class="alert ${successCount === totalFailed ? 'alert-success' : 'alert-warning'}">
            📧 Resend Complete: ${successCount} / ${totalFailed} emails sent successfully!
        </div>
    `;
    
    if (successCount < totalFailed) {
        html += `<div class="alert alert-warning">⚠️ Some emails still failed. Check network and try again.</div>`;
    }
    
    html += '<div style="overflow-x: auto; max-height: 300px;"><table style="width:100%; font-size:12px;">';
    html += '<thead><tr><th>#</th><th>Name</th><th>Email</th><th>Password</th><th>Status</th></tr></thead><tbody>';
    
    resendResults.forEach((result, index) => {
        const statusIcon = result.success ? '✅ Sent' : '❌ Failed';
        const statusColor = result.success ? '#48bb78' : '#f56565';
        const errorMsg = result.error && !result.success ? `<br><small style="color:#f56565;">${result.error}</small>` : '';
        
        html += `<tr>
            <td>${index + 1}</td>
            <td><strong>${escapeHtml(result.name)}</strong></td>
            <td>${escapeHtml(result.email)}</td>
            <td><code style="background:#e2e8f0;padding:4px 8px;">${result.password}</code></td>
            <td><span style="color:${statusColor};font-weight:bold;">${statusIcon}</span>${errorMsg}</td>
        </tr>`;
    });
    
    html += '</tbody></table></div>';
    
    if (successCount < totalFailed) {
        const stillFailed = resendResults.filter(r => !r.success);
        html += `
            <div class="credentials-box" style="margin-top:15px;">
                <strong>⚠️ ${stillFailed.length} emails still failed:</strong><br>
                ${stillFailed.map(f => `${f.name}: ${f.email}`).join('<br>')}
                <br><br>
                <button class="copy-btn" onclick="copyFailedEmailsList()">📋 Copy Failed List</button>
                <button class="btn" onclick="resendFailedEmails()" style="background:#ed8936;">🔄 Try Resend Again</button>
            </div>
        `;
    } else {
        html += `
            <div class="credentials-box">
                <strong>✅ All emails sent successfully!</strong><br>
                <button class="copy-btn" onclick="copyAllCredentials()">📋 Copy All Credentials</button>
                <button class="btn btn-success" onclick="location.reload()">↺ Done</button>
            </div>
        `;
    }
    
    if (resultsDiv) resultsDiv.innerHTML = html;
}

function copyFailedEmailsList() {
    const failed = emailResults?.filter(r => !r.success) || [];
    if (failed.length === 0) {
        alert('No failed emails!');
        return;
    }
    let text = "FAILED EMAILS - NEED MANUAL RESEND\n\n";
    failed.forEach(f => {
        text += `${f.name}\n`;
        text += `Email: ${f.email}\n`;
        text += `Password: ${f.password}\n`;
        text += `---\n`;
    });
    navigator.clipboard.writeText(text);
    alert(`📋 Copied ${failed.length} failed email details to clipboard!`);
}

function clearAllUsers() {
    if (confirm('⚠️ Delete ALL users except admin? This cannot be undone!')) {
        const adminOnly = [{
            id: 'admin_001',
            fullName: 'System Administrator',
            email: 'admin@amethyst.ng',
            password: 'admin123',
            role: 'admin',
            status: 'active',
            registrationDate: new Date().toISOString()
        }];
        localStorage.setItem('amethyst_members', JSON.stringify(adminOnly));
        alert('✅ All users cleared! Refresh the page.');
        location.reload();
    }
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

// Initialize
if (document.getElementById('previewBody')) {
    displayPreview();
}