# Git Setup Instructions

Karena Git tidak tersedia di WebContainer environment, ikuti langkah-langkah berikut untuk setup Git di local environment:

## 1. Download Project Files
Download semua file project dari WebContainer ke local computer Anda.

## 2. Setup Git Repository
```bash
# Navigate ke project directory
cd PBL-BBPVP-BANDUNG

# Initialize git repository
git init

# Add remote repository
git remote add origin https://github.com/rhnnrsdq/PBL-BBPVP-BANDUNG.git

# Add all files
git add .

# Create first commit
git commit -m "first commit"

# Push to GitHub
git branch -M main
git push -u origin main
```

## 3. Verify Setup
```bash
# Check remote connection
git remote -v

# Check branch
git branch

# Check status
git status
```

## 4. Future Development Workflow
```bash
# Pull latest changes
git pull origin main

# Create feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "Add new feature"

# Push feature branch
git push origin feature/new-feature

# Create Pull Request di GitHub
```

## Notes
- File .gitignore sudah dikonfigurasi untuk exclude node_modules dan file sensitive
- README.md sudah dibuat dengan dokumentasi lengkap
- Project siap untuk collaborative development