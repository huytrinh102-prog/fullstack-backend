# Fullstack Backend API

Node.js / Express / MySQL を使用した  
フルスタックWebアプリケーションのバックエンドAPIです。

RESTful API, JWT Authentication, Role-based Authorization,
Cloudinary Upload, Google Login などを実装しています。

---

## Features

- JWT Authentication
- Refresh Token Authentication
- Role-based Authorization
- User CRUD
- Search / Pagination / Sorting
- Cloudinary Avatar Upload
- Google Login
- Sequelize ORM
- RESTful API
- Deploy Ready (Render + Railway)

---

## Tech Stack

- Node.js
- Express.js
- MySQL
- Sequelize
- JWT
- Cloudinary
- Railway
- Render

---

## Project Structure

```bash
src/
├── config/
├── controllers/
├── middleware/
├── migrations/
├── models/
├── routes/
├── services/
└── server.js
Environment Variables

Create .env

PORT=8080

jwtKey=your_secret_key

# MySQL
MYSQLHOST=127.0.0.1
MYSQLPORT=3306
MYSQLUSER=root
MYSQLPASSWORD=
MYSQLDATABASE=jwt

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
Installation
npm install
Run Project
npm start
Database Migration
npx sequelize-cli db:migrate

Production:

npx sequelize-cli db:migrate --env production
API Base URL
/api/v1
Authentication Flow
Access Token (JWT)
Refresh Token
Protected Routes
Role-based Permissions
Main APIs
Authentication
POST /register
POST /login
POST /google-login
GET /account
Users
GET /user-read
POST /user-create
PUT /user-update/:id
DELETE /user-delete/:id
Roles
GET /role-read
POST /role-create
PUT /role-update/:id
DELETE /role-delete/:id
Deployment
Backend
Render
Database
Railway MySQL
CORS / Cookie Notes

If frontend and backend use different domains:

credentials: true
sameSite: "none"
secure: true
Frontend Repository

Frontend is built with React + Redux Toolkit.

Author

Huy Trinh
