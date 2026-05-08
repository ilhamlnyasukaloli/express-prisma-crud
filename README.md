# 🚀 Express + Prisma CRUD API — User

A simple REST API for User management using **Node.js**, **Express**, and **Prisma ORM**.

---

## 🧰 Tech Stack

- Node.js
- Express.js
- Prisma ORM
- PostgreSQL / MySQL
- Express Validator

## ⚙️ Installation

### 1. Clone & install dependencies

```bash
git clone <repo-url>
cd express-prisma-crud
npm install
```

### 2. Environment configuration

```bash
cp .env.example .env
```

Edit the `.env` file and adjust the `DATABASE_URL`:

```env
# PostgreSQL
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/DB_NAME"

# Or MySQL
DATABASE_URL="mysql://USER:PASSWORD@localhost:3306/DB_NAME"

PORT=3000
```

### 3. Database setup

```bash
# Create and run migrations
npm run db:migrate

# Generate Prisma Client
npm run db:generate
```

### 4. Run the server

```bash
# Development (auto-reload)
npm run dev

# Production
npm start
```

Server runs at `http://localhost:3000`

---

## 📡 API Endpoints

Base URL: `http://localhost:3000/api`

### User

| Method   | Endpoint       | Description            | Body Required |
|----------|----------------|------------------------|---------------|
| `GET`    | `/users`       | Get all users          | —             |
| `GET`    | `/users/:id`   | Get user by ID         | —             |
| `POST`   | `/users`       | Create a new user      | ✅            |
| `PUT`    | `/users/:id`   | Update a user          | ✅ (optional) |
| `DELETE` | `/users/:id`   | Delete a user          | —             |

---

## 📋 Request & Response Examples

### ✅ GET /api/users

Optional query params: `page`, `limit`, `search`

```
GET /api/users?page=1&limit=10&search=john
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "USER",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "meta": {
    "total": 1,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

---

### ✅ GET /api/users/:id

```
GET /api/users/1
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "USER",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### ✅ POST /api/users

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password1",
  "role": "USER"
}
```

**Response `201`:**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "USER",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### ✅ PUT /api/users/:id

All fields are optional — only send the fields you want to update.

**Request Body:**
```json
{
  "name": "John Updated",
  "email": "john.new@example.com"
}
```

**Response `200`:**
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "id": 1,
    "name": "John Updated",
    "email": "john.new@example.com",
    "role": "USER",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-02T00:00:00.000Z"
  }
}
```

---

### ✅ DELETE /api/users/:id

```
DELETE /api/users/1
```

**Response `200`:**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

---

## ❌ Error Responses

| Status | Condition                    |
|--------|------------------------------|
| `400`  | Invalid ID                   |
| `404`  | User not found               |
| `409`  | Email already in use         |
| `422`  | Input validation failed      |
| `500`  | Internal server error        |

**Example validation error `422`:**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    { "field": "email", "message": "Invalid email format" },
    { "field": "password", "message": "Password must be at least 8 characters" }
  ]
}
```

---

## 🔑 Validation Rules

### POST /users
| Field      | Required | Rules                                                  |
|------------|----------|--------------------------------------------------------|
| `name`     | ✅       | 2–100 characters                                       |
| `email`    | ✅       | Valid email format, unique                             |
| `password` | ✅       | Min 8 characters, must contain uppercase & number     |
| `role`     | ❌       | `USER` or `ADMIN` (default: `USER`)                    |

### PUT /users/:id
All fields are optional, same rules as above.

---

## 🛠️ Scripts

| Command               | Description                              |
|-----------------------|------------------------------------------|
| `npm start`           | Run the server (production)              |
| `npm run dev`         | Run the server with nodemon              |
| `npm run db:migrate`  | Create & run database migrations         |
| `npm run db:generate` | Regenerate Prisma Client                 |
| `npm run db:studio`   | Open Prisma Studio (database GUI)        |
| `npm run db:reset`    | Reset database (delete all data)         |

---

## 📦 Dependencies

| Package             | Version  | Purpose                     |
|---------------------|----------|-----------------------------|
| `express`           | ^4.21.1  | Web framework               |
| `@prisma/client`    | ^5.22.0  | Database ORM                |
| `bcrypt`            | ^5.1.1   | Password hashing            |
| `express-validator` | ^7.2.0   | Input validation            |
| `dotenv`            | ^16.4.5  | Environment management      |
| `nodemon`           | ^3.1.7   | Auto-reload (dev)           |
| `prisma`            | ^5.22.0  | Prisma CLI (dev)            |

## 📄 License

MIT License
