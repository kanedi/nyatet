# API Documentation (Server Actions)

This project uses Next.js Server Actions as the primary API layer. These functions are called directly from Client Components or Server Components to interact with the database.

## Authentication (`src/actions/auth.ts`)

| Action | Input | Output | Description |
| :--- | :--- | :--- | :--- |
| `login` | `prevState: any`, `formData: FormData` | `void` (redirects) or `{ message: string }` | Authenticates user via email/password. Uses custom JWT session cookie. |
| `logout` | `void` | `void` (redirects) | Clears session cookie and redirects to login. |

## Products (`src/actions/product.ts`)

These actions manage the product catalog for "UMKM" mode.

| Action | Input | Output | Description |
| :--- | :--- | :--- | :--- |
| `getProducts` | `organizationId: string` | `Promise<Product[]>` | Fetches all products for an organization. |
| `createProduct` | `{ organizationId, name, price, unit, isService, costPrice?, stock? }` | `{ success: boolean, data?: Product, error?: string }` | Creates a new product. |
| `updateProduct` | `id: string`, `{ name, price, unit, isService, costPrice?, stock? }` | `{ success: boolean, data?: Product, error?: string }` | Updates an existing product. |
| `deleteProduct` | `id: string` | `{ success: boolean, error?: string }` | Deletes a product. |

## Members / Warga (`src/actions/member.ts`)

Manage members (Warga/Pelanggan) for both "RT" and "UMKM" modes.

| Action | Input | Output | Description |
| :--- | :--- | :--- | :--- |
| `getMembers` | `organizationId: string` | `Promise<Member[]>` | Fetches all members. |
| `createMember` | `{ organizationId, name, phone?, address?, notes? }` | `{ success: boolean, data?: Member, error?: string }` | Creates a new member. |
| `updateMember` | `id: string`, `{ name, phone?, address?, notes? }` | `{ success: boolean, data?: Member, error?: string }` | Updates an existing member. |
| `deleteMember` | `id: string` | `{ success: boolean, error?: string }` | Deletes a member. |

## Transactions (`src/actions/transaction.ts`)

Handles POS transactions.

| Action | Input | Output | Description |
| :--- | :--- | :--- | :--- |
| `createTransaction` | `{ organizationId, memberId?, type: "INCOME"\|"EXPENSE", items: { productId, quantity, priceAtSale }[] }` | `{ success: boolean, data?: Transaction, error?: string }` | Records a transaction, calculates total, snapshots cost, and updates stock (if applicable). |
| `getTransactions` | `organizationId: string` | `Promise<Transaction[]>` | Fetches recent transactions with member and item details. |

## Reports (`src/actions/report.ts`)

Aggregates data for analytics.

| Action | Input | Output | Description |
| :--- | :--- | :--- | :--- |
| `getFinancialSummary` | `organizationId: string`, `period: "day"\|"month"`, `date: Date` | `Promise<FinancialSummary>` | Returns Revenue, Cost, Profit, and Transaction Count. |
| `getProductSalesSummary` | `organizationId: string`, `period: "day"\|"month"`, `date: Date` | `Promise<ProductSalesSummary[]>` | Returns quantity and revenue per product. |

## Bills / Iuran (`src/actions/bill.ts`)

Manages recurring bills or dues (primarily for "RT" mode).

| Action | Input | Output | Description |
| :--- | :--- | :--- | :--- |
| `getBills` | `organizationId: string` | `Promise<Bill[]>` | Fetches all bills. |
| `createBill` | `{ organizationId, memberId, period, amount }` | `{ success: boolean, data?: Bill, error?: string }` | Creates a bill record. |
| `updateBillStatus` | `id: string`, `status: BillStatus` | `{ success: boolean, data?: Bill, error?: string }` | Updates bill status (e.g., UNPAID -> PAID). |
