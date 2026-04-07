# KenziemotoSport - E-Commerce Sparepart Motor

Aplikasi web e-commerce modern untuk penjualan sparepart motor dengan arsitektur MVC yang bersih, ringan, dan responsif.

## 🚀 Fitur Utama

### 🛠️ ROLE ADMIN
- **Dashboard**: Statistik ringkas (User, Produk, Pesanan).
- **User Management**: Lihat daftar pelanggan & hapus akun.
- **Product Management**: CRUD (Tambah, Edit, Hapus) produk dengan upload gambar.
- **Order & Payment Management**: 
  - Verifikasi bukti transfer (Confirm/Reject).
  - Update status pengiriman (Pending, Paid, Shipped, Completed, Rejected).

### 🏍️ ROLE USER
- **Auth**: Registrasi & Login pelanggan.
- **Shopping**: Katalog produk (Grid card modern), Detail produk.
- **Cart**: Tambah, Update Qty, & Hapus produk dari keranjang.
- **Checkout**: Sistem pesanan otomatis dengan status "Pending".
- **Order Tracking**: Upload bukti transfer & pantau status pesanan secara real-time.

---

## 🛠️ Teknologi yang Digunakan

- **Backend**: Node.js & Express.js
- **View Engine**: EJS (Server-side rendering)
- **Database**: MySQL (Akses via `mysql2/promise`)
- **Styling**: Tailwind CSS via CDN (Modern & Lightweight)
- **Session**: `express-session` for auth & cart management.
- **Upload**: `multer` (Product images & Payment proofs).

---

## 📂 Struktur Folder (MVC)

```text
kenzie/
├── config/             # DB Connection
├── controllers/        # Business Logic
├── middlewares/        # Auth & Upload Middlewares
├── models/             # (DB Tables handled via MySQL2 in controllers)
├── public/             # Static files & Uploads
│   └── uploads/        # Product & Payment images
├── routes/             # Route definitions
├── scripts/            # Database Seeding
├── sql/                # MySQL Schema
├── views/              # EJS Templates
└── app.js              # Entry Point
```

---

## ⚙️ Cara Install & Jalankan

### 1. Clone & Install Dependencies
```bash
cd kenzie
npm install
```

### 2. Setup Database
1. Buat database di MySQL dengan nama `kenziemoto`.
2. Import file SQL dari `sql/schema.sql` ke database tersebut.
3. Konfigurasi file `.env` (isi `DB_USER` dan `DB_PASS` sesuai MySQL Anda).

### 3. Seed Admin (Opsional)
Jalankan script berikut untuk membuat akun admin default:
```bash
node scripts/seed-admin.js
```
*Email: admin@kenzie.com | Password: admin123*

### 4. Jalankan Aplikasi
```bash
npm start
```
Buka di browser: `http://localhost:3000`

---

## 🎨 UI Highlight
- Menggunakan tema warna **Purple** (Ungu) yang solid dan modern.
- Tipografi **Poppins** dari Google Fonts.
- Komponen card dengan efek **hover:scale-105** dan bayangan yang premium.
- Sidebar Dashboard Admin yang sederhana namun fungsional.

---
**KenziemotoSport** - *Performa Motor Anda, Prioritas Kami.*
