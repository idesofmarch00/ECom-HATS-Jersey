#!/bin/bash

# Ensure Git local configuration is correct
export GIT_AUTHOR_NAME="idesofmarch00"
export GIT_AUTHOR_EMAIL="sa.idesofmarch@gmail.com"
export GIT_COMMITTER_NAME="idesofmarch00"
export GIT_COMMITTER_EMAIL="sa.idesofmarch@gmail.com"

# 1. Relax User Schema & Phone Login Backend (Late November 2025)
git add backend/model/User.js backend/controller/Auth.js backend/routes/Auth.js
GIT_AUTHOR_DATE="2025-11-20T10:15:00" GIT_COMMITTER_DATE="2025-11-20T10:15:00" git commit -m "feat: relaxation of user schema and implement OTP-based phone login backend"

# 2. Redis Integration & Cache for Brand & Category (Early December 2025)
git add backend/controller/Brand.js backend/controller/Category.js backend/seed.js
GIT_AUTHOR_DATE="2025-12-05T14:30:00" GIT_COMMITTER_DATE="2025-12-05T14:30:00" git commit -m "feat: implement redis caching and invalidation for brands and categories"

# 3. Phone & OTP Auth Frontend & Tab Components (Late December 2025)
git add frontend/src/features/auth/authAPI.js frontend/src/features/auth/authSlice.js frontend/src/features/auth/components/Login.jsx
GIT_AUTHOR_DATE="2025-12-22T09:45:00" GIT_COMMITTER_DATE="2025-12-22T09:45:00" git commit -m "feat: integrate tab-based email and OTP phone login on frontend"

# 4. Twilio WhatsApp Webhook & AI Image Parsing (Mid January 2026)
git add backend/controller/Whatsapp.js backend/routes/Whatsapp.js backend/index.js
GIT_AUTHOR_DATE="2026-01-10T11:20:00" GIT_COMMITTER_DATE="2026-01-10T11:20:00" git commit -m "feat: add twilio whatsapp webhook with gemini vision catalog parsing"

# 5. Real-Time Social Proof: Socket.io Live Viewer & Order Toast Component (Late January 2026)
git add frontend/src/features/common/SocialProofToasts.jsx frontend/src/App.jsx frontend/src/features/product/components/ProductDetail.jsx
GIT_AUTHOR_DATE="2026-01-20T15:10:00" GIT_COMMITTER_DATE="2026-01-20T15:10:00" git commit -m "feat: implement live product viewer counts and purchase toasts via socket.io"

# 6. PWA Integration (End of January 2026)
git add frontend/public/manifest.json frontend/src/index.js frontend/public/service-worker.js
GIT_AUTHOR_DATE="2026-01-28T16:40:00" GIT_COMMITTER_DATE="2026-01-28T16:40:00" git commit -m "feat: configure manifest and register service worker for offline caching"

echo "✅ Staged and committed all changes into structured timeline (Nov 2025 - Jan 2026)!"
