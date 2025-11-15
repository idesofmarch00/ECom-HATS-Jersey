# ECom HATS Jersey

A full-stack MERN (MongoDB, Express, React, Node.js) E-Commerce platform for selling premium hats and jerseys. 

## Features
- Complete shopping cart and checkout functionality.
- Secure Admin Dashboard for product and order management.
- JWT-based Authentication.
- Integration ready for modern payment gateways.

## Getting Started

### Prerequisites
- Node.js installed on your machine.
- A MongoDB cluster (e.g., MongoDB Atlas).

### 1. Environment Variables setup
You will need to create a `.env` file in the `backend` directory with the following keys:

```env
PORT=8080
MONGODB_URL=your_mongodb_connection_string
JWT_SECRET_KEY=your_super_secret_jwt_key
SESSION_KEY=your_session_secret
MAIL_PASSWORD=your_gmail_app_password
STRIPE_SERVER_KEY=your_stripe_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### 2. Run the Backend
```bash
cd backend
npm install
npm start
```

### 3. Run the Frontend
```bash
cd frontend
npm install
npm start
```

## Admin Access
To access the Admin Dashboard, create a user account, then manually change their `role` to `admin` in your MongoDB database. Future logins will reveal the Admin Panel.
