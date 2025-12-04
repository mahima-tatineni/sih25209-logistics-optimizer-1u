# Logistics Module - Quick Start Guide

## 🚀 Quick Start (5 Minutes)

### Option 1: Automated Startup (Recommended)

**Windows:**
```bash
start-logistics-system.bat
```

**Linux/Mac:**
```bash
chmod +x start-logistics-system.sh
./start-logistics-system.sh
```

This will:
1. Start the sih-25209 backend on port 8000
2. Start the Next.js frontend on port 3000
3. Open the login page in your browser

### Option 2: Manual Startup

**Terminal 1 - Backend:**
```bash
cd sih-25209
python backend/main.py
```

**Terminal 2 - Frontend:**
```bash
pnpm dev
```

**Browser:**
```
http://localhost:3000/login
```

## 🔐 Login Credentials

```
Email:    logistics.marine@sail.in
Password: password
```

## 📋 What You'll See

1. **Login Page** → Enter credentials
2. **Redirect** → Automatically go to `/logistics/schedules`
3. **Schedules Inbox** → View import schedules from procurement
4. **Port Selection** → Click a schedule to select optimal port
5. **Tracking** → Monitor shipment progress and run what-if scenarios

## 🏗️ Architecture

```
┌─────────────────────────────────────────┐
│   Main Next.js App (Port 3000)          │
│   ┌─────────────────────────────────┐   │
│   │  Login System (Supabase Auth)   │   │
│   └──────────────┬──────────────────┘   │
│                  │                       │
│   ┌──────────────▼──────────────────┐   │
│   │  Role-Based Routing             │   │
│   │  LogisticsTeam → /logistics     │   │
│   └──────────────┬──────────────────┘   │
│                  │                       │
│   ┌──────────────▼──────────────────┐   │
│   │  Logistics Pages                │   │
│   │  - /logistics/schedules         │   │
│   │  - /logistics/port-selection    │   │
│   │  - /logistics/tracking          │   │
│   └──────────────┬──────────────────┘   │
│                  │                       │
│   ┌──────────────▼──────────────────┐   │
│   │  API Proxy Routes               │   │
│   │  /api/logistics/*               │   │
│   └──────────────┬──────────────────┘   │
└──────────────────┼──────────────────────┘
                   │ HTTP Requests
┌──────────────────▼──────────────────────┐
│   sih-25209 Backend (Port 8000)         │
│   ┌─────────────────────────────────┐   │
│   │  FastAPI Endpoints              │   │
│   │  - Port Selection Logic         │   │
│   │  - AI Risk Engine               │   │
│   │  - Optimization Algorithms      │   │
│   │  - Timeline Tracking            │   │
│   └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

## 📁 Key Files

### API Proxy Routes (New)
```
app/api/logistics/
├── schedules/
│   ├── route.ts                          # GET /api/logistics/schedules
│   └── [id]/
│       ├── route.ts                      # GET /api/logistics/schedules/:id
│       ├── port-candidates/route.ts      # GET port candidates
│       ├── select-port/route.ts          # POST select port
│       ├── timeline/route.ts             # GET timeline
│       ├── whatif/route.ts               # POST create scenario
│       └── scenarios/route.ts            # GET list scenarios
```

### Middleware (New)
```
lib/middleware/
└── logistics-guard.ts                    # Access control
```

### Configuration (Modified)
```
.env.local                                # Added LOGISTICS_BACKEND_URL
```

### Logistics Pages (Existing)
```
app/logistics/
├── page.tsx                              # Entry point
├── schedules/page.tsx                    # Schedules inbox
├── port-selection/[id]/page.tsx          # Port selection
└── tracking/[id]/page.tsx                # Tracking & timeline
```

## 🔒 Security

### Access Control
- Only users with role `LogisticsTeam` can access `/logistics/*`
- Email `logistics.marine@sail.in` is whitelisted
- `SystemAdmin` role has full access
- All other users are redirected to `/login`

### Middleware Guard
```typescript
// lib/middleware/logistics-guard.ts
canAccessLogistics(user) // Returns boolean
requireLogisticsAccess(user) // Throws if unauthorized
```

## 🧪 Testing

### Quick Health Check
```bash
# Backend
curl http://localhost:8000/health
# Expected: {"ok": true}

# Frontend Proxy
curl http://localhost:3000/api/logistics/schedules
# Expected: Array of schedules
```

### Full Verification
See `verify-logistics-integration.md` for complete checklist.

## 🛠️ Troubleshooting

### Backend won't start
```bash
cd sih-25209
pip install -r requirements.txt
python backend/main.py
```

### Frontend won't start
```bash
pnpm install
pnpm dev
```

### Login fails
- Check `.env.local` has correct Supabase credentials
- Verify user exists in database
- Check browser console for errors

### API returns 503
- Ensure backend is running: `curl http://localhost:8000/health`
- Check `LOGISTICS_BACKEND_URL` in `.env.local`
- Verify port 8000 is not blocked

### Unauthorized access
- Verify user role is `LogisticsTeam`
- Clear browser localStorage and login again
- Check `lib/middleware/logistics-guard.ts`

## 📚 Documentation

- **Full Integration Guide**: `LOGISTICS_INTEGRATION_GUIDE.md`
- **Verification Checklist**: `verify-logistics-integration.md`
- **Workflow Details**: `sih-25209/LOGISTICS_WORKFLOW.md`

## ✅ Acceptance Criteria

- [x] Login as `logistics.marine@sail.in` / `password` succeeds
- [x] User redirected to `/logistics/schedules`
- [x] All logistics pages accessible
- [x] API calls proxied to sih-25209 backend
- [x] Backend handles requests correctly
- [x] Other users' behavior unchanged
- [x] No sih-25209 internal files modified
- [x] Only glue code (routing, auth, proxy) added

## 🎯 Next Steps

1. **Start the system**: Run `start-logistics-system.bat` (Windows) or `./start-logistics-system.sh` (Linux/Mac)
2. **Login**: Use `logistics.marine@sail.in` / `password`
3. **Explore**: Navigate through schedules, port selection, and tracking
4. **Test**: Follow `verify-logistics-integration.md` checklist
5. **Deploy**: See `LOGISTICS_INTEGRATION_GUIDE.md` for production setup

## 🤝 Support

For issues or questions:
1. Check troubleshooting section above
2. Review full documentation in `LOGISTICS_INTEGRATION_GUIDE.md`
3. Verify backend logs in sih-25209 terminal
4. Check browser console for frontend errors

---

**Ready to go!** Run the startup script and login to start using the logistics module.
