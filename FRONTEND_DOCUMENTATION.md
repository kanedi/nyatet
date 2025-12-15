# Frontend Documentation

This project is built using **Next.js 16 (App Router)** with **TypeScript**, **Tailwind CSS**, and **shadcn/ui** components.

## Project Structure

```
src/
├── actions/        # Server Actions (API Layer)
├── app/            # Next.js App Router Pages
│   ├── dashboard/  # Protected Dashboard Routes
│   │   ├── layout.tsx  # Dashboard Sidebar & Layout
│   │   ├── page.tsx    # Main Dashboard (POS for UMKM, Overview for RT)
│   │   ├── laporan/    # Sales Reports
│   │   ├── produk/     # Product Management
│   │   ├── pelanggan/  # Customer/Member Management
│   │   ├── warga/      # Resident Management (RT Mode)
│   │   └── ...
│   ├── login/      # Auth Page
│   └── page.tsx    # Landing Page
├── components/     # React Components
│   ├── ui/         # Reusable UI Components (shadcn/ui)
│   └── ...         # Feature-specific components (e.g., TransactionForm)
└── lib/            # Utilities (Auth, Helpers)
```

## Key Technologies

-   **Framework**: Next.js 16
-   **Styling**: Tailwind CSS
-   **UI Library**: shadcn/ui (built on Radix UI primitives)
-   **Icons**: lucide-react
-   **Forms**: react-hook-form + zod
-   **Date Handling**: date-fns

## Key Components

### Feature Components

| Component | Description |
| :--- | :--- |
| `TransactionForm` | The POS interface. Handles adding items to cart and submitting transactions. |
| `ReportsView` | Client component for the Reports page, handing tab switching between Daily and Monthly views. |
| `EditProductDialog` | Modal for editing product details. |
| `EditMemberDialog` | Modal for editing member details. |

### UI Components (`src/components/ui`)

Reusable components following the shadcn/ui pattern:
-   `Button`, `Input`, `Label`, `Card`
-   `Table`: For data listing.
-   `Dialog`: For modals.
-   `Select`: For dropdowns.
-   `Tabs`: For tabbed interfaces.
-   `Form`: Wrapper for react-hook-form integration.

## Routing & Navigation

-   **Public Routes**: `/`, `/login`
-   **Protected Routes**: all routes under `/dashboard/*`
-   **Sidebar**: Defined in `src/app/dashboard/layout.tsx`. It dynamically renders links based on the user's `OrganizationType` (RT or UMKM).

## State Management

-   **Server State**: Managed via Next.js Server Components and Server Actions. `revalidatePath` is used to refresh data after mutations.
-   **Client State**: Local React state (`useState`) and `react-hook-form` for form handling.
