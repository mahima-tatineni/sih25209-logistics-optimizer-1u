# SAIL AI Logistics Optimizer

AI-Enabled Logistics Optimization Platform for Steel Authority of India Limited (SAIL)

## 🚀 Overview

A comprehensive logistics management system that optimizes port-to-plant material movements for SAIL's integrated steel plants. The platform handles coking coal and limestone imports from global ports to 5 major steel plants across India.

## ✨ Features

### 🏭 Plant Management
- **Plant-Specific Dashboards**: Each plant (Bhilai, Durgapur, Rourkela, Bokaro, IISCO) has dedicated views
- **Stock Tracking**: Real-time monitoring of coking coal and limestone inventory
- **Stock Requests**: Create and track replenishment requests to procurement
- **Stock Updates**: Log receipts and consumption with automatic days-cover calculation
- **Movement History**: Complete audit trail of all stock transactions

### 📦 Procurement Portal
- **Request Management**: View and process requests from all plants
- **Vessel Planning**: Assign vessels and create shipment schedules
- **Schedule Management**: Track all active and planned shipments
- **Inventory Monitoring**: Cross-plant stock visibility

### 🚢 Logistics Optimization
- **Port Selection**: AI-powered optimal port selection for vessel discharge
- **Cost Optimization**: Minimize total landed cost (ocean freight + port charges + rail + demurrage)
- **Risk Assessment**: Weather, congestion, and draft risk evaluation
- **What-If Analysis**: Scenario planning for disruptions and alternatives
- **Schedule Tracking**: End-to-end shipment visibility

### 🎯 Key Capabilities
- **5 Steel Plants**: Bhilai, Durgapur, Rourkela, Bokaro, IISCO
- **5 Strategic Ports**: Visakhapatnam, Paradip, Haldia, Dhamra, Kolkata
- **2 Materials**: Coking Coal, Limestone
- **Real-time Notifications**: Role-based alerts and updates
- **Dynamic Stock Management**: Automatic days-cover calculation
- **Complete Audit Trail**: All transactions logged and traceable

## 🛠️ Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Radix UI** - Accessible component primitives
- **Lucide Icons** - Beautiful icon library

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **Supabase** - PostgreSQL database and authentication
- **Python FastAPI** (sih-25209) - Logistics optimization engine

### Database
- **PostgreSQL** (via Supabase)
- Tables: users, plants, ports, stock_requests, plant_events, current_stock, schedules, shipments

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm/pnpm
- Python 3.8+ (for logistics backend)
- Supabase account

### 1. Clone the Repository
```bash
git clone <repository-url>
cd sail-logistics-optimizer
```

### 2. Install Dependencies
```bash
# Frontend
npm install
# or
pnpm install

# Backend (sih-25209)
cd sih-25209
pip install -r requirements.txt
cd ..
```

### 3. Environment Setup
Create `.env.local` file:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
LOGISTICS_BACKEND_URL=http://localhost:8000
```

### 4. Database Setup
Run the migration scripts in Supabase SQL Editor:
```bash
# Run these in order:
scripts/101_seed_demo_users.sql
scripts/102_plant_system_tables.sql
```

### 5. Start Development Servers

**Terminal 1 - Frontend:**
```bash
npm run dev
```

**Terminal 2 - Backend:**
```bash
cd sih-25209
python backend/main.py
```

**Terminal 3 - (Optional) Automated:**
```bash
# Windows
start-logistics-system.bat

# Linux/Mac
./start-logistics-system.sh
```

## 🔐 Demo Credentials

All passwords: `password`

### Plant Users
- `plant.bhilai@sail.in` - Bhilai Steel Plant (BSP)
- `plant.durgapur@sail.in` - Durgapur Steel Plant (DSP)
- `plant.rourkela@sail.in` - Rourkela Steel Plant (RSP)
- `plant.bokaro@sail.in` - Bokaro Steel Plant (BSL)
- `plant.iisco@sail.in` - IISCO Steel Plant (ISP)

### Other Roles
- `procurement@sail.in` - Procurement Admin
- `logistics.marine@sail.in` - Logistics Team
- `port.vizag@sail.in` - Port Admin (Vizag)
- `railway@sail.in` - Railway Admin
- `admin@sail.in` - System Admin

## 📖 User Guides

### For Plant Users
1. **Login** with your plant credentials
2. **View Stock** in "Today's Snapshot"
3. **Create Requests** in "Stock Requests" tab
4. **Update Stock** in "Stock Updates" tab
5. **Track Arrivals** in "Home" tab

### For Procurement Users
1. **View Requests** from all plants
2. **Assign Vessels** to requests
3. **Create Schedules** for shipments
4. **Monitor Inventory** across plants

### For Logistics Users
1. **View Schedules** pending optimization
2. **Select Ports** using AI recommendations
3. **Track Shipments** end-to-end
4. **Run What-If** scenarios

## 🏗️ Project Structure

```
sail-logistics-optimizer/
├── app/                      # Next.js app directory
│   ├── api/                  # API routes
│   │   ├── plant/           # Plant-specific APIs
│   │   ├── procurement/     # Procurement APIs
│   │   └── logistics/       # Logistics APIs (proxy to sih-25209)
│   ├── plant/[plantId]/     # Dynamic plant pages
│   ├── procurement/         # Procurement portal
│   ├── logistics/           # Logistics portal
│   └── login/               # Authentication
├── components/              # React components
│   ├── plant/              # Plant-specific components
│   ├── procurement/        # Procurement components
│   ├── logistics/          # Logistics components
│   └── ui/                 # Shared UI components
├── lib/                    # Utilities and helpers
│   ├── auth.tsx           # Authentication context
│   ├── notifications.tsx  # Notification system
│   └── role-routing.ts    # Role-based routing
├── hooks/                  # Custom React hooks
├── scripts/               # Database migration scripts
├── sih-25209/            # Python logistics backend
│   └── backend/          # FastAPI application
└── public/               # Static assets
```

## 🔄 Workflow

```
Plant → Creates Stock Request
    ↓
Procurement → Views Request → Assigns Vessel → Creates Schedule
    ↓
Logistics → Optimizes Schedule → Selects Port
    ↓
Vessel → Sails → Arrives → Discharges
    ↓
Railway → Transports to Plant
    ↓
Plant → Receives Stock → Updates Inventory
```

## 📊 Key Metrics

- **17+ MT** annual raw material imports
- **5 Plants** across India
- **5 Strategic Ports** on east coast
- **30 Days** target stock cover
- **Real-time** stock tracking and optimization

## 🧪 Testing

### Run Tests
```bash
npm test
```

### Test Workflows
1. **Plant Request Creation** - See `PLANT_SYSTEM_QUICKSTART.md`
2. **Stock Updates** - See `PLANT_IMPROVEMENTS_SUMMARY.md`
3. **Logistics Optimization** - See `LOGISTICS_QUICKSTART.md`

## 📚 Documentation

- `PLANT_SYSTEM_FIXES_SUMMARY.md` - Plant system implementation
- `LOGISTICS_INTEGRATION_GUIDE.md` - Logistics module setup
- `NOTIFICATION_SYSTEM_SUMMARY.md` - Notification system
- `QUICK-FIX-GUIDE.md` - Common issues and solutions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is proprietary software developed for Steel Authority of India Limited (SAIL).

## 🆘 Support

For issues and questions:
- Check documentation in the root directory
- Review `QUICK-FIX-GUIDE.md` for common problems
- Contact the development team

## 🎯 Roadmap

- [ ] Real-time vessel tracking (AIS integration)
- [ ] Weather API integration
- [ ] Mobile app for field operations
- [ ] Advanced ML models for delay prediction
- [ ] Multi-vessel optimization
- [ ] Automated alerts and notifications
- [ ] Integration with plant ERP systems

## 🏆 Acknowledgments

- Steel Authority of India Limited (SAIL)
- Smart India Hackathon 2025
- Problem Statement: SIH-25209

---

**Built with ❤️ for SAIL's Logistics Optimization**
