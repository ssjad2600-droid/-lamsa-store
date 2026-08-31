# Lamsa — Arabic E-Commerce Storefront for Beauty Products

A complete e-commerce storefront with a full Arabic right-to-left (RTL) interface for the beauty sector, paired with a fully separate admin dashboard that gives the store owner direct control over products, orders, and content — no developer required.

**Project status:** Both the storefront and admin dashboard are fully functional and currently populated with demo products for testing and demonstration purposes — not yet launched to real customers.

---

## Features

### Storefront (Customer-Facing)
- **Full Arabic RTL interface** — from product listing to checkout, everything right-to-left
- **Product browsing** — catalog listing, filtering, and search
- **Complete purchase flow** — from product selection through order completion
- **Responsive design** — consistent experience on mobile and desktop

### Admin Dashboard (Store Owner)
- **Fully separate dashboard** — direct access for the store owner only
- **Product management** — add, edit, delete without any developer involvement
- **Order management** — track incoming orders and their status
- **Content management** — full control over what customers see

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React, TypeScript, Vite |
| **Styling** | Tailwind CSS |
| **Backend & Database** | Firebase (Firestore, Authentication, Storage) |
| **Arabic/RTL** | Full RTL architecture across both storefront and admin interfaces |

---

## Requirements

- **Node.js** — 18 or later
- **npm** — comes with Node.js
- **Firebase project** — free at firebase.google.com

---

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
Copy the example file and fill in your Firebase project details:
```bash
cp .env.example .env.local
```

### 3. Run Development Server
```bash
npm run dev
```

---

## Security

- `.env` is excluded from the repository via `.gitignore`
- Firebase configuration is read exclusively from environment variables — no hardcoded values

---

## License

All rights reserved © Sajad Hussam Ali — 2026

---

## Contact

- **Email:** ssjad2600@gmail.com
- **GitHub:** github.com/ssjad2600-droid