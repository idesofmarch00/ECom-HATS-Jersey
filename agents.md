# ECom HATS Jersey — Agent Rules, Specs & Skills

## Project Overview
A full-stack MERN (MongoDB, Express, React, Node.js) e-commerce platform for selling premium hats and jerseys. This is a **monorepo** with `backend/` and `frontend/` directories that are deployed separately.

---

## Repository Structure
```
ecom_mern/
├── backend/                 # Express + MongoDB API server
│   ├── controller/          # Route handlers (Product, BulkProduct, Brand, Category, Auth, Cart, Order, User, Upload, Banner, Whatsapp)
│   ├── middleware/          # Express middleware (validate.js, sanitize.js)
│   ├── model/               # Mongoose schemas (User, Product, Brand, Category, Cart, Order)
│   ├── routes/              # Express route definitions
│   ├── services/            # Shared utilities (common.js, cloudinary.js, embedding.js, redis.js, socket.js)
│   ├── data.json            # Seed data (20 hats/jerseys products)
│   ├── seed.js              # MongoDB seeding script
│   ├── index.js             # Main entry point
│   ├── .env                 # Environment variables (NEVER commit)
│   └── package.json
├── frontend/                # React 18 + Redux Toolkit + Tailwind CSS
│   ├── src/
│   │   ├── app/             # Redux store + constants + socketContext
│   │   ├── features/        # Feature modules (auth, product, cart, order, admin, navbar, user, common)
│   │   ├── pages/           # Page-level components (Home, Checkout, etc.)
│   │   ├── theme/           # Design system tokens
│   │   ├── App.jsx          # Root component with React Router
│   │   └── index.js         # React DOM entry
│   ├── public/              # Static assets + manifest.json
│   ├── tailwind.config.js
│   └── package.json
├── README.md
├── CHANGELOG.md
└── agents.md                # THIS FILE
```

---

## Tech Stack
| Layer         | Technology                          |
|---------------|-------------------------------------|
| Frontend      | React 18, Redux Toolkit, Tailwind CSS, React Router 6 |
| Backend       | Express 5, Passport.js (JWT + Local Strategy) |
| Database      | MongoDB via Mongoose                |
| Caching       | Redis via ioredis (banners, categories, brands, OTP) |
| Real-Time     | Socket.io (viewer counts, purchase toasts) |
| AI/Search     | Gemini text-embedding-004 (vector search), Gemini 1.5 Flash Vision (WhatsApp bot) |
| Image Storage | Cloudinary (via multer + multer-storage-cloudinary) |
| Payments      | Stripe (PaymentIntents API)         |
| Email         | Nodemailer (Gmail SMTP)             |
| Messaging     | Twilio WhatsApp API (product ingestion bot) |

---

## Environment Variables (backend/.env)
```env
PORT=8080
MONGODB_URL=<mongodb_connection_string>
JWT_SECRET_KEY=<secret>
SESSION_KEY=<secret>
MAIL_PASSWORD=<gmail_app_password>
STRIPE_SERVER_KEY=<stripe_secret_key>
ENDPOINT_SECRET=<stripe_webhook_secret>
CLOUDINARY_CLOUD_NAME=<cloud_name>
CLOUDINARY_API_KEY=<api_key>
CLOUDINARY_API_SECRET=<api_secret>
GEMINI_API_KEY=<gemini_api_key>
FRONTEND_URL=http://localhost:3000
```

---

## Running Locally
```bash
# Terminal 1 — Backend
cd backend && npm install && npm start
# Runs on http://localhost:8080

# Terminal 2 — Frontend
cd frontend && npm install --legacy-peer-deps && npm start
# Runs on http://localhost:3000, proxies API to :8080
```
**Note:** Frontend requires `--legacy-peer-deps` due to `react-alert@7` not supporting React 18.

---

## Authentication Flow
1. User signs up → password hashed with `crypto.pbkdf2` + random salt stored in MongoDB.
2. Login → Passport LocalStrategy validates credentials → JWT token created → stored in HTTP-only cookie.
3. Protected routes use `isAuth()` middleware which extracts JWT from cookie via `cookieExtractor`.
4. Admin routes additionally check `user.role === 'admin'` in the controller.

---

## API Routes
| Method | Path                     | Auth | Description                        |
|--------|--------------------------|------|------------------------------------|
| POST   | `/auth/signup`           | No   | Register new user (validated)      |
| POST   | `/auth/login`            | No   | Login + set JWT cookie (validated) |
| GET    | `/auth/check`            | Yes  | Validate current session           |
| GET    | `/auth/logout`           | Yes  | Clear session                      |
| POST   | `/auth/otp/send`         | No   | Send OTP for phone login           |
| POST   | `/auth/otp/login`        | No   | Login via OTP                      |
| GET    | `/products`              | Yes  | List/filter/semantic-search products |
| GET    | `/products/export`       | Yes  | Export product catalog (admin)     |
| PATCH  | `/products/bulk-stock`   | Yes  | Bulk update stock via upload (admin)|
| GET    | `/products/:id`          | Yes  | Single product detail              |
| POST   | `/products`              | Yes  | Create product (admin, validated)  |
| PATCH  | `/products/:id`          | Yes  | Update product (admin)             |
| GET    | `/categories`            | Yes  | List categories                    |
| GET    | `/brands`                | Yes  | List brands                        |
| POST   | `/cart`                  | Yes  | Add to cart                        |
| GET    | `/cart`                  | Yes  | Get user cart                      |
| DELETE | `/cart/:id`              | Yes  | Remove from cart                   |
| PATCH  | `/cart/:id`              | Yes  | Update cart item quantity           |
| POST   | `/orders`                | Yes  | Create order                       |
| GET    | `/orders`                | Yes  | Get user orders / all (admin)      |
| PATCH  | `/orders/:id`            | Yes  | Update order status (admin)        |
| GET    | `/users/own`             | Yes  | Get own user profile               |
| PATCH  | `/users/:id`             | Yes  | Update user profile                |
| POST   | `/upload`                | Yes  | Upload image to Cloudinary         |
| GET    | `/banners`               | No   | Get active discount banners        |
| POST   | `/banners`               | Yes  | Create banner (admin, Redis)       |
| DELETE | `/banners/:id`           | Yes  | Delete banner (admin)              |
| POST   | `/whatsapp-webhook`      | No   | Twilio WhatsApp ingestion webhook  |
| POST   | `/create-payment-intent` | No*  | Create Stripe payment intent       |
| POST   | `/webhook`               | No   | Stripe webhook handler             |

---

## Current Product Data
- `data.json` contains 20 products: 9 jerseys (Barcelona, Real Madrid, Lakers, Man United, PSG, etc.), 5 caps, 3 snapbacks, 3 hats.
- Brands: Nike, Adidas, New Era, Mitchell & Ness, Jordan.
- Images currently use Unsplash URLs (free, working). Future: migrate to Cloudinary-hosted images.
- `seed.js` script seeds MongoDB with products, brands, categories, and size/color objects.

---

## Coding Conventions
- **Backend:** CommonJS modules (`require/module.exports`). Controllers export individual functions. Routes use `exports.router`.
- **Frontend:** ES6 modules. Feature-based folder structure. Redux slices co-located with API files.
- **File extensions:** `.jsx` for all React components with JSX. `.js` for pure logic (slices, APIs, store, hooks).
- **Styling:** Tailwind CSS utility classes inline. No separate CSS modules per component.
- **Validation:** Input validation via `express-validator` middleware on auth and product routes. Global NoSQL injection prevention via `mongo-sanitize`.

---

## Git & Commit History
- **Author:** `idesofmarch00 <sa.idesofmarch@gmail.com>`
- **Fake history:** Jul 2025 – Sep 2025 (initial build), Oct-Nov 2025 (Cloudinary).
- **Future commits:** Nov 2025 – Jan 2026 (AI/automation features).
- All commits must use the above author/email for GitHub contribution graph.

---

## Roadmap (Phases)

### Phase 1: Product Data & Branding ✅ COMPLETE
- [x] Replace `data.json` with hat/jersey seed data (20 products)
- [ ] Upload real product images to Cloudinary (currently Unsplash URLs)
- [x] Rename `.js` → `.jsx` for React component files
- [ ] Verify app runs end-to-end locally

### Phase 2: Redis Integration ✅ COMPLETE
- [x] Install `ioredis@^5.10.1` in backend
- [x] Implement discount banner management stored in Redis (24h TTL)
- [x] Implement OTP caching in Redis
- [x] Cache frequently accessed data (categories, brands) in Redis

### Phase 3: WhatsApp AI Bot ✅ COMPLETE
- [x] Integrate Twilio WhatsApp API webhook (`POST /whatsapp-webhook`)
- [x] Use Gemini 1.5 Flash Vision to parse product images
- [x] Auto-generate product titles, descriptions, categories from images (structured JSON)
- [x] Upload parsed images to Cloudinary and create products in MongoDB (with embeddings)

### Phase 4: Real-Time Social Proof (Socket.io) ✅ COMPLETE
- [x] Add Socket.io to backend (`socket.io@^4.8.3`)
- [x] Broadcast "X people viewing this" counts (room-based)
- [x] Broadcast purchase notification toasts (ring buffer of 20 recent)
- [x] Track active viewer counts per product page

### Phase 5: Production Hardening (Current)
- [x] Input validation & sanitization on auth and product routes
- [x] Admin spreadsheet export & bulk stock import
- [x] WhatsApp contact button for order tracking
- [x] Dynamic Stripe redirect URL (dev/prod aware)
- [x] Consolidated controller folder structure
- [ ] Replace placeholder API keys with real credentials
- [ ] Configure Twilio webhook URL in console

### Phase 6: PWA & Mobile (Future)
- [ ] Configure `manifest.json` properly for installability
- [ ] Register Service Worker for offline caching
- [ ] Add push notification support
- [ ] Ensure full mobile responsiveness

---

## Known Issues
1. `react-alert@7.0.3` only supports React 16/17 — needs `--legacy-peer-deps` for install.
2. ~~Backend currently uses `controller/` AND `controllers/`~~ — **RESOLVED**: consolidated to `controller/`.
3. ~~No input validation/sanitization~~ — **RESOLVED**: `express-validator` + `mongo-sanitize` middleware added.
4. Stripe webhook secret needs real value for payment flow to work.
5. Frontend proxy (`"proxy": "http://localhost:8080"`) only works in dev mode.
6. Product images are Unsplash URLs — should migrate to Cloudinary for production.
7. Redis is optional — app gracefully degrades if Redis is not running (banners won't work).

---

## Skills & Tools for Agents
- **Image Upload:** Use `POST /upload` with `multipart/form-data`, field name `image`. Returns `{ url: "cloudinary_url" }`.
- **Product Creation:** Send product JSON to `POST /products` with `thumbnail` and `images` fields containing Cloudinary URLs.
- **Admin Check:** Set MongoDB `users.role = "admin"` to enable admin dashboard access.
- **Database Seed:** Use `data.json` for initial product seeding via a custom script or direct MongoDB import.
