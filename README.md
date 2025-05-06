# 🏠 BASA FINDER SERVERSIDE

A robust backend service for a rental property management system built with **Node.js**, **Express**, **TypeScript**, and **MongoDB**.

---

## 🚀 Features

### 🔐 Authentication & Authorization
- User registration and login with JWT authentication
- Role-based access control (Admin, Landlord, Tenant)
- Password encryption using `bcrypt`
- Token-based authentication with refresh tokens

### 👥 User Management
- Profile management (name, email, phone, address)
- Role and status (active/blocked) management
- Password update functionality

### 🏘️ Rental House Management
- Create, update, and delete rental listings
- Image upload with Cloudinary
- Search, filter, and track availability
- Amenities management

### 📥 Rental Request System
- Send rental requests
- Manage request statuses (pending, approved, rejected)
- Filtering, sorting, and soft deletion of requests

### 💳 Payment Integration
- Secure payment processing via **ShurjoPay**
- Track payment status and transaction history
- Revenue calculation and payment verification

### 🧰 Additional Features
- Custom `AppError` and global error handling
- Schema validation using **Zod**
- Advanced query building with pagination and filtering
- Middleware support for CORS, cookie parsing, and rate limiting

---

## 🧱 Technology Stack

- **Runtime**: Node.js  
- **Language**: TypeScript  
- **Framework**: Express.js  
- **Database**: MongoDB (with Mongoose ODM)  
- **Authentication**: JWT  
- **Password Hashing**: bcrypt  
- **Validation**: Zod  
- **File Uploads**: multer, Cloudinary  
- **Payment Gateway**: ShurjoPay  
- **Utilities**: cors, cookie-parser, express-rate-limit  

---

## ⚙️ Prerequisites

- Node.js v14+
- MongoDB
- npm or yarn
- TypeScript

---

## 📁 Environment Variables

Create a `.env` file in the root directory:

```env
NODE_ENV=development
PORT=5000
DATABASE_URL=your_mongodb_connection_string
JWT_ACCESS_SECRET=your_jwt_access_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret
JWT_ACCESS_EXPIRES_IN=365d
JWT_REFRESH_EXPIRES_IN=365d
BCRYPT_SALT_ROUNDS=10
CORS_ORIGIN=your_frontend_url

# ShurjoPay Configuration
SP_ENDPOINT=your_shurjopay_endpoint
SP_USERNAME=your_shurjopay_username
SP_PASSWORD=your_shurjopay_password
SP_PREFIX=SP
SP_RETURN_URL=your_return_url
```

---

## 📦 Installation

```bash
# Clone the repo
git clone https://github.com/habibb2r/BASA-FINDER-SERVERSIDE.git
cd BASA-FINDER-SERVERSIDE

# Install dependencies
npm install

# Build the project
npm run build

# Start in development mode
npm run start:dev
```

---

## 🌐 Live Server

```bash
https://basa-finder-serverside.vercel.app/
```

---

## 📡 API Endpoints

### Auth
- `POST /api/v1/auth/signup` – Register user  
- `POST /api/v1/auth/login` – Login user  

### User
- `GET /api/v1/user` – Get all users (Admin)  
- `PATCH /api/v1/user/update-profile` – Update profile  
- `PATCH /api/v1/user/update` – Update status (Admin)  
- `PATCH /api/v1/user/update/password` – Change password  
- `GET /api/v1/user/my-profile/:id` – Get specific profile  

### Rental Listings
- `POST /api/v1/landlords/listings` – Create listing  
- `GET /api/v1/landlords/listings` – Get all listings  
- `GET /api/v1/landlords/listings/:id` – Get single listing  
- `PATCH /api/v1/landlords/listings/:id` – Update listing  
- `DELETE /api/v1/landlords/listings/:id` – Delete listing  

### Rental Requests
- `POST /api/v1/tenants/create` – Create rental request  
- `GET /api/v1/tenants/requests` – Tenant's requests  
- `GET /api/v1/rental-request/landlord/requests` – Landlord's requests  
- `PATCH /api/v1/requests/:id/status` – Update status  
- `GET /api/v1/requests` – All requests  
- `DELETE /api/v1/requests/:id` – Delete request  

### Payment
- `POST /api/v1/payment/create` – Initiate payment  
- `GET /api/v1/payment/verify` – Verify payment  
- `GET /api/v1/payment` – All payments (Admin)  
- `GET /api/v1/payment/my-payments` – User payments  
- `GET /api/v1/payment/revenue` – Total revenue (Admin)  

---

## 📜 Scripts

| Script             | Description                      |
|--------------------|----------------------------------|
| `start:prod`       | Start production server          |
| `start:dev`        | Start dev server with hot reload |
| `build`            | Compile TypeScript               |
| `lint`             | Run ESLint                       |
| `lint:fix`         | Fix lint issues                  |
| `format`           | Format code with Prettier        |

---

## ❗ Error Handling

- Custom `AppError` class  
- Centralized error handler  
- Zod validation errors  
- Mongoose-specific error handling  
- Duplicate key errors  
- Generic fallback handler  

---

## 🚀 Deployment

The backend is **Vercel**-ready. Includes a `vercel.json` for configuration.

---

## 🪪 License

**ISC License**

## 👨‍💻 Developer

**HABIBB2R**

- GitHub: [@habibb2r](https://github.com/habibb2r)
- LinkedIn: [@habibb2r](https://linkedin.com/in/habibb2r)
- Portfolio: [habibb2r.site](https://habibb2r.site)

---
