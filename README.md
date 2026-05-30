# Tech Khabar - Hindi News Portal

Tech Khabar is a modern, responsive, professional, and SEO-optimized Hindi News website built on **Next.js 15**, **React 19**, and **Tailwind CSS**. It imports live articles dynamically from the RSS feed of `https://www.tazakhabare.in/` and provides an enterprise-grade backend service layer, comment moderation, and a fully featured admin dashboard.

---

## 🌟 Features

- **Dynamic Content Seeding**: Automatically pulls news articles, descriptions, featured images, and categories from `https://www.tazakhabare.in/feeds/` on server startup (with local offline fallback).
- **Service Layer Architecture**: Clean, modular structure decoupling database queries from Next.js Page views and API routes.
- **Dynamic Category Pages**: Dynamic routing for categories including General, India, World, Sports, Entertainment, and Technology News.
- **Advanced Admin Dashboard**:
  - Secure Login authentication using custom JWT tokens.
  - CRUD operations for Articles (Create, Edit, Delete, Draft state).
  - Category manager and live comment moderation.
  - Detailed analytics metrics (total articles, views, subscriber counts, and comments).
- **SEO & Performance Optimized**: Schema FAQ generation, fast static pre-rendering, custom meta tags, and semantic HTML structure.
- **Premium Design Aesthetics**: Smooth glassmorphism, responsive navigation, dark/light mode toggle with Theme Provider, and loading state animations.

---

## 📂 Project Directory Structure

```text
├── src/
│   ├── app/                    # Next.js App Router (Pages, API routes)
│   │   ├── admin/              # Admin login & dashboard views
│   │   ├── api/                # Backend Serverless JSON API Routes
│   │   ├── category/           # Dynamic category news listing
│   │   ├── news/               # Single news article detail page
│   │   ├── search/             # Global article search matching
│   │   ├── layout.tsx          # Root template & Providers wrapper
│   │   └── page.tsx            # Main Landing/Home Page
│   │
│   ├── components/             # Reusable UI React Components
│   │   ├── admin/              # Forms & managers for the dashboard
│   │   ├── features/           # Article cards, sharing, comments & FAQs
│   │   ├── layout/             # Navbar, Footer, Sidebar, News Ticker
│   │   └── ui/                 # Global contexts (e.g., ThemeProvider)
│   │
│   ├── lib/                    # Shared utilities & database client
│   │   ├── db.ts               # Mongoose DB connection pool handler
│   │   └── seeder.ts           # tazakhabare.in RSS Feed Importer
│   │
│   ├── models/                 # Mongoose Database schemas
│   └── services/               # Service Layer (Business logic & database CRUD)
```

---

## 💻 Local Setup & Installation

### Prerequisites

- **Node.js**: v18.x or v20+ recommended
- **MongoDB**: A running local MongoDB instance (`mongodb://localhost:27017`) or MongoDB Atlas URI.

### Steps

1. **Clone the Repository** (or move into the project directory):
   ```bash
   cd "d:/news website"
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a file named `.env.local` in the root folder with the following variables:
   ```env
   # MongoDB Connection
   MONGODB_URI=mongodb://localhost:27017/tech_khabar

   # JWT Secret (for Admin login token hashing)
   JWT_SECRET=your_secret_passphrase_here

   # Default Admin Credentials
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=admin123
   ```

4. **Run the Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your web browser. On initial load, the database will automatically fetch and import articles from tazakhabare.in.

5. **Access the Admin Dashboard**:
   - URL: `http://localhost:3000/admin/dashboard`
   - Log in using the `ADMIN_USERNAME` and `ADMIN_PASSWORD` credentials defined in your `.env.local`.

---

## 🚀 Live Deployment Guide

Follow these steps to make your news website live on **Vercel** with **MongoDB Atlas**:

### Step 1: Upload Project to GitHub

1. Create a new repository on your GitHub account.
2. Initialize Git, stage all files, and push them to your repository:
   ```bash
   git init
   git add .
   git commit -m "Initialize Tech Khabar news portal"
   git branch -M main
   git remote add origin https://github.com/yourusername/your-repo-name.git
   git push -u origin main
   ```

### Step 2: Set Up a Free Database on MongoDB Atlas

1. Sign up/log in at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Click **Create Database** and choose the **M0 Shared Free Tier**.
3. Create a database user (note down the username and password).
4. In **Network Access**, add IP address `0.0.0.0/0` to allow Vercel's serverless functions to connect to the database.
5. Go to your cluster dashboard, click **Connect**, select **Drivers**, and copy the connection string. It should look like this:
   `mongodb+srv://<username>:<password>@cluster0.xxxx.mongodb.net/tech_khabar?retryWrites=true&w=majority`
   Make sure to replace `<username>` and `<password>` with the database credentials you created.

### Step 3: Deploy on Vercel

1. Sign up/log in at [Vercel](https://vercel.com).
2. Click **Add New** -> **Project**.
3. Import your GitHub repository.
4. Expand the **Environment Variables** section and add the following keys:
   - `MONGODB_URI` = `mongodb+srv://<username>:<password>@cluster0.xxxx.mongodb.net/tech_khabar?retryWrites=true&w=majority`
   - `JWT_SECRET` = `(Generate a strong random string)`
   - `ADMIN_USERNAME` = `(Your preferred admin username)`
   - `ADMIN_PASSWORD` = `(Your preferred secure admin password)`
5. Click **Deploy**. Vercel will build and host your website.

---

## 🛠️ Verification & Maintenance

- **Typecheck & Linter**: Ensure production stability by running `npx tsc --noEmit` and `npm run lint`.
- **Production Build**: Test production optimization locally with `npm run build` and launch the local production bundle with `npm run start`.
