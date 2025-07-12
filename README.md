# 🧠 SyncSpace | Multiplayer Virtual Space

A real-time multiplayer metaverse web app inspired by Gather Town. Users can join shared spaces, walk around interactive 2D environments, and collaborate virtually. Built with **Next.js**, **Phaser**, **WebSockets**, and **PostgreSQL**, this project blends immersive frontend interaction with robust backend systems.

---

## 🎥 Demo

[Watch Demo](https://drive.google.com/file/d/16d1pv1sKPzJAwr-Yte2dhtVgIAM3mhsO/preview)


## 🚀 Features

* **Real-Time Multiplayer Movement** via WebSockets
* **Phaser-based 2D Arena** with tilemaps and dynamic avatars
* **Authentication** (Sign Up / Login / JWT-based)
* **Space Management** – create, join, and manage virtual spaces
* **Element Placement System** – place tables, chairs, and other objects
* **Movement Validation** – server-side checks for walkable tiles
* **Smooth Animation** – for all users (including others in real time)
* **Admin Controls** – create maps, elements and avatars
* **Monorepo Architecture** – separate frontend, backend, and shared modules

---

## 🧱 Tech Stack

### Frontend

* **Next.js** (React-based SSR)
* **Tailwind CSS**
* **Phaser.js** for map rendering and avatar movement
* **WebSocket Client**

### Backend

* **Node.js + Express**
* **WebSocket Server** (custom)
* **Prisma ORM** with **PostgreSQL**=-

### Dev Tools

* **Monorepo (Turborepo)**
* **ESLint, Prettier** for quality

---

## 📦 Project Structure

```
/apps
  /frontend         # Next.js frontend
  /http             # Express backend
  /ws               # WebSocket server

/packages
  /common      # Shared types & utilities (e.g. constants, schema)
  /db          # Database schema and migration files

```

---

## 🛠️ Running Locally

### Prerequisites

* Node.js >= 18
* PostgreSQL
* Docker (optional for database, you can also use online database links like NeonDB)

### 1. Clone the repo

```bash
git clone https://github.com/your-username/metavers.git
cd metavers
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup environment variables

Create `.env` files for `packages/db` and `packages/common`.

**Example for `common/db/.env`**

```env
DATABASE_URL=postgresql://user:password@localhost:5432/metavers
```

**Example for `packages/commo/n.env`**

```env
JWT_SECRET=your_secret_key
```

### 4. Start PostgreSQL and Migrate the database
**Run the below command in packages/db**
```env
npx prisma migrate dev
```

### 5. Run the dev environment

```bash
npm run dev  # Starts both frontend, backend and websokcet server concurrently
```

---

## 🌐 Live link

Coming soon...

---

## 🧩 TODOs

* [ ] Voice/Video chat integration
* [ ] Chat messaging
* [ ] Space permissions (private/public rooms)

---

## 🙋‍♂️ Author

Made with ❤️ by **Nikhil Kumar**

* Portfolio: [Link](https://portfolio-nywf.vercel.app/)
* Twitter: [Link](https://x.com/__NikhilKumar_)
* LinkedIn: [Link](https://www.linkedin.com/in/nikhilkumar17/)

---

## 📄 License

Well I can't stop you 🥰

