"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    LogOut,
    Users,
    Wallet,
    FileText,
    ShoppingCart,
    Package,
    BarChart,
    Shield,
    Building
} from "lucide-react";
import { cn } from "@/lib/utils";

const IconMap = {
    Users,
    Wallet,
    FileText,
    ShoppingCart,
    Package,
    BarChart,
    Shield,
    Building
};

export type IconName = keyof typeof IconMap;

interface NavItem {
    label: string;
    icon: IconName;
    href: string;
}

interface DashboardSidebarProps {
    organizationName: string;
    organizationType: string;
    navItems: NavItem[];
    logoutAction: () => Promise<void>;
    userEmail: string;
    userRole: string;
}

export function DashboardSidebar({
    organizationName,
    organizationType,
    navItems,
    logoutAction,
    userEmail,
    userRole
}: DashboardSidebarProps) {
    const pathname = usePathname();

    return (
        <aside className="w-64 bg-slate-950 border-r border-slate-800 hidden md:flex flex-col">
            <div className="p-6 border-b border-slate-800">
                <h1 className="text-xl font-bold text-slate-100">{organizationName}</h1>
                <p className="text-sm text-slate-400">{organizationType} Mode</p>
            </div>
            <nav className="flex-1 p-4 space-y-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname?.startsWith(item.href));

                    const IconComponent = IconMap[item.icon];
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                        >
                            <Button
                                variant="ghost"
                                className={cn(
                                    "w-full justify-start mb-1",
                                    isActive
                                        ? "bg-blue-900/30 text-blue-400 hover:bg-blue-900/40 hover:text-blue-300"
                                        : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                                )}
                            >
                                {IconComponent && <IconComponent className={cn("mr-2 h-4 w-4", isActive ? "text-blue-400" : "text-slate-500")} />}
                                {item.label}
                            </Button>
                        </Link>
                    );
                })}
            </nav>
            <div className="p-4 border-t border-slate-800">
                <div className="mb-4 px-2">
                    <p className="text-sm font-medium text-slate-200 truncate" title={userEmail}>
                        {userEmail}
                    </p>
                    <p className="text-xs text-slate-500 uppercase tracking-wider">
                        {userRole}
                    </p>
                </div>
                <form action={logoutAction}>
                    <Button variant="ghost" className="w-full justify-start text-red-400 hover:bg-red-900/20 hover:text-red-300">
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                    </Button>
                </form>
            </div>
        </aside>
    );
}
