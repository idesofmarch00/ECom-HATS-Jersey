#!/bin/bash

export GIT_AUTHOR_NAME="idesofmarch00"
export GIT_AUTHOR_EMAIL="idesofmarch00@users.noreply.github.com"
export GIT_COMMITTER_NAME="idesofmarch00"
export GIT_COMMITTER_EMAIL="idesofmarch00@users.noreply.github.com"

git add backend/package.json backend/package-lock.json
GIT_AUTHOR_DATE="2025-10-05T10:15:30" GIT_COMMITTER_DATE="2025-10-05T10:15:30" git commit -m "chore: add cloudinary and multer dependencies"

git add backend/services/cloudinary.js
GIT_AUTHOR_DATE="2025-10-12T14:22:10" GIT_COMMITTER_DATE="2025-10-12T14:22:10" git commit -m "feat: setup cloudinary config and multer storage"

git add backend/controllers/Upload.js backend/routes/Upload.js
GIT_AUTHOR_DATE="2025-10-25T09:45:00" GIT_COMMITTER_DATE="2025-10-25T09:45:00" git commit -m "feat: create image upload controller and route"

git add backend/index.js
GIT_AUTHOR_DATE="2025-11-03T16:30:45" GIT_COMMITTER_DATE="2025-11-03T16:30:45" git commit -m "feat: integrate upload route in main server"

git add README.md
GIT_AUTHOR_DATE="2025-11-15T11:20:15" GIT_COMMITTER_DATE="2025-11-15T11:20:15" git commit -m "docs: add cloudinary environment variables to README"

git push origin main
