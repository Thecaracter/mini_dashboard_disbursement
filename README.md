# Lintaspay Transaction Dashboard

Dashboard manajemen transaksi dengan autentikasi JWT, role-based access, dan server-side sorting.

## Cara Menjalankan

```bash
npm install
npm run dev
```

Akses di `http://localhost:3000`

## Kredensial Login untuk Testing

### Admin Role

- **Username:** `admin`
- **Password:** `admin123`

### Operator Role

- **Username:** `operator`
- **Password:** `operator123`

## Fitur yang Berhasil Diimplementasikan

### Autentikasi & Keamanan

- JWT-based authentication dengan JOSE library
- Route protection middleware (semua route protected kecuali /login)
- Token expiry 1 jam, auto-logout saat token expired
- Axios 401 interceptor untuk handle unauthorized requests

### Dashboard & Data Management

- Transaction listing dengan server-side pagination (10 items per page)
- Search by sender name (real-time)
- Filter by status (PENDING, SUCCESS, FAILED, APPROVED, REJECTED)
- Server-side sorting (click header untuk sort)
- Transaction detail modal
- CSV export untuk filtered data

### Role-Based UI

- Operator: Create transaction button
- Admin: Approve/Reject buttons (hanya PENDING status)

### Form & Validation

- Create transaction form dengan Zod validation
  - Sender name: 3-100 characters
  - Account number: 6-20 numeric digits
  - Bank: 9 options (BCA, BRI, BNI, Mandiri, BSI, CIMB Niaga, Permata, Danamon, BTN)
  - Amount: 10K-100M
  - Note: Optional, max 255 chars
- Real-time Rupiah formatting di amount input
- Admin fee auto-calculation (2.5K untuk <5M, 5K untuk ≥5M)

### UI/UX

- Neo-brutalist design (2px black borders, cream background)
- Responsive design (mobile-friendly)
- Loading states dengan animated spinner
- Error states dengan retry button
- Toast notifications (success/error)
- Confirmation dialogs untuk sensitive actions

### Data Persistence

- URL params persist (page, search, status, sortBy, order)
- Server-side caching (5 minutes)
- Cache invalidation on sort change

## Bonus Features

### Sortable Table Headers

- Click header untuk sort ascending/descending
- Visual indicators (↑↓ arrows)
- Sort semua kolom: ID, Pengirim, Bank, Jumlah, Admin, Tanggal
- URL params tracking (sortBy, order)
- Server-side sorting via MockAPI
- Toggle asc/desc dengan click ulang

### Advanced Features

- Logout functionality
- CSV export dengan RFC 4180 compliance
- Transaction detail modal dengan full info
- Confirm dialog untuk approve/reject
- Automatic page reset saat filter berubah

## Bagian yang Dibantu AI & Cara Review

### Fitur yang Dikerjakan dengan AI Assistance:

1. **Authentication System** (`src/hooks/useAuth.ts`, `src/middleware.ts`)
   - JWT token generation + verification
   - Route protection middleware
   - Cookie-based session management
   - **Review:** Login dengan kedua role, verify token expiry (1h), check middleware redirect saat token expired

2. **Data Fetching & Caching** (`src/api/transactions.ts`)
   - Server-side caching strategy (5 min)
   - Cache invalidation on sort change
   - MockAPI integration dengan sortBy/order params
   - **Review:** Monitor Network tab
     - Pertama kali load: API call ada
     - Refresh halaman: API call lagi (cache 5 min)
     - Klik sort header: API call baru dengan ?sortBy=x&order=y

3. **Sorting Implementation** (`src/hooks/useTransactions.ts`, `src/components/TransactionTable.tsx`)
   - URL state management untuk sort params
   - Query key factory untuk TanStack Query
   - Header click handlers + visual indicators (↑↓)
   - **Review:**
     - Klik "Jumlah" header → data urut by amount desc
     - Klik lagi → toggle asc, icon berubah
     - Refresh → sort state persist (via URL)

4. **Form Validation** (`src/components/CreateTransactionForm.tsx`)
   - Zod schema dengan custom rules
   - Real-time Rupiah formatting
   - Admin fee auto-calculation
   - **Review:**
     - Test invalid inputs (short name, non-numeric account)
     - Check amount displays as "Rp X.XXX.XXX" real-time
     - Verify admin fee: 2.5K untuk <5M, 5K untuk ≥5M

5. **UI/UX Components** (Loading, Error, Pagination)
   - Loading states dengan spinner
   - Error handling dengan retry
   - Pagination logic
   - Role-based conditional rendering
   - **Review:** Disable network, verify error state shows + retry works

## Tech Stack

- Next.js 16.2.9 (App Router, Turbopack)
- TypeScript (strict mode)
- TanStack React Query v5
- React Hook Form + Zod
- Axios
- JOSE (JWT HS256)
- Tailwind CSS

## Notes

- All routes protected except /login
- JWT secret: "lintaspay-secret-key-2024"
- API base: https://6a2bb86c3e2b60ab038eb30a.mockapi.io/api/v1
- Server-side caching: 5 minutes (cleared on sort change)
- Detailed code documentation in `penjelasan.md` (excluded from git)
