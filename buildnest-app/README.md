# 🏗️ BuildNest — Where Owners & Workers Meet

**BuildNest** is a full-stack construction site expenditure management system built with **Next.js 14**, **TypeScript**, **Prisma**, and **MySQL**.

![BuildNest Dashboard](https://img.shields.io/badge/Next.js-14-black?logo=next.js) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript) ![Prisma](https://img.shields.io/badge/Prisma-ORM-green) ![MySQL](https://img.shields.io/badge/MySQL-8-orange?logo=mysql)

---

## ✨ Features

| Module | Features |
|--------|----------|
| 🏠 **Dashboard** | Real-time stats, Chart.js charts, expenditure overview |
| 🏢 **Buildings** | Project management, progress tracking, apartment status |
| 👤 **Owners** | Owner profiles, investment tracking, invoice alerts |
| 👷 **Workers** | Workforce management, attendance, specialization |
| 📦 **Materials** | Inventory management, low-stock alerts, usage tracking |
| 💰 **Payments** | Worker & owner payments, bKash/Nagad/Bank support |
| 📋 **Contracts** | Legal agreement management with status tracking |
| 🔧 **Equipment** | Machinery status tracking, usage logs |
| ⚠️ **Safety** | Incident reporting, resolution tracking |
| 🔐 **Auth** | JWT-based session authentication |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18+ ([Download](https://nodejs.org/))
- **MySQL** 8.0+ (or use XAMPP / MySQL Workbench)
- **Git**

### 1. Clone & Install

```bash
git clone https://github.com/YOUR_USERNAME/BuildNest.git
cd BuildNest/buildnest-app
npm install
```

### 2. Setup Database

```bash
# Create the MySQL database
mysql -u root -p -e "CREATE DATABASE ConstructionWorkerManagement;"

# Import the SQL schema & data
mysql -u root -p ConstructionWorkerManagement < "../BuildNest- Where Owners and Workers Meet.sql"
```

### 3. Configure Environment

```bash
# Copy the example env file
cp .env.example .env
```

Edit `.env`:
```env
DATABASE_URL="mysql://root:YOUR_PASSWORD@localhost:3306/ConstructionWorkerManagement"
JWT_SECRET="your-super-secret-key-change-this"
```

### 4. Setup Prisma & Seed Admin User

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database (optional, since we imported SQL)
# npx prisma db push

# Seed the admin user
npm run db:seed
```

### 5. Run the App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🚀

### 6. Login

| Field | Value |
|-------|-------|
| Username | `admin` |
| Password | `buildnest@2024` |

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 14 App Router, TypeScript, Tailwind CSS |
| **Backend** | Next.js API Routes (server-side) |
| **ORM** | Prisma 5 |
| **Database** | MySQL 8 |
| **Auth** | JWT via `jose` library |
| **Charts** | Chart.js + react-chartjs-2 |
| **Notifications** | react-hot-toast |
| **Icons** | react-icons |

---

## 📁 Project Structure

```
buildnest-app/
├── prisma/
│   ├── schema.prisma    # Database schema
│   └── seed.ts          # Admin user seeder
├── src/
│   ├── app/
│   │   ├── (dashboard)/ # Protected dashboard pages
│   │   │   ├── dashboard/
│   │   │   ├── buildings/
│   │   │   ├── owners/
│   │   │   ├── workers/
│   │   │   ├── materials/
│   │   │   ├── payments/
│   │   │   ├── contracts/
│   │   │   ├── equipment/
│   │   │   └── safety/
│   │   ├── api/         # API routes (Backend)
│   │   └── auth/        # Login page
│   ├── lib/
│   │   ├── prisma.ts    # Prisma client singleton
│   │   ├── auth.ts      # JWT utilities
│   │   └── utils.ts     # Helper functions
│   └── middleware.ts    # Auth protection middleware
└── package.json
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login |
| GET/POST/PUT/DELETE | `/api/buildings` | Buildings CRUD |
| GET/POST/PUT/DELETE | `/api/workers` | Workers CRUD |
| GET/POST/PUT/DELETE | `/api/owners` | Owners CRUD |
| GET/POST/PUT/DELETE | `/api/materials` | Materials CRUD |
| GET/POST/PUT/DELETE | `/api/contracts` | Contracts CRUD |
| GET/PUT | `/api/safety` | Safety incidents |
| GET/PUT | `/api/equipment` | Equipment management |
| GET | `/api/payments/worker` | Payment data |
| GET | `/api/dashboard` | Dashboard stats |

---

## 📊 Database Schema

The database contains **15+ tables** covering:
- Owners, Buildings, Apartments, Project_Stages
- Sector_Heads, Workers, Worker_Attendance, Worker_Payments
- Materials, Material_Usage_Log, Suppliers, Material_Orders
- Equipment, Equipment_Usage_Log
- Owner_Payments, Invoices, Contracts
- Safety_Incidents, Daily_Work_Log, Building_Inspection_Reports

---

## 🌟 Key Highlights

- 🔐 **JWT Authentication** with HTTP-only cookies
- 📱 **Responsive** mobile-first dark UI
- 📊 **Real-time Charts** with Chart.js
- 🔍 **Search & Pagination** on all tables
- ⚡ **Parallel API calls** for fast dashboard loading
- 🗑️ **Soft delete** with Transaction Recycle Bin (from SQL)
- 💳 **Multi-payment** methods: Cash, Bank Transfer, bKash, Nagad
- ⚠️ **Low stock** alerts for materials
- ✅ **One-click resolve** for safety incidents

---

## 👨‍💻 Developer

**Md. Ferdous Jaman**  
📧 ferdousjamanmim@gmail.com

---

*Built with ❤️ using the BuildNest SQL schema as the foundation.*
