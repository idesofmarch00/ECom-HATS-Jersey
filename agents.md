# ECom HATS Jersey — Agent Rules, Specs & Skills

## Project Overview
A full-stack MERN (MongoDB, Express, React, Node.js) e-commerce platform for selling premium hats and jerseys. This is a **monorepo** with `backend/` and `frontend/` directories that are deployed separately.

---

## Repository Structure
```
ecom_mern/
├── backend/                 # Express + MongoDB API server
│   ├── controller/          # Route handlers (Product, Brand, Category, Auth, Cart, Order, User)
│   ├── controllers/         # Extended handlers (Upload.js for Cloudinary)
│   ├── model/               # Mongoose schemas (User, Product, Brand, Category, Cart, Order)
│   ├── routes/              # Express route definitions
│   ├── services/            # Shared utilities (common.js, cloudinary.js)
│   ├── data.json            # Seed data (currently generic products — MUST be replaced with hats/jerseys)
│   ├── index.js             # Main entry point
│   ├── .env                 # Environment variables (NEVER commit)
│   └── package.json
├── frontend/                # React 18 + Redux Toolkit + Tailwind CSS
│   ├── src/
│   │   ├── app/             # Redux store + constants
│   │   ├── features/        # Feature modules (auth, product, cart, order, admin, navbar, user, common)
│   │   ├── pages/           # Page-level components (Home, Checkout, etc.)
│   │   ├── App.js           # Root component with React Router
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
| Backend       | Express 4, Passport.js (JWT + Local Strategy) |
| Database      | MongoDB via Mongoose                |
| Image Storage | Cloudinary (via multer + multer-storage-cloudinary) |
| Payments      | Stripe (PaymentIntents API)         |
| Email         | Nodemailer (Gmail SMTP)             |

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
| Method | Path                    | Auth | Description                     |
|--------|-------------------------|------|---------------------------------|
| POST   | `/auth/signup`          | No   | Register new user               |
| POST   | `/auth/login`           | No   | Login + set JWT cookie          |
| GET    | `/auth/check`           | Yes  | Validate current session        |
| GET    | `/auth/logout`          | Yes  | Clear session                   |
| GET    | `/products`             | Yes  | List/filter products            |
| GET    | `/products/:id`         | Yes  | Single product detail           |
| POST   | `/products`             | Yes  | Create product (admin)          |
| PATCH  | `/products/:id`         | Yes  | Update product (admin)          |
| GET    | `/categories`           | Yes  | List categories                 |
| GET    | `/brands`               | Yes  | List brands                     |
| POST   | `/cart`                 | Yes  | Add to cart                     |
| GET    | `/cart`                 | Yes  | Get user cart                   |
| DELETE | `/cart/:id`             | Yes  | Remove from cart                |
| PATCH  | `/cart/:id`             | Yes  | Update cart item quantity        |
| POST   | `/orders`               | Yes  | Create order                    |
| GET    | `/orders`               | Yes  | Get user orders / all (admin)   |
| PATCH  | `/orders/:id`           | Yes  | Update order status (admin)     |
| GET    | `/users/own`            | Yes  | Get own user profile            |
| PATCH  | `/users/:id`            | Yes  | Update user profile             |
| POST   | `/upload`               | Yes  | Upload image to Cloudinary      |
| POST   | `/create-payment-intent`| No*  | Create Stripe payment intent    |
| POST   | `/webhook`              | No   | Stripe webhook handler          |

---

## Current Product Data
- `data.json` contains 30+ generic products (phones, laptops, groceries, furniture).
- Images are external URLs from `i.dummyjson.com`.
- **ACTION REQUIRED:** Replace with real hat/jersey data + Cloudinary-hosted images.

---

## Coding Conventions
- **Backend:** CommonJS modules (`require/module.exports`). Controllers export individual functions. Routes use `exports.router`.
- **Frontend:** ES6 modules. Feature-based folder structure. Redux slices co-located with API files.
- **File extensions:** Currently `.js` for all React components. **TODO:** Rename to `.jsx` for JSX files.
- **Styling:** Tailwind CSS utility classes inline. No separate CSS modules per component.

---

## Git & Commit History
- **Author:** `idesofmarch00 <sa.idesofmarch@gmail.com>`
- **Fake history:** Jul 2025 – Sep 2025 (initial build), Oct-Nov 2025 (Cloudinary).
- **Future commits:** Nov 2025 – Jan 2026 (AI/automation features).
- All commits must use the above author/email for GitHub contribution graph.

---

## Roadmap (Phases)

### Phase 1: Product Data & Branding (Current)
- [ ] Replace `data.json` with hat/jersey seed data
- [ ] Upload real product images to Cloudinary
- [ ] Rename `.js` → `.jsx` for React component files
- [ ] Verify app runs end-to-end locally

### Phase 2: Redis Integration
- [ ] Install `redis` / `ioredis` in backend
- [ ] Implement discount banner management stored in Redis
- [ ] Implement OTP-based phone login (OTP stored in Redis with TTL)
- [ ] Cache frequently accessed data (categories, brands) in Redis

### Phase 3: WhatsApp AI Bot
- [ ] Integrate Twilio WhatsApp API webhook (`POST /whatsapp-webhook`)
- [ ] Use AI Vision model (OpenAI/Gemini) to parse product images
- [ ] Auto-generate product titles, descriptions, categories from images
- [ ] Upload parsed images to Cloudinary and create products in MongoDB

### Phase 4: Real-Time Social Proof (Socket.io)
- [ ] Add Socket.io to backend
- [ ] Broadcast "X people viewing this" counts
- [ ] Broadcast "Someone from [city] just bought [product]" toasts
- [ ] Track active viewer counts per product page

### Phase 5: PWA & Mobile
- [ ] Configure `manifest.json` properly for installability
- [ ] Register Service Worker for offline caching
- [ ] Add push notification support
- [ ] Ensure full mobile responsiveness

---

## Known Issues
1. `react-alert@7.0.3` only supports React 16/17 — needs `--legacy-peer-deps` for install.
2. Backend currently uses `controller/` (original) AND `controllers/` (new Upload.js) — should consolidate.
3. No input validation/sanitization on product creation endpoints.
4. Stripe webhook secret needs real value for payment flow to work.
5. Frontend proxy (`"proxy": "http://localhost:8080"`) only works in dev mode.

---

## Skills & Tools for Agents
- **Image Upload:** Use `POST /upload` with `multipart/form-data`, field name `image`. Returns `{ url: "cloudinary_url" }`.
- **Product Creation:** Send product JSON to `POST /products` with `thumbnail` and `images` fields containing Cloudinary URLs.
- **Admin Check:** Set MongoDB `users.role = "admin"` to enable admin dashboard access.
- **Database Seed:** Use `data.json` for initial product seeding via a custom script or direct MongoDB import.
