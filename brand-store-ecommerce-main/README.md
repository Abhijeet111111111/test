# Brand Store — Premium Footwear E-Commerce

**Brand Store** is a full-stack e-commerce web application dedicated to curated and authenticated premium footwear from the world's top brands (e.g., Adidas, New Balance, Reebok, Woodland, Bugatti, Prada, Cole Haan, Zara, and U.S. Polo Assn.). 

Designed with a sleek, high-end visual aesthetic, the application features glassmorphism, curated dark/light color schemes, fluid micro-animations (via Framer Motion), dynamic catalog filtering, and robust checkout/payment integrations (Stripe, Razorpay, and Dynamic UPI QR Codes).

---

## 🚀 Live Repository
This repository is configured as a monorepo containing both the frontend client and the backend server.
GitHub Repository: [https://github.com/nilesh0002/Brand-Store](https://github.com/nilesh0002/Brand-Store)

---

## 🛠️ Tech Stack & Key Features

### 💻 Frontend (Next.js & React)
* **Framework**: Next.js 16 (React 19 App Router)
* **Styling**: Tailwind CSS (PostCSS)
* **Animations**: Framer Motion
* **State Management**: Redux Toolkit (managing shopping cart, wishlist, auth state, and interface toggles)
* **Components**: `@base-ui/react` (Accessible, unstyled components for select lists, checklists, sheets, and slider ranges)
* **Key Features**:
  * **API-Connected Authentication & Checkout**: Frontend forms (Login, Register, and Checkout) are fully wired up to the Express/MongoDB backend via an interceptor-enabled Axios client. JWT auth tokens are automatically managed in LocalStorage and attached to request headers.
  * **Dynamic UPI QR Code Payment**: Dynamic generation of transaction QR codes at checkout featuring local currency formatting and real-time total updates, along with click-to-copy UPI merchant VPA.
  * **Dynamic Catalog Filter**: Multi-select filtering by Brand, Sizes, Colors, and a slider range (₹0 - ₹50,000).
  * **Custom Category Pages**: Pre-filtered routes (e.g., `/category/sneakers`, `/category/boots`) featuring rich hero banners.
  * **Interactive Product Details**: Multi-image selector, size/color selectors, add to cart actions, and native HTML accordion summaries.
  * **Global Search Overlay**: Client-side fuzzy-search across the product catalog.

### ⚙️ Backend (Express & MongoDB)
* **Runtime**: Node.js & TypeScript (`tsx` for dev watch mode)
* **Framework**: Express.js
* **Database**: MongoDB (managed via Mongoose ODM)
* **Security & Auth**: JSON Web Tokens (JWT) with bearer authorization headers, bcryptjs password hashing, and Google OAuth.
* **API Integrations**:
  * **Stripe** (International Payments)
  * **Razorpay** (Domestic Indian Payments)
  * **UPI QR Payment** (Real-time dynamic merchant QR code generation)
  * **Cloudinary** (Dynamic product image hosting and scaling)
* **Key Features**:
  * Complete REST API architecture (Auth, Products, Brands, Categories, Cart, Wishlist, Coupons, Reviews, Orders).
  * Auto-seeding script to populate the local database with sample categories, brands, and premium mock products.
  * **Robust Schema Hooks & Error Logs**: Corrected asynchronous Mongoose pre-save password-hashing hooks and global error-handling logging middleware.

---

## 📁 Project Structure

```
Brand Store/
├── frontend/             # Next.js Frontend Client
│   ├── src/
│   │   ├── app/          # App Router Pages (Home, Shop, Category, Product Detail, Cart)
│   │   ├── components/   # UI elements (buttons, layout, slides)
│   │   ├── store/        # Redux store & slices (cart, wishlist, auth)
│   │   └── lib/          # Utilities (formatting, class mergers, api client)
│   └── package.json
│
├── backend/              # Node.js + Express + Mongoose Backend API
│   ├── src/
│   │   ├── config/       # Databases & Third-Party APIs (Cloudinary, Stripe, Razorpay)
│   │   ├── models/       # Mongoose Schemas (User, Product, Order, Brand, Category, etc.)
│   │   ├── routes/       # Express Router Endpoints
│   │   └── utils/        # Seeding and background scripts
│   ├── .env.example      # Example configuration keys
│   └── package.json
│
└── .gitignore            # Root git ignore patterns
```

---

## ⚙️ Getting Started

### Prerequisites
* **Node.js** (v18 or higher recommended)
* **MongoDB** (Running locally on default port `27017` or an active MongoDB Atlas URI)

---

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure Environment Variables:
   Create a `.env` file from the example template:
   ```bash
   cp .env.example .env
   ```
   *(Open `.env` and fill in your keys. By default, it will fall back to `http://localhost:3000` for client origins, port `5000` for API hosting, and local MongoDB `mongodb://localhost:27017/brand-store`)*.

4. **Seed the Database**:
   Populate MongoDB with default brands, categories, and premium shoe products:
   ```bash
   npm run seed
   ```
5. Start the backend development server:
   ```bash
   npm run dev
   ```
   *The backend will boot at **[http://localhost:5000](http://localhost:5000)** (Healthcheck route: `/api/health`)*.

> [!NOTE]
> Database seeding populates products, categories, and brands. Since mock users are not seeded, you must first register a new account on the frontend registration page (`/register`) to test login and authenticated checkout flows.

---

### 2. Frontend Setup

1. Open a new terminal window and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Next.js development server:
   ```bash
   npm run dev
   ```
   *The frontend website will boot at **[http://localhost:3000](http://localhost:3000)**.*

---

## 📜 Available Scripts

### Backend (`backend/`)
* `npm run dev`: Boots server via `tsx watch src/server.ts`
* `npm run seed`: Clears local collections and seeds product database
* `npm run build`: Compiles TypeScript to javascript (`dist/`)
* `npm run start`: Runs compiled production build (`node dist/server.js`)

### Frontend (`frontend/`)
* `npm run dev`: Starts Next.js development server
* `npm run build`: Bundles optimized production package
* `npm run start`: Runs production Next.js server locally
* `npm run lint`: Performs ESLint check on code syntax

---

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
