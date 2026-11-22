# NEWS 24*7 — Premium Digital Newspaper & Financial Intelligence Platform

> **A digital newspaper inspired by high-end international editorial journalism and Bloomberg-grade market intelligence.** Built with React, Tailwind CSS, Framer Motion, Recharts, Express.js, and structured JSON data storage.

---

## 📸 Design Inspiration & Visual Identity

Inspired by classic blackletter / serif editorial layouts and modern dark-mode digital newsrooms:
- **Palette**: Deep charcoal and ink black backgrounds (`#0b0c10`, `#13141b`, `#1a1c24`), elegant yellow and warm amber accents (`#f59e0b`, `#fbbf24`), and crisp white editorial typography.
- **Typography**: Dual hierarchy blending regal serifs (*Playfair Display*, *Cormorant Garamond*, *Cinzel*) with high-legibility geometric sans (*Plus Jakarta Sans*).
- **Glassmorphic Editorial Cards**: Multi-layered frosted glass cards (`backdrop-blur-md`, subtle borders, soft drop shadows).
- **Dynamic Cinematic Hero Carousel**: Auto-rotating background news visuals (30s interval with pause/resume controls), numbered slide controls (`1 2 3 4`), and "NEXT STORY" preview cards.

---

## 🚀 Key Features

### 1. Editorial Front Page & Masthead
- **Classic Masthead**: Current day & date, volume/edition number, brand logo with yellow star asterisk, search bar, and "Subscribe now" pill button.
- **Category Navigation**: Rounded pill tabs for `WORLD`, `INDIA`, `POLITICS`, `BUSINESS`, `MARKETS`, `TECH`, `SPORTS`, `ENTERTAINMENT`, `SCIENCE`, and `OPINION`.
- **Breaking News Marquee**: Real-time ticker with flashing badge and priority indicators.
- **Asymmetric Editorial Layout**: Lead investigations paired with stacked frosted glass cards.

### 2. Live News Integration & RSS Sync
- Synchronizes with legitimate external RSS feeds (**Google News India, World, Business, Tech, Sports, Entertainment, Science**, and news wires).
- Automatic background deduplication, category tagging, image fallback assignment, and reading time estimation.
- Periodic synchronization via `node-cron` every 15 minutes + manual trigger button in Admin Panel.

### 3. Stock Market Intelligence (Homepage Priority & Dedicated Terminal)
- **Indian Markets**: NIFTY 50, BSE SENSEX, BANK NIFTY, and NSE Bluechips (Reliance, TCS, HDFC Bank, Infosys, ICICI Bank).
- **International Markets**: NASDAQ Composite, S&P 500, DOW JONES, FTSE 100, DAX 40, NIKKEI 225.
- **Interactive Recharts Area Chart**: Dynamic time-series curves with `1D`, `1W`, `1M`, and `1Y` filters.
- **Forex Board**: Live exchange rates for USD/INR, EUR/INR, GBP/INR.
- **Market Movers**: Top Gainers and Decliners ranked by percentage change.

### 4. Subscription System & Simulated Payment Sandbox
- **Three Tiers**:
  - **Bronze**: ₹99/month (₹950/year) — Ad-lite reading, standard daily dispatches.
  - **Silver**: ₹199/month (₹1,900/year) — Ad-free, deep-dive investigations, interactive charts, audio reader.
  - **Gold VIP**: ₹399/month (₹3,800/year) — All-access pass, Chief Editor scoops, financial models.
- **Interactive Payment Sandbox Modal**:
  - Test with UPI (GPay/PhonePe/Paytm), Credit/Debit Card, or NetBanking.
  - Dedicated **"Simulate Successful Payment"** button (instantly generates invoices and upgrades tier).
  - Dedicated **"Simulate Payment Failure"** button (demonstrates card decline and error handling).
- **Paywall Gating**: Non-subscribers reading Silver/Gold articles encounter blurred content and an inline upgrade prompt.

### 5. Multi-Role Editorial CMS & Approval Workflow
Strict editorial hierarchy enforced at the backend:
- **Super Admin**: Full platform authority, user role promotion, system settings.
- **Chief Editor**: Editorial oversight, article publishing, breaking news manager.
- **Section Editor**: Reviews and approves/rejects journalist submissions.
- **Author/Journalist**: Drafts articles; submissions automatically enter the pending review queue. **Authors cannot approve their own articles.**
- **Subscriber**: Reads gated content matching their active subscription tier.
- **Free Reader**: Public news reader.

### 6. Interactive Reader Experience
- **Audio Reader Simulation**: In-browser text-to-speech simulation with animated waveform.
- **Font-Size Adjuster**: One-click toggling between Normal, Large, and Extra-Large serif reading sizes.
- **Bookmark / Saved Stories**: Save articles to a personal reading list.
- **Accredited Reader Commentary**: Editorial-moderated discussion thread on articles.

---

## 🔑 Demo Login Accounts

You can test any role instantly using the **Floating Demo Role Switcher** at the bottom-right of the screen, or log in manually with password `password123`:

| Role | Email | Password | Permissions & Highlights |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin@news247.global` | `password123` | Full CMS, User Roles, Settings, Review Queue |
| **Chief Editor** | `chief.editor@news247.global` | `password123` | Publish stories, Review Queue, Breaking news |
| **Section Editor** | `section.editor@news247.global` | `password123` | Review & approve author submissions |
| **Author / Journalist** | `author@news247.global` | `password123` | Draft stories (cannot self-approve) |
| **Subscriber (Gold)** | `subscriber@news247.global` | `password123` | VIP Gold tier, bypasses all paywalls |
| **Free Reader** | `reader@news247.global` | `password123` | Standard free articles, paywall prompts |

---

## 🛠️ Installation & Running Instructions

### Prerequisites
- Node.js (v18+ recommended)
- npm (v9+)

### 1. Backend Setup
```bash
cd backend
npm install
npm run dev
# Backend starts at: http://localhost:5000
# Health check: http://localhost:5000/api/health
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
# Frontend starts at: http://localhost:5173
```

---

## 📁 Project Structure

```
new24/
├── backend/
│   ├── data/                   # Persistent JSON Storage
│   │   ├── users.json          # User accounts, hashed passwords, roles & tiers
│   │   ├── articles.json       # Published, draft, and pending editorial dispatches
│   │   ├── markets.json        # Real-time stock indices, time series, & currencies
│   │   ├── categories.json     # News desks & slugs
│   │   ├── subscriptions.json  # Active and cancelled subscriptions
│   │   ├── payments.json       # Simulated payment audit logs & invoices
│   │   ├── breaking.json       # Urgent breaking news items
│   │   ├── hero_slides.json    # Homepage dynamic hero carousel slides
│   │   └── settings.json       # Platform parameters & subscription pricing
│   ├── src/
│   │   ├── config/             # Environment & path variables
│   │   ├── utils/storage.js    # Atomic JSON read/write with mutex & backup
│   │   ├── middleware/         # JWT auth, role authorization & Multer image upload
│   │   ├── services/           # Live RSS sync, market data feeds, node-cron
│   │   ├── controllers/        # Auth, articles, markets, subscriptions, admin
│   │   ├── routes/             # Express API route endpoints
│   │   └── server.js           # Server bootstrap & helmet security
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/         # Masthead Header, Navbar, BreakingTicker, Footer,
│   │   │   │                   # PaywallModal, DemoPaymentModal, DemoRoleSwitcher
│   │   │   └── home/           # HeroSection, MarketSection, FeaturedNewsGrid,
│   │   │                       # CategorySections, NewsletterSection
│   │   ├── pages/              # Home, CategoryPage, StockMarketPage, ArticleDetails,
│   │   │                       # Search, SubscriptionPlans, UserDashboard, SavedArticles,
│   │   │                       # Login, Register, AdminDashboard, About, Contact
│   │   ├── context/            # AuthContext (JWT, user state, bookmarks)
│   │   │                       # NewsContext (categories, breaking news, market polling)
│   │   ├── services/api.js     # Axios client with auth interceptor
│   │   ├── App.jsx             # React Router routing configuration
│   │   └── main.jsx
│   ├── tailwind.config.js      # Luxury dark newspaper theme palette
│   └── vite.config.js
└── README.md
```

---

## 📡 REST API Documentation Summary

| Method | Endpoint | Access | Purpose |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Create new reader account |
| `POST` | `/api/auth/login` | Public | Sign in and receive JWT token |
| `GET` | `/api/auth/me` | Authenticated | Retrieve authenticated user profile |
| `POST` | `/api/auth/bookmarks/:id` | Authenticated | Toggle article bookmark |
| `GET` | `/api/articles` | Public / Optional Auth | List articles (filtered by desk, status, tag) |
| `GET` | `/api/articles/:id` | Public / Optional Auth | Read article (verifies subscription paywall) |
| `POST` | `/api/articles` | Editorial Staff | Create draft or submit for review |
| `POST` | `/api/articles/:id/review`| Editors & Admins | Approve or reject article (no self-approval) |
| `GET` | `/api/markets` | Public | Stock indices, forex, gainers & decliners |
| `GET` | `/api/news/breaking` | Public | Live breaking news marquee ticker items |
| `GET` | `/api/news/hero-slides` | Public | Dynamic homepage hero background slides |
| `POST` | `/api/subscriptions/checkout-demo` | Authenticated | Process simulated payment (success or decline) |
| `GET` | `/api/admin/stats` | Editorial Staff | Real-time analytics, revenue, view counts |
| `GET` | `/api/admin/users` | Admins | Manage users and modify permissions |

---

## ⚖️ License & Editorial Freedom

Built as a digital newspaper platform demonstration. All journalistic dispatches, market simulations, and editorial records are persistent in `backend/data/`.
