# MoPT Map

**Product Roadmap & Execution Dashboard** — A real-time operations hub for the MoPT VR clinical skills training platform.

MoPT Map is a single-page dashboard that centralises product operations: KPIs, OKRs, sprint tracking, deliverables management, risk register, roadmap, and a living Product Manager Execution Pack — all backed by Supabase with real-time cross-session sync.

---

## Features

- **Dashboard** — KPI summary cards, OKR tracking, sprint timeline, team overview, risk breakdown
- **Deliverables Tracker** — 47 deliverables across VR, Web, and LMS workstreams; filterable, searchable, expandable rows
- **Risk Register** — 20 risks with severity scoring, mitigation plans, and colour-coded visualisation
- **Roadmap** — Now / Next / Later lane view with full descriptions
- **Documentation** — Complete PM Master Execution Pack with interactive table of contents, scroll-spy, and rich content blocks
- **Admin Panel** — Full CMS for all data entities, branding editor, documentation editor, changelog audit trail, JSON import/export, and factory reset
- **Real-Time Sync** — Supabase Realtime broadcasts changes instantly to all open sessions
- **Offline Fallback** — localStorage backup when Supabase is unreachable

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript 5.8, Vite 6 |
| Styling | Tailwind CSS v4, glassmorphism design system |
| Icons | Lucide React |
| Animation | Motion |
| Database | Supabase (PostgreSQL + Realtime) |
| Hosting | Firebase Hosting |
| Dev Server | Express + Vite middleware |

---

## Getting Started

### Prerequisites

- Node.js 18+
- A Supabase project (free tier works)

### Setup

```bash
git clone https://github.com/Prodigeezyxx/MoPT-Map.git
cd MoPT-Map
npm install
```

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_your_anon_key
```

Run the Supabase setup script against your project's SQL editor (`supabase-setup.sql`) to create the required tables and enable Realtime.

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Deploy to Firebase

```bash
npm run build
firebase deploy
```

---

## Project Structure

```
src/
├── main.tsx                 # React entry point
├── App.tsx                  # Root component with routing & admin auth
├── index.css                # Tailwind + CSS custom properties
├── data.ts                  # Default data (deliverables, risks, OKRs, etc.)
├── lib/
│   ├── utils.ts             # cn() helper (clsx + tailwind-merge)
│   ├── supabase.ts          # Supabase client initialisation
│   └── dataStore.ts         # Data layer: cache, CRUD, Realtime, changelog
└── components/
    ├── pages/
    │   ├── Dashboard.tsx
    │   ├── Deliverables.tsx
    │   ├── Roadmap.tsx
    │   ├── Risks.tsx
    │   └── Documentation.tsx
    └── admin/
        ├── AdminLogin.tsx
        ├── AdminPanel.tsx
        └── DocumentationEditor.tsx
```

---

## Database Schema

Two tables in Supabase:

- **`app_data`** — Key-value store (`key` TEXT PK, `value` JSONB, `updated_at` TIMESTAMPTZ) for all content sections
- **`changelog`** — Audit trail (`id` TEXT PK, `created_at`, `admin`, `action`, `entity`, `entity_id`, `entity_title`, `changes` JSONB)

Realtime is enabled on both tables for live cross-session synchronisation.

---

## Admin Access

Click the MoPT logo in the sidebar **5 times within 3 seconds** to trigger the admin login modal.

Default credentials:
- Username: `admin1` / Password: `MoPT@2026!`
- Username: `admin2` / Password: `MoPT@2026!`

All admin actions are logged to the changelog with full diff tracking.

---

## License

Private — MoPT Internal Use


