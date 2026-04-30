// email-service.js - Email template and sending functions

// Welcome Email HTML Template
function getWelcomeEmailHTML(user, whatsappLink) {
    return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>Welcome to CORET Foundation</title></head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background: #f0f2f5;">
<div style="max-width: 500px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
<div style="background: linear-gradient(135deg, #667eea, #764ba2); padding: 30px; text-align: center; color: white;">
<h1 style="margin: 0;">🔮 Welcome to Amethyst</h1>
<p style="margin: 10px 0 0;">CORET Foundation Nigeria</p>
</div>
<div style="padding: 30px;">
<h2 style="color: #2d3748;">Dear ${escapeHtml(user.fullName)},</h2>
<p>Welcome to the <strong>Community of Renaissance Thinkers Foundation (CORET) Nigeria</strong>! Your account has been successfully created.</p>
<div style="background: #f7fafc; border-left: 4px solid #667eea; padding: 15px; margin: 20px 0; border-radius: 8px;">
<h3 style="margin: 0 0 10px; color: #2d3748;">🔐 Your Login Credentials</h3>
<p><strong>🔗 Portal URL:</strong> https://amethyst.coret.ng</p>
<p><strong>📧 Email:</strong> ${escapeHtml(user.email)}</p>
<p><strong>🔑 Password:</strong> <code style="background:#e2e8f0;padding:4px 8px;border-radius:4px;">${user.password}</code></p>
<p><small>⚠️ Please change your password after first login.</small></p>
</div>
<div style="text-align: center; margin: 20px 0;">
<a href="${whatsappLink}" style="display: inline-block; background: #25D366; color: white; text-decoration: none; padding: 10px 25px; border-radius: 50px; font-weight: 600;">📱 Join Our WhatsApp Community</a>
</div>
<h3>📋 What you can do:</h3>
<ul>
<li>✅ Update your member profile</li>
<li>✅ Participate in constitution review</li>
<li>✅ Vote on community decisions</li>
<li>✅ Connect with other members</li>
<li>✅ Access meeting schedules and resources</li>
</ul>
<p><strong>🌍 Your Worldview:</strong> ${escapeHtml(user.worldview || 'Humanist')}</p>
<p>Need help? Contact: <a href="mailto:support@coret.ng">support@coret.ng</a></p>
<p style="margin-top: 30px;">Warm regards,<br><strong>CORET Foundation Nigeria Leadership</strong></p>
</div>
<div style="background: #f7fafc; padding: 20px; text-align: center; font-size: 12px; color: #718096;">
<p>&copy; 2026 CORET Foundation Nigeria | Building a better Nigeria through critical thinking</p>
</div>
</div>
</body>
</html>`;
}

// Send email function (works with SMTP.js or falls back to console)
async function sendWelcomeEmail(user) {
    const fromEmail = document.getElementById('fromEmail')?.value;
    const smtpPassword = document.getElementById('smtpPassword')?.value;
    const whatsappLink = document.getElementById('whatsappLink')?.value;
    
    const emailHtml = getWelcomeEmailHTML(user, whatsappLink);
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📧 Sending email to: ${user.email}`);
    console.log(`👤 Name: ${user.fullName}`);
    console.log(`🔑 Password: ${user.password}`);
    console.log(`💬 WhatsApp: ${whatsappLink}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    // Check if SMTP.js is available
    if (typeof Email !== 'undefined' && Email.send) {
        try {
            const result = await new Promise((resolve) => {
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
            });
            
            if (result.success) {
                console.log(`✅ Email sent successfully to ${user.email}`);
            } else {
                console.log(`❌ Failed to send to ${user.email}: ${result.error}`);
            }
            return result;
        } catch(e) {
            console.log(`❌ Error sending to ${user.email}:`, e.message);
            return { success: false, error: e.message };
        }
    } else {
        console.log(`⚠️ SMTP.js not loaded. Email logged to console only.`);
        return { success: true, simulated: true, message: "Logged to console" };
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