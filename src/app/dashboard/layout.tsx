import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
    Heart
} from "lucide-react";
import { logout } from "@/actions/auth";
import { DashboardSidebar, IconName } from "@/components/DashboardSidebar";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getSession();

    if (!session) {
        redirect("/login");
    }

    const { organizationType, role, organizationName } = session;

    const menus: Record<string, { label: string; icon: IconName; href: string }[]> = {
        RT: [
            { label: "Warga", icon: "Users", href: "/dashboard/warga" },
            { label: "Iuran", icon: "Wallet", href: "/dashboard/iuran" },
            { label: "Kas", icon: "FileText", href: "/dashboard/kas" },
        ],
        UMKM: [
            { label: "Kasir", icon: "ShoppingCart", href: "/dashboard" }, // POS on main dash
            { label: "Produk", icon: "Package", href: "/dashboard/produk" },
            { label: "Pelanggan", icon: "Users", href: "/dashboard/pelanggan" },
            { label: "Laporan", icon: "BarChart", href: "/dashboard/laporan" },
        ],
        SYSTEM: []
    };

    let navItems = menus[organizationType as string] || [];

    if (role === "SUPER_ADMIN") {
        navItems = [
            ...navItems,
            { label: "User Management", icon: "Shield", href: "/dashboard/users" },
            { label: "Organization Management", icon: "Building", href: "/dashboard/organizations" }
        ];
    }

    return (
        <div className="flex h-screen bg-blue-50">
            {/* Sidebar */}
            <DashboardSidebar
                organizationName={organizationName as string || "Nyatet.online"}
                organizationType={String(organizationType)}
                navItems={navItems}
                logoutAction={logout}
            />

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-8 flex flex-col">
                <div className="flex-1">
                    {children}
                </div>
                <footer className="mt-8 text-center text-sm text-gray-400 flex items-center justify-center gap-1">
                    crafted with <Heart className="h-4 w-4 text-red-500 fill-red-500" /> by fliptech
                </footer>
            </main>
        </div>
    );
}
