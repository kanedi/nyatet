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
-   `GET ?organizationId=...`: List products.
-   `POST`: Create product. Body: `{ "organizationId", "name", "price", "unit" ... }`

### Members (`/api/members`)
-   `GET ?organizationId=...`: List members.
-   `POST`: Create member. Body: `{ "organizationId", "name", "phone" ... }`

### Transactions (`/api/transactions`)
-   `GET ?organizationId=...`: List transactions.
-   `POST`: Create transaction. Body: `{ "organizationId", "type", "items": [...] }`

### Bills (`/api/bills`)
-   `GET ?organizationId=...`: List bills.
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
-   `getProducts`, `createProduct`, `updateProduct`, `deleteProduct`.

### Members (`member.ts`)
-   `getMembers`, `createMember`, `updateMember`, `deleteMember`.

### Transactions (`transaction.ts`)
-   `createTransaction`, `getTransactions`.

### Reports (`report.ts`)
-   `getFinancialSummary`, `getProductSalesSummary`.
