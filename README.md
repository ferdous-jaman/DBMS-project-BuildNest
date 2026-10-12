# 🏗️ BuildNest — Construction Site Expenditure Management System
> *Where Owners and Workers Meet*

[![Next.js 14](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Prisma ORM](https://img.shields.io/badge/Prisma-ORM-green)](https://www.prisma.io/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-orange?logo=mysql)](https://www.mysql.com/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**BuildNest** is an enterprise-grade full-stack web application designed for comprehensive construction project and expenditure management. Built upon an advanced relational database schema, it connects property owners, contractor teams, sector heads, and construction laborers into a cohesive, real-time platform.

---

## 📸 Overview & Architecture

BuildNest bridges the gap between high-level architectural management and on-the-ground operational tracking:

```
                    ┌───────────────────────────────┐
                    │       BuildNest Platform      │
                    │   (Next.js 14 App Router)    │
                    └──────────────┬────────────────┘
                                   │
         ┌─────────────────────────┼─────────────────────────┐
         ▼                         ▼                         ▼
  🏢 Project Owners       👷 Workers & Site Labor     📋 Contractors & Materials
  - Capital Investments   - Attendance & Daily Logs   - Supplier Invoices
  - Apartment Allocation  - Salary & Multi-channel    - Material Stock Alerts
  - Real-time ROI Stats     Disbursements (bKash/Nagad)- Heavy Equipment Logs
```

---

## 🚀 Key Modules & Features

| Module | Features & Capabilities |
| :--- | :--- |
| 📊 **Executive Dashboard** | Real-time project cost analytics, progress gauges, Chart.js doughnut/bar visuals, and expense breakdowns. |
| 🏢 **Buildings & Projects** | Multi-building tracking, stages (Foundation, Structural, Finishing), apartment assignments, and budget forecasting. |
| 👥 **Owner Portal** | Owner profiles, apartment investments, payment logs, and pending invoice alert badges. |
| 👷 **Workforce Management** | Daily attendance tracking, specialization classification (Masons, Electricians, Plumbers), and automated salary calculations. |
| 💳 **Payroll & Finance** | Dual disbursement system for workers and owners, supporting Cash, Bank Transfers, bKash, and Nagad. |
| 📦 **Material Inventory** | Automated stock tracking, minimum quantity warnings, supplier order lifecycle, and site usage logs. |
| 📜 **Legal & Contracts** | Contract management with contractors, start/end date monitoring, contract value tracking, and status controls. |
| 🚜 **Equipment Tracking** | Operational status (Available, In Use, Maintenance), condition ratings, and usage duration logs. |
| 🦺 **Safety & Incidents** | On-site hazard reporting, severity levels, injury logs, and one-click incident resolution workflows. |
| 🔐 **Security & Auth** | JWT authentication via secure HTTP-only cookies with edge middleware protection. |

---

## 🗄️ Database Architecture (`MySQL`)

The project contains a complete production SQL schema in [`BuildNest- Where Owners and Workers Meet.sql`](./BuildNest-%20Where%20Owners%20and%20Workers%20Meet.sql):

- **15+ Interconnected Tables**:
  - `BUILDING`, `APARTMENT`, `PROJECT_STAGES`, `STAGE_HISTORY`
  - `OWNER`, `OWNER_PHONE`, `OWNER_PAYMENT`, `INVOICE`
  - `SECTOR_HEAD`, `WORKER`, `WORKER_PHONE`, `WORKER_ATTENDANCE`, `WORKER_PAYMENT`
  - `SUPPLIER`, `MATERIAL`, `MATERIAL_ORDER`, `MATERIAL_USAGE_LOG`
  - `EQUIPMENT`, `EQUIPMENT_USAGE_LOG`
  - `CONTRACT`, `SAFETY_INCIDENT`, `DAILY_WORK_LOG`, `INSPECTION_REPORT`
- **Integrity Constraints**: Foreign keys with `ON DELETE CASCADE / SET NULL`, indexed lookups.
- **Audit & Recovery**: Transaction recycle bin triggers and logs.

---

## 📁 Repository Structure

```
DBMS-project-BuildNest/
├── BuildNest- Where Owners and Workers Meet.sql   # Complete SQL schema, sample data & triggers
├── BuildNest/
│   └── BuildNest- Where Owners and Workers Meet.sql
├── buildnest-app/                                # Full-Stack Next.js 14 Application
│   ├── prisma/
│   │   ├── schema.prisma                         # Prisma ORM schema mapped to MySQL
│   │   └── seed.ts                               # Initial administrator database seeder
│   ├── src/
│   │   ├── app/
│   │   │   ├── (dashboard)/                      # Protected dashboard views
│   │   │   │   ├── dashboard/                    # Real-time analytics dashboard
│   │   │   │   ├── buildings/                    # Building project manager
│   │   │   │   ├── owners/                       # Owner investments & invoicing
│   │   │   │   ├── workers/                      # Workforce management
│   │   │   │   ├── materials/                    # Material inventory
│   │   │   │   ├── payments/                     # Worker & Owner payouts
│   │   │   │   ├── contracts/                    # Contractor agreements
│   │   │   │   ├── equipment/                    # Machine & equipment fleet
│   │   │   │   └── safety/                       # Site safety incidents
│   │   │   ├── api/                              # REST API Route Handlers (Backend)
│   │   │   │   ├── auth/login/route.ts
│   │   │   │   ├── dashboard/route.ts
│   │   │   │   ├── buildings/route.ts
│   │   │   │   ├── workers/route.ts
│   │   │   │   ├── owners/route.ts
│   │   │   │   ├── materials/route.ts
│   │   │   │   ├── payments/worker/route.ts
│   │   │   │   ├── contracts/route.ts
│   │   │   │   ├── safety/route.ts
│   │   │   │   └── equipment/route.ts
│   │   │   ├── auth/login/page.tsx               # Modern Glassmorphic Login
│   │   │   ├── globals.css                       # Dark theme aesthetic styling
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── components/                           # Shared UI components & modals
│   │   ├── lib/                                  # Prisma client, JWT, utilities
│   │   ├── types/                                # TypeScript definitions
│   │   └── middleware.ts                         # Edge route guard
│   ├── .env.example                              # Environment configuration template
│   ├── package.json
│   ├── tailwind.config.ts
│   └── tsconfig.json
└── README.md
```

---

## 🛠️ Quick Start Guide

### 1. Prerequisites
- **Node.js** (v18.17+ or v20+)
- **MySQL Server** (8.0+ or XAMPP)
- **Git**

### 2. Database Setup
Create the MySQL database and import the schema:
```bash
# Log in to MySQL and create database
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS ConstructionWorkerManagement;"

# Import the complete schema & sample records
mysql -u root -p ConstructionWorkerManagement < "BuildNest- Where Owners and Workers Meet.sql"
```

### 3. Application Setup
```bash
# Navigate to the app folder
cd buildnest-app

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
```

Update `.env` with your MySQL credentials:
```env
DATABASE_URL="mysql://root:YOUR_PASSWORD@localhost:3306/ConstructionWorkerManagement"
JWT_SECRET="your-super-secure-jwt-secret-key-32chars"
```

### 4. Initialize Prisma & Admin Seed
```bash
# Generate Prisma Client
npx prisma generate

# Seed admin credentials
npm run db:seed
```

### 5. Launch the Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser!

### 🔑 Default Credentials
- **Username**: `admin`
- **Password**: `buildnest@2024`

---

## 🛡️ API Endpoints Summary

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Secure JWT authentication & cookie issuance |
| `GET` | `/api/dashboard` | Aggregated metrics, charts data, and budget stats |
| `GET` / `POST` / `PUT` / `DELETE` | `/api/buildings` | Buildings CRUD & project stage tracking |
| `GET` / `POST` / `PUT` / `DELETE` | `/api/workers` | Workers database, attendance & salary |
| `GET` / `POST` / `PUT` / `DELETE` | `/api/owners` | Owner profiles, investments & dues |
| `GET` / `POST` / `PUT` / `DELETE` | `/api/materials` | Material inventory & low-stock alerts |
| `GET` | `/api/payments/worker` | Worker disbursement & payment history |
| `GET` / `POST` / `PUT` / `DELETE` | `/api/contracts` | Contractor legal agreements |
| `GET` / `PUT` | `/api/equipment` | Heavy equipment status & usage |
| `GET` / `PUT` | `/api/safety` | Site incident reports & status resolution |

---

## 👤 Author

**Md. Ferdous Jaman**
- GitHub: [@ferdous-jaman](https://github.com/ferdous-jaman)
- Email: ferdousjamanmim@gmail.com

---
*Developed as an end-to-end full stack solution for the BuildNest DBMS project.*
