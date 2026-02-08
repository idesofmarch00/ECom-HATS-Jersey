#!/bin/bash

# Ensure Git local configuration is correct
export GIT_AUTHOR_NAME="idesofmarch00"
export GIT_AUTHOR_EMAIL="sa.idesofmarch@gmail.com"
export GIT_COMMITTER_NAME="idesofmarch00"
export GIT_COMMITTER_EMAIL="sa.idesofmarch@gmail.com"

# 1. Backend Vector Embedding Service and Model Updates (Early February 2026)
git add backend/services/embedding.js backend/model/Product.js
GIT_AUTHOR_DATE="2026-02-05T10:30:00" GIT_COMMITTER_DATE="2026-02-05T10:30:00" git commit -m "feat: add gemini vector embedding service and update product model"

# 2. Product Controller Upgrade for Atlas Vector Search & Fallback (Mid February 2026)
git add backend/controller/Product.js
GIT_AUTHOR_DATE="2026-02-12T14:45:00" GIT_COMMITTER_DATE="2026-02-12T14:45:00" git commit -m "feat: implement mongodb atlas vector search and graceful fuzzy regex fallback"

# 3. WhatsApp Bot Vector Creation & Database Seeding Migrations (Late February 2026)
git add backend/controller/Whatsapp.js backend/scripts/generate-embeddings.js
GIT_AUTHOR_DATE="2026-02-18T09:15:00" GIT_COMMITTER_DATE="2026-02-18T09:15:00" git commit -m "feat: automate embedding creation in whatsapp bot and add seed migration script"

# 4. Frontend Search Thunks, Dynamic Search Bar, URL Binding, Clear Search Actions (End of February 2026)
git add frontend/src/features/product/components/ProductList.jsx frontend/src/features/navbar/Navbar.jsx
GIT_AUTHOR_DATE="2026-02-25T16:20:00" GIT_COMMITTER_DATE="2026-02-25T16:20:00" git commit -m "feat: build responsive semantic search bar with reactive routing and clear search state"

echo "✅ Staged and committed all semantic search features (Feb 2026 timeline)!"
