# 🚀 Quick Reference Card

## ✅ Repository Status
```
✓ Git repository created
✓ Initial commit done
✓ 46 files committed
✓ Ready to push to GitHub
```

---

## 📤 Push to GitHub (Copy & Paste)

### 1. Create GitHub Repo
Go to: **https://github.com/new**
- Name: `sail-logistics-optimizer`
- Private repository
- Don't initialize with anything

### 2. Run These Commands
```bash
git remote add origin https://github.com/YOUR_USERNAME/sail-logistics-optimizer.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

---

## 🔐 Demo Credentials

All passwords: `password`

**Plant Users:**
- `plant.bhilai@sail.in` → Bhilai (BSP)
- `plant.durgapur@sail.in` → Durgapur (DSP)
- `plant.rourkela@sail.in` → Rourkela (RSP)
- `plant.bokaro@sail.in` → Bokaro (BSL)
- `plant.iisco@sail.in` → IISCO (ISP)

**Other Roles:**
- `procurement@sail.in` → Procurement
- `logistics.marine@sail.in` → Logistics
- `admin@sail.in` → Admin

---

## 🏃 Quick Start

### Start Application
```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
cd sih-25209
python backend/main.py
```

### Or Use Automated Script
```bash
# Windows
start-logistics-system.bat

# Linux/Mac
./start-logistics-system.sh
```

---

## 🗄️ Database Setup

### Run Migration
1. Go to: https://supabase.com/dashboard
2. SQL Editor → New Query
3. Copy: `scripts/102_plant_system_tables.sql`
4. Paste and Run

---

## 📁 Key Files

**Documentation:**
- `README.md` - Project overview
- `GITHUB_SETUP.md` - Push to GitHub
- `QUICK-FIX-GUIDE.md` - Troubleshooting
- `REPOSITORY_SUMMARY.md` - What's included

**Setup:**
- `.env.local` - Environment variables
- `scripts/102_plant_system_tables.sql` - Database
- `start-logistics-system.bat` - Windows startup
- `start-logistics-system.sh` - Linux/Mac startup

---

## 🎯 Common Tasks

### Make Changes
```bash
git add .
git commit -m "Your message"
git push
```

### Create Branch
```bash
git checkout -b feature/name
# Make changes
git push -u origin feature/name
```

### Check Status
```bash
git status
git log --oneline -5
```

---

## 🆘 Quick Fixes

**Request Creation Fails?**
→ Run database migration (see above)

**Login Not Working?**
→ Check `.env.local` has Supabase credentials

**Port 3000 In Use?**
→ Kill process: `npx kill-port 3000`

**Backend Not Starting?**
→ Install dependencies: `pip install -r sih-25209/requirements.txt`

---

## 📊 Project Stats

- **44 files** committed
- **4,903 lines** of code
- **5 plants** supported
- **5 ports** integrated
- **3 user roles** (Plant, Procurement, Logistics)

---

## 🔗 Quick Links

- **Supabase Dashboard**: https://supabase.com/dashboard
- **Create GitHub Repo**: https://github.com/new
- **Local App**: http://localhost:3000
- **Backend API**: http://localhost:8000

---

## ✨ Features

✅ Plant-specific dashboards  
✅ Real-time stock tracking  
✅ Stock request workflow  
✅ Procurement portal  
✅ Logistics optimization  
✅ AI-powered port selection  
✅ Role-based notifications  
✅ Complete audit trail  

---

**Need detailed help?** Check the full documentation files! 📚
