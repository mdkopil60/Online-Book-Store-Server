# 📚 Online Book Store Server

Backend API for the Online Book Store built with **Node.js**, **Express.js**, **TypeScript**, and **MongoDB**.

## 🚀 Features

- REST API
- MongoDB Integration
- CRUD Operations
- Book Management
- Cart API
- Admin Dashboard APIs
- Error Handling
- TypeScript Support

## 🛠 Tech Stack

- Node.js
- Express.js
- TypeScript
- MongoDB
- dotenv
- cors

## API Endpoints

### Books

```
GET /books
GET /books/:id
POST /books
PATCH /books/:id
DELETE /books/:id
```

### Cart

```
GET /cart
POST /cart
PATCH /cart/:id
DELETE /cart/:id
```

### Dashboard

```
GET /dashboard/stats
```

## Installation

```bash
git clone <server-repository-url>

cd Online-Book-Store-Server

npm install

npm run dev
```

Runs on

```
http://localhost:5000
```

## Environment Variables

Create `.env`

```
PORT=5000

MONGO_DB_URI=your_mongodb_connection_string
```

## Project Structure

```
src/
│
├── routes/
├── controllers/
├── middleware/
├── config/
└── index.ts
```

## Author

Kopil Uddin

Full Stack Developer