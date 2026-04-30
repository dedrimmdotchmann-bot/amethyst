
# 🔮 Amethyst - Digital Infrastructure for CORET Foundation Nigeria

A comprehensive digital platform for the Community of Renaissance Thinkers Foundation (CORET) Nigeria, providing member management, governance tools, voting systems, and community engagement features.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [Import Users from CSV](#import-users-from-csv)
- [Email Configuration](#email-configuration)
- [Authentication](#authentication)
- [Branches](#branches)
- [Technologies Used](#technologies-used)
- [License](#license)

## Overview

Amethyst is a digital infrastructure platform designed specifically for CORET Foundation Nigeria. It provides:

- **Member Management** - Complete CRUD operations for members
- **Authentication System** - Secure login/signup for members and admin
- **Governance Tools** - Constitution review platform and voting mechanism
- **Data Management** - CSV import/export capabilities
- **Communication Hub** - Member engagement and notifications

## Features

### Phase 1 - Completed ✅

| Feature | Status | Description |
|---------|--------|-------------|
| Member Management (CRUD) | ✅ Complete | Full member database operations |
| Authentication (Login/Signup) | ✅ Complete | Secure access for members and admin |
| Engagement Tracking | ✅ Complete | Track member participation |
| Constitution Review Platform | ✅ Complete | Collaborative constitution editing |
| Structured Feedback Forms | ✅ Complete | Collect member input |
| Voting Mechanism | ✅ Complete | Democratic decision making |
| Dashboard with Stats | ✅ Complete | Real-time analytics and metrics |
| Bulk User Import | ✅ Complete | CSV/JSON import with auto-email |
| Observer Role | ✅ Complete | Non-voting participant role |
| Conflict of Interest Recusal | ✅ Complete | Section 19 MoC compliance |

### Phase 2 - Planned 🚧

- [ ] Mobile application
- [ ] Real-time notifications
- [ ] Advanced analytics dashboard
- [ ] Event management system
- [ ] Newsletter automation

## Project Structure
amethyst/
├── index.html # Login page
├── dashboard.html # Member dashboard
├── constitution.html # Constitution review page
├── README.md # Documentation
├── css/
│ └── style.css # Global styles
├── js/
│ ├── auth.js # Authentication logic
│ ├── constitution.js # Constitution functions
│ └── dashboard.js # Dashboard logic
└── data/ # Import/export utilities
├── import-users.html # CSV import tool
├── style.css # Import page styles
├── users-data.js # User data array
├── email-service.js # Email templates
└── main.js # Import logic

## Installation

### Prerequisites

- Any modern web browser (Chrome, Firefox, Edge, Safari)
- Local server (optional - works directly in browser)
- Git (for version control)

### Local Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/amethyst.git
   cd amethyst
   ```

2. **Open the application**
   - Simply open `index.html` in your browser
   - Or use Live Server in VS Code

3. **Default Admin Account**
   ```
   Email: admin@amethyst.ng
   Password: admin123
   ```

## Usage

### Login

1. Open `index.html` in your browser
2. Enter your email and password
3. Click "Login" to access the dashboard

### Managing Members

- **View Members** - Dashboard shows all registered members
- **Add Member** - Use signup form or import CSV
- **Edit Member** - Click on member name to edit details
- **Delete Member** - Admin can remove members

### Import Users from CSV

1. Navigate to `data/import-users.html`
2. Upload your CSV file with columns: `Email, FullName, Phone, Worldview, Zone`
3. Preview the users to be imported
4. Click "Import & Create Accounts"
5. Copy credentials and send welcome emails

**CSV Format Example:**
```csv
Email,FullName,Phone,Worldview,Zone
user@example.com,John Doe,08012345678,Humanist,South-West
```

### Email Configuration

To send real welcome emails:

1. **Generate Gmail App Password**
   - Go to Google Account → Security → 2-Step Verification (enable)
   - Go to App Passwords → Select "Mail" → Generate
   - Copy the 16-character password

2. **Configure in import page**
   - Open `data/import-users.html`
   - Enter your Gmail address
   - Paste the App Password
   - Set WhatsApp group link

3. **Test email configuration**
   - Click "Test Email to Yourself" button
   - Check your inbox

## Authentication

### Default Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@amethyst.ng | admin123 |
| Member (Melody) | samuelmelly425@gmail.com | melody123 |
| Member (Chinaza) | nazaekpere.ji@gmail.com | chinaza123 |
| Member (Chioma) | chiomablack2001@gmail.com | chioma123 |
| Member (Maduka) | anthonymaduka71@gmail.com | maduka123 |
| Member (B.B.) | blessinbrian@gmail.com | blessin123 |
| Member (Najibu) | Najeebabubakar3rd@gmail.com | najibu123 |
| Member (Muhammed) | muhammedbabangida29@gmail.com | muhammed123 |
| Member (Juliet) | julietobi777@gmail.com | juliet123 |
| Member (Emmanuel) | emmanuelikeamadi@gmail.com | emmanuel123 |

### Password Rules

- Minimum 6 characters
- Change password after first login
- Store passwords securely (hashed in production)

## Branches

| Branch | Description | Status |
|--------|-------------|--------|
| `main` | Original stable version | Preserved |
| `main2` | Working version with CSV import and email features | ✅ Active |

```bash
# Switch between branches
git checkout main    # Original stable
git checkout main2   # Current working version
```

## Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Storage**: LocalStorage (client-side)
- **Email**: SMTP.js / EmailJS integration
- **Version Control**: Git & GitHub
- **Icons**: Emoji-based (no external dependencies)

## Key Features Walkthrough

### Dashboard Statistics
- Total members count
- Zones covered across Nigeria
- Gender diversity metrics
- Worldview distribution

### Member Management
- Search and filter members
- View detailed profiles
- Export member data to CSV
- Bulk operations

### CSV Import Process

1. **Upload** - Select your CSV file
2. **Preview** - Review all users before import
3. **Duplicate Detection** - Automatically skips existing emails
4. **Account Creation** - Creates unique IDs for each user
5. **Password Generation** - Auto-generates secure passwords
6. **Email Notification** - Sends welcome emails (optional)
7. **Results Display** - Shows import summary with credentials

### Welcome Email Template

Includes:
- Warm welcome message
- Login credentials (email + password)
- WhatsApp group invitation
- Call-to-action to test Amethyst v0
- Support contact information

## Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| Cannot login | Clear localStorage or use default admin credentials |
| CSV import fails | Check file format (must have Email, FullName columns) |
| Emails not sending | Verify Gmail App Password, enable 2FA |
| Duplicate users | System automatically skips existing emails |
| Dashboard shows 0 members | Run import or add members via signup |

### Debug Mode

Press `Ctrl+Shift+D` on login page to show debug panel with user data.

## Development

### Local Storage Structure

```javascript
amethyst_members = [
  {
    id: "unique_id",
    fullName: "User Name",
    email: "user@example.com",
    password: "userpassword",
    role: "member|admin",
    status: "active|inactive",
    registrationDate: "ISO date string",
    worldview: "Humanist|Atheist|etc",
    zone: "South-West|South-East|etc"
  }
]
```

### Adding New Features

1. Create a new branch from `main2`
2. Implement your feature
3. Test thoroughly
4. Create pull request

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is proprietary and confidential to CORET Foundation Nigeria.

## Contact

- **CORET Foundation**: https://coret.ng
- **Amethyst Platform**: https://amethyst.coret.ng
- **WhatsApp Community**: https://chat.whatsapp.com/HcqS9j2RZHnA6xOyBJi6Bq
- **Email**: support@coret.ng

## Acknowledgments

- CORET Foundation Nigeria Leadership
- Community of Renaissance Thinkers
- All founding members and testers

---

**Version**: 1.0.0  
**Last Updated**: April 2026  
**Status**: ✅ Phase 1 Complete | 🚀 Active Development

