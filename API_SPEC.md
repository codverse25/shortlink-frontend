# API Spec - Shortlink Unira

Dokumen ini merangkum endpoint API backend untuk integrasi frontend.

## Base URL

- Development: `http://localhost:3000`

## Format Respons

### Sukses

```json
{
  "success": true,
  "message": "...",
  "data": {}
}
```

### Error

```json
{
  "success": false,
  "message": "...",
  "data": null
}
```

## Autentikasi

Endpoint yang berawalan `/links` membutuhkan JWT token.

Header yang harus dikirim:

```http
Authorization: Bearer <accessToken>
```

Token didapat dari endpoint login.

## Auth Endpoints

### 1. Register

`POST /auth/register`

#### Request Body

| Field    | Tipe   | Wajib | Keterangan         |
| -------- | ------ | ----- | ------------------ |
| name     | string | tidak | Nama user          |
| email    | string | ya    | Email valid        |
| password | string | ya    | Minimal 6 karakter |

#### Contoh Request

```json
{
  "name": "Budi",
  "email": "budi@example.com",
  "password": "password123"
}
```

#### Contoh Response

```json
{
  "success": true,
  "message": "Registrasi berhasil",
  "data": {
    "id": 1,
    "email": "budi@example.com",
    "name": "Budi",
    "createdAt": "2026-04-30T10:00:00.000Z"
  }
}
```

### 2. Login

`POST /auth/login`

#### Request Body

| Field    | Tipe   | Wajib | Keterangan    |
| -------- | ------ | ----- | ------------- |
| email    | string | ya    | Email valid   |
| password | string | ya    | Password user |

#### Contoh Request

```json
{
  "email": "budi@example.com",
  "password": "password123"
}
```

#### Contoh Response

```json
{
  "success": true,
  "message": "Login berhasil",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": 1,
      "email": "budi@example.com",
      "name": "Budi"
    }
  }
}
```

## Link Endpoints

Semua endpoint berikut membutuhkan JWT token, kecuali redirect publik.

### 1. Create Link

`POST /links`

#### Request Body

| Field       | Tipe              | Wajib | Keterangan              |
| ----------- | ----------------- | ----- | ----------------------- |
| url         | string            | ya    | URL tujuan, harus valid |
| title       | string            | tidak | Judul link              |
| description | string            | tidak | Deskripsi link          |
| expiredAt   | string (ISO date) | tidak | Tanggal expired         |

#### Contoh Request

```json
{
  "url": "https://example.com/landing-page",
  "title": "Landing Page",
  "description": "Halaman promo",
  "expiredAt": "2026-05-30T00:00:00.000Z"
}
```

#### Catatan

- `code` shortlink dibuat otomatis oleh server.
- Respons menyertakan `stats` dengan `totalClicks`.

### 2. Get All Links

`GET /links`

Mengambil semua link milik user yang sedang login.

#### Contoh Response

```json
{
  "success": true,
  "message": "Berhasil mengambil semua link",
  "data": [
    {
      "id": 1,
      "code": "aB12Cd",
      "originalUrl": "https://example.com/landing-page",
      "userId": 1,
      "title": "Landing Page",
      "description": "Halaman promo",
      "createdAt": "2026-04-30T10:10:00.000Z",
      "expiredAt": null,
      "isActive": true,
      "stats": {
        "linkId": 1,
        "totalClicks": 0,
        "lastClickedAt": null
      }
    }
  ]
}
```

### 3. Get Link by ID

`GET /links/:id`

Hanya bisa mengakses link milik user sendiri.

### 4. Update Link

`PATCH /links/:id`

#### Request Body

| Field       | Tipe              | Wajib | Keterangan           |
| ----------- | ----------------- | ----- | -------------------- |
| originalUrl | string            | tidak | URL tujuan baru      |
| isActive    | boolean           | tidak | Aktif atau nonaktif  |
| title       | string            | tidak | Judul baru           |
| description | string            | tidak | Deskripsi baru       |
| expiredAt   | string (ISO date) | tidak | Tanggal expired baru |

#### Catatan Penting

- Nama field update URL adalah `originalUrl`, bukan `url`.

### 5. Delete Link

`DELETE /links/:id`

Menghapus link milik user sendiri.

## Public Redirect

### Redirect Shortlink

`GET /:code`

Endpoint publik ini tidak membutuhkan login.

#### Perilaku

- Jika `code` valid, server akan redirect ke `originalUrl`.
- Server juga mencatat klik secara background.
- Jika link tidak ditemukan, nonaktif, atau expired, server mengembalikan JSON error.

#### Contoh Error

```json
{
  "success": false,
  "message": "Link tidak ditemukan",
  "data": null
}
```

## Validation Rules

- Register:
  - `email` harus valid.
  - `password` minimal 6 karakter.
- Login:
  - `email` harus valid.
- Create link:
  - `url` wajib valid.
  - `expiredAt` harus format tanggal valid jika diisi.
- Update link:
  - `originalUrl` wajib valid jika diisi.
  - `isActive` harus boolean.
  - `expiredAt` harus format tanggal valid jika diisi.

## Model Data Penting

### User

| Field     | Tipe           |
| --------- | -------------- |
| id        | number         |
| email     | string         |
| name      | string \| null |
| createdAt | string         |

### Link

| Field       | Tipe           |
| ----------- | -------------- |
| id          | number         |
| code        | string         |
| originalUrl | string         |
| userId      | number \| null |
| title       | string \| null |
| description | string \| null |
| createdAt   | string         |
| expiredAt   | string \| null |
| isActive    | boolean        |

### LinkStat

| Field         | Tipe           |
| ------------- | -------------- |
| linkId        | number         |
| totalClicks   | number         |
| lastClickedAt | string \| null |

## Frontend Flow

1. User register atau login.
2. Simpan `accessToken` dari login.
3. Kirim token di header `Authorization` untuk semua request `/links`.
4. Tampilkan daftar link dari `GET /links`.
5. Saat create link, gunakan `code` dari response untuk menampilkan URL pendek.
6. Untuk preview atau edit, ambil detail dari `GET /links/:id`.
7. Untuk akses publik, arahkan user ke `/:code`.

## Error yang Umum

- `401 Unauthorized`: token tidak ada, token salah, atau user tidak ditemukan.
- `403 Forbidden`: user mencoba akses link milik user lain.
- `404 Not Found`: link tidak ditemukan.
- `410 Gone`: link sudah expired.
- `409 Conflict`: email sudah digunakan saat register.
