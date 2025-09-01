# BBPVP Bandung Training Website

Website sistem pelatihan untuk Balai Besar Pengembangan Vokasi dan Produktivitas (BBPVP) Bandung.

## Fitur Utama

### 🔐 Sistem Autentikasi
- Login/Register dengan role-based access (Admin, Trainer, Participant)
- Integrasi otomatis dengan Google Spreadsheet untuk backup data
- Session management dan protected routes

### 👨‍💼 Dashboard Admin
- Kelola users, programs, dan sessions
- Monitor attendance dan assignment submissions
- Export reports dan analytics
- System settings dan Google Sheets configuration

### 👨‍🏫 Dashboard Trainer
- Manage sessions dan assignments
- Mark attendance real-time
- Track participant progress
- Export participant lists

### 👨‍🎓 Dashboard Participant
- Enroll ke training programs
- Mark attendance online
- Submit assignments
- Track learning progress

## Teknologi

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **Data Storage**: Local Storage + Google Sheets API
- **Date Handling**: date-fns

## Instalasi

```bash
# Clone repository
git clone https://github.com/rhnnrsdq/PBL-BBPVP-BANDUNG.git
cd PBL-BBPVP-BANDUNG

# Install dependencies
npm install

# Start development server
npm run dev
```

## Struktur Project

```
src/
├── components/          # Reusable components
├── pages/              # Page components
│   └── dashboards/     # Role-based dashboards
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── data/               # Mock data and data management
└── types/              # TypeScript type definitions
```

## Google Sheets Integration

Website ini terintegrasi dengan Google Apps Script untuk:
- Backup registrasi user
- Sync attendance records
- Export assignment submissions
- Real-time data synchronization

## Demo Accounts

- **Admin**: admin@bbpvp.com / admin123
- **Trainer**: trainer@bbpvp.com / trainer123
- **Participant**: participant@bbpvp.com / participant123

## Deployment

Project ini dapat di-deploy ke:
- Netlify (recommended)
- Vercel
- GitHub Pages

## Kontribusi

1. Fork repository
2. Create feature branch
3. Commit changes
4. Push ke branch
5. Create Pull Request

## Lisensi

© 2025 BBPVP Bandung. All rights reserved.