# ShopNest Backend Documentation

ShopNest is a modern e-commerce backend API built with Node.js and Express. It provides authentication, product management, order processing, payment integration, and admin analytics for a full online shopping experience.

## 1. Overview

ShopNest helps you manage:
- User registration and login
- Product catalog CRUD operations
- Order placement and order tracking
- Online payments through Razorpay
- Admin dashboard statistics
- Email notifications for important events

## 2. Key Features

- User authentication with JWT
- Password hashing using bcryptjs
- Admin-only routes for product, order, and analytics management
- Product image upload and storage with Cloudinary
- Order creation with shipping address details
- Razorpay payment order creation and signature verification
- Automated email notifications for registration and order confirmation
- MongoDB-based data modeling for users, products, and orders

## 3. Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose

### Authentication & Security
- JSON Web Token (JWT)
- bcryptjs
- CORS
- dotenv

### Media & File Handling
- Multer
- Cloudinary

### Payments & Email
- Razorpay
- Nodemailer

### Development Tools
- Nodemon
- Archiver

## 4. Project Structure

```text
Backend/
├── config/
├── controllers/
├── middleware/
├── models/
├── routes/
├── uploads/
├── utils/
├── index.js
├── package.json
└── README.md
```

## 5. Installation

```bash
cd Backend
npm install
```

Create a `.env` file in the Backend folder with these values:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
EMAIL_USER=your_email_address
EMAIL_PASSWORD=your_email_password
```

Run the server:

```bash
npm run dev
```

## 6. Available Scripts

```bash
npm start        # Start the server in production mode
npm run dev      # Start the server in development mode
npm run zip      # Create a zip archive of the backend
```

## 7. API Endpoints

Base URL:

```text
http://localhost:5000
```

### 7.1 Health Check

| Method | Endpoint | Usage | Description |
|---|---|---|---|
| GET | `/` | Check server status | Returns a simple message confirming the server is running |

### 7.2 Authentication Routes

| Method | Endpoint | Usage | Description | Access |
|---|---|---|---|---|
| POST | `/api/auth/register` | Register a new account | Creates a new user and sends a verification email | Public |
| POST | `/api/auth/login` | Sign in | Authenticates user and returns a JWT token | Public |
| GET | `/api/auth/users` | View all users | Returns all registered users except passwords | Admin |

#### Register User
```http
POST /api/auth/register
Content-Type: application/json
```

Body:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json
```

Body:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### 7.3 Product Routes

| Method | Endpoint | Usage | Description | Access |
|---|---|---|---|---|
| GET | `/api/products` | View all products | Fetches the full product catalog | Public |
| GET | `/api/products/:id` | View one product | Fetches a single product by ID | Public |
| POST | `/api/products` | Create product | Adds a new product and uploads an image | Admin |
| PUT | `/api/products/:id` | Update product | Modifies product details and optional image | Admin |
| DELETE | `/api/products/:id` | Delete product | Removes a product from the catalog | Admin |

#### Create Product
```http
POST /api/products
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

Form fields:
- `name`
- `description`
- `price`
- `category`
- `stock`
- `image`

### 7.4 Order Routes

| Method | Endpoint | Usage | Description | Access |
|---|---|---|---|---|
| POST | `/api/orders` | Place an order | Creates a new order for the logged-in user | User |
| GET | `/api/orders` | View all orders | Returns all orders in the system | Admin |
| GET | `/api/orders/myorders` | View my orders | Returns orders placed by the logged-in user | User |
| PUT | `/api/orders/:id/status` | Update order status | Changes an order status such as Pending, Shipped, Delivered, or Cancelled | Admin |

#### Place Order
```http
POST /api/orders
Authorization: Bearer <token>
Content-Type: application/json
```

Body example:
```json
{
  "items": [
    {
      "productId": "64f2b1234abc",
      "qty": 2,
      "price": 499
    }
  ],
  "totalAmount": 998,
  "address": {
    "fullName": "John Doe",
    "street": "123 Main Street",
    "city": "Mumbai",
    "state": "Maharashtra",
    "zipCode": "400001",
    "country": "India"
  },
  "paymentId": "pay_123"
}
```

### 7.5 Payment Routes

| Method | Endpoint | Usage | Description | Access |
|---|---|---|---|---|
| POST | `/api/payment/order` | Create Razorpay order | Creates a payment order for checkout | Public |
| POST | `/api/payment/verify` | Verify payment | Verifies Razorpay signature after payment | Public |

#### Create Payment Order
```http
POST /api/payment/order
Content-Type: application/json
```

Body:
```json
{
  "amount": 500
}
```

### 7.6 Analytics Routes

| Method | Endpoint | Usage | Description | Access |
|---|---|---|---|---|
| GET | `/api/analytics` | Admin dashboard stats | Returns total users, orders, products, and revenue | Admin |

## 8. Main Models

### User
Fields:
- `name`
- `email`
- `password`
- `role`
- `verified`

### Product
Fields:
- `name`
- `description`
- `price`
- `category`
- `stock`
- `imagesUrl`
- `rating`
- `numReviews`

### Order
Fields:
- `user`
- `items`
- `totalAmount`
- `address`
- `paymentId`
- `status`

## 9. Usage Notes

- Use the `Authorization` header with a valid JWT token for protected routes.
- Admin-only operations require a user whose role is `admin`.
- Product images are uploaded to Cloudinary and stored as image URLs.
- Orders trigger email notifications after successful placement.

## 10. Summary

ShopNest is a complete backend foundation for an e-commerce platform with secure user management, product handling, ordering, payments, analytics, and email notifications. It is designed to power a modern storefront frontend with a reliable API layer.
```

---

### Delete Product
- **Method:** `DELETE`
- **Endpoint:** `/api/products/:id`
- **Description:** Delete a product
- **Access:** Protected (Admin only)
- **Headers:** `Authorization: Bearer <token>`
- **URL Parameters:**
  - `id` (required): Product ID
- **Response (200):**
```json
{
  "message": "Product removed"
}
```
- **Error Response (404):**
```json
{
  "message": "Product not found"
}
```

---

## 3. Order Routes (`/api/orders`)

### Create Order
- **Method:** `POST`
- **Endpoint:** `/api/orders`
- **Description:** Create a new order
- **Access:** Protected (Authenticated users)
- **Headers:** `Authorization: Bearer <token>`
- **Request Body:**
```json
{
  "items": [
    {
      "productId": "product_id",
      "quantity": 2,
      "price": 99.99
    }
  ],
  "totalAmount": 199.98,
  "address": "123 Main St, City, Country",
  "paymentId": "payment_id_from_razorpay"
}
```
- **Response (201):**
```json
{
  "message": "Order created successfully",
  "order": {
    "_id": "order_id",
    "user": "user_id",
    "items": [...],
    "totalAmount": 199.98,
    "address": "123 Main St, City, Country",
    "status": "pending",
    "paymentId": "payment_id",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```
- **Features:**
  - Automatic order confirmation email
  - Payment tracking
  - Stock management

---

### Get My Orders
- **Method:** `GET`
- **Endpoint:** `/api/orders/myorders`
- **Description:** Retrieve current user's orders
- **Access:** Protected (Authenticated users)
- **Headers:** `Authorization: Bearer <token>`
- **Response (200):**
```json
[
  {
    "_id": "order_id",
    "user": "user_id",
    "items": [
      {
        "productId": {
          "_id": "product_id",
          "name": "Product Name",
          "price": 99.99
        },
        "quantity": 2
      }
    ],
    "totalAmount": 199.98,
    "address": "123 Main St, City, Country",
    "status": "delivered",
    "createdAt": "2024-01-01T00:00:00Z"
  }
]
```

---

### Get All Orders
- **Method:** `GET`
- **Endpoint:** `/api/orders`
- **Description:** Retrieve all orders in the system
- **Access:** Protected (Admin only)
- **Headers:** `Authorization: Bearer <token>`
- **Response (200):**
```json
[
  {
    "_id": "order_id",
    "user": {
      "_id": "user_id",
      "name": "John Doe"
    },
    "items": [...],
    "totalAmount": 199.98,
    "address": "123 Main St, City, Country",
    "status": "pending",
    "createdAt": "2024-01-01T00:00:00Z"
  }
]
```

---

### Update Order Status
- **Method:** `PUT`
- **Endpoint:** `/api/orders/:id/status`
- **Description:** Update the status of an order
- **Access:** Protected (Admin only)
- **Headers:** `Authorization: Bearer <token>`
- **URL Parameters:**
  - `id` (required): Order ID
- **Request Body:**
```json
{
  "status": "shipped"
}
```
- **Valid Status Values:**
  - `pending` - Order received
  - `processing` - Being prepared
  - `shipped` - On the way
  - `delivered` - Order delivered
  - `cancelled` - Order cancelled
- **Response (200):**
```json
{
  "message": "Order status updated successfully",
  "order": {
    "_id": "order_id",
    "status": "shipped",
    "updatedAt": "2024-01-02T00:00:00Z"
  }
}
```

---

## 4. Payment Routes (`/api/payment`)

### Create Razorpay Order
- **Method:** `POST`
- **Endpoint:** `/api/payment/order`
- **Description:** Create a payment order with Razorpay
- **Access:** Public
- **Request Body:**
```json
{
  "amount": 199.98
}
```
- **Response (200):**
```json
{
  "id": "razorpay_order_id",
  "entity": "order",
  "amount": 19998,
  "amount_paid": 0,
  "currency": "INR",
  "receipt": "receipt_id",
  "status": "created",
  "attempts": 0,
  "created_at": 1704067200
}
```
- **Features:**
  - Amount in INR currency
  - Automatic receipt generation
  - Integration with Razorpay

---

### Verify Payment
- **Method:** `POST`
- **Endpoint:** `/api/payment/verify`
- **Description:** Verify Razorpay payment signature
- **Access:** Public
- **Request Body:**
```json
{
  "razorpay_order_id": "order_id",
  "razorpay_payment_id": "payment_id",
  "razorpay_signature": "signature_hash"
}
```
- **Response (200) - Success:**
```json
{
  "message": "Payment verified successfully"
}
```
- **Response (400) - Failure:**
```json
{
  "message": "Invalid payment signature"
}
```
- **Security:** Signature verified using HMAC-SHA256

---

## 5. Analytics Routes (`/api/analytics`)

### Get Admin Statistics
- **Method:** `GET`
- **Endpoint:** `/api/analytics`
- **Description:** Retrieve dashboard statistics for admin
- **Access:** Protected (Admin only)
- **Headers:** `Authorization: Bearer <token>`
- **Response (200):**
```json
{
  "totalUsers": 150,
  "totalOrders": 1250,
  "totalProducts": 300,
  "totalRevenue": 125000.50
}
```
- **Metrics Included:**
  - Total registered users
  - Total orders placed
  - Total products available
  - Total revenue generated

---

## Tech Stack

### Backend Framework
- **Express.js** (v5.2.1) - Web application framework
- **Node.js** - JavaScript runtime

### Database
- **MongoDB** - NoSQL database
- **Mongoose** (v9.7.3) - MongoDB ODM

### Authentication & Security
- **JWT (jsonwebtoken)** (v9.0.3) - Token-based authentication
- **bcryptjs** (v3.0.3) - Password hashing

### Payment Integration
- **Razorpay** (v2.9.6) - Payment gateway

### File & Image Management
- **Multer** (v2.2.0) - File upload middleware
- **Cloudinary** (v2.10.0) - Cloud image storage

### Email Service
- **Nodemailer** (v9.0.3) - Email sending utility

### Development Tools
- **Nodemon** (v3.1.14) - Auto-restart on file changes
- **Archiver** (v6.0.0) - ZIP file creation

### Environment Management
- **dotenv** (v17.4.2) - Environment variable loader

### API Utilities
- **CORS** (v2.8.6) - Cross-Origin Resource Sharing

---

## Database Models

### User Model
```json
{
  "_id": ObjectId,
  "name": String,
  "email": String (unique),
  "password": String (hashed),
  "role": String (default: "user", values: ["user", "admin"]),
  "createdAt": Timestamp
}
```

### Product Model
```json
{
  "_id": ObjectId,
  "name": String,
  "description": String,
  "price": Number,
  "category": String,
  "stock": Number,
  "imagesUrl": String,
  "createdAt": Timestamp,
  "updatedAt": Timestamp
}
```

### Order Model
```json
{
  "_id": ObjectId,
  "user": ObjectId (ref: User),
  "items": [
    {
      "productId": ObjectId (ref: Product),
      "quantity": Number,
      "price": Number
    }
  ],
  "totalAmount": Number,
  "address": String,
  "status": String (default: "pending"),
  "paymentId": String,
  "createdAt": Timestamp,
  "updatedAt": Timestamp
}
```

---

## Authentication

### JWT Token
- **Method:** Token-based authentication
- **Token Location:** Request header
- **Header Format:** `Authorization: Bearer <token>`
- **Token Expiry:** 30 days
- **Usage:** Include in protected routes

### Middleware
- **`authMiddleware`** - Verifies JWT token
- **`adminMiddleware`** - Checks if user has admin role

### Protected Routes
Routes requiring authentication include a `protect` middleware that validates the JWT token.

---

## Error Handling

### Common HTTP Status Codes

| Status | Meaning |
|--------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid input data |
| 401 | Unauthorized - Authentication required/failed |
| 404 | Not Found - Resource not found |
| 500 | Internal Server Error - Server-side error |

### Error Response Format
```json
{
  "message": "Error description"
}
```

---

## CORS Configuration

The backend is configured with CORS enabled for cross-origin requests. This allows the frontend to communicate with the backend API.

---

## Contributing

This project is part of the ShopNest e-commerce platform.

---

## Support

For issues or questions, please refer to the project documentation or contact the development team.

---

**Last Updated:** January 2024
**Version:** 1.0.0
