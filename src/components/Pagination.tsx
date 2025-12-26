"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function Pagination({ totalPages }: { totalPages: number }) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const currentPage = Number(searchParams.get("page")) || 1;

    const createPageURL = (pageNumber: number | string) => {
        const params = new URLSearchParams(searchParams);
        params.set("page", pageNumber.toString());
        return `${pathname}?${params.toString()}`;
    };

    return (
        <div className="flex items-center justify-center space-x-2 mt-4">
            <Button
                variant="outline"
                size="sm"
                asChild
                disabled={currentPage <= 1}
                className={cn(currentPage <= 1 && "pointer-events-none opacity-50")}
            >
                <Link href={createPageURL(currentPage - 1)}>
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Prev
                </Link>
            </Button>

            <div className="flex -space-x-px">
                {/* Simplified pagination: just current page logic or simple range if needed. 
                    For now, showing simple Prev/Next and maybe current page info.
                */}
                <span className="px-4 py-2 text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                </span>
            </div>

            <Button
                variant="outline"
                size="sm"
                asChild
                disabled={currentPage >= totalPages}
                className={cn(currentPage >= totalPages && "pointer-events-none opacity-50")}
            >
                <Link href={createPageURL(currentPage + 1)}>
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
            </Button>
        </div>
    );
}
