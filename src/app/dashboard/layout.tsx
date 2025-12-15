import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Users,
    Wallet,
    ShoppingCart,
    Package,
    FileText,
    LogOut,
    BarChart,
    Shield,
    Building
} from "lucide-react";
import { logout } from "@/actions/auth";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getSession();

    if (!session) {
        redirect("/login");
    }

    const { organizationType, role } = session;

    const menus: Record<string, { label: string; icon: any; href: string }[]> = {
        RT: [
            { label: "Warga", icon: Users, href: "/dashboard/warga" },
            { label: "Iuran", icon: Wallet, href: "/dashboard/iuran" },
            { label: "Kas", icon: FileText, href: "/dashboard/kas" },
        ],
        UMKM: [
            { label: "Kasir", icon: ShoppingCart, href: "/dashboard" }, // POS on main dash
            { label: "Produk", icon: Package, href: "/dashboard/produk" },
            { label: "Pelanggan", icon: Users, href: "/dashboard/pelanggan" },
            { label: "Laporan", icon: BarChart, href: "/dashboard/laporan" },
        ],
        SYSTEM: []
    };

    let navItems = menus[organizationType as string] || [];

    if (role === "SUPER_ADMIN") {
        navItems = [
            ...navItems,
            { label: "User Management", icon: Shield, href: "/dashboard/users" },
            { label: "Organization Management", icon: Building, href: "/dashboard/organizations" }
        ];
    }

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r hidden md:flex flex-col">
                <div className="p-6 border-b">
                    <h1 className="text-xl font-bold">Nyatet.online</h1>
                    <p className="text-sm text-gray-500">{String(organizationType)} Mode</p>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                        >
                            <Button variant="ghost" className="w-full justify-start">
                                <item.icon className="mr-2 h-4 w-4" />
                                {item.label}
                            </Button>
                        </Link>
                    ))}
                </nav>
                <div className="p-4 border-t">
                    <form action={logout}>
                        <Button variant="outline" className="w-full justify-start text-red-500">
                            <LogOut className="mr-2 h-4 w-4" />
                            Logout
                        </Button>
                    </form>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-8">
                {children}
            </main>
        </div>
    );
}
