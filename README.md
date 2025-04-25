# BASA FINDER SERVERSIDE

A robust backend service for a rental property management system built with Node.js, Express, TypeScript, and MongoDB.

## Features

### Authentication & Authorization

- User registration and login with JWT authentication
- Role-based access control (Admin, Landlord, Tenant)
- Password encryption using bcrypt
- Token-based authentication with refresh tokens

### User Management

- Profile management (name, email, phone, address)
- User role management
- Password update functionality
- User status management (active/blocked)

### Rental House Management

- Create, update, and delete rental listings
- Search and filter rental properties
- Image upload support
- Amenities management
- Availability status tracking

### Rental Request System

- Create rental requests
- Request status management (pending/approved/rejected)
- Request filtering and sorting
- Soft delete functionality

### Payment Integration

- Secure payment processing with ShurjoPay
- Payment status tracking
- Transaction history
- Revenue calculation
- Payment verification system

### Additional Features

- Error handling with custom AppError
- Request validation using Zod
- Query building with pagination and filtering
- CORS support
- Cookie parsing
- Rate limiting
- Global error handling

## Technology Stack

- **Runtime Environment**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (jsonwebtoken)
- **Password Encryption**: bcrypt
- **Validation**: Zod
- **Payment Gateway**: ShurjoPay
- **Other Tools**:
  - cors
  - cookie-parser
  - express-rate-limit
  - multer
  - cloudinary

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn
- TypeScript

## Environment Variables

Create a .env file in the root directory with the following variables:

\`\`\`env
NODE_ENV=development
PORT=5000
DATABASE_URL=your_mongodb_connection_string
JWT_ACCESS_SECRET=your_jwt_access_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret
JWT_ACCESS_EXPIRES_IN=365d
JWT_REFRESH_EXPIRES_IN=365d
BCRYPT_SALT_ROUNDS= give salt round
CORS_ORIGIN= your frontend url

# ShurjoPay Configuration

SP_ENDPOINT=your_shurjopay_endpoint
SP_USERNAME=your_shurjopay_username
SP_PASSWORD=your_shurjopay_password
SP_PREFIX=SP
SP_RETURN_URL=your_return_url
\`\`\`

## Installation

1. Clone the repository:
   \`\`\`bash
   git clone <repository-url>
   cd BASA-FINDER-SERVERSIDE
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Build the project:
   \`\`\`bash
   npm run build
   \`\`\`

4. Start the development server:
   \`\`\`bash
   npm run start:dev
   \`\`\`

## API Routes

### Auth Routes

- POST `/api/v1/auth/signup` - Register a new user
- POST `/api/v1/auth/login` - User login

### User Routes

- GET `/api/v1/user` - Get all users (Admin only)
- PATCH `/api/v1/user/update-profile` - Update user profile
- PATCH `/api/v1/user/update` - Update user status (Admin only)
- PATCH `/api/v1/user/update/password` - Update user password
- GET `/api/v1/user/my-profile/:id` - Get user profile

### Rental House Routes

- POST `/api/v1/landlords/listings` - Create rental listing
- GET `/api/v1/landlords/listings` - Get all rental listings
- GET `/api/v1/landlords/listings/:id` - Get single rental listing
- DELETE `/api/v1/landlords/listings/:rentalHouseId` - Delete rental listing
- PATCH `/api/v1/landlords/listings/:rentalHouseId` - Update rental listing

### Rental Request Routes

- POST `/api/v1/tenants/create` - Create rental request
- GET `/api/v1/tenants/requests` - Get tenant's rental requests
- GET `/api/v1/rental-request/landlord/requests` - Get landlord's rental requests
- PATCH `/api/v1/requests/:requestId/status` - Update request status
- GET `/api/v1/requests` - Get all rental requests
- DELETE `/api/v1/requests/:id` - Delete rental request

### Payment Routes

- POST `/api/v1/payment/create` - Initialize payment
- GET `/api/v1/payment/verify` - Verify payment
- GET `/api/v1/payment` - Get all payments (Admin only)
- GET `/api/v1/payment/my-payments` - Get user payments
- GET `/api/v1/payment/revenue` - Calculate total revenue (Admin only)

## Scripts

- `npm run start:prod` - Start production server
- `npm run start:dev` - Start development server with hot reload
- `npm run build` - Build the project
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run format` - Format code with Prettier

## Error Handling

The application includes comprehensive error handling with:

- Custom AppError class
- Global error handler
- Validation error handling
- Cast error handling
- Duplicate error handling
- Generic error handling

## Deployment

The application is configured for deployment on Vercel with the included vercel.json configuration.

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

ISC
