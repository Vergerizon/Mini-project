# 📘 DigiWallet PPOB API Documentation

## Table of Contents
1. [API Endpoints](#api-endpoints)
2. [Transaction Flow](#transaction-flow)
3. [Design Decisions](#design-decisions)

---

# 📡 API Endpoints

## Base URL
```
http://localhost:3000/api
```

## Response Format
Semua response menggunakan format JSON standar:

### Success Response
```json
{
  "success": true,
  "message": "Pesan sukses",
  "data": { ... },
  "timestamp": "2026-01-26T10:00:00.000Z"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Pesan error",
  "timestamp": "2026-01-26T10:00:00.000Z"
}
```

### Validation Error Response
```json
{
  "success": false,
  "message": "Validasi gagal",
  "errors": [
    {
      "field": "email",
      "message": "Format email tidak valid",
      "value": "invalid-email"
    },
    {
      "field": "name",
      "message": "Nama wajib diisi",
      "value": ""
    }
  ],
  "timestamp": "2026-01-26T10:00:00.000Z"
}
```

### Paginated Response
```json
{
  "success": true,
  "message": "Data fetched successfully",
  "data": [ ... ],
  "pagination": {
    "totalItems": 100,
    "totalPages": 10,
    "currentPage": 1,
    "itemsPerPage": 10,
    "hasNextPage": true,
    "hasPrevPage": false
  },
  "timestamp": "2026-01-26T10:00:00.000Z"
}
```

## HTTP Status Codes
| Code | Keterangan |
|------|------------|
| 200 | OK - Request berhasil |
| 201 | Created - Resource berhasil dibuat |
| 400 | Bad Request - Validasi gagal / request tidak valid |
| 404 | Not Found - Resource tidak ditemukan |
| 409 | Conflict - Duplikasi data (email sudah ada, dll) |
| 422 | Unprocessable Entity - Data tidak dapat diproses |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error - Kesalahan server |

---

## 👤 Users Endpoints

### 1. Create User
```http
POST /api/users
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone_number": "081234567890"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "User berhasil dibuat",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone_number": "081234567890",
    "balance": "0.00",
    "created_at": "2026-01-26T10:00:00.000Z",
    "updated_at": "2026-01-26T10:00:00.000Z"
  },
  "timestamp": "2026-01-26T10:00:00.000Z"
}
```

**Error - Validation Failed (400):**
```json
{
  "success": false,
  "message": "Validasi gagal",
  "errors": [
    { "field": "name", "message": "Nama wajib diisi", "value": "" },
    { "field": "email", "message": "Format email tidak valid", "value": "invalid" }
  ],
  "timestamp": "2026-01-26T10:00:00.000Z"
}
```

**Error - Email Already Exists (409):**
```json
{
  "success": false,
  "message": "Email sudah terdaftar",
  "timestamp": "2026-01-26T10:00:00.000Z"
}
```

---

### 2. Get All Users
```http
GET /api/users?page=1&limit=10
```

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | integer | 1 | Halaman |
| limit | integer | 10 | Jumlah data per halaman (max: 100) |

**Success Response (200):**
```json
{
  "success": true,
  "message": "Daftar user berhasil diambil",
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "phone_number": "081234567890",
      "balance": "500000.00",
      "created_at": "2026-01-26T10:00:00.000Z",
      "updated_at": "2026-01-26T10:00:00.000Z"
    },
    {
      "id": 2,
      "name": "Jane Smith",
      "email": "jane@example.com",
      "phone_number": "081234567891",
      "balance": "250000.00",
      "created_at": "2026-01-26T10:00:00.000Z",
      "updated_at": "2026-01-26T10:00:00.000Z"
    }
  ],
  "pagination": {
    "totalItems": 3,
    "totalPages": 1,
    "currentPage": 1,
    "itemsPerPage": 10,
    "hasNextPage": false,
    "hasPrevPage": false
  },
  "timestamp": "2026-01-26T10:00:00.000Z"
}
```

**Error - Invalid Query (400):**
```json
{
  "success": false,
  "message": "Validasi gagal",
  "errors": [
    { "field": "page", "message": "Page harus angka positif", "value": "-1" },
    { "field": "limit", "message": "Limit harus 1-100", "value": "500" }
  ],
  "timestamp": "2026-01-26T10:00:00.000Z"
}
```

---

### 3. Get User by ID
```http
GET /api/users/:id
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Data user berhasil diambil",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone_number": "081234567890",
    "balance": "500000.00",
    "created_at": "2026-01-26T10:00:00.000Z",
    "updated_at": "2026-01-26T10:00:00.000Z"
  },
  "timestamp": "2026-01-26T10:00:00.000Z"
}
```

**Error - User Not Found (404):**
```json
{
  "success": false,
  "message": "User tidak ditemukan",
  "timestamp": "2026-01-26T10:00:00.000Z"
}
```

**Error - Invalid ID (400):**
```json
{
  "success": false,
  "message": "Validasi gagal",
  "errors": [
    { "field": "id", "message": "ID user tidak valid", "value": "abc" }
  ],
  "timestamp": "2026-01-26T10:00:00.000Z"
}
```

---

### 4. Update User
```http
PUT /api/users/:id
```

**Request Body:**
```json
{
  "name": "John Updated",
  "phone_number": "081999888777"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "User berhasil diupdate",
  "data": {
    "id": 1,
    "name": "John Updated",
    "email": "john@example.com",
    "phone_number": "081999888777",
    "balance": "500000.00",
    "created_at": "2026-01-26T10:00:00.000Z",
    "updated_at": "2026-01-26T12:00:00.000Z"
  },
  "timestamp": "2026-01-26T12:00:00.000Z"
}
```

**Error - User Not Found (404):**
```json
{
  "success": false,
  "message": "User tidak ditemukan",
  "timestamp": "2026-01-26T10:00:00.000Z"
}
```

**Error - Validation Failed (400):**
```json
{
  "success": false,
  "message": "Validasi gagal",
  "errors": [
    { "field": "phone_number", "message": "Nomor telepon harus 10-15 digit", "value": "123" }
  ],
  "timestamp": "2026-01-26T10:00:00.000Z"
}
```

---

### 5. Delete User
```http
DELETE /api/users/:id
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "User berhasil dihapus",
  "data": null,
  "timestamp": "2026-01-26T10:00:00.000Z"
}
```

**Error - User Not Found (404):**
```json
{
  "success": false,
  "message": "User tidak ditemukan",
  "timestamp": "2026-01-26T10:00:00.000Z"
}
```

**Error - User Has Transactions (400):**
```json
{
  "success": false,
  "message": "User tidak dapat dihapus karena sudah memiliki transaksi",
  "timestamp": "2026-01-26T10:00:00.000Z"
}
```

---

### 6. Top Up Balance
```http
POST /api/users/:id/topup
```

**Request Body:**
```json
{
  "amount": 100000
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Top up berhasil",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone_number": "081234567890",
    "balance": "600000.00",
    "previous_balance": "500000.00",
    "top_up_amount": "100000.00"
  },
  "timestamp": "2026-01-26T10:00:00.000Z"
}
```

**Error - User Not Found (404):**
```json
{
  "success": false,
  "message": "User tidak ditemukan",
  "timestamp": "2026-01-26T10:00:00.000Z"
}
```

**Error - Invalid Amount (400):**
```json
{
  "success": false,
  "message": "Validasi gagal",
  "errors": [
    { "field": "amount", "message": "Jumlah top up tidak boleh negatif", "value": -50000 }
  ],
  "timestamp": "2026-01-26T10:00:00.000Z"
}
```

---

## 📦 Products Endpoints

### 1. Create Product
```http
POST /api/products
```

**Request Body:**
```json
{
  "name": "Pulsa 10.000",
  "category_id": 5,
  "type": "pulsa",
  "price": 11000,
  "description": "Pulsa All Operator Rp 10.000",
  "is_active": true
}
```

**Type Options:** `pulsa`, `data`, `pln`, `pdam`, `internet`, `game`, `ewallet`

**Success Response (201):**
```json
{
  "success": true,
  "message": "Produk berhasil dibuat",
  "data": {
    "id": 1,
    "name": "Pulsa 10.000",
    "category_id": 5,
    "type": "pulsa",
    "price": "11000.00",
    "description": "Pulsa All Operator Rp 10.000",
    "is_active": true,
    "created_at": "2026-01-26T10:00:00.000Z",
    "updated_at": "2026-01-26T10:00:00.000Z"
  },
  "timestamp": "2026-01-26T10:00:00.000Z"
}
```

**Error - Validation Failed (400):**
```json
{
  "success": false,
  "message": "Validasi gagal",
  "errors": [
    { "field": "name", "message": "Nama produk wajib diisi", "value": "" },
    { "field": "type", "message": "Tipe produk harus salah satu dari: pulsa, data, pln, pdam, internet, game, ewallet", "value": "invalid" },
    { "field": "price", "message": "Harga tidak boleh negatif", "value": -1000 }
  ],
  "timestamp": "2026-01-26T10:00:00.000Z"
}
```

**Error - Category Not Found (404):**
```json
{
  "success": false,
  "message": "Category tidak ditemukan",
  "timestamp": "2026-01-26T10:00:00.000Z"
}
```

---

### 2. Get All Products
```http
GET /api/products?page=1&limit=10&type=pulsa&is_active=true
```

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | integer | 1 | Halaman |
| limit | integer | 10 | Jumlah data per halaman |
| type | string | - | Filter by type (pulsa/data/pln/pdam/internet/game/ewallet) |
| is_active | boolean | - | Filter by active status (true/false) |
| category_id | integer | - | Filter by category |

**Success Response (200):**
```json
{
  "success": true,
  "message": "Daftar produk berhasil diambil",
  "data": [
    {
      "id": 1,
      "name": "Pulsa 10.000",
      "category_id": 5,
      "category_name": "Pulsa",
      "type": "pulsa",
      "price": "11000.00",
      "description": "Pulsa All Operator Rp 10.000",
      "is_active": true,
      "created_at": "2026-01-26T10:00:00.000Z",
      "updated_at": "2026-01-26T10:00:00.000Z"
    },
    {
      "id": 2,
      "name": "Pulsa 25.000",
      "category_id": 5,
      "category_name": "Pulsa",
      "type": "pulsa",
      "price": "26000.00",
      "description": "Pulsa All Operator Rp 25.000",
      "is_active": true,
      "created_at": "2026-01-26T10:00:00.000Z",
      "updated_at": "2026-01-26T10:00:00.000Z"
    }
  ],
  "pagination": {
    "totalItems": 20,
    "totalPages": 2,
    "currentPage": 1,
    "itemsPerPage": 10,
    "hasNextPage": true,
    "hasPrevPage": false
  },
  "timestamp": "2026-01-26T10:00:00.000Z"
}
```

---

### 3. Get Products by Type
```http
GET /api/products/type/:type
```

**Example:** `GET /api/products/type/pulsa`

**Success Response (200):**
```json
{
  "success": true,
  "message": "Daftar produk berhasil diambil",
  "data": [
    {
      "id": 1,
      "name": "Pulsa 10.000",
      "type": "pulsa",
      "price": "11000.00",
      "is_active": true
    },
    {
      "id": 2,
      "name": "Pulsa 25.000",
      "type": "pulsa",
      "price": "26000.00",
      "is_active": true
    }
  ],
  "timestamp": "2026-01-26T10:00:00.000Z"
}
```

**Error - Invalid Type (400):**
```json
{
  "success": false,
  "message": "Tipe produk tidak valid",
  "timestamp": "2026-01-26T10:00:00.000Z"
}
```

---

### 4. Get Product by ID
```http
GET /api/products/:id
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Data produk berhasil diambil",
  "data": {
    "id": 1,
    "name": "Pulsa 10.000",
    "category_id": 5,
    "category_name": "Pulsa",
    "type": "pulsa",
    "price": "11000.00",
    "description": "Pulsa All Operator Rp 10.000",
    "is_active": true,
    "created_at": "2026-01-26T10:00:00.000Z",
    "updated_at": "2026-01-26T10:00:00.000Z"
  },
  "timestamp": "2026-01-26T10:00:00.000Z"
}
```

**Error - Product Not Found (404):**
```json
{
  "success": false,
  "message": "Produk tidak ditemukan",
  "timestamp": "2026-01-26T10:00:00.000Z"
}
```

---

### 5. Update Product
```http
PUT /api/products/:id
```

**Request Body:**
```json
{
  "name": "Pulsa 15.000",
  "price": 16000,
  "description": "Pulsa All Operator Rp 15.000 Updated"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Produk berhasil diupdate",
  "data": {
    "id": 1,
    "name": "Pulsa 15.000",
    "category_id": 5,
    "type": "pulsa",
    "price": "16000.00",
    "description": "Pulsa All Operator Rp 15.000 Updated",
    "is_active": true,
    "created_at": "2026-01-26T10:00:00.000Z",
    "updated_at": "2026-01-26T12:00:00.000Z"
  },
  "timestamp": "2026-01-26T12:00:00.000Z"
}
```

**Error - Product Not Found (404):**
```json
{
  "success": false,
  "message": "Produk tidak ditemukan",
  "timestamp": "2026-01-26T10:00:00.000Z"
}
```

---

### 6. Delete Product
```http
DELETE /api/products/:id
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Produk berhasil dihapus",
  "data": null,
  "timestamp": "2026-01-26T10:00:00.000Z"
}
```

**Error - Product Not Found (404):**
```json
{
  "success": false,
  "message": "Produk tidak ditemukan",
  "timestamp": "2026-01-26T10:00:00.000Z"
}
```

**Error - Product Has Transactions (400):**
```json
{
  "success": false,
  "message": "Produk tidak dapat dihapus karena sudah memiliki transaksi",
  "timestamp": "2026-01-26T10:00:00.000Z"
}
```

---

### 7. Toggle Product Status
```http
PATCH /api/products/:id/toggle-status
```

**Success Response - Deactivated (200):**
```json
{
  "success": true,
  "message": "Produk berhasil dinonaktifkan",
  "data": {
    "id": 1,
    "name": "Pulsa 10.000",
    "is_active": false,
    "updated_at": "2026-01-26T12:00:00.000Z"
  },
  "timestamp": "2026-01-26T12:00:00.000Z"
}
```

**Success Response - Activated (200):**
```json
{
  "success": true,
  "message": "Produk berhasil diaktifkan",
  "data": {
    "id": 1,
    "name": "Pulsa 10.000",
    "is_active": true,
    "updated_at": "2026-01-26T12:00:00.000Z"
  },
  "timestamp": "2026-01-26T12:00:00.000Z"
}
```

**Error - Product Not Found (404):**
```json
{
  "success": false,
  "message": "Produk tidak ditemukan",
  "timestamp": "2026-01-26T10:00:00.000Z"
}
```

---

## 📂 Categories Endpoints

### 1. Create Category
```http
POST /api/categories
```

**Request Body:**
```json
{
  "name": "Top Up",
  "parent_id": null,
  "description": "Layanan isi ulang pulsa dan paket",
  "is_active": true
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Category berhasil dibuat",
  "data": {
    "id": 1,
    "name": "Top Up",
    "parent_id": null,
    "description": "Layanan isi ulang pulsa dan paket",
    "is_active": true,
    "created_at": "2026-01-26T10:00:00.000Z",
    "updated_at": "2026-01-26T10:00:00.000Z"
  },
  "timestamp": "2026-01-26T10:00:00.000Z"
}
```

**Create Sub-Category Request:**
```json
{
  "name": "Pulsa",
  "parent_id": 1,
  "description": "Isi ulang pulsa semua operator",
  "is_active": true
}
```

**Error - Validation Failed (400):**
```json
{
  "success": false,
  "message": "Validasi gagal",
  "errors": [
    { "field": "name", "message": "Nama category wajib diisi", "value": "" },
    { "field": "name", "message": "Nama category harus 2-100 karakter", "value": "A" }
  ],
  "timestamp": "2026-01-26T10:00:00.000Z"
}
```

**Error - Parent Category Not Found (404):**
```json
{
  "success": false,
  "message": "Parent category tidak ditemukan",
  "timestamp": "2026-01-26T10:00:00.000Z"
}
```

---

### 2. Get All Categories
```http
GET /api/categories?flat=false&is_active=true
```

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| flat | boolean | false | `true` = flat list, `false` = tree structure |
| is_active | boolean | - | Filter by active status |
| parent_id | integer/null | - | Filter by parent (use `null` for root categories) |

**Tree Response (flat=false) (200):**
```json
{
  "success": true,
  "message": "Daftar category berhasil diambil",
  "data": [
    {
      "id": 1,
      "name": "Top Up",
      "parent_id": null,
      "description": "Layanan isi ulang pulsa dan paket",
      "is_active": true,
      "children": [
        {
          "id": 5,
          "name": "Pulsa",
          "parent_id": 1,
          "description": "Isi ulang pulsa semua operator",
          "is_active": true,
          "children": []
        },
        {
          "id": 6,
          "name": "Paket Data",
          "parent_id": 1,
          "description": "Paket internet semua operator",
          "is_active": true,
          "children": []
        }
      ]
    },
    {
      "id": 2,
      "name": "Tagihan",
      "parent_id": null,
      "description": "Pembayaran tagihan bulanan",
      "is_active": true,
      "children": [
        {
          "id": 7,
          "name": "Listrik PLN",
          "parent_id": 2,
          "description": "Pembayaran dan token listrik PLN",
          "is_active": true,
          "children": []
        }
      ]
    }
  ],
  "timestamp": "2026-01-26T10:00:00.000Z"
}
```

**Flat Response (flat=true) (200):**
```json
{
  "success": true,
  "message": "Daftar category berhasil diambil",
  "data": [
    { "id": 1, "name": "Top Up", "parent_id": null, "is_active": true },
    { "id": 2, "name": "Tagihan", "parent_id": null, "is_active": true },
    { "id": 5, "name": "Pulsa", "parent_id": 1, "is_active": true },
    { "id": 6, "name": "Paket Data", "parent_id": 1, "is_active": true },
    { "id": 7, "name": "Listrik PLN", "parent_id": 2, "is_active": true }
  ],
  "timestamp": "2026-01-26T10:00:00.000Z"
}
```

---

### 3. Get Category by ID
```http
GET /api/categories/:id
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Data category berhasil diambil",
  "data": {
    "id": 5,
    "name": "Pulsa",
    "parent_id": 1,
    "parent_name": "Top Up",
    "description": "Isi ulang pulsa semua operator",
    "is_active": true,
    "created_at": "2026-01-26T10:00:00.000Z",
    "updated_at": "2026-01-26T10:00:00.000Z"
  },
  "timestamp": "2026-01-26T10:00:00.000Z"
}
```

**Error - Category Not Found (404):**
```json
{
  "success": false,
  "message": "Category tidak ditemukan",
  "timestamp": "2026-01-26T10:00:00.000Z"
}
```

---

### 4. Get Category with Products
```http
GET /api/categories/:id/products
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Data category dengan produk berhasil diambil",
  "data": {
    "id": 5,
    "name": "Pulsa",
    "parent_id": 1,
    "description": "Isi ulang pulsa semua operator",
    "is_active": true,
    "products": [
      {
        "id": 1,
        "name": "Pulsa 10.000",
        "type": "pulsa",
        "price": "11000.00",
        "description": "Pulsa All Operator Rp 10.000",
        "is_active": true
      },
      {
        "id": 2,
        "name": "Pulsa 25.000",
        "type": "pulsa",
        "price": "26000.00",
        "description": "Pulsa All Operator Rp 25.000",
        "is_active": true
      },
      {
        "id": 3,
        "name": "Pulsa 50.000",
        "type": "pulsa",
        "price": "51000.00",
        "description": "Pulsa All Operator Rp 50.000",
        "is_active": true
      }
    ],
    "total_products": 3
  },
  "timestamp": "2026-01-26T10:00:00.000Z"
}
```

**Error - Category Not Found (404):**
```json
{
  "success": false,
  "message": "Category tidak ditemukan",
  "timestamp": "2026-01-26T10:00:00.000Z"
}
```

---

### 5. Get Subcategories
```http
GET /api/categories/:id/subcategories
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Daftar subcategory berhasil diambil",
  "data": [
    {
      "id": 5,
      "name": "Pulsa",
      "parent_id": 1,
      "description": "Isi ulang pulsa semua operator",
      "is_active": true
    },
    {
      "id": 6,
      "name": "Paket Data",
      "parent_id": 1,
      "description": "Paket internet semua operator",
      "is_active": true
    }
  ],
  "timestamp": "2026-01-26T10:00:00.000Z"
}
```

**Empty Subcategories (200):**
```json
{
  "success": true,
  "message": "Daftar subcategory berhasil diambil",
  "data": [],
  "timestamp": "2026-01-26T10:00:00.000Z"
}
```

---

### 6. Get Category Path (Breadcrumb)
```http
GET /api/categories/:id/path
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Category path berhasil diambil",
  "data": [
    { "id": 1, "name": "Top Up" },
    { "id": 5, "name": "Pulsa" }
  ],
  "timestamp": "2026-01-26T10:00:00.000Z"
}
```

**Root Category Path (200):**
```json
{
  "success": true,
  "message": "Category path berhasil diambil",
  "data": [
    { "id": 1, "name": "Top Up" }
  ],
  "timestamp": "2026-01-26T10:00:00.000Z"
}
```

### 7. Update Category
```http
PUT /api/categories/:id
```

**Request Body:**
```json
{
  "name": "Top Up Updated",
  "description": "Layanan isi ulang pulsa dan paket - Updated"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Category berhasil diupdate",
  "data": {
    "id": 1,
    "name": "Top Up Updated",
    "parent_id": null,
    "description": "Layanan isi ulang pulsa dan paket - Updated",
    "is_active": true,
    "updated_at": "2026-01-26T12:00:00.000Z"
  },
  "timestamp": "2026-01-26T12:00:00.000Z"
}
```

### 8. Delete Category
```http
DELETE /api/categories/:id
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Category berhasil dihapus",
  "data": null,
  "timestamp": "2026-01-26T10:00:00.000Z"
}
```

**Error - Category Has Products (400):**
```json
{
  "success": false,
  "message": "Category tidak dapat dihapus karena memiliki produk",
  "timestamp": "2026-01-26T10:00:00.000Z"
}
```

### 9. Toggle Category Status
```http
PATCH /api/categories/:id/toggle-status
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Category berhasil dinonaktifkan",
  "data": {
    "id": 1,
    "name": "Top Up",
    "is_active": false
  },
  "timestamp": "2026-01-26T10:00:00.000Z"
}
```

---

## 💳 Transactions Endpoints

### 1. Create Transaction ⭐ (Main Feature)
```http
POST /api/transactions
```

**Headers:**
| Header | Required | Description |
|--------|----------|-------------|
| X-Idempotency-Key | Optional | UUID untuk mencegah double submit |
| Content-Type | Required | application/json |

**Request Body:**
```json
{
  "user_id": 1,
  "product_id": 1,
  "customer_number": "081234567890"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Transaksi berhasil",
  "data": {
    "id": 1,
    "user_id": 1,
    "product_id": 1,
    "customer_number": "081234567890",
    "amount": "11000.00",
    "status": "SUCCESS",
    "reference_number": "TRX1706266800000ABC123",
    "notes": null,
    "created_at": "2026-01-26T10:00:00.000Z",
    "updated_at": "2026-01-26T10:00:00.000Z",
    "user_name": "John Doe",
    "user_email": "john@example.com",
    "product_name": "Pulsa 10.000",
    "product_type": "pulsa"
  },
  "timestamp": "2026-01-26T10:00:00.000Z"
}
```

**Error - Insufficient Balance (400):**
```json
{
  "success": false,
  "message": "Saldo tidak mencukupi",
  "timestamp": "2026-01-26T10:00:00.000Z"
}
```

**Error - User Not Found (404):**
```json
{
  "success": false,
  "message": "User tidak ditemukan",
  "timestamp": "2026-01-26T10:00:00.000Z"
}
```

**Error - Product Not Found (404):**
```json
{
  "success": false,
  "message": "Produk tidak ditemukan",
  "timestamp": "2026-01-26T10:00:00.000Z"
}
```

**Error - Product Inactive (400):**
```json
{
  "success": false,
  "message": "Produk tidak aktif",
  "timestamp": "2026-01-26T10:00:00.000Z"
}
```

**Error - Duplicate Request / Processing (409):**
```json
{
  "success": false,
  "message": "Request dengan idempotency key yang sama sedang diproses",
  "timestamp": "2026-01-26T10:00:00.000Z"
}
```

**Error - Idempotent Response (Cached):**
```json
{
  "success": true,
  "message": "Transaksi berhasil",
  "data": { ... },
  "_idempotent": true,
  "_note": "Response dari cache, transaksi sudah diproses sebelumnya"
}
```

**Error - Validation Failed (400):**
```json
{
  "success": false,
  "message": "Validasi gagal",
  "errors": [
    { "field": "user_id", "message": "User ID wajib diisi", "value": null },
    { "field": "product_id", "message": "Product ID wajib diisi", "value": null },
    { "field": "customer_number", "message": "Nomor tujuan wajib diisi", "value": "" }
  ],
  "timestamp": "2026-01-26T10:00:00.000Z"
}
```

---

### 2. Get All Transactions
```http
GET /api/transactions?page=1&limit=10&status=SUCCESS
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| page | integer | Halaman (default: 1) |
| limit | integer | Jumlah per halaman (default: 10, max: 100) |
| user_id | integer | Filter by user |
| product_id | integer | Filter by product |
| status | string | `PENDING`, `SUCCESS`, `FAILED` |
| start_date | date | Filter mulai tanggal (YYYY-MM-DD) |
| end_date | date | Filter sampai tanggal (YYYY-MM-DD) |

**Success Response (200):**
```json
{
  "success": true,
  "message": "Daftar transaksi berhasil diambil",
  "data": [
    {
      "id": 1,
      "user_id": 1,
      "product_id": 1,
      "customer_number": "081234567890",
      "amount": "11000.00",
      "status": "SUCCESS",
      "reference_number": "TRX1706266800000ABC123",
      "notes": null,
      "created_at": "2026-01-26T10:00:00.000Z",
      "user_name": "John Doe",
      "product_name": "Pulsa 10.000",
      "product_type": "pulsa"
    },
    {
      "id": 2,
      "user_id": 1,
      "product_id": 5,
      "customer_number": "081234567890",
      "amount": "15000.00",
      "status": "SUCCESS",
      "reference_number": "TRX1706266900000DEF456",
      "notes": null,
      "created_at": "2026-01-26T10:30:00.000Z",
      "user_name": "John Doe",
      "product_name": "Data 1GB 30 Hari",
      "product_type": "data"
    }
  ],
  "pagination": {
    "totalItems": 50,
    "totalPages": 5,
    "currentPage": 1,
    "itemsPerPage": 10,
    "hasNextPage": true,
    "hasPrevPage": false
  },
  "timestamp": "2026-01-26T10:00:00.000Z"
}
```

**Empty Result (200):**
```json
{
  "success": true,
  "message": "Daftar transaksi berhasil diambil",
  "data": [],
  "pagination": {
    "totalItems": 0,
    "totalPages": 0,
    "currentPage": 1,
    "itemsPerPage": 10,
    "hasNextPage": false,
    "hasPrevPage": false
  },
  "timestamp": "2026-01-26T10:00:00.000Z"
}
```

---

### 3. Get Transaction by ID
```http
GET /api/transactions/:id
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Data transaksi berhasil diambil",
  "data": {
    "id": 1,
    "user_id": 1,
    "product_id": 1,
    "customer_number": "081234567890",
    "amount": "11000.00",
    "status": "SUCCESS",
    "reference_number": "TRX1706266800000ABC123",
    "notes": null,
    "created_at": "2026-01-26T10:00:00.000Z",
    "updated_at": "2026-01-26T10:00:00.000Z",
    "user_name": "John Doe",
    "user_email": "john@example.com",
    "product_name": "Pulsa 10.000",
    "product_type": "pulsa"
  },
  "timestamp": "2026-01-26T10:00:00.000Z"
}
```

**Error - Transaction Not Found (404):**
```json
{
  "success": false,
  "message": "Transaksi tidak ditemukan",
  "timestamp": "2026-01-26T10:00:00.000Z"
}
```

---

### 4. Get Transaction by Reference Number
```http
GET /api/transactions/reference/:reference
```

**Example:** `GET /api/transactions/reference/TRX1706266800000ABC123`

**Success Response (200):**
```json
{
  "success": true,
  "message": "Data transaksi berhasil diambil",
  "data": {
    "id": 1,
    "user_id": 1,
    "product_id": 1,
    "customer_number": "081234567890",
    "amount": "11000.00",
    "status": "SUCCESS",
    "reference_number": "TRX1706266800000ABC123",
    "notes": null,
    "created_at": "2026-01-26T10:00:00.000Z",
    "user_name": "John Doe",
    "product_name": "Pulsa 10.000",
    "product_type": "pulsa"
  },
  "timestamp": "2026-01-26T10:00:00.000Z"
}
```

**Error - Reference Not Found (404):**
```json
{
  "success": false,
  "message": "Transaksi dengan reference number tersebut tidak ditemukan",
  "timestamp": "2026-01-26T10:00:00.000Z"
}
```

---

### 5. Get Transactions by User
```http
GET /api/transactions/user/:userId
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Daftar transaksi user berhasil diambil",
  "data": [
    {
      "id": 1,
      "product_id": 1,
      "customer_number": "081234567890",
      "amount": "11000.00",
      "status": "SUCCESS",
      "reference_number": "TRX1706266800000ABC123",
      "created_at": "2026-01-26T10:00:00.000Z",
      "product_name": "Pulsa 10.000",
      "product_type": "pulsa"
    },
    {
      "id": 2,
      "product_id": 5,
      "customer_number": "081234567890",
      "amount": "15000.00",
      "status": "SUCCESS",
      "reference_number": "TRX1706266900000DEF456",
      "created_at": "2026-01-26T10:30:00.000Z",
      "product_name": "Data 1GB 30 Hari",
      "product_type": "data"
    }
  ],
  "pagination": {
    "totalItems": 10,
    "totalPages": 1,
    "currentPage": 1,
    "itemsPerPage": 10,
    "hasNextPage": false,
    "hasPrevPage": false
  },
  "timestamp": "2026-01-26T10:00:00.000Z"
}
```

**Error - User Not Found (404):**
```json
{
  "success": false,
  "message": "User tidak ditemukan",
  "timestamp": "2026-01-26T10:00:00.000Z"
}
```

---

### 6. Cancel Transaction
```http
POST /api/transactions/:id/cancel
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Transaksi berhasil dibatalkan dan saldo dikembalikan",
  "data": {
    "id": 1,
    "user_id": 1,
    "product_id": 1,
    "customer_number": "081234567890",
    "amount": "11000.00",
    "status": "FAILED",
    "reference_number": "TRX1706266800000ABC123",
    "notes": "Cancelled by user",
    "refunded_amount": "11000.00",
    "user_new_balance": "511000.00",
    "created_at": "2026-01-26T10:00:00.000Z",
    "updated_at": "2026-01-26T12:00:00.000Z"
  },
  "timestamp": "2026-01-26T12:00:00.000Z"
}
```

**Error - Transaction Not Found (404):**
```json
{
  "success": false,
  "message": "Transaksi tidak ditemukan",
  "timestamp": "2026-01-26T10:00:00.000Z"
}
```

**Error - Transaction Already Cancelled (400):**
```json
{
  "success": false,
  "message": "Transaksi sudah dibatalkan sebelumnya",
  "timestamp": "2026-01-26T10:00:00.000Z"
}
```

**Error - Transaction Cannot Be Cancelled (400):**
```json
{
  "success": false,
  "message": "Transaksi tidak dapat dibatalkan karena status bukan SUCCESS",
  "timestamp": "2026-01-26T10:00:00.000Z"
}
```

---

## 📊 Reports Endpoints

### 1. Dashboard Summary
```http
GET /api/reports/dashboard?start_date=2026-01-01&end_date=2026-01-31
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| start_date | date | No | Tanggal mulai (YYYY-MM-DD), default: 30 hari lalu |
| end_date | date | No | Tanggal akhir (YYYY-MM-DD), default: hari ini |

**Success Response (200):**
```json
{
  "success": true,
  "message": "Dashboard summary berhasil diambil",
  "data": {
    "total_users": 3,
    "total_products": 20,
    "active_products": 18,
    "total_categories": 15,
    "total_transactions": 150,
    "success_transactions": 140,
    "failed_transactions": 10,
    "pending_transactions": 0,
    "total_revenue": "15500000.00",
    "average_transaction": "110714.29",
    "period": {
      "start_date": "2026-01-01",
      "end_date": "2026-01-31"
    }
  },
  "timestamp": "2026-01-26T10:00:00.000Z"
}
```

---

### 2. User Transaction Summary
```http
GET /api/reports/users?start_date=2026-01-01&end_date=2026-01-31
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "User transaction summary berhasil diambil",
  "data": [
    {
      "user_id": 1,
      "user_name": "John Doe",
      "email": "john@example.com",
      "phone_number": "081234567890",
      "current_balance": "489000.00",
      "total_transactions": 50,
      "success_count": 48,
      "failed_count": 2,
      "pending_count": 0,
      "total_spent": "550000.00",
      "average_transaction": "11458.33",
      "last_transaction": "2026-01-26T10:00:00.000Z"
    },
    {
      "user_id": 2,
      "user_name": "Jane Smith",
      "email": "jane@example.com",
      "phone_number": "081234567891",
      "current_balance": "200000.00",
      "total_transactions": 30,
      "success_count": 28,
      "failed_count": 2,
      "pending_count": 0,
      "total_spent": "350000.00",
      "average_transaction": "12500.00",
      "last_transaction": "2026-01-25T15:30:00.000Z"
    }
  ],
  "timestamp": "2026-01-26T10:00:00.000Z"
}
```

---

### 3. Product Revenue Summary
```http
GET /api/reports/products?start_date=2026-01-01&end_date=2026-01-31
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Product revenue summary berhasil diambil",
  "data": [
    {
      "product_id": 1,
      "product_name": "Pulsa 10.000",
      "product_type": "pulsa",
      "category_name": "Pulsa",
      "price": "11000.00",
      "is_active": true,
      "total_sold": 100,
      "total_revenue": "1100000.00",
      "percentage_of_total": "7.10"
    },
    {
      "product_id": 2,
      "product_name": "Pulsa 25.000",
      "product_type": "pulsa",
      "category_name": "Pulsa",
      "price": "26000.00",
      "is_active": true,
      "total_sold": 80,
      "total_revenue": "2080000.00",
      "percentage_of_total": "13.42"
    },
    {
      "product_id": 9,
      "product_name": "Token PLN 20.000",
      "product_type": "pln",
      "category_name": "Listrik PLN",
      "price": "21500.00",
      "is_active": true,
      "total_sold": 50,
      "total_revenue": "1075000.00",
      "percentage_of_total": "6.94"
    }
  ],
  "timestamp": "2026-01-26T10:00:00.000Z"
}
```

---

### 4. Failed Transactions Report
```http
GET /api/reports/failed-transactions?start_date=2026-01-01&end_date=2026-01-31
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Failed transactions report berhasil diambil",
  "data": [
    {
      "id": 5,
      "user_id": 1,
      "user_name": "John Doe",
      "user_email": "john@example.com",
      "product_id": 4,
      "product_name": "Pulsa 100.000",
      "product_type": "pulsa",
      "customer_number": "081234567890",
      "amount": "101000.00",
      "status": "FAILED",
      "reference_number": "TRX1706267000000GHI789",
      "notes": "Saldo tidak mencukupi",
      "created_at": "2026-01-20T14:30:00.000Z"
    },
    {
      "id": 12,
      "user_id": 2,
      "user_name": "Jane Smith",
      "user_email": "jane@example.com",
      "product_id": 11,
      "product_name": "Token PLN 100.000",
      "product_type": "pln",
      "customer_number": "123456789012",
      "amount": "101500.00",
      "status": "FAILED",
      "notes": "Cancelled by user",
      "reference_number": "TRX1706267100000JKL012",
      "created_at": "2026-01-22T09:15:00.000Z"
    }
  ],
  "summary": {
    "total_failed": 10,
    "total_lost_revenue": "850000.00"
  },
  "timestamp": "2026-01-26T10:00:00.000Z"
}
```

---

### 5. Daily Transaction Summary
```http
GET /api/reports/daily?start_date=2026-01-01&end_date=2026-01-31
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Daily transaction summary berhasil diambil",
  "data": [
    {
      "date": "2026-01-26",
      "total_transactions": 25,
      "success_count": 23,
      "failed_count": 2,
      "pending_count": 0,
      "total_revenue": "1250000.00",
      "average_transaction": "54347.83"
    },
    {
      "date": "2026-01-25",
      "total_transactions": 30,
      "success_count": 28,
      "failed_count": 2,
      "pending_count": 0,
      "total_revenue": "1500000.00",
      "average_transaction": "53571.43"
    },
    {
      "date": "2026-01-24",
      "total_transactions": 22,
      "success_count": 21,
      "failed_count": 1,
      "pending_count": 0,
      "total_revenue": "980000.00",
      "average_transaction": "46666.67"
    }
  ],
  "summary": {
    "total_days": 26,
    "total_transactions": 650,
    "total_revenue": "32500000.00",
    "daily_average_revenue": "1250000.00"
  },
  "timestamp": "2026-01-26T10:00:00.000Z"
}
```

---

### 6. Health Check
```http
GET /api/health
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "DigiWallet PPOB API is running",
  "timestamp": "2026-01-26T10:00:00.000Z",
  "version": "1.0.0",
  "uptime": "2h 30m 45s",
  "environment": "development"
}
```

---

## 🚫 Common Error Responses

### Rate Limit Exceeded (429)
```json
{
  "success": false,
  "message": "Terlalu banyak request. Silakan coba lagi dalam 15 menit.",
  "timestamp": "2026-01-26T10:00:00.000Z"
}
```

### Internal Server Error (500)
```json
{
  "success": false,
  "message": "Terjadi kesalahan pada server",
  "timestamp": "2026-01-26T10:00:00.000Z"
}
```

### Invalid JSON Body (400)
```json
{
  "success": false,
  "message": "Request body tidak valid. Pastikan format JSON benar.",
  "timestamp": "2026-01-26T10:00:00.000Z"
}
```

### Route Not Found (404)
```json
{
  "success": false,
  "message": "Endpoint tidak ditemukan",
  "timestamp": "2026-01-26T10:00:00.000Z"
}
```

---

# 🔄 Transaction Flow

## Flow Diagram

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                        TRANSACTION FLOW DIAGRAM                               │
└──────────────────────────────────────────────────────────────────────────────┘

    ┌─────────┐         ┌──────────────────┐         ┌─────────────────┐
    │ Client  │─────────│   API Gateway    │─────────│   Controller    │
    │(Postman)│         │ (Express Server) │         │                 │
    └────┬────┘         └────────┬─────────┘         └────────┬────────┘
         │                       │                            │
         │  POST /transactions   │                            │
         │  + X-Idempotency-Key  │                            │
         │───────────────────────>                            │
         │                       │                            │
         │              ┌────────┴─────────┐                  │
         │              │   Idempotency    │                  │
         │              │   Middleware     │                  │
         │              └────────┬─────────┘                  │
         │                       │                            │
         │                       │ Check duplicate key        │
         │                       │─────────────┐              │
         │                       │             │              │
         │                       │<────────────┘              │
         │                       │                            │
         │                       │ If duplicate: return cached│
         │                       │ If new: proceed            │
         │                       │───────────────────────────>│
         │                       │                            │
         │                       │              ┌─────────────┴──────────────┐
         │                       │              │      Transaction           │
         │                       │              │        Service             │
         │                       │              └─────────────┬──────────────┘
         │                       │                            │
         │                       │              ┌─────────────┴──────────────┐
         │                       │              │    BEGIN TRANSACTION       │
         │                       │              │    (Database Level)        │
         │                       │              └─────────────┬──────────────┘
         │                       │                            │
         │                       │              ┌─────────────┴──────────────┐
         │                       │              │ 1. SELECT user FOR UPDATE  │
         │                       │              │    (Lock row to prevent    │
         │                       │              │     race condition)        │
         │                       │              └─────────────┬──────────────┘
         │                       │                            │
         │                       │              ┌─────────────┴──────────────┐
         │                       │              │ 2. Validate user exists    │
         │                       │              │    (if not: ROLLBACK)      │
         │                       │              └─────────────┬──────────────┘
         │                       │                            │
         │                       │              ┌─────────────┴──────────────┐
         │                       │              │ 3. SELECT product          │
         │                       │              │    Validate active         │
         │                       │              └─────────────┬──────────────┘
         │                       │                            │
         │                       │              ┌─────────────┴──────────────┐
         │                       │              │ 4. Validate balance        │
         │                       │              │    balance >= price?       │
         │                       │              │    (if not: ROLLBACK)      │
         │                       │              └─────────────┬──────────────┘
         │                       │                            │
         │                       │              ┌─────────────┴──────────────┐
         │                       │              │ 5. Generate reference      │
         │                       │              │    TRX{timestamp}{random}  │
         │                       │              └─────────────┬──────────────┘
         │                       │                            │
         │                       │              ┌─────────────┴──────────────┐
         │                       │              │ 6. UPDATE users            │
         │                       │              │    SET balance = balance   │
         │                       │              │    - product.price         │
         │                       │              └─────────────┬──────────────┘
         │                       │                            │
         │                       │              ┌─────────────┴──────────────┐
         │                       │              │ 7. INSERT transactions     │
         │                       │              │    status = 'SUCCESS'      │
         │                       │              └─────────────┬──────────────┘
         │                       │                            │
         │                       │              ┌─────────────┴──────────────┐
         │                       │              │       COMMIT               │
         │                       │              │    (All changes saved)     │
         │                       │              └─────────────┬──────────────┘
         │                       │                            │
         │                       │<───────────────────────────│
         │                       │                            │
         │   Response 201        │                            │
         │   Transaction Success │                            │
         │<──────────────────────│                            │
         │                       │                            │
```

## Step-by-Step Transaction Flow

### Step 1: Request Masuk
```
Client mengirim POST /api/transactions dengan body:
{
  "user_id": 1,
  "product_id": 1,
  "customer_number": "081234567890"
}
Header: X-Idempotency-Key: "unique-uuid-12345"
```

### Step 2: Idempotency Check
```javascript
// middleware/idempotency.js
1. Cek apakah key sudah ada di cache
2. Jika ada → return cached response (mencegah double submit)
3. Jika belum → acquire lock dan lanjut ke controller
```

### Step 3: Input Validation
```javascript
// utils/validator.js
1. Validate user_id (integer, required)
2. Validate product_id (integer, required)
3. Validate customer_number (string, required)
```

### Step 4: Business Logic (Service Layer)
```javascript
// services/transactionService.js

// BEGIN TRANSACTION
await connection.beginTransaction();

// 1. Lock user row (prevent race condition)
SELECT * FROM users WHERE id = ? FOR UPDATE;

// 2. Validate user exists
if (!user) throw "User tidak ditemukan";

// 3. Validate product exists & active
SELECT * FROM products WHERE id = ?;
if (!product.is_active) throw "Produk tidak aktif";

// 4. Validate balance
if (user.balance < product.price) throw "Saldo tidak mencukupi";

// 5. Generate reference number
const ref = "TRX" + timestamp + random;

// 6. Deduct balance
UPDATE users SET balance = balance - price WHERE id = user_id;

// 7. Create transaction record
INSERT INTO transactions (...) VALUES (...);

// COMMIT
await connection.commit();
```

### Step 5: Response
```json
{
  "success": true,
  "message": "Transaksi berhasil",
  "data": {
    "id": 1,
    "reference_number": "TRX1706266800000ABC123",
    "status": "SUCCESS",
    "amount": "11000.00"
  }
}
```

### Error Handling Flow
```
Any error during Step 4:
  ↓
ROLLBACK (semua perubahan dibatalkan)
  ↓
Return error response dengan status code yang sesuai
```

---

# 🎯 Design Decisions

## 1. Database Schema Design

### 1.1 Tabel `users`

```sql
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone_number VARCHAR(15) NULL,
    balance DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    ...
);
```

**Keputusan Desain:**

| Aspek | Keputusan | Alasan |
|-------|-----------|--------|
| `DECIMAL(15,2)` untuk balance | Bukan FLOAT/DOUBLE | Mencegah floating point error pada kalkulasi uang. DECIMAL menyimpan nilai exact, cocok untuk financial data |
| `email UNIQUE` | Constraint unique | Satu email = satu akun, mencegah duplikasi |
| `INDEX pada email & phone` | B-Tree index | Mempercepat pencarian user saat login/lookup |

### 1.2 Tabel `categories` (Hierarchical)

```sql
CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    parent_id INT NULL,
    CONSTRAINT fk_categories_parent FOREIGN KEY (parent_id) 
        REFERENCES categories(id) ON DELETE CASCADE
);
```

**Keputusan Desain:**

| Aspek | Keputusan | Alasan |
|-------|-----------|--------|
| Self-referencing FK | `parent_id → categories.id` | Memungkinkan struktur hierarki tanpa batas level (parent → child → grandchild) |
| `ON DELETE CASCADE` | Cascade delete | Menghapus parent category otomatis menghapus semua child |
| `parent_id NULL` | Nullable | NULL = root category (tidak punya parent) |

**Struktur Hierarki:**
```
Top Up (parent_id: NULL)
├── Pulsa (parent_id: 1)
├── Paket Data (parent_id: 1)

Tagihan (parent_id: NULL)
├── Listrik PLN (parent_id: 2)
├── PDAM (parent_id: 2)
```

### 1.3 Tabel `products`

```sql
CREATE TABLE products (
    type ENUM('pulsa', 'data', 'pln', 'pdam', 'internet', 'game', 'ewallet') NOT NULL,
    ...
    CONSTRAINT fk_products_category FOREIGN KEY (category_id) 
        REFERENCES categories(id) ON DELETE SET NULL
);
```

**Keputusan Desain:**

| Aspek | Keputusan | Alasan |
|-------|-----------|--------|
| `ENUM` untuk type | Bukan VARCHAR | Membatasi nilai yang valid, storage efisien (1-2 bytes vs variable) |
| `ON DELETE SET NULL` | Set NULL on category delete | Produk tetap ada walau kategori dihapus, tidak orphaned |
| Multiple indexes | type, price, category_id, is_active | Optimasi untuk berbagai filter query |

### 1.4 Tabel `transactions`

```sql
CREATE TABLE transactions (
    reference_number VARCHAR(50) UNIQUE NOT NULL,
    status ENUM('PENDING', 'SUCCESS', 'FAILED') DEFAULT 'PENDING',
    ...
    CONSTRAINT fk_transactions_user FOREIGN KEY (user_id) 
        REFERENCES users(id) ON DELETE RESTRICT
);
```

**Keputusan Desain:**

| Aspek | Keputusan | Alasan |
|-------|-----------|--------|
| `ON DELETE RESTRICT` | Tidak boleh hapus user dengan transaksi | Data integritas - transaksi adalah audit trail yang tidak boleh hilang |
| `reference_number UNIQUE` | Constraint unique | Setiap transaksi harus punya ID unik untuk tracking |
| `ENUM` untuk status | 3 status finite | State machine yang jelas: PENDING → SUCCESS/FAILED |
| Index pada created_at | B-Tree index | Optimasi untuk reporting berdasarkan tanggal |

---

## 2. Application Architecture

### 2.1 Layered Architecture

```
┌─────────────────────────────────────────┐
│              Routes Layer               │  ← Routing & Validation
├─────────────────────────────────────────┤
│           Controller Layer              │  ← HTTP Request/Response
├─────────────────────────────────────────┤
│            Service Layer                │  ← Business Logic
├─────────────────────────────────────────┤
│           Database Layer                │  ← Data Access
└─────────────────────────────────────────┘
```

**Alasan:**
- **Separation of Concerns**: Setiap layer punya tanggung jawab spesifik
- **Testability**: Business logic di service bisa ditest tanpa HTTP
- **Maintainability**: Perubahan di satu layer tidak mempengaruhi layer lain
- **Reusability**: Service bisa dipanggil dari multiple controllers

### 2.2 Connection Pooling

```javascript
// database/config.js
const pool = mysql.createPool({
    connectionLimit: 10,
    waitForConnections: true,
    queueLimit: 0
});
```

**Alasan:**
- **Performance**: Tidak perlu create/destroy connection setiap request
- **Resource Management**: Membatasi jumlah koneksi ke database
- **Concurrency**: Multiple requests bisa dilayani secara paralel

---

## 3. Transaction Safety (Race Condition Prevention)

### 3.1 Database Transaction + FOR UPDATE Lock

```javascript
// Acquire exclusive lock on user row
SELECT * FROM users WHERE id = ? FOR UPDATE;
```

**Alasan:**

```
Tanpa FOR UPDATE (Race Condition):
┌────────────────────────────────────────────────────────────────┐
│ Request A                    │ Request B                       │
│ Baca saldo: 100.000         │                                 │
│                             │ Baca saldo: 100.000             │
│ Cek: 100k >= 50k ✅         │                                 │
│                             │ Cek: 100k >= 60k ✅             │
│ Update: 100k - 50k = 50k    │                                 │
│                             │ Update: 100k - 60k = 40k        │
│ COMMIT                      │ COMMIT                          │
│                                                                │
│ Hasil: Saldo 40k (SALAH! Seharusnya B ditolak)                │
└────────────────────────────────────────────────────────────────┘

Dengan FOR UPDATE:
┌────────────────────────────────────────────────────────────────┐
│ Request A                    │ Request B                       │
│ SELECT ... FOR UPDATE       │                                 │
│ (Lock acquired)             │ SELECT ... FOR UPDATE           │
│ Baca saldo: 100.000         │ ⏳ WAITING (blocked by A)       │
│ Cek & Update: 50k           │ ⏳                               │
│ COMMIT (Release lock)       │                                 │
│                             │ (Lock acquired)                 │
│                             │ Baca saldo: 50.000              │
│                             │ Cek: 50k >= 60k ❌ DITOLAK     │
│                             │ ROLLBACK                        │
│                                                                │
│ Hasil: A sukses, B ditolak (BENAR!)                           │
└────────────────────────────────────────────────────────────────┘
```

### 3.2 Idempotency Key (Application Level)

```javascript
// Header: X-Idempotency-Key: "uuid-123"

// Jika key sudah diproses sebelumnya
if (cachedResponse) {
    return cachedResponse; // Return hasil yang sama
}

// Lock untuk concurrent requests dengan key yang sama
if (!acquireLock(key)) {
    return "Request sedang diproses";
}
```

**Alasan:**
- **Prevent Double Submit**: User klik tombol bayar 2x cepat
- **Network Retry Safety**: Client retry request, tapi transaksi sebelumnya sudah sukses
- **Consistency**: Request dengan key yang sama SELALU return hasil yang sama

---

## 4. Security Design

### 4.1 Rate Limiting

```javascript
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 menit
    max: 100 // max 100 request per IP
});
```

**Alasan:**
- Mencegah brute force attack
- Mencegah DDoS
- Fair usage untuk semua user

### 4.2 Input Validation

```javascript
body('email').isEmail().normalizeEmail()
body('price').isFloat({ min: 0 })
body('customer_number').matches(/^[0-9]{10,15}$/)
```

**Alasan:**
- Mencegah SQL Injection (parameterized queries)
- Mencegah invalid data masuk ke database
- Data sanitization

### 4.3 Helmet (Security Headers)

```javascript
app.use(helmet());
```

**Headers yang ditambahkan:**
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`

---

## 5. Error Handling Strategy

### 5.1 Centralized Error Response

```javascript
// utils/respons.js
const errorResponse = (res, message, statusCode = 500) => {
    return res.status(statusCode).json({
        success: false,
        message: message
    });
};
```

**Alasan:**
- Consistent error format untuk frontend
- Single point of error formatting
- Easy to add logging/monitoring

### 5.2 Transaction Rollback

```javascript
try {
    await connection.beginTransaction();
    // ... operations
    await connection.commit();
} catch (error) {
    await connection.rollback();
    throw error;
} finally {
    connection.release();
}
```

**Alasan:**
- **Atomicity**: Semua berhasil atau semua gagal
- **No partial state**: Tidak ada kondisi setengah jadi
- **Connection cleanup**: Release connection walaupun error

---

## Summary Design Principles

| Principle | Implementation |
|-----------|----------------|
| **Data Integrity** | Foreign keys, RESTRICT delete, DECIMAL for money |
| **Consistency** | Database transactions, FOR UPDATE locks |
| **Idempotency** | X-Idempotency-Key header middleware |
| **Security** | Rate limiting, input validation, helmet |
| **Scalability** | Connection pooling, indexes, pagination |
| **Maintainability** | Layered architecture, centralized responses |
| **Auditability** | Reference numbers, timestamps, status tracking |
