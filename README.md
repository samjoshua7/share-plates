# Share Plates

### *If your table has more than enough, pass a little joy around. Good food is meant to be shared.*

This repository contains the project files for **Share Plates**, a food redistribution platform created during our college internal hackathon under the **Society & Social Care** category.

Our team secured **3rd Prize** in the competition.

The platform connects:

* **Store Owners** (who donate leftover food)
* **Shelters / Needy Organizations** (who request food)
* **Volunteers** (who deliver food)

The goal is to reduce **food waste** while helping people in need.

---

# Current Deployment Architecture

The project is currently being upgraded for **public deployment**.

We are moving from local development to a cloud architecture:

Frontend
Hosted on **Vercel**

Backend API
Hosted on **Render**

Database
Hosted on **MongoDB Atlas**

Architecture overview:

Users
↓
Frontend (Vercel)
↓
Backend API (Render)
↓
MongoDB Atlas Database

---

# Development Status

The project is actively being improved and stabilized for real-world usage.

Developers are currently working on:

* Fixing dashboard features for each user role
* Improving food request workflow
* Enhancing map integration
* Implementing realtime notifications
* Stabilizing volunteer delivery tracking
* Improving UI and accessibility
* Preparing the system for cloud deployment

---

# Environment Setup

Before starting development, ensure the following tools are installed:

* Node.js
* npm
* Git

---

# Important Notes

### Sensitive files

Never commit sensitive files.

Files like `.env` contain database credentials and secrets.

These files are already ignored by `.gitignore`.

Never upload `.env` to GitHub.

---

### Dependencies

`node_modules/` folders are ignored.

Install dependencies manually:

```
cd server
npm install

cd client
npm install
```

---

### Build outputs

The following folders are ignored:

```
dist/
build/
node_modules/
```

These files are generated automatically.

---

# Quick Start (React + MongoDB Test)

## 1. Backend Setup

Copy the example environment file:

```
server/.env.example → server/.env
```

Add your MongoDB connection string.

---

### Obtaining your MongoDB Atlas connection string

1. Log in to MongoDB Atlas
2. Select your project
3. Go to **Clusters**
4. Click **Connect**
5. Select **Connect your application**
6. Choose **Node.js**

Atlas will provide a connection string like:

```
mongodb+srv://<username>:<password>@cluster0.mongodb.net/mydatabase?retryWrites=true&w=majority
```

Replace:

* `<username>`
* `<password>`
* `mydatabase`

Example:

```
MONGO_URI=mongodb+srv://myUser:secret123@cluster0.mongodb.net/main?retryWrites=true&w=majority
```

Paste this into:

```
server/.env
```

---

### Start Backend Server

```
cd server
npm install
npm run dev
```

The API runs on:

```
http://localhost:5000
```

Available endpoints:

```
GET /
GET /api/users
```

---

## 2. Client Setup

```
cd client
npm install
npm run dev
```

Open:

```
http://localhost:5173
```

The page should load user data fetched from MongoDB.

---

## 3. Verification

Check:

Browser DevTools → Network tab
Backend console logs
MongoDB Atlas collections

If the database is empty, the backend automatically inserts a **sample user**.

---

# Contribution Guidelines

⚠ Important for contributors.

This repository uses **protected branches**.

The `main` branch **cannot be modified directly**.

---

## Correct Workflow

Never push directly to `main`.

Instead follow this process.

### 1 Create a feature branch

```
git checkout -b feature-your-change
```

### 2 Commit your changes

You may use VS Code commit tools.

```
git add .
git commit -m "describe your change"
```

### 3 Push your branch

```
git push origin feature-your-change
```

### 4 Create a Pull Request

Open a **Pull Request** on GitHub.

The repository owner will review and merge it.

---

# Important for AI Assisted Development

Many contributors may use AI tools.

If using AI:

* Do NOT modify core server configuration.
* Do NOT modify database schemas without discussion.
* Do NOT push directly to `main`.

AI generated code must still follow the **branch → PR → review** workflow.

---

# Common Mistakes to Avoid

Never commit:

```
.env
node_modules
dist
build
```

Never push directly to:

```
main
```

Always create a **feature branch first**.

---

# Future Roadmap

Upcoming improvements include:

* Smart food availability tracking
* Route optimization for volunteers
* Mobile responsive UI improvements
* Realtime delivery updates
* Food analytics dashboard
* Improved map-based request system

---

# Acknowledgement

This project was created during our college hackathon and continues to evolve as we improve it for real-world impact.

Food is meant to be shared.
Let's reduce waste and help communities together.
