# Frontend Documentation

This project is built using **Next.js 16 (App Router)** with **TypeScript**, **Tailwind CSS**, and **shadcn/ui** components.

## Project Structure

```
src/
├── actions/        # Server Actions (API Layer)
├── app/            # Next.js App Router Pages
│   ├── api/        # REST API Routes (External Access)
│   ├── dashboard/  # Protected Dashboard Routes
│   │   ├── layout.tsx       # Dynamic Sidebar (RT / UMKM / SYSTEM permissions)
│   │   ├── page.tsx         # Main Dash (Redirects Super Admin to Users)
│   │   ├── users/           # User Management (Super Admin)
│   │   ├── organizations/   # Organization Management (Super Admin)
│   │   ├── laporan/         # Sales Reports
│   │   ├── produk/          # Product Management
│   │   ├── pelanggan/       # Customer/Member Management
│   │   ├── warga/           # Resident Management (RT Mode)
│   │   └── ...
│   ├── login/      # Auth Page
│   └── page.tsx    # Landing Page
├── components/     # React Components
│   ├── ui/         # Reusable UI Components (shadcn/ui)
│   ├── AddUserDialog.tsx        # User Management UI
│   ├── EditUserDialog.tsx
│   ├── EditUserDialog.tsx
│   ├── UserListTable.tsx
│   ├── SendMessageDialog.tsx     # Telegram Message Internal Tool
│   ├── AddOrganizationDialog.tsx # Org Management UI
│   ├── EditOrganizationDialog.tsx
│   ├── OrganizationListTable.tsx
│   ├── SearchInput.tsx           # Reusable Search Bar
│   ├── PaginationControls.tsx    # Reusable Pagination Buttons
│   └── ...
└── lib/            # Utilities (Auth, Helpers)
```

## Dashboard Modes

 The dashboard adjusts based on the user's `OrganizationType` and `Role`:

1.  **RT Mode**: For Rukun Tetangga management.
    -   Menu: Warga, Iuran, Kas.
    -   Overview: Resident stats.

2.  **UMKM Mode**: For Small Business management.
    -   Menu: Kasir, Produk, Pelanggan, Laporan.
    -   Overview: POS (Point of Sales).

3.  **SYSTEM Mode (Super Admin)**: For System Administration.
    -   Menu: User Management, Organization Management.
    -   Overview: Redirects to User Management.

## Key Technologies

-   **Framework**: Next.js 16
-   **Styling**: Tailwind CSS
-   **UI Library**: shadcn/ui (built on Radix UI primitives)
-   **Icons**: lucide-react
-   **Forms**: react-hook-form + zod
-   **Date Handling**: date-fns

## Management Features (Super Admin)

### User Management
-   **Route**: `/dashboard/users`
-   **Components**: `UserListTable` (includes `SendMessageDialog`), `AddUserDialog`, `EditUserDialog`.
-   **Features**:
    -   List all users with Role/Org details.
    -   Create new users (assign Role & Org).
    -   Edit user Role/Org/Password/**Telegram ID**.
    -   Delete users.
    -   **Telegram Integration**: Send direct messages to users via Bot.

### Organization Management
-   **Route**: `/dashboard/organizations`
-   **Components**: `OrganizationListTable`, `AddOrganizationDialog`, `EditOrganizationDialog`.
-   **Features**:
    -   List all organizations.
    -   Create new organizations (RT/UMKM/SYSTEM).
    -   Edit organization Name/Type.
    -   Delete organizations.

## Routing & Navigation

-   **Public Routes**: `/`, `/login`
-   **Protected Routes**: all routes under `/dashboard/*`
-   **Sidebar**: Defined in `src/app/dashboard/layout.tsx`. Logic handles `SUPER_ADMIN` role to show unique administrative menus.

## Telegram Integration

A guide is available at `TELEGRAM_GUIDE.md`.

-   **Setup**: Input `Telegram ID` in User Management.
-   **Daily Report**: Triggered via Cron `/api/cron/daily-report`.
-   **Manual Trigger**: Available in "Laporan" page (Send to Telegram button).
