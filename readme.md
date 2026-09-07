<div align="center">

# 🚌 Bustkit

**A high-performance, modern platform for seamless intercity bus ticket reservation.**

[![Next.js](https://img.shields.io/badge/Next.js-15.1-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

</div>

---

## 📖 Overview

**Bustkit** is a production-grade, full-stack bus ticket booking platform built with the **Next.js 15 App Router**, **TypeScript**, **Tailwind CSS**, and **Supabase (PostgreSQL)**. Engineered with a feature-first architecture, Bustkit delivers a fast, responsive, and intuitive end-to-end booking experience for travelers, bus operators, and platform administrators.

---

## ✨ Key Features

### 🧳 Customer Experience
- **Smart Bus Search & Autocomplete**: Search routes by source, destination, journey date, and passenger count with instantaneous auto-suggestions.
- **Refresh-Safe & Shareable Results**: URL-driven search state allowing bookmarking and sharing of live search results.
- **Dynamic Filtering & Sorting**: Filter schedules by price range, departure/arrival times, operators, amenities, and bus types (AC, Sleeper, Seater). Sort by fare, duration, or departure.
- **Interactive Visual Seat Map**: Real-time visual seat layout with status indicators (available, selected, booked, driver cabin).
- **Smooth Multi-Step Booking**:
  - Custom boarding and dropping point selection.
  - Passenger information collection with validated inputs and character limits.
  - Real-time dynamic fare breakdown (base fare, taxes, discounts).
- **Instant Booking Confirmation**: Printable and downloadable booking receipts with unique PNR reference codes.
- **Customer Booking Management**: View active and past bookings, track itinerary details, and manage cancellations.

### 🛡️ Operator & Admin Portals
- **Role-Based Access Control (RBAC)**: Secure access tailored for `customer`, `operator`, and `admin` roles.
- **Operator Dashboard**: View fleet assignments, live route schedules, seat occupancy, and revenue summaries.
- **Platform Admin Panel**: Centralized management for buses, operators, schedules, users, and overall booking metrics.

### ⚙️ Engineering & Architecture
- **Atomic Database Transactions**: Supabase PostgreSQL RPC transactions (`create_booking_transaction`) preventing concurrency conflicts and seat double-booking.
- **Optimized Server & Client Components**: Maximum performance with Next.js Server Components for data fetching and lightweight Client Components for interactivity.
- **Strict Input Constraints**: Field-level validation and character limits across all form inputs to guarantee data integrity.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | [Next.js 15](https://nextjs.org/) (App Router, Server Actions, Route Handlers) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) (Strict mode) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/), PostCSS, CSS Variables |
| **UI & Icons** | [Lucide React](https://lucide.dev/), `class-variance-authority`, `clsx`, `tailwind-merge` |
| **Database & Auth** | [Supabase](https://supabase.com/) (PostgreSQL, Row Level Security, RPCs, Auth) |
| **Code Quality** | ESLint, Prettier with Tailwind CSS plugin |

---

## 📁 Project Structure

Bustkit adheres to a **feature-first** modular architecture:

```text
├── docs/                       # Architecture documentation, design system & walkthroughs
├── src/
│   ├── app/                    # Next.js App Router (pages, layouts, API routes)
│   │   ├── (auth)/             # Authentication routes (login, register)
│   │   ├── admin/              # Platform admin dashboards & management
│   │   ├── api/                # API route handlers (buses, schedules, bookings)
│   │   ├── buses/              # Bus details & seat selection pages
│   │   ├── my-bookings/        # Customer bookings portal
│   │   ├── operator/           # Bus operator management portal
│   │   ├── search/             # Search results page
│   │   └── layout.tsx          # Root layout with providers & fonts
│   ├── components/             # Reusable global UI components (Button, Modal, etc.)
│   ├── config/                 # Application & site configuration
│   ├── features/               # Feature-specific modules (UI, context, hooks)
│   │   ├── auth/               # Auth state, context, and login/register forms
│   │   ├── booking/            # Booking flow, seat selection, checkout
│   │   ├── bus/                # Bus cards, amenities, and details
│   │   ├── home/               # Hero section, popular routes, promo banners
│   │   └── search/             # Search form, date pickers, filter drawers
│   ├── lib/                    # Library clients (Supabase client, font loaders)
│   ├── types/                  # Shared TypeScript interfaces & types
│   └── utils/                  # Formatting, calculation, and helper utilities
├── supabase/
│   └── migrations/             # SQL schema migrations & seed data
├── .env.example                # Sample environment variables
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## 🚀 Getting Started

### Prerequisites
Make sure you have the following installed on your machine:
- **Node.js**: v18.18.0 or higher (Node 20+ recommended)
- **npm**, **pnpm**, or **yarn**
- A **Supabase** project (or local Supabase instance)

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/bustkit.git
cd bustkit
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy the `.env.example` file to create a local `.env` file:
```bash
cp .env.example .env
```
Fill in your Supabase project credentials in `.env`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 4. Setup Database & Migrations
Run the SQL migration files located in `supabase/migrations/` sequentially in your Supabase SQL Editor:
1. `00001_create_bus_booking_schema.sql` — Base tables, relations, and RLS policies
2. `00002_seed_initial_data.sql` — Initial operators, buses, routes, and stops
3. `00003_create_booking_transaction.sql` — ACID transaction procedure for bookings
4. `00004_auth_rbac_schema_update.sql` — Role-based access control setup
5. `00005_assign_operator_user.sql` — Operator role assignment helpers
6. `00006_add_40_seats_layout.sql` — 40-seat layout configurations
7. `00007_expand_45_services_seed.sql` — Expanded mock service routes
8. `00008_date_aware_bookings.sql` — Date-aware booking constraints
9. `00009_seat_availability_rpc.sql` — Dynamic seat availability query function

### 5. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 📜 Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Next.js development server with Turbopack/HMR |
| `npm run build` | Compiles the production build |
| `npm run start` | Runs the compiled production build |
| `npm run lint` | Runs ESLint to check for code quality and syntax issues |
| `npm run format` | Formats all files across the project with Prettier |

---

## 🔒 Security & Data Integrity

- **Row Level Security (RLS)**: Fine-grained database access rules enforcing data privacy.
- **Seat Concurrency Protection**: Database-level locking during checkout prevents race conditions where multiple users attempt to reserve the same seat.
- **Input Character Limits**: Every user-editable text input enforces standard length boundaries to defend against payload abuse and maintain clean records.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
