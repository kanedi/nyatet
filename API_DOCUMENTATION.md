# API Documentation

This project provides two ways to interact with the backend:
1.  **Server Actions**: For Next.js Frontend (Direct DB Access).
2.  **REST API**: For External Apps/Integrations (Protected by JWT).

## Authentication

### Login
**POST** `/api/login`
-   **Body**: `{ "email": "...", "password": "..." }`
-   **Response**: `{ "success": true, "token": "...", "user": { ... } }`

Include the token in all subsequent requests:
`Authorization: Bearer <TOKEN>`

---

## Standard REST Endpoints (`src/app/api/*`)

All endpoints below require Authentication.

### Products (`/api/products`)
-   `GET`: List products.
    - Path params: none
    - Query params: `organizationId` (required), `page` (default 1), `limit` (default 10), `q` (search term).
    - Response: `{ data: Product[], meta: { total, page, limit, totalPages } }`
-   `POST`: Create product. Body: `{ "organizationId", "name", "price", "unit" ... }`

### Members (`/api/members`)
-   `GET`: List members.
    - Query params: `organizationId` (required), `page` (default 1), `limit` (default 10), `q` (search term).
    - Response: `{ data: Member[], meta: { total, page, limit, totalPages } }`
-   `POST`: Create member. Body: `{ "organizationId", "name", "phone" ... }`

### Transactions (`/api/transactions`)
-   `GET`: List transactions.
    - Query params: `organizationId` (required), `page` (default 1), `limit` (default 10), `q` (search term).
    - Response: `{ data: Transaction[], meta: { total, page, limit, totalPages } }`
-   `POST`: Create transaction. Body: `{ "organizationId", "type", "items": [...] }`

### Bills (`/api/bills`)
-   `GET`: List bills.
    - Query params: `organizationId` (required), `page` (default 1), `limit` (default 10), `q` (search term).
    - Response: `{ data: Bill[], meta: { total, page, limit, totalPages } }`
-   `POST`: Create/Update Bill.

### Reports (`/api/reports/*`)
-   `GET /financial?organizationId=...`: Revenue summary.
-   `GET /sales?organizationId=...`: Product sales summary.

### User Management (Admin Only) (`/api/admin/users`)
-   `GET`: List all users.
-   `POST`: Create user.
-   `DELETE ?id=...`: Delete user.

---

## Server Actions (`src/actions/*`)

Used internally by the Next.js Frontend.

### Auth (`auth.ts`)
-   `login`: Authenticates user & sets session cookie.
-   `logout`: Clears session.

### Organization (`organization.ts`)
-   `getOrganizationsAction`: List all orgs.
-   `createOrganizationAction`: Create new org (Super Admin).
-   `updateOrganizationAction`: Update org (Super Admin).
-   `deleteOrganizationAction`: Delete org (Super Admin).

### User (`user.ts`)
-   `createUserAction`: Create new user (Super Admin).
-   `updateUserAction`: Update user (Super Admin).
-   `deleteUserAction`: Delete user (Super Admin).

### Products (`product.ts`)
-   `getProducts(orgId, page, search)`, `createProduct`, `updateProduct`, `deleteProduct`.

### Members (`member.ts`)
-   `getMembers(orgId, page, search)`, `createMember`, `updateMember`, `deleteMember`.

### Transactions (`transaction.ts`)
-   `createTransaction`, `getTransactions(orgId, page, search)`.

### Bills (`bill.ts`)
-   `createBill`, `getBills(orgId, page, search)`, `updateBillStatus`, `generateMonthlyBills`.

### Reports (`report.ts`)
-   `getFinancialSummary`, `getProductSalesSummary`.
