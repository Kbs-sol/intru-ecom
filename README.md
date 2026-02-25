# intru.in — E-Commerce Store

Premium minimal streetwear e-commerce built with **Astro 5 + Alpine.js** for [intru.in](https://intru.in).

## Stack

| Layer | Technology | Cost |
|-------|-----------|------|
| Framework | Astro 5 + Alpine.js | Free |
| Styling | Tailwind CSS 3 | Free |
| Database | Cloudflare D1 (SQLite) | Free tier |
| Hosting | Cloudflare Pages | Free tier |
| Payments | Razorpay | 2% per transaction |
| Auth | Google OAuth + email/password | Free |

**Monthly cost: ₹0** (Razorpay charges per transaction only)

## Features

- 🛍️ 6 products with size selection, add-to-cart, instant buy
- 🛒 Persistent cart via Alpine.js + localStorage
- 💳 Razorpay checkout (UPI, cards, COD)
- 🔐 Customer auth: Google OAuth + email/password
- 👤 Admin panel: manage products, pages, orders
- 📄 Legal pages: Privacy, T&C, Returns, Shipping (CMS-editable)
- 📖 Brand story page (SEO-optimized)
- 🗺️ Auto-generated sitemap
- 📊 JSON-LD structured data (Product, Organization, WebSite)

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Set environment variables

Copy `.env.example` to `.env` and fill in:

```bash
cp .env.example .env
```

| Variable | Description |
|----------|-------------|
| `AUTH_SECRET` | Random 64-char string for JWT signing |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `RAZORPAY_KEY_ID` | Razorpay dashboard key ID |
| `RAZORPAY_KEY_SECRET` | Razorpay dashboard key secret |
| `PUBLIC_RAZORPAY_KEY_ID` | Same as RAZORPAY_KEY_ID (public) |
| `SITE_URL` | `https://intru.in` |

### 3. Create Cloudflare D1 database

```bash
npx wrangler d1 create intru-in-db
# Copy the database_id to wrangler.toml
npx wrangler d1 execute intru-in-db --file=schema.sql
npx wrangler d1 execute intru-in-db --file=seed.sql
```

### 4. Create Cloudflare R2 bucket (for image uploads)

```bash
npx wrangler r2 bucket create intru-images
```

### 5. Set production secrets

```bash
npx wrangler secret put RAZORPAY_KEY_SECRET
npx wrangler secret put AUTH_SECRET
npx wrangler secret put GOOGLE_CLIENT_SECRET
```

### 6. Dev server

```bash
npm run dev
```

### 7. Deploy to Cloudflare Pages

Connect your GitHub repo to Cloudflare Pages:
- Build command: `npm run build`
- Output directory: `dist`
- Add custom domain: `intru.in`

## Admin Access

Go to `/admin/login` and enter password: `intru@27`

The password is automatically hashed and stored in D1 on first login.

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create OAuth 2.0 credentials
3. Add authorized redirect URI: `https://intru.in/api/auth/google-callback`
4. Copy Client ID and Secret to `.env`

## Project Structure

```
src/
├── pages/
│   ├── index.astro          # Homepage
│   ├── products/            # Shop & product detail
│   ├── checkout.astro       # Razorpay checkout
│   ├── about.astro          # Brand story (SEO)
│   ├── auth/                # Login / Google OAuth
│   ├── admin/               # Admin panel
│   ├── legal/               # Privacy, T&C, Returns, Shipping
│   └── api/                 # REST API endpoints
├── layouts/
│   ├── BaseLayout.astro     # Site layout with Alpine.js + cart
│   └── AdminLayout.astro    # Admin sidebar layout
├── components/
│   ├── Navigation.astro
│   ├── Footer.astro
│   ├── ProductCard.astro
│   ├── CartDrawer.astro     # Slide-out cart
│   └── SEOHead.astro        # JSON-LD injector
└── lib/
    ├── db.ts                # D1 query helpers
    ├── auth.ts              # JWT + password hashing (Web Crypto)
    ├── razorpay.ts          # Razorpay REST API (no SDK)
    └── utils.ts             # Helpers
```
